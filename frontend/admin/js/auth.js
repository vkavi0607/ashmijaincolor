'use strict';

/**
 * auth.js - ashmija in color Admin (Supabase Auth version)
 *
 * Handles session bootstrap, login, logout, and auth-state changes
 * using real Supabase Auth (email + password).
 *
 * Removed vs the old version:
 *   - Custom JWT/bcrypt/passcode login → replaced by supabase.auth.signInWithPassword({ email, password })
 *   - OTP-based forgot-passcode flow → replaced by supabase.auth.resetPasswordForEmail() (Supabase sends its own reset email)
 *   - The insecure "auto-login with admin/admin" bypass that existed in dev — removed entirely
 *   - Custom account lock/unlock/enable/disable/force-reset (backend-only feature) — this panel is hidden;
 *     manage the admin user directly from Supabase Dashboard → Authentication → Users if ever needed
 *
 * Depends on:
 *   - window.db          - Supabase client instance (from supabase-client.js)
 *   - window.showToast   - toast helper    (from toast.js)
 *   - window.logAudit    - audit helper    (from supabase-client.js)
 */

(function () {
  function showLoginOverlay () {
    const overlay = document.getElementById('login-overlay');
    const main = document.getElementById('admin-main');
    const sidebar = document.getElementById('admin-sidebar');

    if (overlay) overlay.style.display = '';
    if (main) main.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
  }

  function showDashboard () {
    const overlay = document.getElementById('login-overlay');
    const main = document.getElementById('admin-main');
    const sidebar = document.getElementById('admin-sidebar');

    if (overlay) overlay.style.display = 'none';
    if (main) main.style.display = '';
    if (sidebar) sidebar.style.display = '';
  }

  function applySession (user) {
    const displayName = user.user_metadata?.full_name
      || user.email?.split('@')[0]
      || 'Admin';

    const nameEl = document.getElementById('admin-display-name');
    const avatarEl = document.getElementById('admin-avatar');

    if (nameEl) nameEl.textContent = displayName;
    if (avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();

    showDashboard();

    if (typeof window.initDashboard === 'function') {
      window.initDashboard();
    }
  }

  function showLoginError (message) {
    const errEl = document.getElementById('login-error');
    const msgEl = document.getElementById('login-error-msg');

    if (msgEl) msgEl.textContent = message || 'An unexpected error occurred.';
    if (errEl) errEl.classList.add('show');
  }

  function clearLoginError () {
    const errEl = document.getElementById('login-error');
    if (errEl) errEl.classList.remove('show');
  }

  async function handleLoginSubmit () {
    // NOTE: the login form's "username" field is now used as the email address.
    const usernameEl = document.getElementById('login-username');
    const passcodeEl = document.getElementById('login-passcode');
    const btn = document.getElementById('btn-login');

    const email = usernameEl?.value.trim() ?? '';
    const password = passcodeEl?.value.trim() ?? '';

    clearLoginError();

    if (!email || !password) {
      showLoginError('Please enter your email and password.');
      return;
    }

    const originalHTML = btn?.innerHTML ?? '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Signing in...';
    }

    try {
      const { data, error } = await window.db.auth.signInWithPassword({ email, password });

      if (error) {
        showLoginError(error.message || 'Invalid email or password.');
        return;
      }

      if (!data?.user) {
        showLoginError('Login did not create a valid session. Check your credentials.');
        return;
      }

      await window.logAudit('auth', 'login', { user: data.user.email });

      if (typeof window.showToast === 'function') {
        window.showToast('Welcome back!', 'success');
      }

      applySession(data.user);
    } finally {
      if (btn) {
        btn.innerHTML = originalHTML || 'Sign In';
        btn.disabled = false;
      }
    }
  }

  async function handleLogout () {
    await window.logAudit('auth', 'logout', {});
    await window.db.auth.signOut();
    location.reload();
  }

  /* ── Forgot Password Handler (Supabase's built-in email reset flow) ── */
  async function handleForgotPasswordAction () {
    const btn = document.getElementById('btn-forgot-action');
    const email = document.getElementById('forgot-email')?.value.trim() ?? '';

    clearLoginError();

    if (!email) {
      showLoginError('Please enter your email.');
      return;
    }

    const originalHTML = btn?.innerHTML ?? '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Sending...';
    }

    try {
      const { error } = await window.db.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin/index.html',
      });
      if (error) throw error;

      window.showToast('Password reset link sent to your email.', 'success');
      resetForgotPasswordView();
    } catch (err) {
      showLoginError(err.message || 'Could not send reset email.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
    }
  }

  function resetForgotPasswordView () {
    document.getElementById('login-form-view').style.display = 'block';
    document.getElementById('forgot-passcode-view').style.display = 'none';
    clearLoginError();
  }

  /* ── Change Password (while logged in) ── */
  async function handleChangePasscode () {
    const newEl = document.getElementById('sec-new-passcode');
    const confirmEl = document.getElementById('sec-confirm-passcode');

    const newPassword = newEl?.value.trim() ?? '';
    const confirmPassword = confirmEl?.value.trim() ?? '';

    if (!newPassword || !confirmPassword) {
      window.showToast('Please fill both password fields.', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      window.showToast('New password must be at least 6 characters.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      window.showToast('Passwords do not match.', 'warning');
      return;
    }

    try {
      const { error } = await window.db.auth.updateUser({ password: newPassword });
      if (error) throw error;

      window.showToast('Password updated successfully.', 'success');
      if (newEl) newEl.value = '';
      if (confirmEl) confirmEl.value = '';
    } catch (err) {
      window.showToast(err.message || 'Failed to update password.', 'error');
    }
  }

  // The Security section now only has a "change password" form — nothing to
  // load on init, but dashboard.js expects this function to exist.
  window.initSecurity = async function initSecurity () {};

  /* ── Initialisation ── */
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const { data: { session } } = await window.db.auth.getSession();
      if (session?.user) {
        applySession(session.user);
      } else {
        showLoginOverlay();
      }
    } catch (err) {
      console.warn('[auth] session bootstrap failed', err);
      showLoginOverlay();
    }

    /* ── Sign In ── */
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) {
      btnLogin.addEventListener('click', handleLoginSubmit);
    }

    const passcodeEl = document.getElementById('login-passcode');
    if (passcodeEl) {
      passcodeEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleLoginSubmit();
      });
    }

    /* ── Forgot Password Toggles ── */
    const linkForgot = document.getElementById('link-forgot-passcode');
    if (linkForgot) {
      linkForgot.addEventListener('click', function (e) {
        e.preventDefault();
        clearLoginError();
        document.getElementById('login-form-view').style.display = 'none';
        document.getElementById('forgot-passcode-view').style.display = 'block';
      });
    }

    const linkBack = document.getElementById('link-back-to-login');
    if (linkBack) {
      linkBack.addEventListener('click', function (e) {
        e.preventDefault();
        resetForgotPasswordView();
      });
    }

    const btnForgotAction = document.getElementById('btn-forgot-action');
    if (btnForgotAction) {
      btnForgotAction.addEventListener('click', handleForgotPasswordAction);
    }

    /* ── Toggle Password Visibility ── */
    const btnTogglePassword = document.getElementById('btn-toggle-password');
    const inputPassword = document.getElementById('login-passcode');
    const toggleIcon = document.getElementById('toggle-password-icon');
    if (btnTogglePassword && inputPassword && toggleIcon) {
      btnTogglePassword.addEventListener('click', function () {
        if (inputPassword.type === 'password') {
          inputPassword.type = 'text';
          toggleIcon.classList.remove('ti-eye');
          toggleIcon.classList.add('ti-eye-off');
        } else {
          inputPassword.type = 'password';
          toggleIcon.classList.remove('ti-eye-off');
          toggleIcon.classList.add('ti-eye');
        }
      });
    }

    /* ── Sign Out ── */
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', handleLogout);
    }

    /* ── Change Password (Security Settings) ── */
    const btnChangePass = document.getElementById('btn-change-passcode');
    if (btnChangePass) {
      btnChangePass.addEventListener('click', handleChangePasscode);
    }

    // Account lock/unlock/enable/disable/force-reset buttons, if present in the
    // DOM, are hidden since that custom logic no longer applies with Supabase Auth.
    ['btn-toggle-account', 'btn-unlock-account', 'btn-force-reset'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    window.db.auth.onAuthStateChange(function (event, session) {
      if (event === 'SIGNED_OUT') {
        showLoginOverlay();
      }
      if (event === 'SIGNED_IN' && session?.user) {
        applySession(session.user);
      }
    });
  });
})();

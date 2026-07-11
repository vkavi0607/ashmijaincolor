/**
 * config.js — Supabase project configuration
 */
(function() {
  'use strict';

  window.appConfig = {
    SUPABASE_URL: 'https://mkbbcxukwqdostbldbmv.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYmJjeHVrd3Fkb3N0YmxkYm12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NTUzNzgsImV4cCI6MjA5OTMzMTM3OH0.il-QGmf4cOws8MR55kTsF4e4PCar2tuEhQvP5mIRrYQ',
    // Edge Function that ports the Python ML review-reply engine
    ML_REPLY_FUNCTION_URL: 'https://mkbbcxukwqdostbldbmv.supabase.co/functions/v1/generate-reply'
  };
})();

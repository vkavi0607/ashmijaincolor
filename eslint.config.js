module.exports = [
  {
    ignores: ["node_modules/", "frontend/admin/vendor/"]
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        IntersectionObserver: "readonly",
        URLSearchParams: "readonly",
        FormData: "readonly",
        fetch: "readonly",
        Math: "readonly",
        parseInt: "readonly",
        parseFloat: "readonly",
        btoa: "readonly",
        atob: "readonly",
        Uint8Array: "readonly",
        ArrayBuffer: "readonly",
        DataView: "readonly",
        Blob: "readonly",
        File: "readonly",
        Image: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        location: "readonly",
        navigator: "readonly",
        history: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-console": "warn"
    }
  }
];

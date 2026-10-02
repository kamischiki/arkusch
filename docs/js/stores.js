/* Turns the App Store / Mac buttons on or off based on js/config.js.
   An empty url renders a "coming soon" pill instead of a dead link. */
(function () {
  var A = window.Arkusch;

  A.stores = {
    init: function () {
      var macLive = !!(A.config.mac && A.config.mac.url);

      document.querySelectorAll("[data-store]").forEach(function (el) {
        var store = el.dataset.store, url = (A.config[store] || {}).url;
        if (url) {
          el.setAttribute("href", url);
          el.removeAttribute("aria-disabled");
          el.classList.remove("btn--soon");
          el.dataset.i18n = "cta." + store;
        } else {
          el.removeAttribute("href");
          el.setAttribute("aria-disabled", "true");
          el.classList.add("btn--soon");
          el.dataset.i18n = "cta." + store + ".soon";
        }
      });

      document.querySelectorAll("[data-show-if-mac-soon]").forEach(function (el) { el.hidden = macLive; });

      // Contact e-mail, assembled at runtime. Empty text gets the address itself.
      var mail = A.config.contactEmail;
      document.querySelectorAll("[data-email-link]").forEach(function (el) {
        if (!mail) { el.hidden = true; return; }
        el.setAttribute("href", "mailto:" + mail);
        if (!el.dataset.i18n && !el.textContent.trim()) el.textContent = mail;
      });

      // Imprint: points to imprint.html unless config.imprintUrl says otherwise.
      if (A.config.imprintUrl) {
        document.querySelectorAll("[data-imprint-link]").forEach(function (el) {
          el.href = A.config.imprintUrl; el.target = "_blank"; el.rel = "noopener";
        });
      }
    }
  };
})();

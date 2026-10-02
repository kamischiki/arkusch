/* Tiny translation engine. Text lives in /i18n/<lang>.js, markup only carries keys:
   data-i18n="key"        -> textContent
   data-i18n-alt="key"    -> alt attribute
   data-i18n-aria="key"   -> aria-label attribute                                   */
(function () {
  var KEY = "arkusch-lang", LANGS = ["en", "de", "uk"];
  var A = (window.Arkusch = window.Arkusch || {});

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (LANGS.indexOf(saved) > -1) return saved;
    var prefs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).slice(0, 2).toLowerCase();
      if (code === "ua") code = "uk";
      if (LANGS.indexOf(code) > -1) return code;
    }
    return "en";
  }

  function t(key, lang) {
    var s = A.strings[lang || A.i18n.lang] || {};
    return s[key] !== undefined ? s[key] : (A.strings.en[key] || key);
  }

  function apply(lang) {
    A.i18n.lang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) { el.alt = t(el.dataset.i18nAlt); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.title = t(document.body.dataset.titleKey || "meta.title");
    var d = document.querySelector('meta[name="description"]');
    if (d) d.content = t("meta.description");
    document.querySelectorAll("[data-lang-choice]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.langChoice === lang));
    });
    document.dispatchEvent(new CustomEvent("arkusch:lang", { detail: lang }));
  }

  A.i18n = {
    lang: "en", t: t, apply: apply,
    set: function (lang) { try { localStorage.setItem(KEY, lang); } catch (e) {} apply(lang); },
    init: function () { apply(detect()); }
  };
})();

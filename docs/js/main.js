/* Wires everything together once the page is ready. */
document.addEventListener("DOMContentLoaded", function () {
  var A = window.Arkusch;

  // 1. Buttons and links depend on config; set them before text is translated.
  if (A.stores) A.stores.init();

  // 2. Free / PRO lists (built before translation so the new elements get their text)
  if (A.plans) A.plans.init();

  // 3. Language
  document.querySelectorAll("[data-lang-choice]").forEach(function (b) {
    b.addEventListener("click", function () { A.i18n.set(b.dataset.langChoice); });
  });
  A.i18n.init();

  // 4. Clips (need the active language for captions)
  if (A.reels) A.reels.init();

  // 5. Outdoor / Indoor
  function syncTheme() {
    document.querySelectorAll("[data-theme-choice]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.themeChoice === A.theme.get()));
    });
  }
  document.querySelectorAll("[data-theme-choice]").forEach(function (b) {
    b.addEventListener("click", function () { A.theme.set(b.dataset.themeChoice); syncTheme(); });
  });
  syncTheme();
});

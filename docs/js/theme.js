/* Outdoor (light) / Indoor (dark). Loaded in <head> so the page never flashes the wrong theme. */
(function () {
  var KEY = "arkusch-theme", root = document.documentElement, saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var theme = saved === "dark" || saved === "light"
    ? saved
    : (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  root.dataset.theme = theme;

  window.Arkusch = window.Arkusch || {};
  Arkusch.theme = {
    get: function () { return root.dataset.theme; },
    set: function (name) {
      root.dataset.theme = name;
      try { localStorage.setItem(KEY, name); } catch (e) {}
    }
  };
})();

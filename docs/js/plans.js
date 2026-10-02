/* Free vs PRO comparison. To move a feature between plans, change its `tier` below
   (or reorder the lines). Texts live in i18n/*.js under pl.<key>.t (title) and pl.<key>.d (description). */
(function () {
  var A = window.Arkusch;

  var ITEMS = [
    { key: "unlimited",  tier: "free" },
    { key: "photos",     tier: "free" },
    { key: "fields",     tier: "free" },
    { key: "events",     tier: "free" },
    { key: "reminders",  tier: "free" },
    { key: "links",      tier: "free" },
    { key: "csv",        tier: "free" },

    { key: "places",     tier: "pro" },
    { key: "gps",        tier: "pro" },
    { key: "neighbours", tier: "pro" },
    { key: "tags",       tier: "pro" }
  ];

  A.plans = {
    items: ITEMS,
    init: function () {
      ITEMS.forEach(function (item) {
        var list = document.getElementById("plan-" + item.tier);
        if (!list) return;
        var li = document.createElement("li");
        var t = document.createElement("strong"); t.dataset.i18n = "pl." + item.key + ".t";
        var d = document.createElement("span");   d.dataset.i18n = "pl." + item.key + ".d";
        li.appendChild(t); li.appendChild(d); list.appendChild(li);
      });
    }
  };
})();

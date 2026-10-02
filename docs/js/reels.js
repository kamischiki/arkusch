/* Renders the clips listed in config.reels. Videos are self-hosted (no Instagram embed),
   so visitors don't load anything from third parties and no cookie banner is needed. */
(function () {
  var A = window.Arkusch;
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function caption(reel) {
    var c = reel.caption || {};
    return c[A.i18n.lang] || c.en || "";
  }

  A.reels = {
    init: function () {
      var list = A.config.reels || [];
      var section = document.getElementById("reels");
      var host = document.getElementById("reels-list");
      if (!section || !host) return;
      if (!list.length) { section.hidden = true; return; }
      section.hidden = false;

      var io = "IntersectionObserver" in window && !reduceMotion
        ? new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              var v = e.target;
              if (e.isIntersecting) { v.play().catch(function () {}); } else { v.pause(); }
            });
          }, { threshold: 0.6 })
        : null;

      list.forEach(function (reel) {
        var fig = document.createElement("figure"); fig.className = "reel";
        var v = document.createElement("video");
        v.src = reel.src; v.muted = true; v.loop = true; v.playsInline = true;
        v.preload = "metadata"; if (reel.poster) v.poster = reel.poster;
        if (reduceMotion) v.controls = true;
        fig.appendChild(v);

        var btn = document.createElement("button"); btn.type = "button";
        btn.dataset.sound = "off";
        btn.textContent = A.i18n.t("reels.soundOn");
        btn.addEventListener("click", function () {
          v.muted = !v.muted;
          btn.dataset.sound = v.muted ? "off" : "on";
          btn.textContent = A.i18n.t(v.muted ? "reels.soundOn" : "reels.soundOff");
          if (!v.muted) v.play().catch(function () {});
        });
        fig.appendChild(btn);

        var cap = document.createElement("figcaption");
        cap.dataset.reelCaption = "1"; cap.textContent = caption(reel);
        fig.appendChild(cap);
        host.appendChild(fig);
        if (io) io.observe(v);
      });

      document.addEventListener("arkusch:lang", function () {
        host.querySelectorAll(".reel").forEach(function (fig, i) {
          fig.querySelector("figcaption").textContent = caption(list[i]);
          var b = fig.querySelector("button");
          b.textContent = A.i18n.t(b.dataset.sound === "on" ? "reels.soundOff" : "reels.soundOn");
        });
      });
    }
  };
})();

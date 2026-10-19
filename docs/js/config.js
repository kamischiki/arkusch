/* The only file you need to touch for links, contact and video clips. */
window.Arkusch = window.Arkusch || {};
Arkusch.config = {
  // Leave a url empty and the button shows "coming soon" instead.
  ios: { url: "https://apps.apple.com/de/app/arkusch/id6786742492" },
  mac: { url: "https://apps.apple.com/de/app/plant-tracker-arkusch/id6786742492?l=en-GB" },   // Mac App Store link, once it exists

  // Public contact address: "Write me" link, footer "Contact" and the privacy pages.
  // The address is built by JavaScript instead of being typed into the HTML,
  // which keeps it away from the simplest e-mail harvesters.
  contactEmail: "arkusch@gmx.net",
  // Imprint: leave empty to use this site's own imprint.html.
  imprintUrl: "",

  // Short clips (your reels). Put the .mp4 files in /videos and list them here.
  // The whole section stays hidden while this list is empty.
  // { src: "videos/clip-1.mp4", poster: "videos/clip-1.jpg",
  //   caption: { en: "…", de: "…", uk: "…" } }
  reels: [
    { src: "videos/arkush_add-4_youtube.mov", poster: "images/reels/arkush_add-4_youtube-Cover.jpg",
       caption: { en: "Plant care should be fun, not a mental load", de: "…", uk: "…" } },
       { src: "videos/arkush_add-2_youtube.mov", poster: "images/reels/arkush_add-2_youtube-Cover.jpg",
       caption: { en: "…", de: "…", uk: "…" } },
       { src: "videos/arkush_add-3_youtube.mov", poster: "images/reels/arkush_add-3_youtube-Cover.jpg",
       caption: { en: "Plant tags are great, until they end up in the sandbox 😅", de: "…", uk: "…" } },
       { src: "videos/arkush_add-1_youtube.mov", poster: "images/reels/arkush_add-1_youtube-Cover.jpg",
       caption: { en: "There is nothing worse than opening your phone to find out an app you rely on has vanished, along with your data", de: "…", uk: "…" } },
       { src: "videos/arkush_add-6_youtube.mov", poster: "images/reels/arkush_add-6_youtube-Cover.jpg",
       caption: { en: "Expectation vs. Reality: Tomato Edition! 🍅", de: "…", uk: "…" } },
       { src: "videos/arkush_add-5_youtube.mov", poster: "images/reels/arkush_add-5_youtube-Cover.jpg",
       caption: { en: "When your kid decides to \"help\" you to tag your plants, the effort counts!", de: "…", uk: "…" } },
      { src: "videos/arkush_add-8_youtube.mov", poster: "images/reels/arkush_add-8_youtube-Cover.jpg",
       caption: { en: "Playground Trade vs. Plant Parent Trade 🌱", de: "…", uk: "…" } },
       { src: "videos/arkush_add-9.mov", poster: "images/reels/arkush_add-9-Cover.jpg",
       caption: { en: "Wait, those aren't spider mites! 🦕", de: "…", uk: "…" } },
       { src: "videos/arkush_add-10_youtube.mov", poster: "images/reels/arkush_add-10_youtube-Cover.jpg",
       caption: { en: "", de: "…", uk: "…" } }
      ],
   social: {
     youtube: "https://www.youtube.com/@BuiltInTheMargins",
     instagram: "https://www.instagram.com/…"
   }
};

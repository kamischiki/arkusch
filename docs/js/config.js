/* The only file you need to touch for links, contact and video clips. */
window.Arkusch = window.Arkusch || {};
Arkusch.config = {
  // Leave a url empty and the button shows "coming soon" instead.
  ios: { url: "https://apps.apple.com/de/app/arkusch/id6786742492" },
  mac: { url: "" },   // Mac App Store link, once it exists

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
  reels: []
};

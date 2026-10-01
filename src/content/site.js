// Site-wide settings. Edit these to update links across every page.
export const site = {
  name: "Pigeon Bar",
  email: "pigeondenver@gmail.com",
  mapsUrl: "https://maps.app.goo.gl/cRxxzn8TKhwysGsa8",
};

// Links shown in the footer nav on every page, in order.
export const navLinks = [
  { label: "location", href: site.mapsUrl, external: true },
  { label: "hours", href: "/hours" },
  { label: "menu", href: "/menu" },
  { label: "contact", href: `mailto:${site.email}` },
];

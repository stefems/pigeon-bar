// Content is stored as JSON so it can be edited in the CMS at /admin
// (or directly on GitHub). These helpers give the pages a clean shape.
import siteJson from "./site.json";
import hoursJson from "./hours.json";
import menuJson from "./menu.json";

export const site = siteJson;
export const navLinks = siteJson.navLinks;
export const hours = hoursJson.hours;
export const menu = menuJson.sections;

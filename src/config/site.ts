const configured = import.meta.env.VITE_SITE_URL ?? "https://mikeldev.online";
const url = new URL(configured);
if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
  throw new Error("VITE_SITE_URL must be an HTTPS origin without credentials, path, query or fragment");
}

export const site = {
  origin: url.origin,
  indexable: import.meta.env.MODE === "production" && import.meta.env.VITE_INDEXABLE !== "false",
  socialImage: "/images/social-preview.png",
  year: Number(import.meta.env.VITE_BUILD_YEAR ?? new Date().getFullYear()),
};

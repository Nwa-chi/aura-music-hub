export const dynamic = "force-static";

export default function manifest() {
  return {
    name: "AURA Music",
    short_name: "AURA",
    description: "Discover, play, and collect music with AURA.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#090b0f",
    theme_color: "#090b0f",
    orientation: "portrait-primary",
    categories: ["music", "entertainment"],
    icons: [
      {
        src: "/aura-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}

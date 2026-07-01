export const dynamic = "force-static";

export default function manifest() {
  return {
    name: "AURA Music",
    short_name: "AURA",
    description: "Discover, play, and collect music with AURA.",
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    handle_links: "preferred",
    launch_handler: {
      client_mode: ["navigate-existing", "auto"],
    },
    background_color: "#090b0f",
    theme_color: "#090b0f",
    orientation: "portrait-primary",
    categories: ["music", "entertainment"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}

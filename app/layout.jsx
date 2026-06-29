import "./globals.css";
import ServiceWorkerRegistration from "./service-worker-registration";

export const metadata = {
  metadataBase: new URL("https://www.auramusichub.com"),
  title: "AURA",
  description: "AI-built music streaming app for Cloudflare Pages.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AURA",
    description: "AI-built music streaming app for Cloudflare Pages.",
    url: "https://www.auramusichub.com/",
    siteName: "AURA Music",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/aura-icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#090b0f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

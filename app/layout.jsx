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
    icon: "/aura-icon.svg",
    apple: "/aura-icon.svg",
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

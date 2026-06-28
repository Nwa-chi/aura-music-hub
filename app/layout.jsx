import "./globals.css";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

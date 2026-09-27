import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BHUMI-INTEL | Evidence Intelligence for Land Governance",
  description: "National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance — Department of Land Resources (DoLR), Ministry of Rural Development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        {children}
      </body>
    </html>
  );
}

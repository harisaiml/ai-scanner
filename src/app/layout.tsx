import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Automation Opportunity Scanner",
  description: "Identify automation opportunities in your business processes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0a0a0a] text-[#fafafa]">
        {children}
      </body>
    </html>
  );
}

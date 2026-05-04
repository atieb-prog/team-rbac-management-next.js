import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./provider/AuthProvider";

export const metadata: Metadata = {
  title: "Team Access Control",
  description:
    "Role-based access control system build with Next.js 16 and React 19 ",
  keywords: ["Team", "access control"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

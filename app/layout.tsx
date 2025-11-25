import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "User Selection",
  description: "Select a user from the dropdown",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

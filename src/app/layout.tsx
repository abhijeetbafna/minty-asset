import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minty - India-Centric Personal Finance Tracker",
  description:
    "A clean, private personal finance ledger for Indian households. Track income, expenses, and total investments with native Lakh/Crore formatting and April–March financial year alignment.",
  keywords: [
    "personal finance",
    "india finance tracker",
    "expense manager",
    "investment tracker",
    "lakh crore formatting",
    "financial year",
    "provident fund",
    "mutual funds",
  ],
  authors: [{ name: "Minty Engineering" }],
  icons: {
    icon: "/brand/logo-icon.svg",
    shortcut: "/brand/logo-icon.svg",
    apple: "/brand/logo-icon.svg",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F5" },
    { media: "(prefers-color-scheme: dark)", color: "#13171F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

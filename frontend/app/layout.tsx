import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import ClientLayout from "@/components/ClientLayout";

const momoTrustSans = localFont({
  src: [
    {
      path: "../public/fonts/MomoTrustSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-momo",
  fallback: ["ui-monospace", "monospace"],
});

const googleSans = localFont({
  src: [
    {
      path: "../public/fonts/GoogleSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-google",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Volt Kinetic - AI Fitness Partner",
  description: "AI-powered gym coaching and progress tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${momoTrustSans.variable} ${googleSans.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('kinetic-settings');
                  var theme = 'dark';
                  if (saved) {
                    var settings = JSON.parse(saved);
                    theme = settings.theme || 'dark';
                  }
                  if (theme === 'system') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {}
              })()
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0&display=block"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0&display=block"
        />
      </head>
      <body
        className={`${googleSans.className} min-h-screen bg-background text-foreground antialiased transition-colors duration-500`}
      >
        <SettingsProvider>
          <ClientLayout>{children}</ClientLayout>
        </SettingsProvider>
      </body>
    </html>
  );
}

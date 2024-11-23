import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { LegalButton } from "@/components/legal-button";
import { Favicon } from "@/components/favicon";
import db from '@/db/db'
import { projectsTable } from "@/db/schema";

const azonix = localFont({
  src: "./fonts/Azonix.otf",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export async function generateMetadata(): Promise<Metadata> {
  const projectData = await db.select().from(projectsTable)
  
  const title = "guthmann.dev"
  const description = "Hi, I'm Max - A passionate software developer focused on creating impactful web experiences. Specializing in TypeScript, JavaScript, Kotlin, and modern web technologies."
  const url = "https://guthmann.dev"
  const ogImage = "/og-image.png" // Make sure to create this image

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    metadataBase: new URL(url),
    authors: [{ name: "Maximilian Guthmann", url: "https://github.com/guthmanndev" }],
    creator: "Maximilian Guthmann",
    publisher: "Maximilian Guthmann",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        {
          url: "/guthmann.dev-dark.svg",
          media: "(prefers-color-scheme: light)",
          type: "image/svg+xml",
        },
        {
          url: "/guthmann.dev-light.svg",
          media: "(prefers-color-scheme: dark)",
          type: "image/svg+xml",
        },
      ],
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title,
      description,
      siteName: title,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: "guthmann.dev - Personal website of Maximilian Guthmann",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@maxguthmann",
      site: "@maxguthmann",
    },
    alternates: {
      canonical: url,
    },
    keywords: [
      "Maximilian Guthmann",
      "Software Developer",
      "Web Development",
      "TypeScript",
      "JavaScript",
      "Kotlin",
      "React",
      "Next.js",
      "Backend Developer",
    ],
    other: {
      projects: JSON.stringify(projectData),
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen grid grid-rows-[auto_1fr_auto] relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Favicon />
          <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
            <Navbar />
            <main className="w-full">
              {children}
            </main>
            <LegalButton />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

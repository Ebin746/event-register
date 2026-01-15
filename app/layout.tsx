import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GDG SOE CUSAT Event Registration Platform",
  description: "Official registration platform for GDG SOE CUSAT events.",
  icons: {
    icon: "/GDSC_Logo_White_Background_0.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#1a73e8",      // Google Blue (Material)
          colorText: "#202124",        // Google main text
          colorTextSecondary: "#5f6368",
          colorInputText: "#202124",
          colorBackground: "#ffffff",
          borderRadius: "8px",         // Material radius
          fontFamily: "Inter, system-ui, sans-serif",
        },
        elements: {
          card: "shadow-sm border border-gray-200 bg-white",
          headerTitle: "text-gray-900 font-semibold",
          headerSubtitle: "text-gray-500",
          formFieldInput:
            "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          formButtonPrimary:
            "bg-[#1a73e8] hover:bg-[#1669c1] text-white rounded-md shadow-none",
          footerActionLink: "text-[#1a73e8] hover:underline",
          socialButtonsBlockButton:
            "border border-gray-300 bg-white hover:bg-gray-50 rounded-md shadow-none",
          socialButtonsBlockButtonText: "text-gray-800 font-medium",
          dividerLine: "bg-gray-200",
          userButtonPopoverCard: "shadow-lg border border-gray-200",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

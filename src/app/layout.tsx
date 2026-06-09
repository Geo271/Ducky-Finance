import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Updated the title to your new branding!
  title: "Ducky Finance", 
  description: "Personal wealth ledger and analytics",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        // ADDED: overflow-x-hidden right at the end of this string
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-[#FCF8F8] overflow-x-hidden`}
        suppressHydrationWarning
      >
        {children}
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#3f3f46', 
              fontSize: '14px',
              borderRadius: '16px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            },
          }}
        />
      </body>
    </html>
  );
}
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Sales Automation Platform - ROI Analytics',
  description: 'Optimize your sales process with AI-powered ROI analytics and automation recommendations',
  keywords: 'AI, sales automation, ROI, analytics, optimization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background text-text antialiased">
        <div className="relative min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-background to-gray-900 opacity-50"></div>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
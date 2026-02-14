import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Sales Automation Platform - ROI Analytics & Optimization',
  description: 'Analyze and optimize your sales automation investments with AI-powered insights and recommendations',
  keywords: 'sales automation, ROI calculator, AI analytics, sales optimization, business intelligence',
  authors: [{ name: 'AI Sales Platform' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1F1F1F',
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
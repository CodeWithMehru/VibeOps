import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibeOps — Autonomous Event Production & Crisis War-Room',
  description: 'AI-powered event production command center. Plan weddings, birthdays, and community events with deterministic budget optimization, crisis simulation, and vendor negotiation — powered by Groq LPU and Llama 3.3.',
  keywords: 'event planner, AI event management, wedding planner, birthday party, community event, crisis management, budget optimizer, VibeOps',
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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

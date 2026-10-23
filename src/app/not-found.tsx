import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      role="region"
      aria-label="404 Page Not Found"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--carbon)',
        color: 'var(--text-primary)',
        padding: '24px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 480,
          width: '100%',
          padding: '36px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--radius-md)',
            background: 'var(--gold-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold)',
          }}
        >
          <Compass size={28} aria-hidden="true" />
        </div>

        <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--mono-font)', color: 'var(--gold)', lineHeight: 1 }}>
          404
        </div>

        <h1 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Operational Vector Not Found</h1>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          The requested route or blueprint identifier is not recognized by the VibeOps Command Center.
        </p>

        <Link
          href="/"
          className="btn-primary"
          aria-label="Return to VibeOps Command Center"
          style={{ marginTop: 8, fontSize: '0.86rem', padding: '10px 20px', textDecoration: 'none' }}
        >
          <ArrowLeft size={15} aria-hidden="true" /> Return to Command Center
        </Link>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Zap,
  Cpu,
  Timer,
  Download,
  Settings,
  ChevronDown,
  X,
  Key,
  FileText,
  FileJson,
} from 'lucide-react';
import { PRESET_LABELS } from '@/lib/presets';

interface NavbarProps {
  modelUsed: string;
  latencyMs: number;
  onLoadPreset: (key: string) => void;
  onExport: (format: 'pdf' | 'json' | 'markdown') => void;
  hasBlueprint: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export default function Navbar({
  modelUsed,
  latencyMs,
  onLoadPreset,
  onExport,
  hasBlueprint,
  apiKey,
  onApiKeyChange,
}: NavbarProps) {
  const [presetOpen, setPresetOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey);

  return (
    <>
      <nav className="no-print" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(11, 12, 16, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--hairline)',
        padding: '0 24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
          maxWidth: 1440,
          margin: '0 auto',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 'var(--radius-md)',
              background: 'var(--gold-dim)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Zap size={18} color="var(--gold)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                VibeOps
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                AI Event Architect
              </div>
            </div>
          </div>

          {/* Center: Model Badge + Latency */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {modelUsed && (
              <div className="gold-badge" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cpu size={12} />
                Groq LPU • {modelUsed.includes('70b') ? 'Llama-3.3-70B' : 'Llama-3.1-8B'}
              </div>
            )}
            {latencyMs > 0 && (
              <div className="emerald-badge font-mono" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Timer size={11} />
                {latencyMs}ms
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Preset Selector */}
            <div style={{ position: 'relative' }}>
              <button className="btn-secondary" onClick={() => { setPresetOpen(!presetOpen); setExportOpen(false); }} style={{ fontSize: 13, padding: '8px 14px' }}>
                <Zap size={14} />
                <span style={{ display: 'inline' }}>Demo Presets</span>
                <ChevronDown size={13} />
              </button>
              {presetOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--hairline-strong)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 6,
                  minWidth: 280,
                  zIndex: 200,
                  animation: 'slideUp 0.2s ease',
                }}>
                  {PRESET_LABELS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => { onLoadPreset(p.key); setPresetOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        padding: '10px 14px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: 14,
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 18 }}>{p.emoji}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export */}
            {hasBlueprint && (
              <div style={{ position: 'relative' }}>
                <button className="btn-secondary" onClick={() => { setExportOpen(!exportOpen); setPresetOpen(false); }} style={{ fontSize: 13, padding: '8px 14px' }}>
                  <Download size={14} />
                  <span>Export</span>
                  <ChevronDown size={13} />
                </button>
                {exportOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline-strong)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 6,
                    minWidth: 220,
                    zIndex: 200,
                    animation: 'slideUp 0.2s ease',
                  }}>
                    <button
                      onClick={() => { onExport('pdf'); setExportOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 14, cursor: 'pointer', borderRadius: 'var(--radius-sm)', textAlign: 'left' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <FileText size={15} /> Print / PDF Run-Sheet
                    </button>
                    <button
                      onClick={() => { onExport('json'); setExportOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 14, cursor: 'pointer', borderRadius: 'var(--radius-sm)', textAlign: 'left' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <FileJson size={15} /> JSON Blueprint
                    </button>
                    <button
                      onClick={() => { onExport('markdown'); setExportOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 14, cursor: 'pointer', borderRadius: 'var(--radius-sm)', textAlign: 'left' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <FileText size={15} /> Markdown Export
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            <button className="btn-ghost" onClick={() => setSettingsOpen(true)} style={{ padding: '8px' }}>
              <Settings size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="modal-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>API Key Settings</h2>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>Bring your own Groq API key for live AI generation</p>
              </div>
              <button className="btn-ghost" onClick={() => setSettingsOpen(false)} style={{ padding: 6 }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">
                <Key size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Groq API Key
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="gsk_..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
              />
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>
                Get your free key at{' '}
                <a href="https://console.groq.com" target="_blank" rel="noopener" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
                  console.groq.com
                </a>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={() => { onApiKeyChange(keyInput); setSettingsOpen(false); }}>
                Save Key
              </button>
              {apiKey && (
                <button className="btn-crisis" onClick={() => { setKeyInput(''); onApiKeyChange(''); setSettingsOpen(false); }}>
                  Remove Key
                </button>
              )}
            </div>
            <div style={{ marginTop: 16, padding: 12, background: 'var(--gold-dim)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <p style={{ fontSize: 12, color: 'var(--gold)' }}>
                🔒 Your key is stored locally in your browser and never sent to our servers — it goes directly to Groq&apos;s API.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

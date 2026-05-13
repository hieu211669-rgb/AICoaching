'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, 
  Rocket, 
  CheckCircle2, 
  RotateCcw, 
  X, 
  AlertCircle,
  Undo2,
  Settings2,
  Layout,
  Palette,
  Eye,
  Bolt,
  Activity
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

// 1. Interface định nghĩa cấu trúc Settings để đảm bảo Type Safety
interface SettingsState {
  sidebarPos: 'LEFT' | 'RIGHT';
  displayDensity: 'COMPACT' | 'COMFORT';
  rounding: number;
  stickyHeader: boolean;
  autoCollapse: boolean;
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
}

const SettingsPage = () => {
  const { settings: globalSettings, updateSettings } = useSettings();

  // 1. Detect system theme for accurate local preview
  const [isSystemDark, setIsSystemDark] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsSystemDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 2. State Management: Tách biệt Preview và Applied
  const [previewState, setPreviewState] = useState<SettingsState>({ ...globalSettings });
  
  // Calculate local theme class
  const localThemeClass = useMemo(() => {
    if (previewState.theme === 'system') return isSystemDark ? 'dark' : 'light';
    return previewState.theme;
  }, [previewState.theme, isSystemDark]);

  const [isDeploying, setIsDeploying] = useState(false);
  // ... rest of state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const accents = [
    // ... accents list
    { color: '#f4ffc6', name: 'KINETIC_LIME' },
    { color: '#ff7948', name: 'NEON_OAT' },
    { color: '#00f0ff', name: 'CYBER_CYAN' },
    { color: '#ff00ff', name: 'PLASMA_PINK' },
    { color: '#4a4a48', name: 'STEALTH_GREY' },
  ];

  // ... useEffects and handlers

  // Sync previewState khi globalSettings thay đổi (lần đầu load hoặc reset)
  useEffect(() => {
    setPreviewState({ ...globalSettings });
  }, [globalSettings]);

  // 3. Logic so sánh: Kiểm tra xem user có thay đổi gì chưa deploy không
  const hasChanges = useMemo(() => {
    return (
      previewState.theme !== globalSettings.theme ||
      previewState.accentColor !== globalSettings.accentColor ||
      previewState.sidebarPos !== globalSettings.sidebarPos ||
      previewState.displayDensity !== globalSettings.displayDensity ||
      previewState.rounding !== globalSettings.rounding
    );
  }, [previewState, globalSettings]);

  // Cleanup notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // --- Handlers ---

  const handleUpdate = (updates: Partial<SettingsState>) => {
    setPreviewState(prev => ({ ...prev, ...updates }));
  };

  const handleDeploy = () => {
    if (!hasChanges) return;
    setIsDeploying(true);
    
    // Giả lập quá trình deploy hệ thống (Neural Sync)
    setTimeout(() => {
      updateSettings(previewState);
      setIsDeploying(false);
      setNotification({ message: 'Neural configuration deployed successfully', type: 'success' });
    }, 1200);
  };

  const handleUndo = () => {
    setPreviewState({ ...globalSettings });
    setNotification({ message: 'Staged changes discarded', type: 'info' });
  };

  const handleDefault = () => {
    const defaultSettings: SettingsState = {
      sidebarPos: 'LEFT',
      displayDensity: 'COMFORT',
      rounding: 4,
      stickyHeader: true,
      autoCollapse: false,
      theme: 'dark',
      accentColor: '#f4ffc6',
    };
    setPreviewState(defaultSettings);
    setNotification({ message: 'Staged factory defaults (Preview only)', type: 'info' });
  };

  return (
    <div 
      className={`p-6 md:p-12 max-w-7xl mx-auto w-full font-body relative transition-all duration-500 bg-background text-foreground ${localThemeClass}`}
      style={{ 
        '--primary': previewState.accentColor,
        '--rounding': `${previewState.rounding}px`
      } as React.CSSProperties}
    >
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-24 right-12 z-[100] flex items-center gap-3 px-6 py-4 rounded-lg border shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' 
            ? 'bg-surface border-primary/20 text-primary' 
            : 'bg-surface border-tertiary/20 text-tertiary'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <Activity size={20} />}
          <span className="text-sm font-bold tracking-tight uppercase">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100 text-foreground">
            <X size={16} />
          </button>
        </div>
      )}

      {/* 6. Bonus: Staged Warning Banner */}
      {hasChanges && (
        <div className="mb-10 p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-primary" size={20} />
            <div>
              <p className="text-sm font-bold text-primary uppercase tracking-tight">Configuration Staged</p>
              <p className="text-[10px] text-foreground/50 uppercase font-medium">Changes are only visible in the preview core. Deploy to apply globally.</p>
            </div>
          </div>
          <button 
            onClick={handleUndo}
            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-primary/10 hover:bg-primary/20 text-primary rounded transition-all"
          >
            <Undo2 size={14} />
            Discard Changes
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Controls (Update previewState) */}
        <div className="lg:col-span-7 space-y-12">
          {/* Appearance Section */}
          <section>
            <h2 className="text-4xl font-display font-black tracking-tighter mb-8 text-foreground flex items-center gap-4 uppercase italic">
              <Palette className="text-primary" size={32} />
              Appearance
            </h2>
            
            <div className="space-y-10">
              {/* Theme Selector */}
              <div>
                <label className="text-[10px] font-bold tracking-[0.2em] text-foreground/40 mb-4 block uppercase italic">Visual Mode Engine</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['dark', 'light', 'system'] as const).map((t) => (
                    <button 
                      key={t}
                      onClick={() => handleUpdate({ theme: t })}
                      className={`py-6 px-2 flex flex-col items-center gap-3 transition-all border-b-2 rounded-t-lg ${
                        previewState.theme === t 
                        ? 'bg-surface' 
                        : 'bg-background border-transparent text-foreground/40 hover:bg-surface/50'
                      }`}
                      style={{ 
                        borderColor: previewState.theme === t ? previewState.accentColor : 'transparent', 
                        color: previewState.theme === t ? previewState.accentColor : '' 
                      }}
                    >
                      <span className="material-symbols-outlined text-3xl">
                        {t === 'dark' ? 'dark_mode' : t === 'light' ? 'light_mode' : 'settings_brightness'}
                      </span>
                      <span className="font-display text-xs font-bold uppercase tracking-widest">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Picker */}
              <div>
                <label className="text-[10px] font-bold tracking-[0.2em] text-foreground/40 mb-4 block uppercase italic">Kinetic Neural Accents</label>
                <div className="flex flex-wrap gap-4">
                  {accents.map((acc) => (
                    <button
                      key={acc.color}
                      onClick={() => handleUpdate({ accentColor: acc.color })}
                      style={{ backgroundColor: acc.color }}
                      className={`w-14 h-14 rounded-lg transition-all flex items-center justify-center shadow-lg ${
                        previewState.accentColor === acc.color 
                        ? 'ring-4 ring-foreground ring-offset-4 ring-offset-background scale-110' 
                        : 'hover:scale-110 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {previewState.accentColor === acc.color && (
                        <CheckCircle2 size={24} className="text-black font-bold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Layout Section */}
          <section>
            <h2 className="text-4xl font-display font-black tracking-tighter mb-8 text-foreground flex items-center gap-4 uppercase italic">
              <Layout className="text-tertiary" size={32} />
              Layout Engine
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-surface rounded-xl border border-surface-border transition-all">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-display text-sm font-bold tracking-tight uppercase text-foreground italic">Sidebar Navigation</span>
                  <span className="material-symbols-outlined" style={{ color: previewState.accentColor }}>dock_to_left</span>
                </div>
                <div className="flex gap-2 p-1 bg-background rounded-lg border border-surface-border">
                  {(['LEFT', 'RIGHT'] as const).map((pos) => (
                    <button 
                      key={pos}
                      onClick={() => handleUpdate({ sidebarPos: pos })}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded transition-all ${previewState.sidebarPos === pos ? 'bg-surface shadow-sm' : 'text-foreground/30 hover:text-foreground'}`}
                      style={{ color: previewState.sidebarPos === pos ? previewState.accentColor : '' }}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-surface rounded-xl border border-surface-border transition-all">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-display text-sm font-bold tracking-tight uppercase text-foreground italic">Information Density</span>
                  <span className="material-symbols-outlined" style={{ color: previewState.accentColor }}>density_medium</span>
                </div>
                <div className="flex gap-2 p-1 bg-background rounded-lg border border-surface-border">
                  {(['COMPACT', 'COMFORT'] as const).map((density) => (
                    <button 
                      key={density}
                      onClick={() => handleUpdate({ displayDensity: density })}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded transition-all ${previewState.displayDensity === density ? 'bg-surface shadow-sm' : 'text-foreground/30 hover:text-foreground'}`}
                      style={{ color: previewState.displayDensity === density ? previewState.accentColor : '' }}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>

              {/* Component Rounding Slider */}
              <div className="md:col-span-2 p-8 bg-surface rounded-xl border border-surface-border transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-display text-sm font-bold tracking-tight uppercase text-foreground italic">Component Rounding</span>
                  <span className="font-display font-black text-xs uppercase" style={{ color: previewState.accentColor }}>{previewState.rounding}PX RADIUS</span>
                </div>
                <input 
                  className="w-full h-1.5 bg-background rounded-lg appearance-none cursor-pointer border border-surface-border accent-primary" 
                  max="24" min="0" type="range" 
                  value={previewState.rounding}
                  onChange={(e) => handleUpdate({ rounding: parseInt(e.target.value) })}
                  style={{ accentColor: previewState.accentColor } as any}
                />
                <div className="flex justify-between mt-3 text-[9px] font-black text-foreground/20 uppercase tracking-[0.2em]">
                  <span>Sharp</span>
                  <span>Industrial</span>
                  <span>Organic</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Visual Preview (Sử dụng previewState) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32">
            <div className="font-display text-[10px] font-bold tracking-[0.3em] text-foreground/30 mb-6 uppercase flex items-center gap-2 italic">
              <Eye size={14} />
              Neural Preview Core
            </div>
            
            {/* Real-time Preview Container */}
            <div 
              className="overflow-hidden shadow-2xl border border-surface-border aspect-[4/5] relative group transition-all duration-500 shadow-black/50"
              style={{ 
                borderRadius: `${previewState.rounding * 2}px`,
                backgroundColor: 'var(--background)'
              }}
            >
              {/* Mock UI Shell */}
              <div className={`absolute inset-0 flex ${previewState.sidebarPos === 'RIGHT' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Mock Sidebar */}
                <div 
                  className="w-16 h-full border-surface-border flex flex-col items-center py-6 gap-6 transition-all duration-500"
                  style={{ 
                    backgroundColor: 'var(--surface-variant)',
                    borderRightWidth: previewState.sidebarPos === 'LEFT' ? '1px' : '0',
                    borderLeftWidth: previewState.sidebarPos === 'RIGHT' ? '1px' : '0',
                  }}
                >
                  <div 
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300"
                    style={{ 
                      borderRadius: `${previewState.rounding}px`,
                      backgroundColor: `var(--primary)20` 
                    }}
                  >
                    <div className="w-5 h-5 rounded-full animate-pulse bg-primary"></div>
                  </div>
                  <div className="space-y-4 opacity-10">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-1.5 rounded-full bg-foreground"></div>
                    ))}
                  </div>
                </div>

                {/* Mock Main Content */}
                <div className="flex-1 flex flex-col">
                  <div 
                    className={`h-14 w-full border-b border-surface-border flex items-center px-6 justify-between transition-all duration-500 bg-background`}
                  >
                    <div className="w-24 h-2.5 bg-foreground/10 rounded-full"></div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-foreground/5"></div>
                      <div className="w-5 h-5 rounded-full bg-foreground/5"></div>
                    </div>
                  </div>

                  <div className={`flex-1 p-8 ${previewState.displayDensity === 'COMPACT' ? 'space-y-4' : 'space-y-8'}`}>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="w-28 h-2 bg-foreground/5 rounded-full mb-3"></div>
                        <div 
                          className="w-40 h-8 rounded font-display font-black text-2xl flex items-center px-3 transition-all duration-500 uppercase italic tracking-tighter bg-surface-variant text-foreground"
                        >
                          KINETIC_01
                        </div>
                      </div>
                      <div className="font-display font-black text-5xl text-primary">92%</div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div 
                        className="aspect-square p-6 flex flex-col justify-between transition-all duration-500 border border-surface-border bg-surface-variant"
                        style={{ 
                          borderRadius: `${previewState.rounding * 1.5}px`,
                        }}
                      >
                        <Bolt size={20} className="text-primary" />
                        <div className="space-y-2">
                          <div className="w-full h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                            <div className="w-3/4 h-full rounded-full bg-primary"></div>
                          </div>
                          <div className="text-[9px] font-black uppercase text-foreground/30 tracking-widest italic">Neural Link</div>
                        </div>
                      </div>
                      <div 
                        className="aspect-square p-6 border transition-all duration-500 border-surface-border flex flex-col justify-between bg-surface"
                        style={{ 
                          borderRadius: `${previewState.rounding * 1.5}px`,
                        }}
                      >
                        <Activity size={20} className="text-tertiary" />
                        <div className="text-[9px] font-black leading-tight uppercase text-foreground/40 italic tracking-tighter">System Nominal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staged Indicator Tag */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                <span 
                  className="px-4 py-1.5 border backdrop-blur-md text-[9px] font-black rounded-full transition-all duration-500 uppercase tracking-widest shadow-xl text-primary"
                  style={{ 
                    backgroundColor: `var(--primary)10`,
                    borderColor: `var(--primary)30`,
                  }}
                >
                  Staged Build
                </span>
              </div>
            </div>

            <p className="mt-8 text-foreground/30 text-[10px] italic text-center max-w-xs mx-auto uppercase tracking-widest font-bold leading-relaxed">
              * The precision engine will remain on the current production build until a manual deployment is triggered.
            </p>

            {/* 4. Action Buttons (Deploy / Reset) */}
            <div className="flex flex-col gap-4 mt-10">
              <button 
                onClick={handleDeploy}
                disabled={isDeploying || !hasChanges}
                className={`w-full font-display font-black py-5 px-6 rounded-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all uppercase tracking-[0.2em] shadow-2xl disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed border border-white/10 ${
                  hasChanges ? 'text-black' : 'text-foreground/40 bg-surface'
                }`}
                style={{ 
                  backgroundColor: hasChanges ? previewState.accentColor : '',
                  boxShadow: hasChanges ? `0 15px 30px -10px ${previewState.accentColor}60` : ''
                }}
              >
                {isDeploying ? <Loader2 className="animate-spin" size={22} /> : <Rocket size={22} />}
                <span>{isDeploying ? 'Syncing Neural Core...' : 'Deploy Changes'}</span>
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleUndo}
                  disabled={!hasChanges}
                  className="bg-surface hover:bg-surface-hover text-foreground/50 hover:text-foreground disabled:opacity-20 font-display font-black py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[9px] border border-surface-border"
                >
                  <Undo2 size={14} />
                  <span>Undo Staged</span>
                </button>
                <button 
                  onClick={handleDefault}
                  className="bg-surface hover:bg-surface-hover text-foreground/50 hover:text-foreground font-display font-black py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-[9px] border border-surface-border"
                >
                  <RotateCcw size={14} />
                  <span>Factory Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

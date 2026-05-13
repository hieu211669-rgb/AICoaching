'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  sidebarPos: 'LEFT' | 'RIGHT';
  displayDensity: 'COMPACT' | 'COMFORT';
  rounding: number;
  stickyHeader: boolean;
  autoCollapse: boolean;
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
}

const defaultSettings: Settings = {
  sidebarPos: 'LEFT',
  displayDensity: 'COMFORT',
  rounding: 4,
  stickyHeader: true,
  autoCollapse: false,
  theme: 'dark',
  accentColor: '#f4ffc6',
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kinetic-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever settings change (after initial load)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('kinetic-settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // Apply global effects whenever settings change
  useEffect(() => {
    if (!isLoaded) return;

    const root = window.document.documentElement;
    
    // Apply Accent Color
    root.style.setProperty('--primary', settings.accentColor);
    
    // Apply Rounding
    root.style.setProperty('--rounding', `${settings.rounding}px`);

    // Apply Theme
    const applyTheme = (themeValue: 'dark' | 'light' | 'system') => {
      let activeTheme = themeValue;
      
      if (themeValue === 'system') {
        activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      if (activeTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    applyTheme(settings.theme);

    // Listen for system theme changes if set to system
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('kinetic-settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      <div style={{ 
        '--primary': settings.accentColor,
        '--rounding': `${settings.rounding}px`
      } as React.CSSProperties}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

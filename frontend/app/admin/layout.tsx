'use client';

import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';
import { useSettings } from '@/context/SettingsContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useSettings();

  return (
    <div className={`flex min-h-screen bg-background text-foreground ${settings.sidebarPos === 'RIGHT' ? 'flex-row-reverse' : 'flex-row'} transition-colors duration-500`}>
      <Sidebar />
      <div className={`flex-1 flex flex-col min-h-screen ${settings.sidebarPos === 'RIGHT' ? 'mr-64' : 'ml-64'}`}>
        <TopBar />
        <main className="flex-1">
          {children}
        </main>
        
        <footer className="border-t border-surface-border bg-background px-8 py-3 flex justify-between items-center text-[10px] font-bold tracking-widest text-gray-500 uppercase">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></span>
              Server Status: Operational
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></span>
              Database: Connected
            </div>
          </div>
          <div>
            Precision Engine v2.4.0-Stable
          </div>
        </footer>
      </div>
    </div>
  );
}

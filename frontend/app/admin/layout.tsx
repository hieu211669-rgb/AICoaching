'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';
import { useSettings } from '@/context/SettingsContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = useSettings();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.replace('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        router.replace('/');
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace('/login');
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary font-display uppercase tracking-widest animate-pulse">Verifying access...</p>
      </div>
    );
  }

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

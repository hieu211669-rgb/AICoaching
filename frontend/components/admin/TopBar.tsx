'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

const TopBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { settings } = useSettings();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="flex justify-between items-center w-full px-8 py-4 bg-background/80 backdrop-blur-xl  border-surface-border font-body sticky top-0 z-30 transition-colors duration-500">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
          <input 
            className="w-full bg-surface border border-surface-border focus:ring-1 text-sm py-2 pl-10 pr-4 rounded-md text-foreground placeholder-gray-500 outline-none transition-all" 
            placeholder="Search system assets..." 
            type="text"
            style={{ 
              borderColor: 'var(--primary)',
            } as any}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6 ml-8">
        <button className="text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button 
          onClick={() => router.push('/admin/setting')}
          className="text-gray-400 hover:text-primary transition-colors"
          style={{ color: isActive('/admin/setting') ? 'var(--primary)' : '' } as any}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin/setting') ? "'FILL' 1" : '' }}>settings</span>
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden border border-surface-border">
          <img 
            alt="Admin Avatar" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVXZQ9UFNLSn1szliCigKNLvlvwHvzjViqDFyMOm2Mm4FWwJNmalMZhFVN0SzqcDzIfPh-crS5ZcIWjL6Q5ZPSWD3IhV2l7V1TfPCIMtmAsnNx6kUqE_vUvwlHjtcgOzXFFPXflP3V5vBY55p8amFf2iujv524xoWSj1wb5BX9-a5cZ3GzI5WVc_5O4r41NwMx1coW4AyTwO7gpdd4SWUmYS70Efh_t-vtdAxXoFcCm3ClfhPMFSckpmBweT2aJRpMwX3YStDzNXt6"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [expandedItems, setExpandedItems] = useState<{[key: string]: boolean}>({
    contentManager: true, 
    exerciseLab: false
  });

  const toggleExpand = (item: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const contentManagerPages = [
    { icon: 'upload_file', label: 'Video Upload', href: '/admin/content-manager/upload' },
    { icon: 'video_library', label: 'Video Library', href: '/admin/content-manager/library' },
  ];

  const exerciseLabPages = [
    { icon: 'add_circle', label: 'Create Exercise', href: '/admin/exercise-lab/create' },
    { icon: 'fitness_center', label: 'All Exercises', href: '/admin/exercise-lab/library' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside 
      className={`fixed ${settings.sidebarPos === 'RIGHT' ? 'right-0 border-l' : 'left-0 border-r'} top-0 h-full z-40 bg-background border-surface-border w-64 flex flex-col font-headline tracking-tight overflow-y-auto transition-all duration-300`}
    >
      <div className="p-8 sticky top-0 bg-background  border-surface-border z-10">
        <Link href="/admin">
          <h1 className="text-2xl font-bold tracking-tighter text-primary">KINETIC</h1>
          <p className="text-[10px] tracking-[0.2em] text-gray-500 mt-1 uppercase">PRECISION ADMIN</p>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4 pb-4">
        {/* Dashboard */}
        <Link 
          href="/admin" 
          className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 rounded-md ${
            isActive('/admin') 
            ? 'bg-surface font-bold border-l-4' 
            : 'text-gray-400 hover:bg-surface'
          }`}
          style={{ 
            borderColor: isActive('/admin') ? 'var(--primary)' : 'transparent',
            color: isActive('/admin') ? 'var(--primary)' : ''
          }}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </Link>

        {/* Content Manager - Expandable */}
        <div className="space-y-1">
          <button
            onClick={() => toggleExpand('contentManager')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-surface transition-colors duration-200 rounded-md hover:text-foreground"
          >
            <span className="material-symbols-outlined">video_library</span>
            <span className="flex-1 text-left">Content Manager</span>
            <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${expandedItems.contentManager ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
          
          {expandedItems.contentManager && (
            <div className="space-y-1 pl-4 border-l-2 ml-4 border-primary/20">
              {contentManagerPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`flex items-center gap-3 px-4 py-2 text-[12px] transition-colors duration-200 rounded-md ${
                    isActive(page.href) ? 'bg-surface' : 'text-gray-400 hover:bg-surface hover:text-foreground'
                  }`}
                  style={{ color: isActive(page.href) ? 'var(--primary)' : '' }}
                >
                  <span className="material-symbols-outlined text-[16px]">{page.icon}</span>
                  <span>{page.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Exercise Lab - Expandable */}
        <div className="space-y-1">
          <button
            onClick={() => toggleExpand('exerciseLab')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-surface transition-colors duration-200 rounded-md hover:text-foreground"
          >
            <span className="material-symbols-outlined">fitness_center</span>
            <span className="flex-1 text-left">Exercise Lab</span>
            <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${expandedItems.exerciseLab ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
          
          {expandedItems.exerciseLab && (
            <div className="space-y-1 pl-4 border-l-2 border-tertiary/20 ml-4">
              {exerciseLabPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`flex items-center gap-3 px-4 py-2 text-[12px] transition-colors duration-200 rounded-md ${
                    isActive(page.href) ? 'text-tertiary bg-surface' : 'text-gray-400 hover:text-tertiary hover:bg-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{page.icon}</span>
                  <span>{page.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <Link 
          href="/admin/setting" 
          className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 rounded-md ${
            isActive('/admin/setting') 
            ? 'bg-surface font-bold border-l-4' 
            : 'text-gray-400 hover:bg-surface'
          }`}
          style={{ 
            borderColor: isActive('/admin/setting') ? 'var(--primary)' : 'transparent',
            color: isActive('/admin/setting') ? 'var(--primary)' : ''
          }}
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </Link>
      </nav>
      
      <div className="p-4  border-surface-border space-y-2">
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-primary transition-colors duration-200 rounded-md">
          <span className="material-symbols-outlined">help</span>
          <span>Support</span>
        </Link>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-primary transition-colors duration-200 rounded-md">
          <span className="material-symbols-outlined">logout</span>
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

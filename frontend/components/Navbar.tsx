'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, LineChart, User, PlayCircle, Library } from 'lucide-react';

import { useSettings } from '@/context/SettingsContext';

const BottomNav = () => {
  const pathname = usePathname();
  const { settings } = useSettings();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dashboard', icon: Library, label: 'Library' },
    { href: '/AIRating', icon: PlayCircle, label: 'Analyze' },
    { href: '/progress', icon: LineChart, label: 'Plans' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface/90 backdrop-blur-xl border-t border-surface-border shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex justify-around items-center pt-3 pb-6 px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 active:scale-90 transition-all duration-150 ${
              isActive ? '' : 'text-on-surface-variant/60 hover:text-on-surface-variant/80'
            }`}
            style={{ color: isActive ? settings.accentColor : '' }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;

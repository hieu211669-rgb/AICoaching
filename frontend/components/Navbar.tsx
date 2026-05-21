'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, User, PlayCircle, Library } from 'lucide-react';

import { useSettings } from '@/context/SettingsContext';

type BottomNavProps = {
  mobileOnly?: boolean;
};

const BottomNav = ({ mobileOnly = false }: BottomNavProps) => {
  const pathname = usePathname();
  const { settings } = useSettings();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/library', icon: Library, label: 'Library' },
    { href: '/AIRating', icon: PlayCircle, label: 'Analyze' },
    { href: '/progress', icon: LineChart, label: 'Plans' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-surface-border bg-surface/90 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 active:scale-90 transition-all duration-150 ${
                isActive ? '' : 'text-on-surface-variant/60 hover:text-on-surface-variant/80'
              }`}
              style={{ color: isActive ? settings.accentColor : '' }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="max-w-full truncate text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <aside className={`fixed right-0 top-0 z-50 h-screen w-24 flex-col items-center justify-center border-l border-surface-border bg-surface/90 px-3 backdrop-blur-xl ${mobileOnly ? 'hidden' : 'hidden md:flex'}`}>
        <div className="absolute top-6 font-display text-[10px] font-black uppercase tracking-[0.25em] text-primary [writing-mode:vertical-rl]">
          VOLT
        </div>
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex h-14 w-14 items-center justify-center rounded-lg border transition-all duration-150 ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-transparent text-on-surface-variant/60 hover:border-surface-border hover:bg-background hover:text-primary'
                }`}
                style={{ color: isActive ? settings.accentColor : '' }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="sr-only">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default BottomNav;

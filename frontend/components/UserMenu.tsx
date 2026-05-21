'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, LineChart, Menu, PlayCircle, User, X } from 'lucide-react';

const menuItems = [
  { href: '/', icon: Home, label: 'Home', description: 'Training overview' },
  { href: '/library', icon: Library, label: 'Library', description: 'Exercise and video library' },
  { href: '/AIRating', icon: PlayCircle, label: 'Analyze', description: 'AI form rating' },
  { href: '/progress', icon: LineChart, label: 'Plans', description: 'Workout plan and progress' },
  { href: '/coaching', icon: PlayCircle, label: 'Coach', description: 'AI coaching assistant' },
  { href: '/profile', icon: User, label: 'Profile', description: 'Athlete profile' },
];

export default function UserMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const drawer = (
    <div className="fixed inset-0 z-[999]">
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <aside className="absolute left-0 top-0 flex h-full w-full max-w-sm flex-col border-r border-surface-border bg-background shadow-2xl sm:max-w-md">
        <div className="flex h-16 items-center justify-between border-b border-surface-border px-5">
          <div>
            <p className="font-display text-lg font-black uppercase tracking-tight text-primary">VOLT KINETIC</p>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border bg-surface text-foreground transition-colors hover:text-primary"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                    active
                      ? 'border-primary/30 bg-primary/10'
                      : 'border-transparent hover:border-primary/20 hover:bg-surface'
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-black uppercase tracking-tight text-foreground">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs font-medium text-foreground/45">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-surface-border p-4">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-display text-xs font-black uppercase tracking-widest text-black transition-opacity hover:opacity-90"
          >
            Open Profile
          </Link>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="hidden h-10 w-10 items-center justify-center rounded-lg text-primary duration-200 hover:bg-surface active:scale-95 md:flex"
      >
        <Menu size={22} />
      </button>

      {open && mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}

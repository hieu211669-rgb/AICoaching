'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/register' || pathname === '/login' || pathname?.startsWith('/admin');

  return (
    <>
      <main className={`flex-1 ${hideNavbar ? '' : 'pb-24'} h-full overflow-x-hidden`}>
        {children}
      </main>
      {!hideNavbar && <Navbar />}
    </>
  );
}

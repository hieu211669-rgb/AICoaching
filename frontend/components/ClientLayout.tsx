'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const userMenuRoutes = [
    '/',
    '/AIRating',
    '/coaching',
    '/dashboard',
    '/edit-profile',
    '/exercise',
    '/library',
    '/profile',
    '/progress',
    '/train',
  ];
  const usesUserMenu = userMenuRoutes.includes(currentPath);
  const hideNavbar =
    pathname === '/register' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/resetpw' ||
    pathname === '/send-email' ||
    pathname === '/sendemail' ||
    pathname?.startsWith('/admin');

  return (
    <>
      <main className={`flex-1 ${hideNavbar ? '' : usesUserMenu ? 'pb-24 md:pb-0' : 'pb-24 md:pb-0 md:pr-24'} h-full overflow-x-hidden`}>
        {children}
      </main>
      {!hideNavbar && <Navbar mobileOnly={usesUserMenu} />}
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserMenu from '@/components/UserMenu';
import { ArrowLeft } from 'lucide-react';

const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuBxpbkDrkQZyqvuWjQcqWXOYLyNOvTqqpgMEuTB34x_vEEKE5St7gcdOAuozEQRBtee-rmaaqXPYdOJPJ_-Z_5DQ48GQGtf2M0Sp9Uu3JN3WvDYT783Of56veNHC474vWgxf9KQm5i9ag0c_ulq4QAK48KVO_DX05vkuqHhgGpj2dsS-X9XyUafQehBj1DBgohpIdQ_w77aa5RJ1NRQ71Nd_GV-aXH4u2-xOJBrfhyeVqVJQw7s_0SCzFZZCmWq8GraOWi77Jl3uN8h";

type User = {
  avatar_url?: string;
  full_name?: string;
};

interface TopAppBarProps {
  title?: string;
  showAvatar?: boolean;
  showBack?: boolean;
}

export default function TopAppBar({ 
  title = "VOLT KINETIC",
  showAvatar = true,
  showBack = false
}: TopAppBarProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  const getAvatarUrl = () => {
    const url = user?.avatar_url;
    if (!url) return defaultAvatar;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    
    // Handle relative URLs by prepending the backend API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-surface-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-4">
        <UserMenu />
        {showBack && (
          <button 
            onClick={() => router.back()}
            className="active:scale-95 transition-transform text-primary hover:opacity-80 flex items-center justify-center h-10 w-10 rounded-lg"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <h1 className="text-xl font-black text-primary tracking-[-0.02em] font-display uppercase truncate max-w-[150px] sm:max-w-none">
          {title}
        </h1>
      </div>
      
      {showAvatar && (
        <Link href={user ? "/profile" : "/login"}>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/20 bg-surface transition-transform active:scale-95">
            <img
              alt="User profile avatar"
              className="h-full w-full object-cover"
              src={getAvatarUrl()}
            />
          </div>
        </Link>
      )}
    </header>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Dumbbell, 
  Activity, 
  History,
  Flame,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import TopAppBar from '@/components/TopAppBar';

const profileImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAb1SNOsecnWphr_FzRQddO3y-GfWLFURLwN0xEj4tzEP6RJGP7NTtkiDpyfom0btq3YmzYS4OhM33BhAdtXp3zjhLdTffXL9JvqDNR3ZABaaOfc9AihO9qRM5dHEDyZHBYOHACc0top6qGb6Wvc8eO-C-KJPsrdEM9qZNYwi_GXZNLyuAh80cHGYQkosHPjEzntte864uGiEOAMkm4F8hG-afAtKiG9ueZIvyXWMcbfZ_UZn27YfXR__l-aTjGYz5pM1qY5Uvc-ylg';

const trainingHistory = [
  {
    icon: <History className="text-primary" size={20} />,
    title: 'Hypertrophy - Upper Body A',
    meta: 'Oct 24 / 18:42 / 74 min',
    metric: '420kg',
    metricLabel: 'Volume',
    metricClassName: 'text-primary',
  },
  {
    icon: <Activity className="text-tertiary" size={20} />,
    title: 'Kinetic Sprint - Interval',
    meta: 'Oct 22 / 06:15 / 25 min',
    metric: '4.2km',
    metricLabel: 'Distance',
    metricClassName: 'text-tertiary',
  },
  {
    icon: <Dumbbell className="text-primary" size={20} />,
    title: 'Active Recovery - Yoga',
    meta: 'Oct 21 / 20:00 / 45 min',
    metric: 'RECOV',
    metricLabel: 'State',
    metricClassName: 'text-zinc-500',
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ workoutsCompleted: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        fetchUserData(userData.id);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // 1. Fetch Workout History Count
      const historyRes = await fetch(`http://localhost:8000/api/user/workout-history/${userId}`);
      const historyData = await historyRes.json();
      
      // 2. Fetch Streak
      const statsRes = await fetch(`http://localhost:8000/api/user/stats/${userId}`);
      const statsData = await statsRes.json();

      setStats({
        workoutsCompleted: historyData.history?.length || 0,
        streak: statsData.streak || 0
      });
    } catch (err) {
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const coreMetrics = [
    {
      icon: <Dumbbell className="text-primary opacity-50" size={24} />,
      borderClassName: 'border-primary',
      value: stats.workoutsCompleted.toString(),
      valueClassName: 'text-on-background',
      label: 'Workouts Completed',
    },
    {
      icon: <Flame className="text-tertiary opacity-50" size={24} />,
      borderClassName: 'border-tertiary',
      value: stats.streak.toString(),
      valueClassName: 'text-on-background',
      label: 'Day Streak',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-primary flex items-center justify-center font-display uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-on-background">
        <TopAppBar title="ATHLETE_PROFILE" />
        <main className="flex flex-col items-center justify-center pt-48 px-4 text-center">
           <div className="h-24 w-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-6 border-2 border-primary/20">
              <UserIcon size={48} className="text-zinc-500" />
           </div>
           <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 font-display">Access Restricted</h2>
           <p className="text-zinc-500 mb-8 max-w-xs">Please login to access your personalized athlete profile and training history.</p>
           <Link href="/login" className="bg-primary text-black px-10 py-4 rounded-lg font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20 active:scale-95 transition-transform">
             Login / Sign Up
           </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 text-on-background">
      <TopAppBar title="ATHLETE_PROFILE" />

      <div className="fixed left-0 right-0 top-[60px] z-50 h-px bg-surface-container-low" />

      <main className="mx-auto max-w-4xl px-4 pt-24 sm:px-6">
        <section className="relative mb-12 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="h-32 w-32 overflow-hidden rounded-lg border-2 border-primary bg-background p-1">
              <img
                alt="Athlete Profile"
                className="h-full w-full rounded-lg object-cover"
                src={user?.avatar_url || profileImage}
              />
            </div>
          </div>

          <h2 className="mb-1 font-headline text-4xl font-extrabold uppercase tracking-tighter text-on-background">
            {user?.full_name || 'Elite Athlete'}
          </h2>

          <div className="flex w-full gap-4">
            <Link
              href="/edit-profile"
              className="flex-1 rounded-lg bg-primary py-4 text-center font-headline text-sm font-black uppercase tracking-widest text-on-primary transition-all hover:bg-primary-dim active:scale-95"
            >
              EDIT PROFILE
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 font-headline text-sm font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-500/20 active:scale-95"
            >
              <LogOut size={16} />
              SIGN OUT
            </button>
          </div>
        </section>

        <section className="mb-12">
          <h3 className="mb-4 font-headline text-xs font-bold uppercase tracking-widest text-zinc-500">Core Metrics</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {coreMetrics.map((metric) => (
              <div
                key={metric.label}
                className={`relative overflow-hidden rounded-lg border-l-2 bg-surface-container-low p-6 ${metric.borderClassName}`}
              >
                <div className="mb-4">{metric.icon}</div>
                <p className={`mb-2 font-display text-4xl font-black leading-none ${metric.valueClassName}`}>{metric.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-end justify-between">
            <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-zinc-500">Training History</h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-primary" type="button">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {trainingHistory.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-lg bg-surface-container-low p-4 sm:gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-surface-container-highest">
                  {activity.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-headline text-sm font-bold tracking-tight">{activity.title}</h4>
                  <p className="text-xs font-medium text-zinc-500">{activity.meta}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm font-bold">{activity.metric}</p>
                  <p className={`text-[10px] font-bold uppercase ${activity.metricClassName}`}>{activity.metricLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}

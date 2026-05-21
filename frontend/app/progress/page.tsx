'use client';

import { useState } from 'react';
import { Check, Zap, Lock, BarChart3 } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import TopAppBar from '@/components/TopAppBar';

export default function Plans() {
  const { settings } = useSettings();
  const [completedWorkouts, setCompletedWorkouts] = useState(1);

  const weekDays = [
    { day: 'MON', date: 21, completed: true, isToday: false },
    { day: 'TUE', date: 22, completed: true, isToday: false },
    { day: 'WED', date: 23, completed: false, isToday: false },
    { day: 'THU', date: 24, completed: false, isToday: true },
    { day: 'FRI', date: 25, completed: false, isToday: false },
    { day: 'SAT', date: 26, completed: false, isToday: false },
    { day: 'SUN', date: 27, completed: false, isToday: false },
  ];

  const todayWorkouts = [
    {
      id: 1,
      name: 'Barbell Back Squat',
      category: 'Power',
      sets: 4,
      reps: '8-10',
      weight: '120kg',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc9Q8GMgGEqdXoJovXkuaMoLe8xyV31AFOFOfLC99wo0Bx5hdmGswJfEQkJobyVnQRFAFVgCR7fPoPVViMO2iLfFVcgnkSZ9WQ2VYd4UgnE3YC8IPVzciewjMTPDBoQeqcZKK3DcHeYwD-6d7UPCGTQNj-kuV7nggOhdpay33sAh8TilY_lcevVlsdI75tp-WW8MrkokhtPkSQtIL8oRFbyWRRsZCDms-eV-hbnDDK947oSFd5Qg5QQHfzyWYx-Wgho9N3gYJrRL1o',
      completed: true,
    },
    {
      id: 2,
      name: 'Bulgarian Split Squat',
      category: 'Strength',
      sets: 3,
      reps: '12',
      weight: '40kg',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9GGDUpFFqbe9rPUjwv_c0Z57ScW7JT_zxeuaqKgG_irxEQV3zwtSEfDfQ2bao9lMIzm6AD1D6zG31TMb7Its3CkcXu1X5rzzflSjNTOIU65Bn-GwQSTOfMLynaZ5Qz42SioAp_5exavV4lojumxok_LwhvGOHhcjlYaiV0q5HP7ILVZok8z9aSluLZsWS0BQ_pEHYWgzkAj3FzKEINiFWnb75JJs-1vChM--GPDGlbJKxQxZglhDW3ahUA_nOnRFzzmJphtV4KMT8',
      completed: false,
    },
    {
      id: 3,
      name: 'Leg Press Machine',
      category: 'Engine',
      sets: 3,
      reps: '15',
      weight: '200kg',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6-TO1CMJFc2T9UcbEhhfMp26CsyL4-gqRIjMT37frO1Sa1qXbeGS9ElxD86QNaiK3U71cELGGY6xtCTOhORy027LWPggjCISxUMdXpN23J4oAy9EWaQA_WgyC4Uml-ef7iG9rv9A_Jzd_xIY7P4JjKs6Ak3uDGznOfq_dO5Vre4ODTNV6Kn1eEJxbldezUveez2eGVUhk5cHIAMk9hYZ5c8fKjABKas4fhDctcrrkXMNau9Wz2XSsER2bzneCKu8skGnkSy7d8o5z',
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-500">
      <TopAppBar />

      <main className="mx-auto max-w-5xl space-y-12 px-4 pt-24 sm:px-6 md:pb-12">
        {/* Weekly Calendar Section */}
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-primary font-bold tracking-wider text-xs uppercase">Current Phase</span>
              <h2 className="font-display mt-1 text-3xl font-black uppercase italic tracking-tighter text-foreground sm:text-4xl">WEEK 04: PEAK</h2>
            </div>
            <div className="text-right">
              <span className="text-foreground/40 text-[10px] uppercase tracking-[0.2em]">Completion</span>
              <p className="text-2xl font-black text-primary tracking-tighter">68%</p>
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`flex min-w-0 flex-col items-center rounded-lg border-b-2 py-3 transition-all duration-300 sm:py-4 ${
                  day.isToday
                    ? 'bg-surface border-tertiary shadow-lg'
                    : day.completed
                    ? 'bg-surface border-primary'
                    : 'bg-surface border-surface-border/30'
                }`}
              >
                <span className={`text-[10px] mb-2 font-bold ${day.isToday ? 'text-tertiary' : 'text-foreground/40'}`}>
                  {day.isToday ? 'TODAY' : day.day}
                </span>
                <span
                  className={`text-xl font-black ${
                    day.isToday ? 'text-foreground' : day.completed ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {day.date}
                </span>
                <div className="mt-2">
                  {day.isToday ? (
                    <Zap size={16} className="text-tertiary fill-tertiary" />
                  ) : day.completed ? (
                    <Check size={16} className="text-primary" />
                  ) : (
                    <Lock size={16} className="text-foreground/10" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Workout List */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-display text-xl font-black uppercase tracking-tight sm:text-2xl">TODAY'S ARSENAL</h3>
            <div className="h-[2px] flex-grow bg-surface-border/20 relative">
              <div className="absolute left-0 top-0 h-full w-1/3 bg-tertiary"></div>
            </div>
            <span className="text-xs font-bold text-tertiary">{completedWorkouts}/4 COMPLETE</span>
          </div>

          <div className="space-y-4">
            {todayWorkouts.map((workout, idx) => (
              <div
                key={workout.id}
                className={`group relative flex overflow-hidden rounded-lg border-l-4 border-surface-border bg-surface transition-all duration-300 ${
                  workout.completed
                    ? 'border-l-primary opacity-100'
                    : 'border-l-transparent hover:border-l-tertiary opacity-80'
                }`}
              >
                <div className="min-w-0 flex-grow p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 font-bold rounded uppercase ${
                        workout.completed
                          ? 'bg-primary text-black'
                          : 'bg-background text-foreground/40'
                      }`}
                    >
                      {workout.category}
                    </span>
                  </div>
                  <h4 className="font-display mb-1 text-xl font-black uppercase sm:text-2xl">{workout.name}</h4>
                  <div className="mt-4 flex flex-wrap gap-5 sm:gap-6">
                    <div>
                      <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Sets</p>
                      <p className="text-xl font-black">{workout.sets}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Reps</p>
                      <p className="text-xl font-black">{workout.reps}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Weight</p>
                      <p className="text-xl font-black text-primary">{workout.weight}</p>
                    </div>
                  </div>
                </div>

                <div className="relative hidden w-32 shrink-0 overflow-hidden sm:block md:w-48">
                  <img
                    alt={workout.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      workout.completed
                        ? 'grayscale-0 opacity-100'
                        : 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80'
                    }`}
                    src={workout.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent"></div>
                </div>

                {workout.completed && (
                  <div className="absolute top-4 right-4 text-primary bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                    <Check size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Metrics & Tracking */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="relative overflow-hidden rounded-xl border border-surface-border bg-surface p-5 sm:p-8 md:col-span-2">
            <div className="relative z-10">
              <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-black tracking-tight font-display uppercase">KINETIC METRICS</h3>
                  <p className="text-foreground/40 text-xs mt-1 uppercase font-bold tracking-widest">Weight Progress (kg) • Last 30 Days</p>
                </div>
                <div className="bg-background px-3 py-1 rounded-full flex items-center gap-2 border border-surface-border">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[10px] font-bold text-primary">-2.4 KG</span>
                </div>
              </div>

              {/* Chart Area */}
              <div className="w-full h-40 relative flex items-end justify-between px-2">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path
                    d="M 0 35 Q 10 32, 20 30 T 40 28 T 60 22 T 80 15 T 100 10"
                    fill="none"
                    stroke="var(--primary)"
                    strokeDasharray="0.5 0.5"
                    strokeWidth="0.5"
                  ></path>
                  <path
                    d="M 0 35 Q 10 32, 20 30 T 40 28 T 60 22 T 80 15 T 100 10 L 100 40 L 0 40 Z"
                    fill="url(#grad)"
                    opacity="0.1"
                  ></path>
                  <defs>
                    <linearGradient id="grad" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={1}></stop>
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0}></stop>
                    </linearGradient>
                  </defs>
                </svg>

                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-10">
                  <div className="w-full border-t border-foreground"></div>
                  <div className="w-full border-t border-foreground"></div>
                  <div className="w-full border-t border-foreground"></div>
                </div>

                {/* Data Points */}
                <div className="w-2 h-2 rounded-full bg-primary absolute left-0 bottom-[12.5%] -translate-x-1/2"></div>
                <div className="w-2 h-2 rounded-full bg-primary absolute left-[40%] bottom-[30%] -translate-x-1/2"></div>
                <div className="w-3 h-3 rounded-full bg-primary border-4 border-surface absolute right-0 bottom-[75%] translate-x-1/2"></div>
              </div>

              <div className="flex justify-between mt-4 px-2 text-[10px] text-foreground/20 uppercase tracking-widest font-bold">
                <span>Day 01</span>
                <span>Day 15</span>
                <span>Day 30</span>
              </div>
            </div>
          </div>

          {/* Body Fat Card */}
          <div className="flex flex-col justify-between rounded-xl bg-primary p-6 shadow-lg shadow-primary/10 sm:p-8">
            <BarChart3 size={40} className="text-black/40" />
            <div>
              <h3 className="text-black font-black text-3xl tracking-tighter leading-none mb-2 font-display uppercase italic">
                BODY<br />FAT %
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-black leading-none font-display">12.4</span>
                <span className="text-black/60 font-bold mb-1">-0.8%</span>
              </div>
            </div>
            <div className="h-1.5 bg-black/10 rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-black/60 w-3/4"></div>
            </div>
          </div>
        </section>
      </main>

      {/* FAB Button */}
      <button 
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-black text-black shadow-2xl transition-all hover:opacity-90 active:scale-90"
        style={{ background: `linear-gradient(135deg, var(--primary) 0%, var(--tertiary) 100%)` }}
      >
        +
      </button>
    </div>
  );
}

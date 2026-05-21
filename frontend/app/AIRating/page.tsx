'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { AlertCircle, TrendingUp, Save, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import TopAppBar from '@/components/TopAppBar';

type ApiExercise = {
  id: string;
  exerciseName: string;
  referenceVisual: string;
};

function AIRatingContent() {
  const { settings } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('id');
  
  const [exercise, setExercise] = useState<ApiExercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!exerciseId) {
      setIsLoading(false);
      return;
    }

    const fetchExercise = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/exercises/${exerciseId}`);
        if (res.ok) {
          const data = await res.json();
          setExercise(data);
        }
      } catch (err) {
        console.error("Error fetching exercise for rating:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  const handleSaveResults = async () => {
    setSaving(true);
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        alert('Please login to save results');
        router.push('/login');
        return;
      }

      const user = JSON.parse(savedUser);
      
      const response = await fetch('http://localhost:8000/api/user/workout-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          exercise_id: exerciseId || 'unknown_exercise',
          completed_sets: 1,
          completed_reps: 10,
          weight_used: 80,
          calories_burned: 45,
          completed_at: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Failed to save results');
      
      setSaved(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err) {
      console.error('Error saving workout:', err);
      alert('Failed to save results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const corrections = [
    {
      id: 1,
      icon: '⬇️',
      title: 'Hạ mông thấp hơn',
      description:
        'Góc đùi cần đạt tối thiểu 90 độ để kích hoạt cơ mông tối đa.',
      number: '01',
      iconBg: 'bg-tertiary/10',
      iconBorder: 'border-tertiary/20',
      iconColor: 'text-tertiary',
      numberColor: 'text-tertiary',
    },
    {
      id: 2,
      icon: '📏',
      title: 'Giữ lưng thẳng',
      description:
        'Cột sống trung tính giúp giảm áp lực lên đĩa đệm thắt lưng.',
      number: '02',
      iconBg: 'bg-primary/10',
      iconBorder: 'border-primary/20',
      iconColor: 'text-primary',
      numberColor: 'text-primary',
    },
    {
      id: 3,
      icon: '📍',
      title: 'Gối không quá mũi chân',
      description:
        'Điều chỉnh trọng tâm về sau để bảo vệ khớp gối.',
      number: '03',
      iconBg: 'bg-primary/10',
      iconBorder: 'border-primary/20',
      iconColor: 'text-primary',
      numberColor: 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 transition-colors duration-500">
      <TopAppBar title="AI FORM ANALYSIS" />

      <main className="mx-auto min-h-screen max-w-7xl space-y-8 px-4 pb-24 pt-16 sm:px-6 md:px-8 md:pb-12">
        {/* Hero Section: AI Video Analysis */}
        <section className="mt-4 relative group">
          <div className="relative w-full aspect-video md:aspect-[21/9] bg-surface rounded-xl overflow-hidden ring-1 ring-surface-border shadow-2xl transition-colors duration-500">
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700"
                alt={exercise?.exerciseName || "Exercise Analysis"}
                src={exercise?.referenceVisual || "https://lh3.googleusercontent.com/aida-public/AB6AXuAgGRg282TyRBnpUsmFna1slvR0lOaTJEE8pB-HMB5ziDigxCsqCeBR7j21Ib4H9cHEN547IkO4EaP6xOqp3lPQgj9rHqffAXLMi4ca8IeQCnfYtqUpba6e8xyqjOnQDniE_U3KkynDJ2kKDiqG_KtCsONiqW27s4b6kGfIcWLhKnMJnLT0oAl9nfwlFi6OPYeYYhPfURJBFRKyg355LVHgUmH7uwKmDmr8pS9iaYPI1YCCLJQaO8St8YYquX_eTP5LBv8Cu8NMOQU"}
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="absolute inset-0 pointer-events-none">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="xMidYMid slice"
                viewBox="0 0 1000 500"
              >
                <g 
                  className="fill-primary/20 stroke-[2]"
                  style={{ stroke: 'var(--primary)' }}
                >
                  <line x1="500" x2="500" y1="120" y2="250" />
                  <line x1="500" x2="440" y1="150" y2="180" />
                  <line x1="500" x2="560" y1="150" y2="180" />
                  <line x1="440" x2="420" y1="180" y2="240" />
                  <line x1="560" x2="580" y1="180" y2="240" />
                  <line x1="500" x2="460" y1="250" y2="380" />
                  <line x1="500" x2="540" y1="250" y2="380" />
                  <line x1="460" x2="440" y1="380" y2="460" />
                  <line x1="540" x2="560" y1="380" y2="460" />
                  <circle cx="500" cy="110" r="6" className="fill-primary animate-pulse" />
                  <circle cx="500" cy="150" r="4" />
                  <circle cx="440" cy="180" r="4" />
                  <circle cx="560" cy="180" r="4" />
                  <circle cx="500" cy="250" r="4" />
                  <circle cx="460" cy="380" r="4" />
                  <circle cx="540" cy="380" r="4" />
                  <circle cx="440" cy="460" r="4" />
                  <circle cx="560" cy="460" r="4" />
                </g>
              </svg>
            </div>

            <div className="absolute top-4 left-4 bg-background/60 backdrop-blur-md px-3 py-1 rounded flex items-center gap-2 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                AI Live Analysis • {exercise?.exerciseName}
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-surface p-6 ring-1 ring-surface-border transition-colors duration-500 sm:p-8 md:col-span-4">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <h3 className="text-foreground/40 uppercase text-xs font-bold tracking-[0.2em] mb-4">
              Form Score
            </h3>
            <div className="relative">
              <svg className="h-40 w-40 -rotate-90 sm:h-48 sm:w-48">
                <circle
                  className="text-foreground/5"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="6"
                ></circle>
                <circle
                  className="text-primary drop-shadow-[0_0_12px_var(--primary)]"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="currentColor"
                  strokeDasharray="552.92"
                  strokeDashoffset="66.35"
                  strokeLinecap="round"
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-primary tracking-tighter font-display">
                  88
                </span>
                <span className="text-foreground/40 font-bold text-lg uppercase tracking-widest font-display">
                  / 100
                </span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
              <TrendingUp size={16} className="text-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-wider">
                +12% vs last set
              </span>
            </div>
          </div>

          <div className="flex flex-col rounded-xl bg-surface p-5 ring-1 ring-surface-border transition-colors duration-500 sm:p-8 md:col-span-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-black uppercase italic tracking-tight text-foreground sm:text-3xl">
                  ANALYSIS FEEDBACK
                </h2>
                <p className="text-foreground/40 text-sm mt-1 uppercase font-bold tracking-tight">
                  3 critical points identified during the {exercise?.exerciseName || 'session'}.
                </p>
              </div>
              <AlertCircle size={40} className="text-tertiary" />
            </div>
            <div className="space-y-4 flex-grow">
              {corrections.map((correction) => (
                <div
                  key={correction.id}
                  className="flex cursor-default flex-col gap-4 rounded-lg border border-surface-border bg-background p-4 transition-colors hover:bg-surface-hover sm:flex-row sm:items-center sm:gap-6"
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center ${correction.iconBg} rounded border ${correction.iconBorder}`}
                  >
                    <span className={`text-xl ${correction.iconColor}`}>
                      {correction.icon}
                    </span>
                  </div>
                  <div className="min-w-0 flex-grow">
                    <h4 className="text-lg font-black text-foreground uppercase leading-none font-display tracking-tight">
                      {correction.title}
                    </h4>
                    <p className="text-foreground/40 text-xs mt-1 font-medium">
                      {correction.description}
                    </p>
                  </div>
                  <div
                    className={`${correction.numberColor} self-end font-display text-2xl font-black opacity-20 sm:self-auto`}
                  >
                    {correction.number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <button 
            onClick={() => router.back()}
            className="w-full py-4 px-8 rounded-md bg-surface text-foreground font-black uppercase tracking-[0.1em] ring-1 ring-surface-border hover:bg-surface-hover active:scale-95 transition-all flex items-center justify-center gap-3 font-display"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <button 
            onClick={handleSaveResults}
            disabled={saving || saved}
            className={`w-full py-4 px-8 rounded-md font-black uppercase tracking-[0.1em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 font-display ${
              saved ? 'bg-green-500 text-white' : 'bg-primary text-black shadow-primary/20'
            } disabled:opacity-70`}
            style={!saved ? { 
              background: `linear-gradient(to bottom right, var(--primary), var(--primary))`
            } : {}}
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                ĐANG LƯU...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 size={20} />
                ĐÃ LƯU THÀNH CÔNG
              </>
            ) : (
              <>
                <Save size={20} />
                Lưu kết quả
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function AIRatingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AIRatingContent />
    </Suspense>
  );
}

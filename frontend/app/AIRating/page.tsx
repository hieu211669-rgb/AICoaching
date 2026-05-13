'use client';

import React, { useState } from 'react';
import { Menu, AlertCircle, TrendingUp, Save, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

export default function AIRatingPage() {
  const { settings } = useSettings();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
          exercise_id: 'barbell_squat_001', // Dummy ID for current session
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
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 border-b border-surface-border">
        <div className="flex items-center gap-4">
          <button className="active:scale-95 duration-200 text-primary">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-black text-primary tracking-tighter uppercase font-display">
            VOLT KINETIC
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-surface-border">
            <img
              alt="User profile avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv1fXGoBKDu0Dj0XAQZCxertpDUac77fJoT5tSmddmPYL52RD4_W6Jtj1Ylc4-QbolQaJjxOUUG-YZKolajs_2dqLLaiDV9n51BYKtiApTGqNTSnwHMnMvXAW9uolHYjSOQ6Ntqab2CwG0sbPAZSdbYdPbLhdQB8-JHDvUcJkYTqnaarlFbAo8k41xBp0HidozopPJdgZmTwB8b8ZmzYNEcOg3fGiwSNqv5RcV4n2OTy0xTYcgOewdR3GjZAybwkfQhg1O5q-OfMTk"
            />
          </div>
        </div>
      </header>

      <main className="pt-16 pb-24 min-h-screen px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        {/* Hero Section: AI Video Analysis */}
        <section className="mt-4 relative group">
          <div className="relative w-full aspect-video md:aspect-[21/9] bg-surface rounded-xl overflow-hidden ring-1 ring-surface-border shadow-2xl transition-colors duration-500">
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Muscular person performing a deep squat"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgGRg282TyRBnpUsmFna1slvR0lOaTJEE8pB-HMB5ziDigxCsqCeBR7j21Ib4H9cHEN547IkO4EaP6xOqp3lPQgj9rHqffAXLMi4ca8IeQCnfYtqUpba6e8xyqjOnQDniE_U3KkynDJ2kKDiqG_KtCsONiqW27s4b6kGfIcWLhKnMJnLT0oAl9nfwlFi6OPYeYYhPfURJBFRKyg355LVHgUmH7uwKmDmr8pS9iaYPI1YCCLJQaO8St8YYquX_eTP5LBv8Cu8NMOQU"
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
                <line
                  className="stroke-primary/40 stroke-2"
                  x1="0"
                  x2="1000"
                  y1="0"
                  y2="0"
                >
                  <animate
                    attributeName="y1"
                    dur="3s"
                    from="0"
                    repeatCount="indefinite"
                    to="500"
                  />
                  <animate
                    attributeName="y2"
                    dur="3s"
                    from="0"
                    repeatCount="indefinite"
                    to="500"
                  />
                </line>
              </svg>
            </div>

            <div className="absolute top-4 left-4 bg-background/60 backdrop-blur-md px-3 py-1 rounded flex items-center gap-2 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                AI Live Analysis
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 bg-surface p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-surface-border transition-colors duration-500">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <h3 className="text-foreground/40 uppercase text-xs font-bold tracking-[0.2em] mb-4">
              Form Score
            </h3>
            <div className="relative">
              <svg className="w-48 h-48 -rotate-90">
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

          <div className="md:col-span-8 bg-surface p-8 rounded-xl ring-1 ring-surface-border flex flex-col transition-colors duration-500">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-foreground tracking-tight font-display uppercase italic">
                  ANALYSIS FEEDBACK
                </h2>
                <p className="text-foreground/40 text-sm mt-1 uppercase font-bold tracking-tight">
                  3 critical points identified during the Squat session.
                </p>
              </div>
              <AlertCircle size={40} className="text-tertiary" />
            </div>
            <div className="space-y-4 flex-grow">
              {corrections.map((correction) => (
                <div
                  key={correction.id}
                  className="flex items-center gap-6 p-4 bg-background border border-surface-border rounded-lg hover:bg-surface-hover transition-colors cursor-default"
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center ${correction.iconBg} rounded border ${correction.iconBorder}`}
                  >
                    <span className={`text-xl ${correction.iconColor}`}>
                      {correction.icon}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-black text-foreground uppercase leading-none font-display tracking-tight">
                      {correction.title}
                    </h4>
                    <p className="text-foreground/40 text-xs mt-1 font-medium">
                      {correction.description}
                    </p>
                  </div>
                  <div
                    className={`${correction.numberColor} font-black text-2xl opacity-20 font-display`}
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

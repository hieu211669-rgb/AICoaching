'use client';

import { useState } from 'react';
import { ArrowLeft, Share2, Play, AlertCircle, Zap } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function ExerciseDetail() {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);

  const exerciseSteps = [
    {
      number: '01',
      title: 'Vị trí bắt đầu',
      description:
        'Đứng dưới thanh đòn, đặt thanh đòn lên phần cơ cầu vai. Nắm chặt thanh đòn, cùi chỏ hướng xuống. Nhấc tạ ra khỏi giá đỡ và bước lùi 2 bước nhỏ.',
    },
    {
      number: '02',
      title: 'Hạ người (Eccentric)',
      description:
        'Hít sâu, gồng core. Đẩy hông ra sau và hạ người xuống như đang ngồi vào ghế. Giữ lưng thẳng, ngực mở rộng cho đến khi đùi song song với mặt sàn.',
    },
    {
      number: '03',
      title: 'Đẩy lên (Concentric)',
      description:
        'Dồn lực vào gót chân, đạp mạnh xuống sàn để đẩy người đứng dậy về vị trí ban đầu. Thở ra khi hoàn thành chuyển động.',
    },
  ];

  const technicalTips = [
    'Không để đầu gối chụm vào nhau khi đẩy lên.',
    'Luôn giữ cột sống ở vị trí trung tính, không cong lưng.',
    'Mắt nhìn thẳng về phía trước hoặc hơi hướng lên.',
  ];

  const equipment = [
    { name: 'Olympic Barbell', icon: '💪' },
    { name: 'Power Rack', icon: '🏗️' },
    { name: 'Weight Plates', icon: '⭕' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 transition-colors duration-500">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 border-b border-surface-border">
        <div className="flex items-center gap-4">
          <button className="active:scale-95 duration-200 text-primary">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-primary tracking-tighter uppercase font-display">
            VOLT KINETIC
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-foreground/60 hover:text-primary transition-colors">
            <Share2 size={24} />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-surface-border">
            <img
              className="w-full h-full object-cover"
              alt="Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm1AIvXaWd30yrGDjin6_eAsK98z2tXN8NW4sdFaHy-qs8iFY04-G2WlkuWOGLtLoF_3VufvHmrqZ1WVe-QS8DuO3VQmVyiM2W7Jn0-hzJJJL9rwMSu-nTKsWNzzPNMH8gu5_B8cYEjgweN76aVoZOPZOvAR1_r_42frZI5wLEIWzqIQf63Vw_Yro5_mQatLlGjnWym8AEyoFJrWUxulvYqRumMXgguUKFPEgHdJ3m98WpVZ99PLlaZZp3H8J_cILbbbEGVlz02wBI"
            />
          </div>
        </div>
      </header>

      <main className="pt-16 pb-24 max-w-4xl mx-auto">
        {/* Exercise Hero Section */}
        <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-b-xl border-b border-surface-border">
          <img
            className="w-full h-full object-cover grayscale opacity-80"
            alt="Barbell Back Squat"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5hUwKXMC2cnHYNVQ5zKxXZsadiW1P_0pYVvx4Wah22IENhRU-TV7yWnWR3YlBWyJGKiuSSYc0w291Lm4mTakuOPvDMPFEGYPWRl1qWuaLRhfskLPLXgcKe-iaZw3GUjjuhyCG2x1zKylslPfPuM9kKh689Pg-hjidBOPTjnRpJSzs-IkbebCgU0kEgVMRXuxuIGuWo3fL-QyNrBfbWyuBc_doTJgPTr9ceoMHhO82wpm7YwARgULEs3zFph0Uga_qhWdRlOL0S-_2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 hover:bg-primary/30 active:scale-90 transition-all"
            >
              <Play size={48} className="text-primary fill-primary" />
            </button>
          </div>

          {/* Intensity Badge */}
          <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded border border-surface-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">High Intensity</span>
          </div>
        </div>

        <div className="px-6 -mt-8 relative z-10">
          {/* Header Content */}
          <div className="mb-10">
            <h2 className="text-5xl font-black text-foreground leading-none mb-2 uppercase italic tracking-tighter font-display">
              Barbell <span className="text-primary">Back Squat</span>
            </h2>
            <p className="text-foreground/60 text-lg max-w-2xl leading-relaxed">
              Bài tập cơ bản tốt nhất để xây dựng sức mạnh thân dưới và phát triển cơ đùi trước, cơ mông và cơ lưng dưới.
            </p>
            <button className="mt-6 flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full hover:bg-primary/20 transition-all active:scale-95">
              <Zap size={20} className="text-primary" />
              <span className="text-primary font-black uppercase tracking-wider text-sm italic">Phân tích Form của tôi</span>
            </button>
          </div>

          {/* Bento Grid Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-surface p-4 border-l-2 border-primary rounded-r-md">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 font-bold">Cơ chính</p>
              <p className="font-black text-lg">Cơ đùi trước</p>
            </div>
            <div className="bg-surface p-4 border-l-2 border-surface-border rounded-r-md">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 font-bold">Độ khó</p>
              <p className="font-black text-lg">Nâng cao</p>
            </div>
            <div className="bg-surface p-4 border-l-2 border-surface-border rounded-r-md">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 font-bold">Loại</p>
              <p className="font-black text-lg">Sức mạnh</p>
            </div>
            <div className="bg-surface p-4 border-l-2 border-surface-border rounded-r-md">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 font-bold">Thiết bị</p>
              <p className="font-black text-lg">Tạ đòn</p>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-12 pb-12">
            {/* Steps Section */}
            <div className="flex-grow">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight font-display text-foreground">
                <span className="w-8 h-[2px] bg-primary"></span>
                CÁC BƯỚC THỰC HIỆN
              </h3>
              <div className="space-y-12">
                {exerciseSteps.map((step) => (
                  <div key={step.number} className="relative pl-12 group">
                    <span className="absolute left-0 top-0 text-5xl font-black text-foreground/5 group-hover:text-primary transition-colors duration-500 italic">
                      {step.number}
                    </span>
                    <div>
                      <h4 className="text-xl font-black mb-2 uppercase tracking-tight text-foreground">
                        {step.title}
                      </h4>
                      <p className="text-foreground/60 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="w-full lg:w-80 space-y-8">
              {/* Technical Tips */}
              <section className="bg-surface p-6 border-t-2 border-tertiary rounded-b-md">
                <div className="flex items-center gap-2 mb-4 text-tertiary">
                  <AlertCircle size={20} />
                  <h3 className="font-black text-sm uppercase tracking-wider">LƯU Ý KỸ THUẬT</h3>
                </div>
                <ul className="space-y-4">
                  {technicalTips.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 text-sm leading-relaxed text-foreground/60">
                      <span className="text-tertiary font-black">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Equipment List */}
              <section className="p-6 bg-surface rounded-md">
                <h3 className="font-black text-sm uppercase tracking-wider mb-6 text-primary">
                  THIẾT BỊ CẦN THIẾT
                </h3>
                <div className="space-y-3">
                  {equipment.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-background rounded border border-surface-border"
                    >
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-lg">{item.icon}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 bg-background/80 backdrop-blur-xl border-t border-surface-border z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">Kỷ lục cá nhân</p>
            <p className="font-black text-xl font-display text-foreground">
              120 KG <span className="text-xs text-primary/60 font-normal">X 5 REPS</span>
            </p>
          </div>
          <button className="flex-grow md:flex-none md:w-64 py-4 bg-primary text-black font-black uppercase tracking-widest text-sm rounded-md active:scale-[0.98] transition-all hover:opacity-90 shadow-lg shadow-primary/10">
            BẮT ĐẦU LUYỆN TẬP
          </button>
          <button className="p-4 bg-surface text-foreground rounded-md active:scale-95 transition-transform border border-surface-border">
            ➕
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Play, Timer, Bolt, School, ChevronDown, PlayCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function WorkoutDetail() {
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  
  useEffect(() => {
    const title = searchParams.get('title');
    const videoSrc = searchParams.get('videoSrc');
    const thumbnail = searchParams.get('thumbnail');
    
    if (title && videoSrc && thumbnail) {
      setVideoData({ title, videoSrc, thumbnail });
    }
  }, [searchParams]);

  const relatedWorkouts = [
    {
      id: 1,
      title: 'EXPLOSIVE POWER CLEANS',
      category: 'Conditioning',
      duration: '18 MIN',
      intensity: 'INTENSE',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-d18TH05tzfoeci-pz2thImd7sMHm1dBTYVwJu6TdXeaC6Kffh__wGfX2wi3oiH18q-Pi6NJY51yfPbOp9p_QR17cxsj1wK_KvSbxb9QSFSrffA4JOLbvi6p6jc-PfniqBvWyyclorVyDicitI5Q0YI53Tl-_WnKwfMSYB5oWNIju5TQSEZZth535GHC6Y3egN5s-keFjNKU77aXSP_v3lUuQro9qbf62YL3g9IWdU8kfvfuqNICAJ_9-3e3EhVTLPr1PruZ4Sp82',
      color: 'text-tertiary'
    },
    {
      id: 2,
      title: 'ISO-LATERAL SHOULDER PRESS',
      category: 'Strength',
      duration: '32 MIN',
      intensity: 'MODERATE',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2iTzOKjECTPYCrqJhxsMy0MuNwIvRy0OZ0kwD4vqXNGb4zgDq2uLmVAwvF3fxr-BPvtXfsRJDeNbHkQ8K1IgyhZs2Ofw9yNp-NRfcgPjwb1Qo4vcZym3KBHPt0UTk-T6Xh_GEGfDnLWTA5kYpzEP6m2pImmRUuOZHWpf1XHz-UpX3dEDkXEwH5C8xpJKBtXvZc1RzoA-9GGTwJKPcrPjZ1HLmOibdi2zCrPXkpxcvBtfNdd28mpavl-7fJrxHABZHmj6NMajgi5I1',
      color: 'text-primary'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-surface-border flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <button className="text-primary active:scale-95 duration-200 hover:bg-surface p-2 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-display font-bold text-primary tracking-tighter text-xl uppercase">
            VOLT KINETIC
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwz4l7SW63mGkRooml2bpsa_kAudobh4BpRf-wIHi9_qz73Sv_dpZxvCG1GBjB7BZX6E1shFgyROu7EaUtcdh50E_waTPy49-0Itc9CBnUHk_o7PF-x8_tRYVM85YJbEmk4lMXquaMUEenFgcq_r1Kdw2loJ9jiVLD-VU2Wz8TfZrDkf2zk9cyYgGu2DYUY7kgYKPCkDTOziVuV1dQ4EcGydor-XpHzJQxVZBtjGVJl8uK8IQKg5SNBdiEdJYJs2xAv7vQ4tnarsVG"
          />
        </div>
      </header>

      <main className="pt-16">
        {/* Video Player Section */}
        <section className="relative w-full aspect-video bg-black overflow-hidden group">
          {videoData ? (
            <video
              src={videoData.videoSrc}
              poster={videoData.thumbnail}
              className="w-full h-full object-cover"
              controls={isPlaying}
              autoPlay={isPlaying}
            />
          ) : (
            <img
              alt="Workout Preview"
              className="w-full h-full object-cover opacity-80 grayscale"
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200"
            />
          )}
          
          {!isPlaying && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 rounded-xl bg-primary text-black flex items-center justify-center active:scale-90 transition-all shadow-2xl shadow-primary/30"
                >
                  <Play size={40} className="fill-black" />
                </button>
              </div>
            </>
          )}
        </section>

        {/* Content */}
        <div className="px-6 mt-8 space-y-10">
          <div>
            <span className="text-primary font-display text-[10px] font-bold tracking-widest uppercase">
              Kinetic Training Module
            </span>
            <h2 className="text-4xl font-display font-bold text-foreground tracking-tighter leading-none uppercase italic mt-1">
              {videoData?.title || 'System Loading...'}
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface p-4 rounded-lg flex flex-col items-center justify-center text-center border border-surface-border">
              <Timer className="text-primary mb-2" size={20} />
              <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Time</span>
              <span className="text-lg font-display font-bold text-foreground uppercase">Ready</span>
            </div>
            <div className="bg-surface p-4 rounded-lg flex flex-col items-center justify-center text-center border border-surface-border">
              <Bolt className="text-tertiary mb-2" size={20} />
              <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Power</span>
              <span className="text-lg font-display font-bold text-foreground uppercase">High</span>
            </div>
            <div className="bg-surface p-4 rounded-lg flex flex-col items-center justify-center text-center border border-surface-border">
              <School className="text-primary mb-2" size={20} />
              <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Focus</span>
              <span className="text-lg font-display font-bold text-foreground uppercase">AI</span>
            </div>
          </div>

          {/* Collapsible About */}
          <div className="border-b border-surface-border pb-8">
            <div className="flex justify-between items-center group cursor-pointer">
              <h3 className="text-xl font-display font-bold text-foreground uppercase tracking-tight italic">Technical Analysis</h3>
              <ChevronDown className="text-primary group-hover:translate-y-1 transition-transform" />
            </div>
            <p className="mt-4 text-foreground/60 leading-relaxed text-sm">
              Watch this technical breakdown to master biomechanical efficiency. Our AI vision system tracks skeletal alignment in real-time for optimal force production.
            </p>
          </div>

          {/* Related */}
          <div>
            <h3 className="text-xl font-display font-bold text-foreground mb-6 uppercase tracking-tighter italic">Recommended Sessions</h3>
            <div className="flex flex-col gap-6">
              {relatedWorkouts.map((workout) => (
                <div key={workout.id} className="flex gap-4 items-center group cursor-pointer bg-surface p-3 rounded-lg border border-surface-border hover:border-primary/20 transition-all">
                  <div className="relative w-32 h-20 rounded-md overflow-hidden shrink-0">
                    <img
                      alt={workout.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      src={workout.thumbnail}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${workout.color}`}>
                      {workout.category}
                    </span>
                    <h4 className="text-base font-display font-bold text-foreground leading-tight uppercase">
                      {workout.title}
                    </h4>
                    <span className="text-[10px] text-foreground/40 mt-1 font-bold uppercase">
                      {workout.duration} • {workout.intensity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

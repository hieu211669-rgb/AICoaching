'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Play, Timer, Bolt, School, ChevronDown, PlayCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import TopAppBar from '@/components/TopAppBar';

type VideoData = {
  title: string;
  videoSrc: string;
  thumbnail: string;
  focus: string;
  focus_muscle_ids: string[];
};

type RelatedWorkout = {
  id: string;
  title: string;
  category: string;
  duration: string;
  intensity: string;
  thumbnail: string;
  color: string;
  focus: string;
  focus_muscle_ids: string[];
  videoSrc: string;
};

type MuscleGroup = {
  id: string;
  name: string;
};

function WorkoutDetailContent() {
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [relatedWorkouts, setRelatedWorkouts] = useState<RelatedWorkout[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  
  useEffect(() => {
    const title = searchParams.get('title');
    const videoSrc = searchParams.get('videoSrc');
    const thumbnail = searchParams.get('thumbnail');
    const focus = searchParams.get('focus') || '';
    const focusMuscleIdsStr = searchParams.get('focus_muscle_ids');
    
    let focusMuscleIds: string[] = [];
    if (focusMuscleIdsStr) {
      try {
        focusMuscleIds = JSON.parse(focusMuscleIdsStr);
      } catch (e) {
        console.error('Failed to parse focus_muscle_ids:', e);
      }
    }
    
    if (title && videoSrc && thumbnail) {
      setVideoData({ title, videoSrc, thumbnail, focus, focus_muscle_ids: focusMuscleIds });
      fetchData(focusMuscleIds, title);
    }
  }, [searchParams]);

  const fetchData = async (currentMuscleIds: string[], currentTitle: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Fetch both videos and muscle groups in parallel
      const [videoRes, muscleRes] = await Promise.all([
        fetch(`${apiUrl}/api/videos`),
        fetch(`${apiUrl}/api/muscle-groups`)
      ]);

      if (muscleRes.ok) {
        const muscleData = await muscleRes.json();
        setMuscleGroups(muscleData);
      }

      if (videoRes.ok) {
        const data = await videoRes.json();
        const filtered = data
          .filter((v: any) => {
            if (v.title === currentTitle) return false;
            
            // Check if there's any intersection between focus_muscle_ids
            const vMuscleIds = v.focus_muscle_ids || [];
            return currentMuscleIds.some(id => vMuscleIds.includes(id));
          })
          .map((v: any) => ({
            id: v.id || v.title,
            title: v.title,
            category: v.intensity || 'Featured',
            duration: v.duration || 'HD',
            intensity: v.intensity || 'Medium',
            thumbnail: v.thumbnail || v.thumbnail_url,
            color: v.intensity === 'High' ? 'text-tertiary' : 'text-primary',
            focus: v.focus,
            focus_muscle_ids: v.focus_muscle_ids || [],
            videoSrc: v.url || v.video_url
          }));
        setRelatedWorkouts(filtered);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getMuscleNames = (ids: string[]) => {
    if (!ids || ids.length === 0) return '';
    return ids
      .map(id => muscleGroups.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-28">
      <TopAppBar />

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
        <div className="mx-auto mt-8 max-w-5xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div>
            <span className="text-primary font-display text-[10px] font-bold tracking-widest uppercase">
              Kinetic Training Module • {getMuscleNames(videoData?.focus_muscle_ids || []) || videoData?.focus}
            </span>
            <h2 className="font-display mt-1 text-3xl font-bold uppercase italic leading-none tracking-tighter text-foreground sm:text-4xl">
              {videoData?.title || 'System Loading...'}
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="bg-surface p-4 rounded-lg flex flex-col items-center justify-center text-center border border-surface-border">
              <span className="material-symbols-outlined text-primary mb-2">timer</span>
              <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Time</span>
              <span className="text-lg font-display font-bold text-foreground uppercase">Ready</span>
            </div>
            <div className="bg-surface p-4 rounded-lg flex flex-col items-center justify-center text-center border border-surface-border">
              <Bolt className="text-tertiary mb-2" size={20} />
              <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Power</span>
              <span className="text-lg font-display font-bold text-foreground uppercase">High</span>
            </div>
            <div className="bg-surface p-4 rounded-lg flex flex-col items-center justify-center text-center border border-surface-border">
              <span className="material-symbols-outlined text-primary mb-2">school</span>
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
            <h3 className="text-xl font-display font-bold text-foreground mb-6 uppercase tracking-tighter italic">
              Recommended Sessions
            </h3>
            <div className="flex flex-col gap-6">
              {relatedWorkouts.length > 0 ? relatedWorkouts.map((workout) => (
                <a 
                  key={workout.id} 
                  href={`/train?title=${encodeURIComponent(workout.title)}&videoSrc=${encodeURIComponent(workout.videoSrc)}&thumbnail=${encodeURIComponent(workout.thumbnail)}&focus=${encodeURIComponent(workout.focus)}&focus_muscle_ids=${encodeURIComponent(JSON.stringify(workout.focus_muscle_ids))}`}
                  className="group flex cursor-pointer flex-col gap-4 rounded-lg border border-surface-border bg-surface p-3 transition-all hover:border-primary/20 sm:flex-row sm:items-center"
                >
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-32">
                    <img
                      alt={workout.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      src={workout.thumbnail}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${workout.color}`}>
                      {getMuscleNames(workout.focus_muscle_ids) || workout.category}
                    </span>
                    <h4 className="text-base font-display font-bold text-foreground leading-tight uppercase">
                      {workout.title}
                    </h4>
                    <span className="text-[10px] text-foreground/40 mt-1 font-bold uppercase">
                      {workout.duration} • {workout.intensity}
                    </span>
                  </div>
                </a>
              )) : (
                <p className="text-foreground/40 text-sm italic">No other videos with common focus found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WorkoutDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-primary flex items-center justify-center font-display uppercase tracking-widest">Loading...</div>}>
      <WorkoutDetailContent />
    </Suspense>
  );
}

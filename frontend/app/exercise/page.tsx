'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Share2, Play, AlertCircle, Zap, Loader2 } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import TopAppBar from '@/components/TopAppBar';

type ApiExercise = {
  id: string;
  title: string;
  exerciseType: string;
  equipments: string[];
  primary_muscles: string[];
  calories_burn: string;
  set_reps: string;
  difficulty: string;
  referenceVisual: string;
  biomechanicalFocus: string;
  stabillityRequirement: string;
  rangeOfMotion: string;
  timeStamp: string;
  views: number;
};

function ExerciseDetailContent() {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [exercise, setExercise] = useState<ApiExercise | null>(null);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [exerciseSteps, setExerciseSteps] = useState<any[]>([]);
  const [muscleNames, setMuscleNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('id');

  useEffect(() => {
    if (!exerciseId) {
      setError("No exercise selected.");
      setIsLoading(false);
      return;
    }

    const fetchExercise = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/exercises/${exerciseId}`);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || `Server returned ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setExercise(data);

        // Fetch muscle names from primary_muscles IDs
        if (data.primary_muscles && data.primary_muscles.length > 0) {
          const muscleRes = await fetch(`${apiUrl}/api/muscles/names`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: data.primary_muscles })
          });
          if (muscleRes.ok) {
            setMuscleNames(await muscleRes.json());
          }
        }

        // Fetch equipment from exercise_equipment collection
        const eqRes = await fetch(`${apiUrl}/api/exercises/${exerciseId}/equipment`);
        if (eqRes.ok) {
          setEquipmentList(await eqRes.json());
        }

        // Fetch exercise steps
        const stepsRes = await fetch(`${apiUrl}/api/exercises/${exerciseId}/steps`);
        if (stepsRes.ok) {
          setExerciseSteps(await stepsRes.json());
        }
      } catch (err) {
        console.error("Error fetching exercise:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred while loading the exercise.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  // Placeholders for content not yet in the DB
  const technicalTips = [
    'Luôn giữ cột sống ở vị trí trung tính.',
    'Hít thở đúng nhịp độ: Hít vào khi giãn cơ, thở ra khi phát lực.',
    'Tập trung vào sự kết nối giữa tâm trí và cơ bắp (Mind-Muscle Connection).',
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="font-display text-primary uppercase tracking-widest">System Loading...</p>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-error mb-4" size={64} />
        <h2 className="text-2xl font-black uppercase mb-2">Error Detected</h2>
        <p className="text-zinc-500 mb-8">{error || "Exercise not found."}</p>
        <button 
          onClick={() => router.push('/library')}
          className="bg-primary text-black px-8 py-3 rounded-lg font-black uppercase tracking-widest transition-transform active:scale-95"
        >
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 transition-colors duration-500">
      <TopAppBar showBack={true} title={exercise.title} />

      <main className="mx-auto max-w-4xl pb-24 pt-16">
        {/* Exercise Hero Section */}
        <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-b-xl border-b border-surface-border">
          <img
            className="w-full h-full object-cover grayscale opacity-80"
            alt={exercise.title}
            src={exercise.referenceVisual}
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{exercise.difficulty}</span>
          </div>
        </div>

        <div className="relative z-10 -mt-8 px-4 sm:px-6">
          {/* Header Content */}
          <div className="mb-10 flex justify-between items-start">
            <div>
              <h2 className="font-display mb-2 text-4xl font-black uppercase italic leading-none tracking-tighter text-foreground sm:text-5xl">
                {exercise.title}
              </h2>
              <p className="text-foreground/60 text-lg max-w-2xl leading-relaxed">
                {exercise.biomechanicalFocus}
              </p>
            </div>
            <button className="text-foreground/60 hover:text-primary transition-colors">
              <Share2 size={24} />
            </button>
          </div>
          
          <button 
            onClick={() => router.push(`/AIRating?id=${exercise.id}`)}
            className="mb-10 flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full hover:bg-primary/20 transition-all active:scale-95"
          >
            <Zap size={20} className="text-primary" />
            <span className="text-primary font-black uppercase tracking-wider text-sm italic">Phân tích Form của tôi</span>
          </button>

          {/* Bento Grid Stats */}
          <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
            <button 
              onClick={() => router.push(`/library?group=${Array.isArray(exercise.primary_muscles) ? exercise.primary_muscles[0] : exercise.primary_muscles || ''}`)}
              className="bg-surface p-4 border-l-2 border-primary rounded-r-md text-left hover:bg-surface-container transition-all active:scale-95"
            >
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 font-bold">Cơ chính</p>
              <p className="font-black text-lg truncate">{muscleNames.length > 0 ? muscleNames.join(', ') : 'N/A'}</p>
            </button>
            <div className="bg-surface p-4 border-l-2 border-surface-border rounded-r-md">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 font-bold">Độ khó</p>
              <p className="font-black text-lg">{exercise.difficulty || 'N/A'}</p>
            </div>
            <div className="bg-surface p-4 border-l-2 border-surface-border rounded-r-md">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 font-bold">Lượng Calo</p>
              <p className="font-black text-lg">~{exercise.calories_burn}</p>
            </div>
            <div className="bg-surface p-4 border-l-2 border-surface-border rounded-r-md">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 font-bold">Thiết bị</p>
              <p className="font-black text-lg">{equipmentList.length}</p>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col gap-10 pb-12 lg:flex-row lg:gap-12">
            {/* Steps Section */}
            <div className="flex-grow">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight font-display text-foreground">
                <span className="w-8 h-[2px] bg-primary"></span>
                KỸ THUẬT CHI TIẾT
              </h3>
              <div className="space-y-12">
                {exerciseSteps.map((step) => (
                  <div key={step.number} className="group relative pl-10 sm:pl-12">
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
                  {equipmentList.map((eq, idx) => (
                    <div
                      key={eq.id || idx}
                      className="flex items-center justify-between p-3 bg-background rounded border border-surface-border"
                    >
                      <span className="text-sm font-medium text-foreground">{eq.name}</span>
                      {eq.icon_url ? <img src={eq.icon_url} alt={eq.name} className="w-6 h-6" /> : <span className="text-lg">⚙️</span>}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ExerciseDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center font-display uppercase tracking-widest text-primary">Loading...</div>}>
      <ExerciseDetailContent />
    </Suspense>
  );
}

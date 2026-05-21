'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import TopAppBar from '@/components/TopAppBar';

type MuscleGroup = {
  id: string;
  name: string;
  image: string;
  exercise_count?: number;
  featured?: boolean;
};

type Exercise = {
  id: string;
  title: string;
  thumbnail_url: string;
  duration: string;
  quality: string;
  primary_muscles: string[];
  views: number;
};

export default function ExercisesLibrary() {
  const { settings } = useSettings();
  const [selectedLevel, setSelectedLevel] = useState('Người mới');
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllGroups, setShowAllGroups] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const [muscleRes, exerciseRes] = await Promise.all([
          fetch(`${apiUrl}/api/muscle-groups`),
          fetch(`${apiUrl}/api/exercises`)
        ]);

        if (muscleRes.ok) {
          const muscleData = await muscleRes.json();
          if (muscleData.length > 0 && !muscleData.some((g: MuscleGroup) => g.featured)) {
            muscleData[0].featured = true;
          }
          setMuscleGroups(muscleData);
        }

        if (exerciseRes.ok) {
          const rawData = await exerciseRes.json();
          // Map backend fields to frontend Exercise type
          const mappedData = rawData.map((ex: any) => ({
            id: ex.id,
            title: ex.exerciseName,
            thumbnail_url: ex.referenceVisual,
            duration: ex.set_reps, // Using set_reps as a placeholder for duration info
            quality: ex.skillLevel,
            primary_muscles: ex.primary_muscles || [], // handle both names
            views: ex.views || 0,
          }));
          setExercises(mappedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const visibleMuscleGroups = showAllGroups ? muscleGroups : muscleGroups.slice(0, 5);
  
  // Helper to get muscle names from IDs
  const getMuscleNames = (ids: string[]) => {
    if (!ids || ids.length === 0) return 'Toàn thân';
    return ids
      .map(id => muscleGroups.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(' / ') || 'Đang tải...';
  };

  // Sort exercises by views (descending) and take top 4
  const displayedExercises = [...exercises]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 transition-colors duration-500">
      <TopAppBar />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        {/* Search */}
        <section className="mb-10">
          <div className="relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
            <input
              type="text"
              placeholder="Tìm kiếm bài tập..."
              className="w-full bg-surface border-b-2 border-surface-border focus:border-primary py-4 pl-12 pr-4 text-lg outline-none transition-all placeholder:text-gray-600 font-display"
            />
          </div>

          {/* Level Filters */}
          <div className="flex flex-wrap gap-3">
            {['Người mới', 'Trung cấp', 'Nâng cao'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-5 py-2 font-bold text-[10px] uppercase tracking-widest rounded-md active:scale-95 transition-all border ${
                  selectedLevel === level
                    ? 'bg-primary text-black border-primary'
                    : 'bg-surface text-gray-400 border-transparent hover:text-primary hover:border-primary/30'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        {/* Muscle Groups Grid */}
        <section className="mb-12">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-display text-2xl font-black uppercase italic sm:text-3xl">Nhóm cơ chính</h2>
            <div className="flex items-center gap-4">
              {muscleGroups.length > 5 && (
                <button 
                  onClick={() => setShowAllGroups(!showAllGroups)}
                  className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all"
                >
                  {showAllGroups ? 'Thu gọn' : 'Xem tất cả'}
                  <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${showAllGroups ? 'rotate-180' : ''}`}>
                    expand_circle_down
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="grid auto-rows-[180px] grid-cols-12 gap-3 sm:auto-rows-[220px] sm:gap-4">
            {visibleMuscleGroups.map((group, idx) => (
              <div
                key={group.id}
                onClick={() => router.push(`/library?group=${group.name}`)}
                className={`relative overflow-hidden rounded-lg group cursor-pointer border border-surface-border active:scale-[0.98] transition-all ${
                  group.featured ? 'col-span-12 md:col-span-8' : 'col-span-6 md:col-span-4'
                }`}
              >
                <img
                  src={group.image}
                  alt={group.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className={`font-display font-black uppercase leading-none text-foreground ${group.featured ? 'text-3xl sm:text-5xl' : 'text-xl sm:text-2xl'}`}>
                    {group.name}
                  </h3>
                  <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-2">
                    {group.exercise_count || 0} bài tập
                  </p>
                </div>
              </div>
            ))}
            {!isLoading && muscleGroups.length === 0 && (
              <p className="col-span-12 text-center text-gray-500 italic mt-8">Chưa có dữ liệu nhóm cơ.</p>
            )}
          </div>
        </section>

        {/* Featured Exercises */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-xl font-black uppercase italic sm:text-2xl">Bài tập phổ biến</h2>
            <button className="text-primary text-[10px] font-bold uppercase tracking-widest border-b border-primary/30 hover:border-primary transition-all">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {displayedExercises.length > 0 ? displayedExercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => router.push(`/exercise?id=${exercise.id}`)}
                className="group flex cursor-pointer flex-col gap-4 rounded-lg border border-surface-border bg-surface p-4 transition-all hover:border-primary/20 hover:bg-surface-hover sm:flex-row sm:items-center"
              >
                <div className="h-40 w-full flex-shrink-0 overflow-hidden rounded-md bg-background sm:h-16 sm:w-16">
                  <img
                    src={exercise.thumbnail_url}
                    alt={exercise.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                <div className="min-w-0 flex-grow sm:ml-2">
                  <h4 className="text-lg font-bold leading-tight uppercase group-hover:text-primary transition-colors font-display">
                    {exercise.title}
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                      {getMuscleNames(exercise.primary_muscles)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-tertiary">
                      {exercise.duration} • {exercise.quality}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-primary/70">
                      {exercise.views || 0} lượt xem
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-600 group-hover:text-primary transition-colors">arrow_forward</span>
              </div>
            )) : (
              <p className="text-gray-500 italic text-center py-10">Chưa có bài tập nào được tìm thấy.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

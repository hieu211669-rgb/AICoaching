'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TopAppBar from '@/components/TopAppBar';

type ApiExercise = {
  id?: string;
  title?: string;
  exerciseName?: string;
  exerciseType?: string;
  targetMuscle?: string[] | string;
  primary_muscles?: string[] | string;
  set_reps?: string;
  skillLevel?: string;
  referenceVisual?: string;
  thumbnail_url?: string;
  biomechanicalFocus?: string;
  views?: number;
};

type MuscleGroup = {
  id: string;
  name: string;
};

type ExerciseCard = {
  id: string;
  title: string;
  level: string;
  levelClassName: string;
  group: string;
  muscles: string[];
  duration: string;
  intensity: string;
  image: string;
  alt: string;
};

const fallbackImage =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop';

const normalizeMuscles = (value: ApiExercise['targetMuscle']) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
};

const getLevelClassName = (level: string) => {
  return level.toLowerCase() === 'beginner' ? 'text-tertiary' : 'text-primary';
};

const mapExercise = (exercise: ApiExercise, index: number): ExerciseCard => {
  const muscles = normalizeMuscles(exercise.targetMuscle ?? exercise.primary_muscles);
  const level = exercise.skillLevel || 'Training';
  const title = exercise.title || exercise.exerciseName || `Exercise ${index + 1}`;

  return {
    id: exercise.id || title,
    title,
    level,
    levelClassName: getLevelClassName(level),
    group: muscles[0] || exercise.exerciseType || 'General',
    muscles,
    duration: exercise.set_reps || 'Ready',
    intensity: exercise.biomechanicalFocus || exercise.exerciseType || 'Kinetic Focus',
    image: exercise.thumbnail_url || exercise.referenceVisual || fallbackImage,
    alt: `Visual for ${title}`,
  };
};

function LibraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [exercises, setExercises] = useState<ExerciseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const [exerciseResponse, muscleResponse] = await Promise.all([
          fetch(`${apiUrl}/api/exercises`),
          fetch(`${apiUrl}/api/muscle-groups`),
        ]);

        if (!exerciseResponse.ok) {
          throw new Error(`Exercises API error: ${exerciseResponse.status}`);
        }

        if (!muscleResponse.ok) {
          throw new Error(`Muscle groups API error: ${muscleResponse.status}`);
        }

        const [exerciseData, muscleData] = await Promise.all([
          exerciseResponse.json() as Promise<ApiExercise[]>,
          muscleResponse.json() as Promise<MuscleGroup[]>,
        ]);

        setExercises(exerciseData.map(mapExercise));
        setMuscleGroups(muscleData.filter(group => group.name));
      } catch (err) {
        console.error('Failed to fetch library data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load library data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  useEffect(() => {
    const group = searchParams.get('group');
    if (group) {
      // If it's in our predefined list, use it as is, otherwise add it if needed or just set it
      setActiveFilter(group);
    } else {
      setActiveFilter('All');
    }
  }, [searchParams]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      router.push('/library');
    } else {
      router.push(`/library?group=${filter}`);
    }
  };

  const selectedMuscleGroup = muscleGroups.find(group => group.name.toLowerCase() === activeFilter.toLowerCase());

  const filteredExercises = activeFilter === 'All'
    ? exercises
    : exercises.filter(ex =>
        ex.muscles.some(muscle => muscle.toLowerCase() === activeFilter.toLowerCase()) ||
        (selectedMuscleGroup && ex.muscles.some(muscle => muscle === selectedMuscleGroup.id)) ||
        ex.group.toLowerCase() === activeFilter.toLowerCase()
      );

  const muscleFilters = ['All', ...muscleGroups.map(group => group.name)];
  const displayedFilters = muscleFilters.includes(activeFilter)
    ? muscleFilters
    : (activeFilter === 'All' ? muscleFilters : [...muscleFilters, activeFilter]);

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary selection:text-on-primary">
      <TopAppBar title="KINETIC" />

      <main className="mx-auto max-w-md px-4 pb-28 pt-20 md:max-w-4xl lg:max-w-5xl">
        <section className="mb-8 overflow-hidden">
          <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-4">
            {displayedFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterClick(filter)}
                className={`flex-shrink-0 rounded-md px-5 py-2 font-label text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeFilter === filter
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-highest text-on-surface-variant hover:text-primary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="relative mb-8">
          <div className="pointer-events-none absolute -left-4 -top-6 select-none opacity-10">
            <h2 className="font-display text-8xl font-extrabold tracking-tighter text-outline">
              WORK
            </h2>
          </div>
          <div className="relative z-10">
            <p className="mb-1 font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Recommended
            </p>
            <h2 className="font-headline text-4xl font-bold uppercase leading-none tracking-tight">
              {activeFilter === 'All' ? 'Precision' : activeFilter}
              <br />
              Training
            </h2>
          </div>
        </section>

        {isLoading ? (
          <div className="rounded-md bg-surface-container-low p-8 text-center">
            <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Loading exercises...
            </span>
          </div>
        ) : error ? (
          <div className="rounded-md border border-error/30 bg-error-container/20 p-6 text-center">
            <p className="font-label text-sm font-bold uppercase tracking-wider text-error">
              {error}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredExercises.map((exercise) => (
            <article
              key={exercise.id}
              onClick={() => router.push(`/exercise?id=${exercise.id}`)}
              className="group relative cursor-pointer overflow-hidden rounded-md bg-surface-container-low transition-all duration-300 hover:bg-surface-container"
            >
              <div className="flex h-40">
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded-sm bg-surface-container-highest px-2 py-0.5 font-label text-[10px] font-black uppercase tracking-widest ${exercise.levelClassName}`}
                      >
                        {exercise.level}
                      </span>
                      <span className="font-label text-[10px] font-bold uppercase text-on-surface-variant">
                        {exercise.group}
                      </span>
                    </div>
                    <h3 className="font-headline text-xl font-bold leading-tight transition-colors group-hover:text-primary">
                      {exercise.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">timer</span>
                      <span className="font-label text-[10px] font-bold uppercase">
                        {exercise.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      <span className="font-label text-[10px] font-bold uppercase">
                        {exercise.intensity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative w-2/5 overflow-hidden [clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="h-full w-full scale-110 object-cover transition-transform duration-700 group-hover:scale-125"
                    alt={exercise.alt}
                    src={exercise.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-surface-container-low/80" />
                </div>
              </div>
            </article>
          ))}
            {filteredExercises.length === 0 && (
              <p className="col-span-full py-10 text-center text-on-surface-variant">
                No exercises found for this category.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LibraryContent />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Exercise = {
  id?: string;
  name: string;
  type: string;
  muscles: string;
  equipment: string;
  calories: string;
  setsReps: string;
  status: 'Ready' | 'Calibration Req.';
  level: string;
  image: string;
  imageAlt: string;
  views?: number;
};

type MuscleGroup = {
  id?: string | number;
  name: string;
};

const defaultMuscleFilters = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'];

function ExerciseCard({ exercise, onDelete }: { exercise: Exercise, onDelete: (id: string) => void }) {
  const requiresCalibration = exercise.status === 'Calibration Req.';

  return (
    <article className="group relative flex flex-col overflow-hidden border-l border-primary/20 bg-surface-container-low transition-colors hover:bg-surface-container-high">
      <div className="relative h-48 overflow-hidden">
        <img
          className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
          src={exercise.image}
          alt={exercise.imageAlt}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <span
            className={
              requiresCalibration
                ? 'border border-tertiary bg-tertiary-container/30 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-tertiary'
                : 'bg-surface/80 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-primary backdrop-blur-md'
            }
          >
            {exercise.status}
          </span>
          <span
            className={
              exercise.level === 'Advanced' || exercise.level === 'Elite'
                ? 'bg-tertiary px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-on-tertiary'
                : 'bg-surface-container-highest px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-on-surface'
            }
          >
            {exercise.level}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <h3 className="font-display text-2xl font-black uppercase leading-tight text-on-surface transition-colors group-hover:text-primary">
            {exercise.name}
          </h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            {exercise.type} - {exercise.muscles}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          {[
            ['Equipment', exercise.equipment],
            ['Avg Cal', exercise.calories],
            ['Sets/Reps', exercise.setsReps],
          ].map(([label, value]) => (
            <div key={label} className="border-l border-outline-variant/30 pl-3">
              <p className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">{label}</p>
              <p className="text-sm font-black text-on-surface">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-outline-variant/10 pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-sm ${requiresCalibration ? 'text-tertiary' : 'text-primary'}`}
                style={{ fontVariationSettings: requiresCalibration ? undefined : "'FILL' 1" }}
              >
                {requiresCalibration ? 'error_outline' : 'videocam'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {requiresCalibration ? 'Setup Required' : 'AI Form Active'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {exercise.views || 0}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/admin/exercise-lab/new-exercise?id=${exercise.id}`}
              className="rounded-sm p-2 text-on-surface-variant transition-all hover:bg-surface-container-highest hover:text-primary" 
              aria-label={`Edit ${exercise.name}`}
            >
              <span className="material-symbols-outlined text-lg">edit</span>
            </Link>
            <button 
              onClick={() => exercise.id && onDelete(exercise.id)}
              className="rounded-sm p-2 text-on-surface-variant transition-all hover:bg-error-container/20 hover:text-error" 
              aria-label={`Delete ${exercise.name}`}
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/admin/exercises`, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        // Map backend fields to frontend type
        const mappedExercises: Exercise[] = data.map((ex: any) => ({
          id: ex.id,
          name: ex.title,
          type: ex.exerciseType,
          muscles: Array.isArray(ex.primary_muscles) ? ex.primary_muscles.join(', ') : ex.primary_muscles,
          equipment: Array.isArray(ex.equipments) ? `${ex.equipments.length} items` : '0 items',
          calories: ex.calories_burn ? (String(ex.calories_burn).includes('kcal') ? ex.calories_burn : `${ex.calories_burn} kcal`) : '0 kcal',
          setsReps: ex.set_reps,
          status: 'Ready',
          level: ex.difficulty,
          image: ex.referenceVisual,
          imageAlt: `Visual for ${ex.title}`,
          views: ex.views || 0,
        }));
        setExercises(mappedExercises);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/muscle-groups`, { headers: getAuthHeaders() });
        if (response.ok) {
          const data = (await response.json()) as MuscleGroup[];
          setMuscleGroups(data.filter((group) => Boolean(group.name)));
        }
      } catch (error) {
        console.error('Error fetching muscle groups:', error);
      }
    };

    fetchMuscleGroups();
    fetchExercises();
  }, [apiUrl]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;

    try {
      const response = await fetch(`${apiUrl}/api/admin/exercises/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setExercises(prev => prev.filter(ex => ex.id !== id));
      } else {
        alert('Failed to delete exercise');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error connecting to server');
    }
  };

  const muscleFilters = useMemo(() => {
    if (muscleGroups.length === 0) {
      return defaultMuscleFilters;
    }

    return ['All', ...muscleGroups.map((group) => group.name)];
  }, [muscleGroups]);

  const visibleExercises = useMemo(() => {
    if (selectedMuscleGroup === 'All') {
      return exercises;
    }

    return exercises.filter((exercise) =>
      exercise.muscles.toLowerCase().includes(selectedMuscleGroup.toLowerCase()),
    );
  }, [selectedMuscleGroup, exercises]);

  return (
    <div className="min-h-screen bg-background p-8 text-on-background transition-colors duration-500">
      <section className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="font-display mb-2 text-5xl font-black uppercase tracking-tight text-on-surface">
            Exercise
            <br />
            <span className="text-primary italic">Management</span>
          </h2>
          <div className="kinetic-gradient h-1 w-24" />
        </div>
      </section>

      <section className="mb-10 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-2 rounded-sm bg-surface-container-low px-4 py-2">
          <span className="mr-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Muscle Group:</span>
          {muscleFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedMuscleGroup(filter)}
              className={
                selectedMuscleGroup === filter
                  ? 'rounded-sm bg-primary px-3 py-1 text-[11px] font-bold uppercase text-on-primary'
                  : 'rounded-sm bg-surface-container-highest px-3 py-1 text-[11px] font-bold uppercase text-on-surface-variant transition-colors hover:text-on-surface'
              }
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <span className="font-display text-2xl font-black uppercase animate-pulse text-on-surface-variant">Loading exercises...</span>
          </div>
        ) : (
          visibleExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} onDelete={handleDelete} />
          ))
        )}

        <Link
          href="/admin/exercise-lab/new-exercise"
          className="group flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 p-12 text-center transition-all hover:border-primary/50"
        >
          <span className="material-symbols-outlined mb-4 text-6xl text-outline-variant transition-colors group-hover:text-primary">
            add_circle
          </span>
          <p className="font-display font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface">
            Register New Exercise
          </p>
          <p className="mt-2 text-[10px] uppercase text-on-surface-variant">Define mechanics, metrics, and calibration data</p>
        </Link>
      </section>

      <footer className="mt-12 flex flex-col gap-4 border-t border-outline-variant/10 pt-6 text-on-surface-variant md:flex-row md:items-center md:justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.1em]">Showing {visibleExercises.length} of {exercises.length} performance entries</p>
      </footer>
    </div>
  );
}

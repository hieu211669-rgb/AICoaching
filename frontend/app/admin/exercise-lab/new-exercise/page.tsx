'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const exerciseTypes = ['Compound', 'Isolation', 'Mobility', 'Cardio'];
const equipmentOptions = ['Dumbbell', 'Barbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell'];
const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];

function NewExerciseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get('id');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  // Form States
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState('Compound');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['Dumbbell']);
  const [targetMuscles, setTargetMuscles] = useState<string[]>(['Chest', 'Triceps']);
  const [newMuscle, setNewMuscle] = useState('');
  const [estBurn, setEstBurn] = useState('124');
  const [setReps, setSetReps] = useState('4 / 8-12');
  const [skillLevel, setSkillLevel] = useState('Advanced');
  const [referenceVisual, setReferenceVisual] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAkH7eZzT2az7bhzcafr3257vmjPlTYu11pzt2rgzLsPKiS33fzd8vn-CgLX0mCw2koSuvFkIA1x_YxVl212rKKsnL6KhQvE7VrAkxvGJ7ISDZJS0WcyxJiYTgg-Knt281lu_ZvedgE9qvcqanHutUhyvEESDwW55u2R-iryywiYsv6e7xInfzG7NmGs4e0PcRqZlaCVwQPvlnrhXWTks43QuHxDc-nwzshGk9Hk0WELlJy4OC4bE13FpszNRXdR3Os2TnTB8moGYKT');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // AI Metadata
  const [rangeOfMotion, setRangeOfMotion] = useState('0.94 / 1.0');
  const [stabilityRequirement, setStabilityRequirement] = useState('High');
  const [biomechanicalFocus, setBiomechanicalFocus] = useState('Mid-Chest');
  const [timeStamp, setTimeStamp] = useState('');

  // Fetch exercise data if editing
  useEffect(() => {
    if (exerciseId) {
      const fetchExercise = async () => {
        try {
          setFetching(true);
          const response = await fetch(`${apiUrl}/api/admin/exercises/${exerciseId}`, { headers: getAuthHeaders() });
          if (response.ok) {
            const data = await response.json();
            setExerciseName(data.title);
            setExerciseType(data.exerciseType);
            setSelectedEquipment(data.equipments || []);
            setTargetMuscles(data.primary_muscles || []);
            setEstBurn(data.calories_burn);
            setSetReps(data.set_reps);
            setSkillLevel(data.difficulty);
            setReferenceVisual(data.referenceVisual);
            setRangeOfMotion(data.rangeOfMotion);
            setStabilityRequirement(data.stabillityRequirement);
            setBiomechanicalFocus(data.biomechanicalFocus);
            // Keep original timestamp or update? Usually keep creation time, but UI shows "Entry Timestamp"
            // For now, let's just let the real-time clock run or set it to original
          }
        } catch (err) {
          console.error('Fetch error:', err);
        } finally {
          setFetching(false);
        }
      };
      fetchExercise();
    }
  }, [exerciseId]);

  // Real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = `${now.getMonth() + 1}.${now.getDate()}.${now.getFullYear()} / ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setTimeStamp(formatted);
    };

    const interval = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceVisual(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEquipment = (equip: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equip) 
        ? prev.filter(e => e !== equip) 
        : [...prev, equip]
    );
  };

  const addMuscle = () => {
    if (newMuscle.trim() && !targetMuscles.includes(newMuscle.trim())) {
      setTargetMuscles([...targetMuscles, newMuscle.trim()]);
      setNewMuscle('');
    }
  };

  const removeMuscle = (muscle: string) => {
    setTargetMuscles(targetMuscles.filter(m => m !== muscle));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalVisualUrl = referenceVisual;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch(`${apiUrl}/api/admin/upload-image`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadRes.json();
        finalVisualUrl = uploadData.url;
      }

      const exerciseData = {
        title: exerciseName,
        exerciseType,
        equipments: selectedEquipment,
        primary_muscles: targetMuscles,
        calories_burn: estBurn,
        set_reps: setReps,
        difficulty: skillLevel,
        referenceVisual: finalVisualUrl,
        biomechanicalFocus,
        stabillityRequirement: stabilityRequirement,
        rangeOfMotion,
        timeStamp
      };

      const url = exerciseId 
        ? `${apiUrl}/api/admin/exercises/${exerciseId}` 
        : `${apiUrl}/api/admin/exercises`;
      
      const method = exerciseId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(exerciseData),
      });

      if (response.ok) {
        alert(exerciseId ? 'Exercise updated successfully!' : 'Exercise created successfully!');
        router.push('/admin/exercise-lab/library');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to save exercise'}`);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      alert(`Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="font-display text-2xl font-black uppercase animate-pulse text-primary">Loading Data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background px-8 py-10 text-on-background transition-colors duration-500 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <section className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display mt-2 text-4xl font-black tracking-tighter text-on-surface md:text-5xl">
              {exerciseId ? 'Edit Exercise' : 'New Exercise Profile'}
            </h2>
          </div>
          <div className="md:text-right">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Entry Timestamp</p>
            <p className="font-headline font-medium text-primary">{timeStamp}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="flex flex-col gap-8 xl:col-span-7">
            <div className="rounded-lg bg-surface-container-low p-8">
              <div className="flex flex-col gap-6">
                <div className="space-y-1">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Exercise Name
                  </label>
                  <input
                    className="w-full border-b border-outline-variant bg-transparent pb-2 font-display text-3xl font-bold text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/30 focus:border-primary"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    placeholder="e.g. Dumbbell Bench Press"
                    type="text"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Exercise Type
                    </label>
                    <select 
                      className="mt-1 w-full bg-transparent font-headline text-sm font-bold uppercase tracking-tight text-on-surface outline-none"
                      value={exerciseType}
                      onChange={(e) => setExerciseType(e.target.value)}
                    >
                      {exerciseTypes.map(type => (
                        <option key={type} value={type} className="bg-surface-container-low">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Equipment Required
                    </label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {equipmentOptions.map((equipment) => (
                        <button
                          key={equipment}
                          onClick={() => toggleEquipment(equipment)}
                          className={`flex items-center gap-2 border px-3 py-2 font-headline text-[10px] font-bold uppercase tracking-wider transition-all ${
                            selectedEquipment.includes(equipment)
                              ? 'border-primary bg-primary text-on-primary'
                              : 'border-outline-variant bg-surface-container-highest text-on-surface hover:border-primary hover:text-primary'
                          }`}
                          type="button"
                        >
                          {equipment}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative aspect-[16/9] overflow-hidden rounded-lg bg-surface-container-low">
              <img
                alt="Exercise visual"
                className="h-full w-full object-cover opacity-80 grayscale contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                src={referenceVisual}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-flex items-center gap-2 bg-primary px-3 py-1 font-headline text-[10px] font-black uppercase tracking-tighter text-on-primary">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    videocam
                  </span>
                  Reference Visual / {selectedFile ? 'Uploaded' : 'Active'}
                </span>
              </div>
              <div className="absolute right-6 top-6 flex flex-col gap-2">
                 <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                 />
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-surface/60 text-on-surface backdrop-blur-md transition-all hover:bg-primary hover:text-on-primary"
                 >
                    <span className="material-symbols-outlined">upload</span>
                 </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 xl:col-span-5">
            <div className="flex flex-col gap-8 rounded-lg bg-surface-container-low p-8">
              <div>
                <label className="mb-3 block font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Target Muscle Groups
                </label>
                <div className="flex flex-wrap gap-2">
                  {targetMuscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="group flex items-center gap-2 border border-outline-variant bg-surface-container-highest px-3 py-1.5 font-headline text-xs font-bold uppercase tracking-wider text-on-surface"
                    >
                      {muscle}
                      <button onClick={() => removeMuscle(muscle)} className="text-on-surface-variant hover:text-error">
                         <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1 border border-dashed border-outline-variant px-2 py-1 transition-all focus-within:border-primary">
                    <input 
                      type="text" 
                      className="w-20 bg-transparent font-headline text-[10px] font-bold uppercase outline-none placeholder:text-on-surface-variant/30"
                      placeholder="Add New"
                      value={newMuscle}
                      onChange={(e) => setNewMuscle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addMuscle()}
                    />
                    <button onClick={addMuscle} className="text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Est. Burn (kcal)
                  </label>
                  <input 
                    type="text"
                    className="w-full bg-transparent font-display text-4xl font-black tracking-tighter text-primary outline-none focus:border-b border-primary"
                    value={estBurn}
                    onChange={(e) => setEstBurn(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Sets / Reps
                  </label>
                  <input 
                    type="text"
                    className="w-full bg-transparent font-display text-4xl font-black tracking-tighter text-on-surface outline-none focus:border-b border-primary"
                    value={setReps}
                    onChange={(e) => setSetReps(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Skill Level
                  </label>
                  <select 
                    className="mt-1 w-full bg-transparent font-headline text-sm font-bold uppercase tracking-tight text-on-surface outline-none"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level} className="bg-surface-container-low">{level}</option>
                    ))}
                  </select>
                  <div className="flex gap-0.5 pt-2">
                    {skillLevels.map((level, idx) => (
                       <div 
                        key={level} 
                        className={`h-1 w-4 ${skillLevels.indexOf(skillLevel) >= idx ? 'bg-primary' : 'bg-outline-variant/30'}`} 
                       />
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-headline text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Visibility Status
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-headline text-sm font-bold uppercase tracking-tight text-on-surface">Ready to Publish</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow rounded-lg border-l-4 border-primary bg-surface-container-highest p-8">
              <label className="mb-4 block font-headline text-[10px] font-bold uppercase tracking-widest text-primary">
                Precision AI Metadata
              </label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs text-on-surface-variant">Range of Motion Index</label>
                  <input
                    className="w-full border-b border-outline-variant/30 bg-transparent pb-2 font-headline font-bold uppercase text-on-surface outline-none transition-colors focus:border-primary"
                    value={rangeOfMotion}
                    onChange={(e) => setRangeOfMotion(e.target.value)}
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-on-surface-variant">Stability Requirement</label>
                  <input
                    className="w-full border-b border-outline-variant/30 bg-transparent pb-2 font-headline font-bold uppercase text-on-surface outline-none transition-colors focus:border-primary"
                    value={stabilityRequirement}
                    onChange={(e) => setStabilityRequirement(e.target.value)}
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-on-surface-variant">Biomechanical Focus</label>
                  <input
                    className="w-full border-b border-outline-variant/30 bg-transparent pb-2 font-headline font-bold uppercase text-on-surface outline-none transition-colors focus:border-primary"
                    value={biomechanicalFocus}
                    onChange={(e) => setBiomechanicalFocus(e.target.value)}
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-4">
              <Link
                href="/admin/exercise-lab/library"
                className="border border-outline-variant px-8 py-4 font-headline text-xs font-bold uppercase tracking-widest text-on-surface transition-all hover:bg-surface-container-highest active:scale-95"
              >
                Discard
              </Link>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="rounded-sm bg-primary px-10 py-4 font-headline text-xs font-black uppercase tracking-[0.2em] text-on-primary shadow-[0_0_20px_rgba(212,255,0,0.1)] transition-all hover:bg-primary-dim active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (exerciseId ? 'Update Exercise' : 'Save Exercise')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function NewExercisePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <NewExerciseForm />
    </Suspense>
  );
}

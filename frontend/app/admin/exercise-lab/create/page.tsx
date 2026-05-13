'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  Info, 
  UploadFile, 
  VerifiedUser,
  Person
} from '@mui/icons-material';
import { useSettings } from '@/context/SettingsContext';

export default function AddNewMusclePage() {
  const router = useRouter();
  const { settings } = useSettings();
  
  // Form State
  const [scientificName, setScientificName] = useState('');
  const [anatomicalCluster, setAnatomicalCluster] = useState('');
  const [metricPriority, setMetricPriority] = useState('Hypertrophy');
  const [primaryFunction, setPrimaryFunction] = useState('');
  const [fastTwitchRatio, setFastTwitchRatio] = useState(60);
  const [publicAccess, setPublicAccess] = useState(true);

  const [muscleGroups, setMuscleGroups] = useState<any[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/muscle-groups`);
        if (response.ok) {
          const data = await response.json();
          setMuscleGroups(data);
          if (data.length > 0) {
            setAnatomicalCluster(data[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching muscle groups:', error);
      }
    };

    fetchMuscleGroups();
  }, [apiUrl]);

  const handleSave = () => {
    if (!scientificName) {
      alert('Please enter a scientific name.');
      return;
    }
    // Simulation of saving
    console.log({
      scientificName,
      anatomicalCluster,
      metricPriority,
      primaryFunction,
      fastTwitchRatio,
      publicAccess
    });
    alert('Muscle entry saved to Anatomical Database!');
    router.push('/admin');
  };

  return (
    <div className="px-12 pb-12 min-h-screen bg-background text-foreground pt-8 transition-colors duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-medium uppercase tracking-widest text-foreground/40 mb-8">
        <a className="hover:text-primary transition-colors" href="/admin">Console</a>
        <ChevronRight sx={{ fontSize: 10 }} />
        <a className="hover:text-primary transition-colors" href="#">Anatomical Database</a>
        <ChevronRight sx={{ fontSize: 10 }} />
        <span className="text-primary font-bold">Add New Muscle</span>
      </nav>

      {/* Header Section */}
      <section className="mb-12">
        <div className="flex items-end justify-between border-b border-surface-border pb-6">
          <div>
            <h2 className="text-5xl font-black italic text-foreground tracking-tighter leading-none mb-2 uppercase font-display">
              NEW_MUSCLE_ENTRY
            </h2>
            <p className="text-foreground/40 max-w-xl text-sm italic">
              Cataloging biomechanical units for real-time kinetic tracking. Accuracy in anatomical naming and functional clustering is mandatory for precision analytics.
            </p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => router.back()}
              className="px-6 py-2 border border-surface-border bg-surface text-foreground/60 hover:text-foreground hover:bg-surface-hover transition-all uppercase text-xs font-bold tracking-widest rounded"
            >
              Discard
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-2 bg-primary text-black font-black uppercase text-xs tracking-widest rounded-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Save Muscle
            </button>
          </div>
        </div>
      </section>

      {/* Form Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Primary Identification Card */}
        <div className="col-span-12 lg:col-span-8 bg-surface p-8 relative overflow-hidden group border border-surface-border rounded-lg shadow-sm transition-colors duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-foreground">
            <Person sx={{ fontSize: 120 }} />
          </div>
          <h3 className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] mb-8 font-bold border-l-2 border-primary pl-3">
            01. Identification
          </h3>
          <div className="grid grid-cols-2 gap-8 relative z-10">
            <div className="col-span-2">
              <label className="block text-[10px] text-foreground/40 uppercase tracking-widest mb-2 font-bold">Muscle Scientific Name</label>
              <input 
                className="w-full bg-transparent border-b border-surface-border focus:border-primary border-t-0 border-l-0 border-r-0 py-4 px-0 text-xl font-bold focus:ring-0 placeholder-foreground/10 transition-colors text-foreground outline-none font-display uppercase" 
                placeholder="e.g., Pectoralis Major" 
                type="text"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Anatomical Cluster</label>
              <div className="relative">
                <select 
                  className="w-full bg-transparent border-b border-surface-border focus:border-primary border-t-0 border-l-0 border-r-0 py-4 px-0 text-foreground focus:ring-0 appearance-none cursor-pointer font-bold"
                  value={anatomicalCluster}
                  onChange={(e) => setAnatomicalCluster(e.target.value)}
                >
                  {muscleGroups.length > 0 ? (
                    muscleGroups.map((group) => (
                      <option key={group.id || group.name} value={group.name} className="bg-surface uppercase">
                        {group.name}
                      </option>
                    ))
                  ) : (
                    <option value="" className="bg-surface">No Clusters Available</option>
                  )}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40">
                  <ChevronRight sx={{ transform: 'rotate(90deg)', fontSize: 14 }} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Metric Priority</label>
              <div className="flex space-x-3 py-4">
                {['Hypertrophy', 'Endurance', 'Power'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setMetricPriority(p)}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all border ${
                      metricPriority === p ? 'bg-primary text-black border-primary' : 'bg-background text-foreground/40 border-surface-border hover:border-primary/30'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats / Status */}
        <div className="col-span-12 lg:col-span-4 bg-surface p-8 flex flex-col justify-between border border-surface-border rounded-lg shadow-sm transition-colors duration-500">
          <h3 className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] mb-4 font-bold border-l-2 border-tertiary pl-3">
            System Status
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-3xl font-black text-foreground leading-none font-display tracking-tighter uppercase">84.2%</p>
              <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold mt-1">Database Completion</p>
              <div className="w-full bg-background border border-surface-border h-2 mt-4 rounded-full overflow-hidden">
                <div className="bg-tertiary h-full w-[84.2%] shadow-lg shadow-tertiary/20"></div>
              </div>
            </div>
            <div className="bg-background p-4 rounded border border-surface-border">
              <p className="text-[10px] text-foreground/40 uppercase font-bold mb-1 tracking-widest">Last Update</p>
              <p className="text-xs font-mono text-primary font-bold tracking-tight uppercase">2023-OCT-24_14:22:11</p>
            </div>
            <p className="text-[11px] text-foreground/30 leading-relaxed italic uppercase font-bold tracking-tight">
              "Cataloging new muscle structures updates the kinetic engine's predictive model for all active users."
            </p>
          </div>
        </div>

        {/* Functionality Details */}
        <div className="col-span-12 lg:col-span-6 bg-surface p-8 border border-surface-border rounded-lg shadow-sm transition-colors duration-500">
          <h3 className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] mb-8 font-bold border-l-2 border-primary pl-3">
            02. Primary Function
          </h3>
          <textarea 
            className="w-full bg-background border border-surface-border focus:border-primary p-6 text-sm focus:ring-0 placeholder-foreground/10 transition-colors rounded resize-none text-foreground outline-none font-medium leading-relaxed" 
            placeholder="Describe the mechanical role of this muscle in movement (e.g. Adduction, Internal Rotation, Flexion)..." 
            rows={6}
            value={primaryFunction}
            onChange={(e) => setPrimaryFunction(e.target.value)}
          ></textarea>
          <div className="mt-4 flex items-center text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
            <Info sx={{ fontSize: 14, mr: 0.5, color: 'var(--primary)' }} />
            Detailed functional descriptions enhance AI exercise recognition.
          </div>
        </div>

        {/* Schematic Upload */}
        <div className="col-span-12 lg:col-span-6 bg-surface p-8 flex flex-col border border-surface-border rounded-lg shadow-sm transition-colors duration-500">
          <h3 className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] mb-8 font-bold border-l-2 border-primary pl-3">
            03. Visual Schematic
          </h3>
          <div className="flex-1 border-2 border-dashed border-surface-border/40 flex flex-col items-center justify-center group hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden rounded-lg bg-background/50">
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-10 transition-opacity grayscale" 
              alt="Anatomy background" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkH7eZzT2az7bhzcafr3257vmjPlTYu11pzt2rgzLsPKiS33fzd8vn-CgLX0mCw2koSuvFkIA1x_YxVl212rKKsnL6KhQvE7VrAkxvGJ7ISDZJS0WcyxJiYTgg-Knt281lu_ZvedgE9qvcqanHutUhyvEESDwW55u2R-iryywiYsv6e7xInfzG7NmGs4e0PcRqZlaCVwQPvlnrhXWTks43QuHxDc-nwzshGk9Hk0WELlJy4OC4bE13FpszNRXdR3Os2TnTB8moGYKT"
            />
            <div className="relative z-10 flex flex-col items-center text-center px-8">
              <UploadFile sx={{ fontSize: 40, mb: 2, color: 'var(--foreground)', opacity: 0.2 }} className="group-hover:text-primary transition-colors" />
              <p className="text-sm font-bold text-foreground mb-1 uppercase tracking-tight font-display">Upload Anatomical Diagram</p>
              <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">SVG, PNG or GLB (MAX 24MB)</p>
            </div>
          </div>
        </div>

        {/* Bio-Constants Section */}
        <div className="col-span-12 bg-surface p-8 grid grid-cols-1 md:grid-cols-4 gap-8 border border-surface-border rounded-lg shadow-sm transition-colors duration-500">
          <div className="md:col-span-1 border-r border-surface-border/50 pr-8">
            <h3 className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] mb-4 font-bold border-l-2 border-primary pl-3">
              04. Bio-Constants
            </h3>
            <p className="text-xs text-foreground/30 leading-relaxed italic uppercase font-bold tracking-tight">
              Specify default fiber type dominance and mechanical advantage ratios for this muscle group.
            </p>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background p-5 rounded border border-surface-border">
              <label className="block text-[10px] text-foreground/40 uppercase tracking-widest mb-3 font-bold">Fast Twitch Ratio</label>
              <input 
                className="w-full accent-primary h-1 bg-surface-border/30 rounded-lg cursor-pointer transition-all" 
                type="range"
                value={fastTwitchRatio}
                onChange={(e) => setFastTwitchRatio(parseInt(e.target.value))}
                style={{ accentColor: 'var(--primary)' } as any}
              />
              <div className="flex justify-between mt-2 text-[10px] font-mono text-foreground/40 uppercase font-bold">
                <span>0%</span>
                <span className="text-primary font-bold">{fastTwitchRatio}%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="bg-background p-5 rounded border border-surface-border flex flex-col justify-center">
              <label className="block text-[10px] text-foreground/40 uppercase tracking-widest mb-3 font-bold">Leverage Factor</label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-foreground font-display tracking-tighter">1.4</span>
                <span className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest">Ratio</span>
              </div>
            </div>
            <div className="bg-background p-5 rounded border border-surface-border flex flex-col justify-center">
              <label className="block text-[10px] text-foreground/40 uppercase tracking-widest mb-3 font-bold">Stabilization Role</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-3 h-3 bg-primary rounded-sm shadow-sm shadow-primary/30"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Primary Mover</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Action Footer */}
      <div className="mt-12 flex items-center justify-between p-8 bg-surface rounded-lg border border-surface-border shadow-2xl transition-colors duration-500">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center bg-background shadow-inner">
            <VerifiedUser sx={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground uppercase tracking-tight font-display">Validator Check Required</p>
            <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Entry will be flagged for peer review before publishing.</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={publicAccess} 
              onChange={() => setPublicAccess(!publicAccess)}
              className="sr-only peer" 
            />
            <div className="relative w-11 h-6 bg-surface-border/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
            <span className="ms-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Public Access</span>
          </label>
          <button 
            onClick={handleSave}
            className="px-10 py-4 bg-primary text-black font-black uppercase text-sm tracking-[0.2em] rounded border border-primary/20 hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            Save Muscle
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Dumbbell, Tag, Video, Layout, Loader2, CloudUpload, Film } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function UploadPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [videoTitle, setVideoTitle] = useState('');
  const [duration, setDuration] = useState('00:00');
  const [intensity, setIntensity] = useState('High');
  const [selectedMuscles, setSelectedMuscles] = useState(['Quadriceps']);
  const [focusInput, setFocusInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/muscle-groups`);
        if (response.ok) {
          const data = await response.json();
          const names = data.map((group: any) => group.name);
          setMuscleGroups(names);
        }
      } catch (error) {
        console.error('Error fetching muscle groups:', error);
      }
    };

    fetchMuscleGroups();
  }, [apiUrl]);

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles(prev => 
      prev.includes(muscle) 
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handlePublish = async () => {
    if (!videoTitle || !selectedFile) {
      alert('Vui lòng nhập tiêu đề và chọn file video!');
      return;
    }

    setIsPublishing(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const focusValue = focusInput ? focusInput : selectedMuscles.join(', ');

    try {
      if (cloudName && uploadPreset) {
        const cloudForm = new FormData();
        cloudForm.append('file', selectedFile);
        cloudForm.append('upload_preset', uploadPreset);

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
          method: 'POST',
          body: cloudForm,
        });

        if (!cloudRes.ok) {
          const errText = await cloudRes.text();
          throw new Error(`Cloudinary upload failed: ${errText}`);
        }

        const cloudJson = await cloudRes.json();
        const videoUrl = cloudJson.secure_url;
        const publicId = cloudJson.public_id;
        const thumbUrl = `https://res.cloudinary.com/${cloudName}/video/upload/w_640,h_360,c_fill,so_1/${publicId}.jpg`;

        const metaRes = await fetch(`${apiUrl}/api/videos/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: videoTitle,
            url: videoUrl,
            thumbnail: thumbUrl,
            duration,
            intensity,
            focus: focusValue
          })
        });

        if (metaRes.ok) {
          alert('Successfully uploaded and saved metadata!');
          router.push('/admin/content-manager/library');
        } else {
          const err = await metaRes.text();
          throw new Error(`Saving metadata failed: ${err}`);
        }
      } else {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', videoTitle);
        formData.append('intensity', intensity);
        formData.append('focus', focusValue);
        formData.append('duration', duration);

        const response = await fetch(`${apiUrl}/api/videos/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('Successfully uploaded and saved to database!');
          router.push('/admin/content-manager/library');
        } else {
          const errorData = await response.json();
          throw new Error(`Upload error: ${JSON.stringify(errorData)}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Upload failed');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="pt-24 px-12 pb-12 bg-background min-h-screen text-foreground transition-colors duration-500">
      <input 
        type="file" 
        name="file"
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="video/*" 
        className="hidden" 
      />

      <div className="flex justify-between items-end mb-12">
        <div className="max-w-2xl">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block flex items-center gap-2">
            <Layout size={14} /> CONTENT MANAGER / ASSET PIPELINE
          </span>
          <h2 className="text-5xl font-display font-bold tracking-tighter leading-none mb-4 uppercase text-foreground">
            NEW UPLOAD<span className="text-primary">_</span>
          </h2>
          <p className="text-foreground/40 text-lg italic">Cataloging high-fidelity video assets for the kinetic library.</p>
        </div>
        <div className="flex gap-4 mb-2">
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 border border-surface-border bg-surface hover:bg-surface-hover transition-all duration-200 font-bold tracking-tight text-sm uppercase rounded text-foreground"
          >
            Cancel
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-8 py-3 bg-primary text-black font-bold tracking-tight text-sm uppercase shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 rounded"
          >
            {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Film size={16} />}
            <span>{isPublishing ? 'PUBLISHING...' : 'PUBLISH ASSET'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          <section className="bg-surface p-8 rounded border border-surface-border">
            <h3 className="text-primary font-bold text-xs tracking-widest uppercase mb-8 border-b border-surface-border pb-2 flex items-center gap-2">
              <Video size={14} /> Asset Metadata
            </h3>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold text-foreground/40 uppercase mb-2 tracking-widest">Video Title</label>
                <input 
                  className="w-full bg-transparent border-0 border-b border-surface-border py-3 text-2xl font-bold focus:ring-0 focus:border-primary transition-all placeholder:text-foreground/10 text-foreground outline-none font-display uppercase" 
                  placeholder="e.g., Explosive Deadlift Mechanics" 
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-foreground/40 uppercase mb-2 tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Duration (MM:SS)
                  </label>
                  <input 
                    className="w-full bg-background border border-surface-border py-3 px-4 text-sm rounded focus:ring-1 focus:ring-primary text-foreground outline-none"
                    placeholder="e.g., 12:45"
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-foreground/40 uppercase mb-2 tracking-widest">Intensity Profile</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High', 'Expert'].map(level => (
                      <button 
                        key={level}
                        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-tighter border transition-colors rounded ${
                          intensity === level ? 'border-primary bg-primary/10 text-primary' : 'border-surface-border text-foreground/40'
                        }`}
                        onClick={() => setIntensity(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-foreground/40 uppercase mb-2 tracking-widest">Focus (custom input overrides clusters)</label>
                <input
                  className="w-full bg-background border border-surface-border py-3 px-4 text-sm rounded focus:ring-1 focus:ring-primary text-foreground outline-none"
                  placeholder="e.g., Quadriceps, Glutes or Custom focus"
                  type="text"
                  value={focusInput}
                  onChange={(e) => setFocusInput(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="bg-surface p-1 rounded border border-surface-border">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-surface-border rounded p-12 flex flex-col items-center justify-center group hover:border-primary/50 transition-colors cursor-pointer bg-background/50"
            >
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-surface-border">
                <CloudUpload className="text-primary" size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2 uppercase text-foreground font-display">
                {selectedFile ? selectedFile.name : 'Select Kinetic Footage'}
              </h4>
              <p className="text-foreground/40 text-sm mb-8 italic">MP4, MOV (MAX 2GB)</p>
              <button className="px-6 py-2 bg-surface text-xs font-bold uppercase tracking-widest text-primary rounded border border-surface-border hover:bg-surface-hover">
                {selectedFile ? 'Change Asset' : 'Browse Files'}
              </button>
            </div>

            {selectedFile && (
              <div className="p-8 border-t border-surface-border bg-surface-hover/30">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <Film className="text-primary" size={20} />
                    <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
                  </div>
                  <span className="text-primary text-sm font-bold uppercase tracking-tighter">Ready to Publish</span>
                </div>
                <div className="w-full h-1 bg-background rounded-full overflow-hidden border border-surface-border">
                  <div className="h-full bg-primary shadow-[0_0_10px_var(--primary)] transition-all duration-500" style={{width: `100%`}}></div>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="col-span-4 space-y-6">
          <section className="bg-surface p-8 rounded border-l-2 border-primary border-t border-r border-b border-surface-border">
            <h3 className="text-primary font-bold text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
              <Dumbbell size={14} /> Focus Clusters
            </h3>
            <div className="flex flex-wrap gap-2">
              {muscleGroups.map(muscle => (
                <button 
                  key={muscle}
                  onClick={() => toggleMuscle(muscle)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded transition-colors border ${
                    selectedMuscles.includes(muscle) ? 'bg-primary text-black border-primary' : 'bg-background text-foreground/40 border-surface-border hover:border-primary/30'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-surface p-6 rounded border border-surface-border">
            <h3 className="text-foreground/40 font-bold text-[10px] tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
              <Tag size={12} /> System Focus
            </h3>
            <div className="p-4 bg-background rounded border border-surface-border">
              <p className="text-primary text-xs font-mono break-all leading-relaxed font-bold">
                {selectedMuscles.join(', ') || 'No focus selected'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

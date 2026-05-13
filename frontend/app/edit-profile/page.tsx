'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    mantra: '',
    gender: 'Other',
    age: '',
    weight: '',
    height: '',
    password: '',
  });

  const [avatar, setAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAsGhj5Me3D6EXLgIin4W7DZHXUdeX6nfV_8kM5TLH5hIAiASTZlIESuzoK1lqcIpCwTFNbrhZfkmdpbzyZOhggOG_RixasQqASvSUqaNUNXTpcLDLIIo4TWtafQdrgaJq2y0b4-Pw_3CukSQTqYqV1YmZ7VAGs1MtfEKxLUgyY_nrLWnia3XvGc2_cdPmxq2hlo4D4iwJCBf-7UTh8bV2Epm4UzrGGZyM-dhnR1zCfrHwlEs--c-EsXNphmMSTnjhv1K-p4j2eQsn5');

  // Load user data from localStorage on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setFormData((prev) => ({
          ...prev,
          full_name: user.full_name || '',
          email: user.email || '',
          weight: user.weight?.toString() || '',
          height: user.height?.toString() || '',
          // Use defaults for fields not in the basic user model yet
          username: user.username || prev.username,
          mantra: user.mantra || prev.mantra,
          gender: user.gender || prev.gender,
          age: user.age?.toString() || prev.age,
        }));
        if (user.avatar) {
          setAvatar(user.avatar);
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Saving profile:', { ...formData, avatar });
    // Simulate successful save
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden pb-20">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-low flex justify-between items-center px-6 py-4 h-16 border-b border-outline-variant/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="active:scale-95 transition-transform text-primary hover:opacity-80"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline font-bold text-primary tracking-tighter uppercase text-xl">EDIT PROFILE</h1>
        </div>
        <div className="flex items-center">
          <span className="font-headline font-bold text-primary tracking-tighter uppercase opacity-40 text-xs">VOLT KINETIC</span>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-lg mx-auto">
        {/* Profile Photo Section */}
        <section className="relative flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-surface-container-highest border-2 border-primary/20 p-1">
              <img 
                alt="Profile Photo" 
                className="w-full h-full object-cover rounded-md grayscale hover:grayscale-0 transition-all duration-500" 
                src={avatar}
              />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-primary text-on-primary w-10 h-10 rounded-md flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          <p className="mt-4 font-headline text-xs uppercase tracking-[0.2em] text-primary">Change Avatar</p>
        </section>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Full Name</label>
            <input 
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 font-display text-lg placeholder-on-surface-variant/30 transition-all" 
              type="text" 
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Email Address</label>
            <input 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 font-display text-lg placeholder-on-surface-variant/30 transition-all" 
              type="email" 
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Username</label>
            <div className="flex items-center border-b border-outline-variant">
              <span className="text-on-surface-variant pr-1">@</span>
              <input 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border-0 focus:ring-0 text-on-surface py-3 px-0 font-display text-lg transition-all" 
                type="text" 
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-1.5">
            <label className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Change Password</label>
            <input 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
              className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 font-display text-lg placeholder-on-surface-variant/30 transition-all" 
              type="password" 
            />
          </div>

          {/* Bio / Mantra */}
          <div className="space-y-1.5">
            <label className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Performance Mantra</label>
            <textarea 
              name="mantra"
              value={formData.mantra}
              onChange={handleChange}
              className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 font-body text-md resize-none transition-all" 
              rows={2}
            />
          </div>

          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <label className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Gender</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 font-body text-md transition-all appearance-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Age</label>
              <input 
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 font-display text-2xl transition-all" 
                type="number" 
              />
            </div>
          </div>

          {/* Metrics: Height & Weight */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <label className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Weight (KG)</label>
              <input 
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 font-display text-2xl transition-all" 
                type="number" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">Height (CM)</label>
              <input 
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface py-3 px-0 font-display text-2xl transition-all" 
                type="number" 
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-8">
            <button 
              className="w-full bg-primary text-on-primary font-headline font-bold py-5 rounded-md uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-3 active:scale-95 transition-transform bg-gradient-to-br from-primary to-primary-container shadow-lg shadow-primary/20" 
              type="submit"
            >
              SAVE CHANGES
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </button>
          </div>

          {/* Deactivate Link */}
          <div className="pt-4 pb-8 flex justify-center">
            <button className="text-error font-headline text-xs uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2" type="button">
              <span className="material-symbols-outlined text-sm">cancel</span>
              Deactivate Account
            </button>
          </div>
        </form>
      </main>

      {/* Global Decoration - Asymmetric Gradient Glow */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-tertiary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
}

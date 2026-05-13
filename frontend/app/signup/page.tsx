'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'user' // Default role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      // Success
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
      <main className="flex-grow flex flex-col md:flex-row relative overflow-hidden">
        {/* Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-surface-container-low">
          <div 
            className="h-full bg-primary transition-all duration-500 shadow-[0_0_15px_rgba(244,255,198,0.5)]"
            style={{ width: loading ? '70%' : '33.33%' }}
          ></div>
        </div>

        {/* Left Column: Visual Impact */}
        <section className="hidden md:flex md:w-1/2 h-screen sticky top-0 bg-surface-container-low items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img 
              className="w-full h-full object-cover" 
              alt="Athletic intensity" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0MU6UMQhMIvRWXuV4GWDJkZTbDjLrHGo_3Rhz1mgn1LA-HKp0v6npfNHA0H3WPCA1POvejoyQOL_HQs-cb-TlQNfFraopyStmj0VqZQeNtLNUi5YpEO0Gd0ke9XsNf2mu2l5-1GCoXTuL7PSb-10ZkW07FU8gbMiQOgbnAPhEH8nT-3P-c0T_7BLbkIKTiw8Qheg8xGLOXqNgR2OGuV-lEZjW2J5DoW7oVbv-25-DtZebXTZIN5FThz_NQF76X9ylx8vQdpybnPlZ"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span className="font-headline font-black italic tracking-widest text-3xl text-primary">VOLT KINETIC</span>
            </div>
            <h2 className="font-headline text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white">
              PRECISION <br/> <span className="text-primary">PERFORMANCE</span>
            </h2>
            <p className="mt-8 text-on-surface-variant font-body text-lg max-w-sm border-l-2 border-primary pl-6">
              Join the ranks of elite athletes using biometric data and kinetic intelligence to shatter human limits.
            </p>
          </div>
        </section>

        {/* Right Column: Registration Form */}
        <section className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-24 bg-background">
          <div className="w-full max-w-md space-y-12">
            <header className="space-y-2">
              <div className="md:hidden flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span className="font-headline font-black italic tracking-widest text-xl text-primary">VOLT KINETIC</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-headline font-bold tracking-[0.2em] text-primary uppercase">Step 01 / 03</span>
                <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
              </div>
              <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter uppercase leading-none">
                JOIN THE <br/><span className="text-white/40">ELITE</span>
              </h1>
            </header>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-error-container/20 border border-error/30 rounded-md">
                  <p className="text-error text-sm font-bold uppercase tracking-wider">{error}</p>
                </div>
              )}

              {/* Name Field */}
              <div className="group">
                <label className="block text-[10px] font-headline font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors" htmlFor="full_name">
                  Full Name
                </label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-highest border-none border-b border-outline-variant/20 focus:ring-0 focus:border-primary text-on-surface font-headline font-medium p-4 transition-all placeholder:text-white/10 uppercase tracking-tight" 
                    id="full_name" 
                    placeholder="ERIK VANCE" 
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-focus-within:w-full"></div>
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-[10px] font-headline font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-highest border-none border-b border-outline-variant/20 focus:ring-0 focus:border-primary text-on-surface font-headline font-medium p-4 transition-all placeholder:text-white/10 uppercase tracking-tight" 
                    id="email" 
                    placeholder="ELITE @VOLTKINETIC.COM" 
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-focus-within:w-full"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-[10px] font-headline font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors" htmlFor="password">
                  Secret Key
                </label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-highest border-none border-b border-outline-variant/20 focus:ring-0 focus:border-primary text-on-surface font-headline font-medium p-4 transition-all placeholder:text-white/10 tracking-[0.3em]" 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-focus-within:w-full"></div>
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* CTA Section */}
              <div className="pt-6 space-y-6">
                <button 
                  className="kinetic-gradient w-full py-5 rounded-lg flex items-center justify-between px-8 text-on-primary font-headline font-black text-lg tracking-widest uppercase active:scale-[0.98] transition-transform disabled:opacity-50" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? 'DEPLOYING PROFILE...' : 'CREATE ACCOUNT'}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-on-surface-variant text-xs font-body">
                    ALREADY RECRUITED? <Link className="text-white hover:text-primary transition-colors font-bold underline underline-offset-4 decoration-primary/30" href="/login">LOGIN HERE</Link>
                  </p>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center cursor-pointer hover:bg-surface-bright transition-colors border border-outline-variant/10">
                      <img 
                        alt="Google" 
                        className="w-5 h-5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc7hlQXchIB4hI98A-SYnKVpeXLSxJF-6gqd6So-uZpNbSmOK-HebzVm9nPmTheFqM8AlYqfDuR7ZzCW8eaDF8_cVB9TukaWzTrGFh2qigTMvaGwpfY-VReRvLqnGlucxKFfsD6rWHj82ecbVRGUXCMZtkoGWsGf93bjiSzXJ0OtDWR4bsVlhlSHTfrnA_fRfZRiSkugKU5PebO9nkRWGqTrtU7xdEqpYapzeqgiGegYi7LPVQJTcnckvo9aM-nb0034h_fwbL2Htz"
                      />
                    </div>
                    <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center cursor-pointer hover:bg-surface-bright transition-colors border border-outline-variant/10">
                      <span className="material-symbols-outlined text-xl text-white/50 hover:text-white">ios</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <footer className="pt-12 border-t border-outline-variant/10">
              <p className="text-[10px] leading-relaxed text-on-surface-variant/40 font-body uppercase tracking-widest text-center">
                By deploying your profile, you acknowledge the terms of tactical deployment and our kinetic data privacy protocols.
              </p>
            </footer>
          </div>
        </section>
      </main>

      {/* Background Decoration */}
      <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed -top-32 -right-32 w-96 h-96 bg-tertiary/5 blur-[120px] rounded-full pointer-events-none"></div>
    </div>
  );
}

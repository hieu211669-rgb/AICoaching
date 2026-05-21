'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function ForgotPasswordContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!email) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to send link');

      setSuccess('✓ Recovery link sent! Check your email for password reset instructions.');
      setEmail('');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary min-h-screen flex flex-col overflow-x-hidden">
      {/* TopAppBar */}
      <header className="top-0 z-50 flex h-16 w-full items-center justify-between bg-[#0e0e0e] px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/login" className="hover:bg-white/10 transition-all duration-300 active:scale-95 p-2 rounded-lg">
            <span className="material-symbols-outlined text-[#f4ffc6]">arrow_back</span>
          </Link>
          <h1 className="font-headline uppercase tracking-tight font-bold text-lg text-[#f4ffc6]">
            FORGOT PASSWORD
          </h1>
        </div>
        <div className="hidden font-headline text-xl font-black italic tracking-tighter text-[#f4ffc6] sm:block">KINETIC</div>
      </header>

      {/* Main Content Canvas */}
      <main className="relative flex flex-grow flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20">
        {/* Abstract Performance Background Element */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[150px]"></div>
        </div>

        <div className="w-full max-w-xl relative z-10">
          {/* Header Section */}
          <div className="mb-12 md:mb-16">
            <h2 className="font-display mb-6 text-4xl font-black leading-none tracking-tighter text-on-surface sm:text-5xl md:text-7xl">
              RECOVER YOUR <br/>
              <span className="text-primary italic">ACCESS.</span>
            </h2>
            <p className="max-w-md border-l-2 border-primary pl-4 font-body text-base leading-relaxed text-on-surface-variant sm:pl-6 md:text-xl">
              Enter your email address and we'll send you a secure link to reset your password.
            </p>
          </div>

          {/* Input Form Section */}
          <section className="bg-surface-container-low p-1 border-outline-variant/10 rounded-lg">
            <div className="rounded-sm bg-background p-5 sm:p-8 md:p-10">
              <form className="space-y-8" onSubmit={handleSendEmail}>
                {error && (
                  <div className="p-4 bg-error-container/20 border border-error/30 rounded-md">
                    <p className="text-error text-sm font-bold uppercase tracking-wider">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-md">
                    <p className="text-primary text-sm font-bold uppercase tracking-wider">{success}</p>
                  </div>
                )}

                {/* Email Input Field */}
                <div className="group">
                  <label className="block font-headline text-[10px] tracking-[0.2em] text-primary uppercase mb-3 font-bold">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface-container-highest border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 text-on-surface font-headline text-lg py-4 px-0 placeholder:text-on-secondary/50 transition-all duration-300" 
                      placeholder="your.email@domain.com" 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="absolute right-0 bottom-4 opacity-30 group-focus-within:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-primary text-sm">mail</span>
                    </div>
                  </div>
                </div>

                {/* Action Cluster */}
                <div className="pt-4 flex flex-col gap-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="kinetic-gradient text-on-primary font-headline font-bold text-sm tracking-widest uppercase py-5 rounded-md hover:brightness-110 active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(244,255,198,0.15)] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? 'SENDING...' : 'SEND RECOVERY EMAIL'}
                    <span className="material-symbols-outlined text-sm">mail_outline</span>
                  </button>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/10">
                    <Link className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="#support">
                      <span className="material-symbols-outlined text-[14px]">help</span>
                      CONTACT SUPPORT
                    </Link>
                    <Link className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors" href="/login">
                      BACK TO LOGIN
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* Information Box */}
          <div className="mt-10 rounded-lg border border-outline-variant/10 bg-surface-container-low/50 p-5 sm:p-6">
            <div className="flex gap-3 sm:gap-4">
              <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">info</span>
              <div>
                <h3 className="font-headline text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">What happens next?</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We'll send a secure password reset link to your email. The link will expire in 15 minutes for your security. Check your spam folder if you don't see it.
                </p>
              </div>
            </div>
          </div>

          {/* Precision Metric Decoration */}
          <div className="mt-12 flex justify-between items-end">
            <div className="hidden md:block">
              <div className="text-[8px] font-mono text-outline-variant tracking-[0.5em] uppercase mb-1">system_status</div>
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-primary"></div>
                <div className="w-1 h-4 bg-primary/60"></div>
                <div className="w-1 h-4 bg-primary/30"></div>
                <div className="w-1 h-4 bg-primary/10"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-headline text-on-surface-variant/40 tracking-tighter italic">
                VOLT_KINETIC // PASSWORD_RECOVERY_SERVICE
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] border-t border-[#484847]/15 w-full px-8 py-12 flex flex-col items-center gap-4 z-10">
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <Link className="font-body text-[10px] tracking-widest uppercase text-white/40 hover:text-[#f4ffc6] transition-colors" href="#">Support</Link>
          <Link className="font-body text-[10px] tracking-widest uppercase text-white/40 hover:text-[#f4ffc6] transition-colors" href="#">Privacy Policy</Link>
          <Link className="font-body text-[10px] tracking-widest uppercase text-white/40 hover:text-[#f4ffc6] transition-colors" href="#">Terms of Service</Link>
        </div>
        <p className="font-body text-[10px] tracking-widest uppercase text-white/40">© 2024 KINETIC PRECISION. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* Aesthetic Decorative Image */}
      <div className="fixed top-1/4 -right-24 w-96 h-[600px] pointer-events-none z-0 opacity-10">
        <img 
          alt="" 
          className="w-full h-full object-cover grayscale" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMjVwMfo67gcDF06syIDuLWBrus4Iv0zvj94bKBNkYaGdlgfiMyydFAI4Yr8Pg9mPEyH_PobLAoY_0_3FlemTO1H4a4IqK_TQkd-Yz19unINhZGjPe_wwbJemao-mg7yLpQlDCJ3iUeCGJZxEuLjEixFmwL0B3GeyRxoXoWMDbQLJ1MM-Dg9GrBpyHf2xPvAm7iB0xiZuDQ7FT9SLjnyS5RozckamqyrAeMsSJyw0you5HF62U4aDBE4D1zfpJfM_cAzjtfWdakYPmY"
        />
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary font-headline uppercase tracking-widest">Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}

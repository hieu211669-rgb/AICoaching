'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check password requirements
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);

  // Update password strength
  const updatePasswordStrength = (value: string) => {
    setNewPassword(value);
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/\d/.test(value)) strength++;
    if (/[!@#$%^&*]/.test(value)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate all requirements
    if (!hasMinLength || !hasNumber || !hasSpecialChar) {
      alert('Password does not meet security requirements');
      return;
    }

    // TODO: Call API to reset password
    console.log('Password reset:', newPassword);
    alert('Password reset successfully');
    router.push('/login');
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
      {/* Top Navigation Shell */}
      <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-[#0e0e0e] px-4 py-4 text-[#f4ffc6] sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="hover:bg-[#262626] transition-colors active:scale-95 duration-150 p-2 rounded-full"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-display tracking-tighter uppercase font-bold text-lg">
            SECURITY
          </h1>
        </div>
        <div className="hidden font-display font-black italic text-[#f4ffc6] sm:block">
          VOLT KINETIC
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="kinetic-bg relative min-h-screen overflow-hidden px-4 pb-32 pt-24 sm:px-6">
        {/* Background Graphic */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <img
            className="absolute -right-40 top-20 w-[700px] max-w-none grayscale mix-blend-screen sm:-right-20 sm:w-3/4"
            alt="abstract double exposure of human muscular anatomy and flowing kinetic energy lines in a dark technical style"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2otzGU3nEL-Edi4VbpdhEwTRglOuypUe7xcFtY-gipp8Y6o9rBBZJZzALiEXJdW5kpEhORLRxP8vE1HFkPzGGcO0qpBLU8xoyK8oM_Vc9YTeDswIXejf3EjONAnonnXnZae9Il9LPWNvK9TgY3Y-YoWMBn3iYc5A_OjfGt271ZkNvb-7a8qCdF0iB4ugzyIK_IghpURIIzASyXx-mmtSrMXelmJascMhwl6lmoEwZuM0Im5T76dKemgYL8gz9vaM76ZAk2klifKbp"
          />
        </div>

        <div className="max-w-md mx-auto relative z-10">
          {/* Header Section */}
          <header className="mb-12">
            <h2 className="font-display mb-2 text-3xl font-black leading-none tracking-tight sm:text-4xl">
              CREATE NEW <br />
              <span className="text-primary italic">PASSWORD</span>
            </h2>
            <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-[280px]">
              Your new credentials must meet our high-precision security standards.
            </p>
          </header>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="font-headline text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => updatePasswordStrength(e.target.value)}
                  className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-headline px-0 py-4 transition-all placeholder:text-outline"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showNewPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Strength Indicator */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="font-headline text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                  Security Level
                </span>
                <span className="text-primary font-headline font-bold text-xs">
                  {passwordStrength === 3 ? 'EXCELLENT' : passwordStrength === 2 ? 'RELIABLE' : passwordStrength === 1 ? 'WEAK' : 'NONE'}
                </span>
              </div>
              <div className="flex gap-1.5 h-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 ${
                      i < passwordStrength ? 'bg-primary' : 'bg-surface-container-highest'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="font-headline text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-headline px-0 py-4 transition-all placeholder:text-outline"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Primary Action */}
            <button
              type="submit"
              disabled={!hasMinLength || !hasNumber || !hasSpecialChar}
              className="group w-full bg-primary text-on-primary font-headline font-black py-5 px-8 rounded-md flex items-center justify-between hover:bg-primary-dim active:scale-95 duration-200 transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="tracking-widest uppercase italic">SAVE PASSWORD</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="text-outline text-[10px] uppercase tracking-widest font-bold">
              VOLT ENCRYPTION SYSTEM V.2.04
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

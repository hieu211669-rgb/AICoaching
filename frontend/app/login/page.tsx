'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store auth data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));


      // Role-based redirection
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-surface font-body text-on-surface md:flex-row">
      {/* Visual Anchor Section */}
      <section className="relative flex h-72 w-full items-end overflow-hidden p-6 sm:p-8 md:h-screen md:w-7/12 md:p-16">
        <div className="absolute inset-0 z-0">
          <img
            alt="Athletic intensity"
            className="w-full h-full object-cover grayscale opacity-50"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA67J4q2S5Gwcs40s91IY6wSLNNTnxBpJm_Bpx0yPq8X0OE4qBk_nlAfRPqsjU6dbMU9CE4ukGa69hTQ6DiYfCxacTdIVRSh55MydAiCQ3JJVgvdqAdw9QmC0gmt9jcYtEBkyvepVrD0t7syAhXZZcWDzXyV3-_GRgDBM8PGuQ8TdCG0a724dCEyajX_OrNr9zIhoJBDCSVVGt1K56acBRTenA3Ef9rHisoNi792eIU_DafdySzGNmkUfCqAbcROt-2kYpFtjwAXZ-d"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
        </div>

        {/* Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <span className="font-display font-black text-xl tracking-[0.3em] text-primary uppercase italic">
              Volt Kinetic
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold uppercase italic leading-[0.8] tracking-tighter text-primary text-shadow-glow sm:text-6xl md:text-8xl">
            VOLT
          </h1>
          <p className="font-display text-base md:text-2xl font-light tracking-widest text-on-surface-variant mt-4 max-w-md">
            ENGINEERED FOR THE UNSTOPPABLE.
          </p>
        </div>
      </section>

      {/* Auth Section */}
      <section className="flex w-full flex-col justify-center bg-surface px-6 py-10 sm:px-8 md:w-5/12 md:px-12 lg:px-20">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-10 sm:mb-12">
            <h2 className="font-display mb-2 text-3xl font-bold tracking-tight sm:text-4xl">ACCESS PORTAL</h2>
            <p className="text-on-surface-variant font-medium">Verify your credentials to resume training.</p>
          </div>

          {/* Login Form */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-error-container/20 border border-error/30 rounded-md">
                <p className="text-error text-sm font-bold uppercase tracking-wider">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Email Input */}
              <div className="group relative">
                <label
                  htmlFor="email"
                  className="block text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant py-4 px-0 text-lg focus:ring-0 focus:border-primary transition-all placeholder:text-on-surface-variant/30 outline-none"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="group relative">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2 group-focus-within:text-primary transition-colors"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant py-4 px-0 text-lg focus:ring-0 focus:border-primary transition-all placeholder:text-on-surface-variant/30 outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-4 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-full h-full bg-surface-container-highest border border-outline-variant rounded-sm peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                  <span className="material-symbols-outlined text-on-primary text-sm opacity-0 peer-checked:opacity-100 absolute">
                    check
                  </span>
                </div>
                <span className="text-xs font-bold tracking-wider text-on-surface-variant group-hover:text-on-surface transition-colors">
                  REMEMBER PERSISTENCE
                </span>
              </label>
              <Link href="/send-email" className="text-xs font-bold tracking-wider text-primary hover:underline underline-offset-4">
                RESET PASSWORD
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="kinetic-gradient w-full py-5 rounded-md flex items-center justify-center gap-3 group active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-display font-black text-on-primary tracking-[0.2em] text-lg uppercase">
                {loading ? 'VERIFYING...' : 'LOG IN'}
              </span>
              <span className="material-symbols-outlined text-on-primary font-bold group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-12">
            <div className="h-[1px] flex-1 bg-outline-variant opacity-20"></div>
            <span className="text-[10px] font-black text-on-surface-variant tracking-[0.3em] uppercase">
              Connect via
            </span>
            <div className="h-[1px] flex-1 bg-outline-variant opacity-20"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {/* Google Button */}
            <button className="flex items-center justify-center gap-3 py-4 bg-surface-container-low border border-outline-variant/10 rounded-md hover:bg-surface-container-highest transition-colors group">
              <svg className="w-5 h-5 fill-on-surface group-hover:fill-primary transition-colors" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.904 3.16-1.856 4.12-1.168 1.168-2.8 2.48-6.144 2.48-5.504 0-9.744-4.48-9.744-9.984s4.24-9.984 9.744-9.984c3.008 0 5.248 1.168 6.912 2.768l2.304-2.304c-2.08-2.016-5.008-3.488-9.216-3.488-7.904 0-14.32 6.416-14.32 14.32s6.416 14.32 14.32 14.32c4.288 0 7.52-1.424 10.016-4.048 2.592-2.592 3.408-6.224 3.408-9.04 0-.864-.064-1.712-.208-2.512h-13.2z" />
              </svg>
              <span className="text-[11px] font-black tracking-widest uppercase">Google</span>
            </button>

            {/* Apple Button */}
            <button className="flex items-center justify-center gap-3 py-4 bg-surface-container-low border border-outline-variant/10 rounded-md hover:bg-surface-container-highest transition-colors group">
              <svg className="w-5 h-5 fill-on-surface group-hover:fill-primary transition-colors" viewBox="0 0 24 24">
                <path d="M17.073 21.321c-.959.697-1.932 1.344-3.102 1.344-1.144 0-1.503-.697-2.946-.697-1.417 0-1.85.672-2.92.672-1.071 0-2.118-.745-3.151-2.193-2.118-2.94-3.712-8.31-1.464-12.213 1.119-1.944 3.125-3.174 5.321-3.211 1.666-.024 3.238 1.129 4.24 1.129 1.012 0 2.91-1.356 4.908-1.157 1.944.024 3.424.72 4.414 2.144-4.04 2.376-3.384 7.632.745 8.976-.84 2.304-1.92 4.608-3.045 5.201zm-3.804-17.52c-.048-2.616 2.152-4.836 4.704-4.801.024 2.544-2.136 4.752-4.704 4.801z" />
              </svg>
              <span className="text-[11px] font-black tracking-widest uppercase">Apple</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-12 text-center sm:mt-16">
            <p className="text-sm font-medium text-on-surface-variant mb-4">New to the kinetic ecosystem?</p>
            <Link href="/signup" className="inline-flex items-center gap-2 group">
              <span className="font-display font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
                Join the Elite
              </span>
              <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                north_east
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Decorative */}
      <footer className="fixed bottom-0 left-0 w-full p-4 pointer-events-none hidden md:block">
        <div className="flex justify-between items-end opacity-20">
          <div className="text-[10px] font-mono tracking-tighter leading-none">
            COORD: 34.0522° N, 118.2437° W
            <br />
            EST: 2024_VK_BETA
          </div>
          <div className="flex gap-2">
            <div className="w-1 h-8 bg-primary"></div>
            <div className="w-1 h-8 bg-primary/40"></div>
            <div className="w-1 h-8 bg-primary/10"></div>
          </div>
        </div>
      </footer>

      {/* Tailwind Styles */}
      <style jsx>{`
        .kinetic-gradient {
          background: linear-gradient(135deg, #f4ffc6 0%, #d1fc00 100%);
        }
        .text-shadow-glow {
          text-shadow: 0 0 15px rgba(244, 255, 198, 0.4);
        }
      `}</style>
    </main>
  );
}

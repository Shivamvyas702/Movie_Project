'use client';

import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', data);

      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);

      setAuth(res.data);
      toast.success('Login successful');
      router.push('/movies');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#083344] relative overflow-hidden">

      {/* ✅ Bottom Wave Effect */}
      {/* ✅ Bottom Dual Waves - Login Match */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">

        {/* Back Wave - Soft */}
        <svg
          className="absolute bottom-0 w-[110%] h-[240px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#1f5e6b"
            fillOpacity="0.35"
            d="M0,160L48,154.7C96,149,192,139,288,149.3C384,160,480,192,576,197.3C672,203,768,181,864,170.7C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L0,320Z"
          />
        </svg>

        {/* Front Wave - Bright */}
        <svg
          className="relative w-[110%] h-[160px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#0e5560ff"
            fillOpacity="0.55"
            d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L0,320Z"
          />
        </svg>

      </div>

      {/* ✅ Login Card */}
      <div className="relative z-10 w-full max-w-sm bg-[#0b3c49] p-8 rounded-xl text-white shadow-2xl">

        {/* ✅ Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-white rounded-full p-2">
            <span className="bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
              O
            </span>
            <span className="bg-pink-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
              T
            </span>
            <span className="bg-yellow-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
              🎬
            </span>
          </div>
        </div>

        {/* ✅ Title */}
        <h1 className="text-2xl font-semibold text-center mb-6">
          Sign in
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* ✅ Email */}
          <div>
            <input
              {...register('email')}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-md bg-[#083344] border border-[#1e5b6b] focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* ✅ Password with Eye */}
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md bg-[#083344] border border-[#1e5b6b] focus:outline-none focus:ring-2 focus:ring-green-400 pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white cursor-pointer"
            >
              {showPassword ? (
                // Eye Off
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-3.582-10-8 0-1.657.65-3.204 1.75-4.5M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.25 4.5A9.973 9.973 0 0022 11c0-4.418-4.477-8-10-8" />
                </svg>
              ) : (
                // Eye
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {/* ✅ Remember Me */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" className="accent-green-500" />
            Remember me
          </div>

          {/* ✅ Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md cursor-pointer font-semibold transition flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* ✅ Register Link */}
          <div className="text-center mt-4 text-sm text-gray-300">
            Don&apos;t have an account?{' '}
            <span
              onClick={() => router.push('/register')}
              className="text-green-400 hover:underline cursor-pointer font-medium"
            >
              Register
            </span>
          </div>

        </form>
      </div>
    </div>
  );
}

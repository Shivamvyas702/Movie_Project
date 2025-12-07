'use client';

import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await api.post('/auth/register', data);
      toast.success('Registration successful');
      router.push('/');
    } catch {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#083344] relative overflow-hidden">

      {/* ✅ Bottom Dual Waves - SAME AS LOGIN */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">

        {/* Back Wave */}
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

        {/* Front Wave */}
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

      {/* ✅ Register Card */}
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
          Register
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

    

            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {/* ✅ Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-semibold transition flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

          {/* ✅ Back to Login */}
          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account?{' '}
            <span
              onClick={() => router.push('/')}
              className="text-green-400 hover:underline cursor-pointer font-medium"
            >
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

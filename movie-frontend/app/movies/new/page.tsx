'use client';

import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

import { useState, useRef } from 'react';

export default function CreateMoviePage() {
    useAuth();
    const { register, handleSubmit, reset, setValue } = useForm();
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);


    const onSubmit = async (data: any) => {
        try {
            setUploading(true);

            const file = fileRef.current?.files?.[0];

            if (!file) {
                toast.error('Please select a poster image');
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image must be under 2MB');
                return;
            }

            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('publishingYear', String(data.publishingYear));
            formData.append('poster', file);

            await api.post('/movies', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Movie created');
            router.push('/movies');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };





    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // ✅ Client-side compression
        const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.8,          // ✅ ~800KB
            maxWidthOrHeight: 1280,
            useWebWorker: true,
        });

        const newFile = new File([compressedFile], file.name, {
            type: compressedFile.type,
        });

        // ✅ Replace file in input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(newFile);
        if (fileRef.current) {
            fileRef.current.files = dataTransfer.files;
        }

        setPreview(URL.createObjectURL(newFile));
        setFileName(newFile.name);
    };


    const triggerFileSelect = () => {
        fileRef.current?.click();
    };

    const removeImage = () => {
        setPreview(null);
        setFileName(null);

        if (fileRef.current) {
            fileRef.current.value = '';
        }
    };



    return (
      <div className="min-h-screen bg-[#083344] relative overflow-hidden 
                      flex flex-col px-6 md:px-32">
    
        {/* ✅ PAGE TITLE */}
        <h1 className="text-white text-3xl md:text-5xl font-semibold mt-14 md:mt-20 text-center md:text-left">
          Create a new movie
        </h1>
    
        {/* ✅ MAIN FORM ROW */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-28 
                        items-center md:items-start relative z-10 mt-14 md:mt-20">
    
          {/* ✅ IMAGE UPLOAD */}
          <div
            onClick={triggerFileSelect}
            className="w-[260px] h-[260px] md:w-[380px] md:h-[380px]
                       border-2 border-dashed border-gray-400 
                       rounded-xl flex flex-col items-center justify-center 
                       text-gray-300 text-sm cursor-pointer 
                       hover:border-white transition"
          >
            {!preview ? (
              <>
                <span className="text-2xl mb-3">+</span>
                <p className="text-base">Drop an image here</p>
              </>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl"
              />
            )}
          </div>
    
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFileChange}
            className="hidden"
          />
    
          {/* ✅ FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 w-full md:w-[360px]"
          >
            <input
              {...register('title')}
              placeholder="Title"
              required
              className="bg-[#0b3c49] text-white px-5 py-3 rounded-md text-lg
                         outline-none border border-transparent 
                         focus:border-[#2fa4b5]"
            />
    
            <input
              type="number"
              {...register('publishingYear')}
              placeholder="Publishing year"
              required
              className="bg-[#0b3c49] text-white px-5 py-3 rounded-md text-lg
                         outline-none border border-transparent 
                         focus:border-[#2fa4b5] w-full md:w-[220px]"
            />
    
            {/* ✅ ACTION BUTTONS */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-6 w-full">
              <button
                type="button"
                onClick={() => router.push('/movies')}
                className="w-full md:w-auto px-12 py-3 rounded-md border border-gray-300  
                           font-bold text-gray-300 
                           hover:bg-white hover:text-black cursor-pointer transition"
              >
                Cancel
              </button>
    
              <button
                type="submit"
                disabled={uploading}
                className="w-full md:w-auto px-12 py-3 rounded-md bg-green-600  
                           hover:bg-green-700 text-white font-bold text-lg 
                           disabled:opacity-50 cursor-pointer"
              >
                {uploading ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
    
        {/* ✅ BOTTOM WAVES */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
    
          {/* Back Wave */}
          <svg
            className="absolute bottom-0 w-[110%] h-[200px] md:h-[240px]"
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
            className="relative w-[110%] h-[140px] md:h-[160px]"
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
      </div>
    );
    


}

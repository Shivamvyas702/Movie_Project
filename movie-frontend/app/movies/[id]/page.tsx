'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';


export default function EditMoviePage() {
  useAuth();
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // ✅ Load movie data
  useEffect(() => {
    api.get(`/movies/${id}`).then((res) => {
      setValue('title', res.data.title);
      setValue('publishingYear', res.data.publishingYear);

      if (res.data.posterUrl) {
        setPreview(res.data.posterUrl); // show existing poster
        setFileName('Current Poster');
      }
    });
  }, [id, setValue]);

  // ✅ File change handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 6 * 1024 * 1024) {
      toast.error('Image too large');
      return;
    }

    const compressed = await imageCompression(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    });

    const newFile = new File([compressed], file.name, {
      type: compressed.type,
    });

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


  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('publishingYear', String(data.publishingYear));

      const file = fileRef.current?.files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error('Image must be under 2MB');
          return;
        }
        formData.append('poster', file);
      }

      await api.put(`/movies/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Movie updated');
      router.push('/movies');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };




  return (
  <div className="min-h-screen bg-[#083344] relative overflow-hidden 
                  flex flex-col  px-32">

    {/* ✅ PAGE TITLE */}
    <h1 className="text-white text-5xl font-semibold mt-20">
        Edit
      </h1>

      {/* ✅ MAIN FORM ROW */}
         <div className="flex gap-28 items-start relative z-10 mt-20">

        {/* ✅ LEFT: IMAGE BOX */}
        <div
          onClick={triggerFileSelect}
             className="w-[380px] h-[380px] border-2 border-dashed border-gray-400 
                   rounded-xl flex flex-col items-center justify-center 
                   text-gray-300 text-sm cursor-pointer 
                   hover:border-white transition"
        >
          {!preview ? (
            <>
              <span className="text-2xl mb-3 ">+</span>
               <p className="text-base">Drop other image here</p>
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

        {/* ✅ RIGHT: FORM FIELDS */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-[300px] mt-0">

          <input
            {...register('title')}
            placeholder="Title"
            required
            className="bg-[#0b3c49] text-white px-5 py-2 rounded-md text-lg
                     outline-none border border-transparent 
                     focus:border-[#2fa4b5]"
          />

          <input
            type="number"
            {...register('publishingYear')}
            placeholder="Publishing year"
            required
            className="bg-[#0b3c49] text-white px-5 py-2 rounded-md text-lg
                     outline-none border border-transparent 
                     focus:border-[#2fa4b5] w-[220px]"
          />

          {/* ✅ ACTION BUTTONS */}
        <div className="flex gap-6 mt-6">
            <button
              type="button"
              onClick={() => router.push('/movies')}
              className="px-12 py-2 rounded-md border border-gray-300 cursor-pointer font-bold
                       text-gray-300 hover:bg-white hover:text-black transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-12 py-2 rounded-md bg-green-500 hover:bg-green-600 cursor-pointer font-bold
                       text-white font-bold disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>

        </form>
      </div>

      {/* ✅ Bottom Dual Waves  */}
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

    </div>
  );

}

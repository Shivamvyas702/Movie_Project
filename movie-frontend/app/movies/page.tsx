'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaArrowRightFromBracket } from 'react-icons/fa6';



export default function MoviesPage() {
  useAuth();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const hydrated = useAuthStore((s) => s.hydrated);
  const accessToken = useAuthStore((s) => s.accessToken);


  const fetchMovies = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/movies?page=${page}&limit=8`);

      setMovies(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hydrated && accessToken) {
      fetchMovies();
    }
  }, [page, hydrated, accessToken]);





  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Movie?',
      text: 'This movie will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/movies/${id}`);
      toast.success('Movie deleted');

      // ✅ If last item on page deleted, go back a page
      if (movies.length === 1 && page > 1) {
        setPage((p) => p - 1);
        return;
      }

      fetchMovies();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="min-h-screen bg-[#083344] relative overflow-hidden px-16 pt-12 pb-24">

      {/* ✅ Bottom Dual Waves  */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">

        {/* Back Wave */}
        <svg
          className="absolute bottom-0 w-[110%] h-[200px]"
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
          className="relative w-[110%] h-[120px]"
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


      {/* ✅ HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3 text-white">
          <h1 className="text-3xl font-semibold">My movies</h1>

          <button
            onClick={() => router.push('/movies/new')}
            className="w-5 h-5 flex items-center justify-center 
             font-bold rounded-full 
             border-2 border-white text-white 
             hover:bg-green-500 hover:border-green-500 cursor-pointer
             transition"
          >
            +
          </button>


        </div>

        {/* ✅ LOGOUT – WHITE TEXT ONLY */}
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="text-white flex items-center font-bold mr-1 gap-2 hover:underline opacity-90 cursor-pointer"
        >
          Logout
          <FaArrowRightFromBracket className="text-xl ml-2" />
        </button>

      </div>

      {/* ✅ LOADING */}
      {loading && (
        <div className="flex justify-center mt-24">
          <div className="h-10 w-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin" />
        </div>
      )}

      {/* ✅ EMPTY STATE — EXACT CENTER */}
      {!loading && movies.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-5xl font-semibold mb-10">
            Your movie list is empty
          </h2>

          <button
            onClick={() => router.push('/movies/new')}
            className="bg-green-600 hover:bg-green-700 cursor-pointer
                 text-white px-8 py-3 rounded-md 
                 font-medium shadow"
          >
            Add a new movie
          </button>
        </div>
      )}


      {/* ✅ MOVIE GRID — EXACT CARD SIZE */}
      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

          {movies.map((movie) => (
            <div
              key={movie._id}
              onClick={() => router.push(`/movies/${movie._id}`)}
              className="relative bg-[#0b3c49] rounded-xl overflow-hidden shadow-lg 
               cursor-pointer hover:scale-[1.02] transition"
              title="Click To View..."
            >
              {/* ✅ POSTER */}
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-[400px] w-full object-cover"
              />

              {/* ✅ BOTTOM CONTENT ROW */}
              <div className="p-4 text-white bg-gray-800 flex items-start justify-between gap-3">

                {/* ✅ TITLE + YEAR */}
                <div>
                  <h3 className="text-md font-medium truncate max-w-[160px]">
                    {movie.title}
                  </h3>

                  <p className="text-[14px] text-gray-300 mt-1">
                    {movie.publishingYear}
                  </p>
                </div>

                {/* ✅ 3 DOT MENU — BOTTOM RIGHT */}
                <div onClick={(e) => e.stopPropagation()} className="relative">
                  <details className="relative">
                    <summary className="list-none cursor-pointer text-white text-xl select-none px-2" title='Click to Perform Actions'>
                      ⋮
                    </summary>

                    <div className="absolute right-0 bottom-6 w-32 bg-[#0f3f4a] 
                          rounded-md shadow-lg border border-[#1f5e6b] z-20 overflow-hidden">

                      {/* ✅ UPDATE OPTION */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/movies/${movie._id}`);
                        }}
                        className="w-full text-left px-4 py-2 text-white 
                         hover:bg-green-500 hover:text-white"
                      >
                        Update
                      </button>

                      {/* ✅ DELETE OPTION */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(movie._id);
                        }}
                        disabled={deletingId === movie._id}
                        className="w-full text-left px-4 py-2 text-red-400 
                         hover:bg-red-500 hover:text-white 
                         flex items-center justify-between
                         disabled:opacity-50"
                      >
                        Delete

                        {deletingId === movie._id && (
                          <span className="h-3 w-3 border-2 border-white 
                                 border-t-transparent rounded-full 
                                 animate-spin" />
                        )}
                      </button>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          ))}



        </div>
      )}

      {/* ✅ PAGINATION — CENTER GREEN ACTIVE */}
      {!loading && movies.length > 0 && (
        <div className="flex justify-center items-center gap-6 mt-20 text-sm text-white">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="opacity-70 hover:underline disabled:opacity-30 cursor-pointer font-bold"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-7 h-7 rounded flex items-center  font-bold justify-center ${page === i + 1
                ? 'bg-green-500 text-white bg-gray-800'
                : 'text-gray-300 hover:text-white bg-gray-800'
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="opacity-70 hover:underline disabled:opacity-30 cursor-pointer  font-bold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

}

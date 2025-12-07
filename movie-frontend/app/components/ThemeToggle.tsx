'use client';

export default function ThemeToggle() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 bg-black text-white px-3 py-2 rounded"
    >
      Toggle Dark
    </button>
  );
}

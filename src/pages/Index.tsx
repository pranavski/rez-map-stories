import { useState } from 'react';
import Map from '@/components/Map';
import FilmCard from '@/components/FilmCard';
import ThemeFilter from '@/components/ThemeFilter';
import FilmList from '@/components/FilmList';
import { Film } from '@/data/films';

const Index = () => {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const handleThemeToggle = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme)
        ? prev.filter((t) => t !== theme)
        : [...prev, theme]
    );
  };

  const handleResetFilters = () => {
    setSelectedThemes([]);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#7C3AED' }}>
            Indigenous Representation in Film
          </h1>
          <p className="max-w-3xl" style={{ fontFamily: 'Georgia, serif', color: '#8B5CF6' }}>
            An interactive exploration of Indigenous cinema, connecting films with their territories,
            themes, and critical scholarship on settler colonialism, gender, and decolonization.
          </p>
        </div>
      </header>

      <div className="w-full h-full pt-32">
        <Map onLocationClick={setSelectedFilm} />
      </div>

      <ThemeFilter
        selectedThemes={selectedThemes}
        onThemeToggle={handleThemeToggle}
        onReset={handleResetFilters}
      />

      <FilmList
        selectedThemes={selectedThemes}
        onFilmClick={setSelectedFilm}
      />

      <FilmCard film={selectedFilm} onClose={() => setSelectedFilm(null)} />
    </div>
  );
};

export default Index;

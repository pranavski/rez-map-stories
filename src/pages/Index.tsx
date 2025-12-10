import { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import Map from '@/components/Map';
import FilmCard from '@/components/FilmCard';
import ThemeFilter from '@/components/ThemeFilter';
import FilmList from '@/components/FilmList';
import FilmSubmissionForm from '@/components/FilmSubmissionForm';
import { Button } from '@/components/ui/button';
import { Film } from '@/data/films';

const Index = () => {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  const handleThemeToggle = (theme: string) => {
    setSelectedThemes(prev => prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]);
  };

  const handleResetFilters = () => {
    setSelectedThemes([]);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <header className="absolute top-0 left-0 right-0 z-20 p-6 border-4 border-muted bg-orange-200">
        <div className="flex items-start justify-between">
          <div className="max-w-3xl">
            <h1 style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#8B5CF6'
            }} className="text-3xl md:text-4xl font-semibold mb-2 font-mono">
              Indigenous Representation in Film
            </h1>
            <p style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#A78BFA'
            }} className="text-sm md:text-base">
              An interactive exploration of Indigenous cinema, connecting films with their territories,
              themes, and critical scholarship on settler colonialism, gender, and decolonization.
            </p>
          </div>
          
          <Button
            onClick={() => setIsSubmissionFormOpen(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2 shrink-0"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Suggest a Film</span>
          </Button>
        </div>
      </header>

      <div className="w-full h-full pt-32">
        <Map onLocationClick={setSelectedFilm} />
      </div>

      <ThemeFilter selectedThemes={selectedThemes} onThemeToggle={handleThemeToggle} onReset={handleResetFilters} />

      <FilmList selectedThemes={selectedThemes} onFilmClick={setSelectedFilm} />

      <FilmCard film={selectedFilm} onClose={() => setSelectedFilm(null)} />

      <FilmSubmissionForm 
        isOpen={isSubmissionFormOpen} 
        onClose={() => setIsSubmissionFormOpen(false)} 
      />
    </div>
  );
};

export default Index;
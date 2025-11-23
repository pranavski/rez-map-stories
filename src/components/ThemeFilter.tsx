import { useState } from 'react';
import { films } from '@/data/films';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface ThemeFilterProps {
  selectedThemes: string[];
  onThemeToggle: (theme: string) => void;
  onReset: () => void;
}

const ThemeFilter = ({ selectedThemes, onThemeToggle, onReset }: ThemeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract unique key issues from all films
  const allIssues = Array.from(
    new Set(films.flatMap((film) => film.keyIssues))
  ).sort();

  return (
    <div className="absolute top-6 right-4 z-10 bg-white/90 rounded-xl shadow-elevated p-4 max-w-sm" style={{ borderColor: '#A78BFA' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 transition-colors font-medium mb-3"
        style={{ color: '#7C3AED' }}
      >
        <Filter className="w-5 h-5" />
        <span>Filter by Theme</span>
        {selectedThemes.length > 0 && (
          <Badge variant="default" className="ml-2 bg-primary">
            {selectedThemes.length}
          </Badge>
        )}
      </button>

      {isOpen && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap gap-2">
            {allIssues.map((issue) => (
              <Badge
                key={issue}
                variant={selectedThemes.includes(issue) ? 'default' : 'outline'}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedThemes.includes(issue)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-primary/10'
                }`}
                onClick={() => onThemeToggle(issue)}
              >
                {issue}
              </Badge>
            ))}
          </div>

          {selectedThemes.length > 0 && (
            <button
              onClick={onReset}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemeFilter;

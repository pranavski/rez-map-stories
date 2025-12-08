import { films, Film } from '@/data/films';
import { MapPin } from 'lucide-react';
interface FilmListProps {
  selectedThemes: string[];
  onFilmClick: (film: Film) => void;
}
const FilmList = ({
  selectedThemes,
  onFilmClick
}: FilmListProps) => {
  const filteredFilms = selectedThemes.length > 0 ? films.filter(film => film.keyIssues.some(issue => selectedThemes.includes(issue))) : films;
  return <div className="absolute bottom-4 left-4 right-4 z-10 bg-card/95 backdrop-blur-sm rounded-xl shadow-elevated p-4 max-h-48 overflow-y-auto">
      <h3 className="font-bold text-lg mb-3 text-foreground font-mono bg-orange-200">
        Featured Films ({filteredFilms.length})
      </h3>
      <div className="space-y-2">
        {filteredFilms.map(film => <button key={film.id} onClick={() => onFilmClick(film)} className="w-full text-left p-3 rounded-lg border border-border bg-orange-200 hover:border-primary/50 hover:bg-orange-300 transition-all group">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex-1 min-w-0">
                <p className="text-foreground group-hover:text-primary transition-colors font-semibold">
                  {film.title}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {film.location.nation}
                </p>
              </div>
            </div>
          </button>)}
      </div>
    </div>;
};
export default FilmList;
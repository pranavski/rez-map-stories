import { Film } from '@/data/films';
import { X, MapPin, Calendar, Film as FilmIcon, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilmCardProps {
  film: Film | null;
  onClose: () => void;
}

const FilmCard = ({ film, onClose }: FilmCardProps) => {
  if (!film) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-card rounded-2xl shadow-elevated max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
              {film.title}
            </h2>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{film.location.name}</span>
              </div>
              {film.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{film.year}</span>
                </div>
              )}
              {film.directors && (
                <div className="flex items-center gap-1">
                  <FilmIcon className="w-4 h-4" />
                  <span>{film.directors.join(', ')}</span>
                </div>
              )}
            </div>
            {film.availableOn && (
              <div className="mt-2 text-sm text-primary">
                Available on {film.availableOn}
              </div>
            )}
          </div>

          <div className="mb-6 p-4 bg-earth-sand/30 rounded-lg border border-border">
            <h3 className="font-serif font-bold text-lg mb-2 text-earth-brown">
              Indigenous Nation
            </h3>
            <p className="text-foreground">{film.location.nation}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-serif font-bold text-lg mb-3 text-earth-brown">Synopsis</h3>
            <p className="text-foreground leading-relaxed">{film.synopsis}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-serif font-bold text-lg mb-3 text-earth-brown">Themes</h3>
            <div className="flex flex-wrap gap-2">
              {film.themes.map((theme) => (
                <Badge
                  key={theme}
                  variant="secondary"
                  className="bg-earth-sage/20 text-earth-brown border-earth-sage/30"
                >
                  {theme}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-serif font-bold text-lg mb-3 text-earth-brown">
              Key Issues Explored
            </h3>
            <ul className="space-y-2">
              {film.keyIssues.map((issue, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-foreground"
                >
                  <span className="text-primary mt-1">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-serif font-bold text-lg mb-3 text-primary">
              Critical Illumination
            </h3>
            <p className="text-foreground leading-relaxed">{film.illumination}</p>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-3 text-earth-brown">
              Related Readings
            </h3>
            <div className="space-y-3">
              {film.readings.map((reading, index) => (
                <div
                  key={index}
                  className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground mb-1">{reading.title}</p>
                      <p className="text-sm text-muted-foreground">{reading.author}</p>
                    </div>
                    {reading.url && (
                      <a
                        href={reading.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmCard;

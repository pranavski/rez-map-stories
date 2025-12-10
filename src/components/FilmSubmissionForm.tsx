import { useState } from 'react';
import { X, Plus, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FilmSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Reading {
  title: string;
  author: string;
  url: string;
}

const AVAILABLE_THEMES = [
  "Land reclamation",
  "Futurism",
  "Indigenous persistence",
  "Gender identity",
  "Two-Spirit identity",
  "Military colonialism",
  "Residential schools",
  "Resistance",
  "Youth agency",
  "Healthcare sovereignty",
  "Traditional knowledge",
  "Climate change",
  "Community",
  "Cultural loss",
  "Assimilation trauma"
];

const AVAILABLE_KEY_ISSUES = [
  "Settler colonialism",
  "Urban Indigenous experience",
  "Environmental justice",
  "Gender",
  "Identity formation",
  "Cultural genocide",
  "Health disparities",
  "Land-based education",
  "Indigenous displacement"
];

const FilmSubmissionForm = ({ isOpen, onClose }: FilmSubmissionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    directors: '',
    locationName: '',
    locationNation: '',
    locationLat: '',
    locationLng: '',
    synopsis: '',
    illumination: '',
    availableOn: '',
    themes: [] as string[],
    keyIssues: [] as string[],
  });
  const [readings, setReadings] = useState<Reading[]>([{ title: '', author: '', url: '' }]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeToggle = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }));
  };

  const handleKeyIssueToggle = (issue: string) => {
    setFormData(prev => ({
      ...prev,
      keyIssues: prev.keyIssues.includes(issue)
        ? prev.keyIssues.filter(i => i !== issue)
        : [...prev.keyIssues, issue]
    }));
  };

  const addReading = () => {
    setReadings(prev => [...prev, { title: '', author: '', url: '' }]);
  };

  const removeReading = (index: number) => {
    setReadings(prev => prev.filter((_, i) => i !== index));
  };

  const updateReading = (index: number, field: keyof Reading, value: string) => {
    setReadings(prev => prev.map((reading, i) => 
      i === index ? { ...reading, [field]: value } : reading
    ));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      year: '',
      directors: '',
      locationName: '',
      locationNation: '',
      locationLat: '',
      locationLng: '',
      synopsis: '',
      illumination: '',
      availableOn: '',
      themes: [],
      keyIssues: [],
    });
    setReadings([{ title: '', author: '', url: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a film title');
      return;
    }
    if (!formData.synopsis.trim()) {
      toast.error('Please enter a synopsis');
      return;
    }
    if (!formData.illumination.trim()) {
      toast.error('Please enter an illumination/analysis');
      return;
    }
    if (!formData.locationName.trim() || !formData.locationNation.trim()) {
      toast.error('Please enter location details');
      return;
    }
    if (!formData.locationLat || !formData.locationLng) {
      toast.error('Please enter latitude and longitude coordinates');
      return;
    }

    const lat = parseFloat(formData.locationLat);
    const lng = parseFloat(formData.locationLng);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error('Please enter valid coordinates (lat: -90 to 90, lng: -180 to 180)');
      return;
    }

    setIsSubmitting(true);

    try {
      const directors = formData.directors
        .split(',')
        .map(d => d.trim())
        .filter(d => d.length > 0);

      const { data: submission, error: submissionError } = await supabase
        .from('film_submissions')
        .insert({
          title: formData.title.trim(),
          year: formData.year ? parseInt(formData.year) : null,
          directors: directors.length > 0 ? directors : null,
          location_name: formData.locationName.trim(),
          location_nation: formData.locationNation.trim(),
          location_lat: lat,
          location_lng: lng,
          synopsis: formData.synopsis.trim(),
          illumination: formData.illumination.trim(),
          available_on: formData.availableOn.trim() || null,
          themes: formData.themes,
          key_issues: formData.keyIssues,
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Insert readings if any
      const validReadings = readings.filter(r => r.title.trim() && r.author.trim());
      if (validReadings.length > 0 && submission) {
        const { error: readingsError } = await supabase
          .from('submission_readings')
          .insert(
            validReadings.map(r => ({
              submission_id: submission.id,
              title: r.title.trim(),
              author: r.author.trim(),
              url: r.url.trim() || null,
            }))
          );
        
        if (readingsError) {
          console.error('Error adding readings:', readingsError);
        }
      }

      toast.success('Film submitted successfully! It will be reviewed by an admin.');
      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Error submitting film:', error);
      if (error.message?.includes('row-level security')) {
        toast.error('Please sign in to submit a film');
      } else {
        toast.error('Failed to submit film. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-orange-200 rounded-lg shadow-xl m-4">
        <div className="sticky top-0 bg-orange-200 border-b border-orange-300 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-purple-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Suggest a Film
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-600">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Film Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter film title"
                  className="bg-white/80"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder="e.g., 2021"
                  className="bg-white/80"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="directors">Director(s)</Label>
              <Input
                id="directors"
                value={formData.directors}
                onChange={(e) => handleInputChange('directors', e.target.value)}
                placeholder="Separate multiple directors with commas"
                className="bg-white/80"
              />
            </div>

            <div>
              <Label htmlFor="availableOn">Where to Watch</Label>
              <Input
                id="availableOn"
                value={formData.availableOn}
                onChange={(e) => handleInputChange('availableOn', e.target.value)}
                placeholder="e.g., Netflix, Hulu, Kanopy"
                className="bg-white/80"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-600">Location & Territory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationName">Location Name *</Label>
                <Input
                  id="locationName"
                  value={formData.locationName}
                  onChange={(e) => handleInputChange('locationName', e.target.value)}
                  placeholder="e.g., Toronto, Ontario"
                  className="bg-white/80"
                />
              </div>
              <div>
                <Label htmlFor="locationNation">Indigenous Nation/Territory *</Label>
                <Input
                  id="locationNation"
                  value={formData.locationNation}
                  onChange={(e) => handleInputChange('locationNation', e.target.value)}
                  placeholder="e.g., Anishinaabe Territory"
                  className="bg-white/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationLat">Latitude *</Label>
                <Input
                  id="locationLat"
                  type="number"
                  step="any"
                  value={formData.locationLat}
                  onChange={(e) => handleInputChange('locationLat', e.target.value)}
                  placeholder="e.g., 43.6532"
                  className="bg-white/80"
                />
              </div>
              <div>
                <Label htmlFor="locationLng">Longitude *</Label>
                <Input
                  id="locationLng"
                  type="number"
                  step="any"
                  value={formData.locationLng}
                  onChange={(e) => handleInputChange('locationLng', e.target.value)}
                  placeholder="e.g., -79.3832"
                  className="bg-white/80"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-600">Description</h3>
            
            <div>
              <Label htmlFor="synopsis">Synopsis *</Label>
              <Textarea
                id="synopsis"
                value={formData.synopsis}
                onChange={(e) => handleInputChange('synopsis', e.target.value)}
                placeholder="Brief description of the film's plot and main characters"
                className="bg-white/80 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="illumination">Illumination/Analysis *</Label>
              <Textarea
                id="illumination"
                value={formData.illumination}
                onChange={(e) => handleInputChange('illumination', e.target.value)}
                placeholder="How does this film relate to Indigenous representation, settler colonialism, decolonization, or other key themes?"
                className="bg-white/80 min-h-[120px]"
              />
            </div>
          </div>

          {/* Themes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-600">Themes</h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_THEMES.map(theme => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => handleThemeToggle(theme)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.themes.includes(theme)
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/80 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Key Issues */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-600">Key Issues</h3>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_KEY_ISSUES.map(issue => (
                <button
                  key={issue}
                  type="button"
                  onClick={() => handleKeyIssueToggle(issue)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.keyIssues.includes(issue)
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/80 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  {issue}
                </button>
              ))}
            </div>
          </div>

          {/* Readings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-purple-600">Recommended Readings</h3>
              <Button type="button" variant="outline" size="sm" onClick={addReading}>
                <Plus className="h-4 w-4 mr-1" /> Add Reading
              </Button>
            </div>
            
            {readings.map((reading, index) => (
              <div key={index} className="bg-white/50 p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-600">Reading {index + 1}</span>
                  {readings.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeReading(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <Input
                  value={reading.title}
                  onChange={(e) => updateReading(index, 'title', e.target.value)}
                  placeholder="Title"
                  className="bg-white/80"
                />
                <Input
                  value={reading.author}
                  onChange={(e) => updateReading(index, 'author', e.target.value)}
                  placeholder="Author"
                  className="bg-white/80"
                />
                <Input
                  value={reading.url}
                  onChange={(e) => updateReading(index, 'url', e.target.value)}
                  placeholder="URL (optional)"
                  className="bg-white/80"
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="sticky bottom-0 bg-orange-200 pt-4 border-t border-orange-300">
            <Button 
              type="submit" 
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Film Suggestion
                </>
              )}
            </Button>
            <p className="text-xs text-purple-600/70 text-center mt-2">
              Submissions will be reviewed by an admin before appearing on the map.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilmSubmissionForm;

import { CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Switch } from '../../ui/Switch';
import { MusicSelector } from '../MusicSelector';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { LandingPageFormData } from '../../../types/landing';
import { Track } from '../../../types/ui';

interface MusicSectionProps {
  register: UseFormRegister<LandingPageFormData>;
  errors: FieldErrors<LandingPageFormData>;
  watch: UseFormWatch<LandingPageFormData>;
  setValue: UseFormSetValue<LandingPageFormData>;
}

export function MusicSection({ register, errors, watch, setValue }: MusicSectionProps) {
  const musicEnabled = watch('music_enabled');
  const selectedTrack = watch('selected_track');

  const track: Track | undefined = selectedTrack ? {
    id: selectedTrack,
    name: selectedTrack,
    artist: ''
  } : undefined;

  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">8</span>
          </div>
          <CardTitle>Música</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Habilitar Música de Fondo
            </label>
            <Switch
              checked={musicEnabled}
              onCheckedChange={(checked) => setValue('music_enabled', checked)}
            />
          </div>

          {musicEnabled && (
            <MusicSelector
              selectedTracks={track ? [track] : []}
              onTracksChange={(tracks) => setValue('selected_track', tracks[0]?.id || '')}
              enabled={musicEnabled}
              onEnabledChange={(enabled) => setValue('music_enabled', enabled)}
            />
          )}
        </div>
      </CardContent>
    </div>
  );
} 
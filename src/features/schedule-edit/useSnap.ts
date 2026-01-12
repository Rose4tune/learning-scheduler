import { useSettings } from '@/app/providers';
import { pixelToTime, timeToPixel } from '@/shared/lib/time';

export const useSnap = () => {
  const { snapEnabled, snapInterval } = useSettings();

  const snapToGrid = (time: string): string => {
    if (!snapEnabled) return time;

    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    const snappedMinutes = Math.round(totalMinutes / snapInterval) * snapInterval;
    const snappedHours = Math.floor(snappedMinutes / 60);
    const snappedMins = snappedMinutes % 60;

    return `${snappedHours.toString().padStart(2, '0')}:${snappedMins.toString().padStart(2, '0')}`;
  };

  const snapPixelToTime = (pixels: number): string => {
    const time = pixelToTime(pixels);
    return snapToGrid(time);
  };

  return {
    snapToGrid,
    snapPixelToTime,
  };
};

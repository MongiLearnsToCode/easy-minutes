import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon as PlayerPauseIcon, TrashIcon } from './Icons';

interface AudioPlayerProps {
  audioURL: string;
  onDelete: () => void;
}

const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) {
        return '00:00';
    }
    const seconds = Math.floor(timeInSeconds % 60);
    const minutes = Math.floor(timeInSeconds / 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioURL, onDelete }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = new Audio(audioURL);
    audioRef.current = audio;

    // Reset state for new audio file
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);

    const handleDurationUpdate = () => {
      if (audioRef.current && isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handlePlaybackEnd = () => {
      setIsPlaying(false);
    };

    // Listen to multiple events to robustly catch the duration.
    // 'durationchange' is the primary event. 'loadeddata' and 'canplay' are fallbacks.
    audio.addEventListener('durationchange', handleDurationUpdate);
    audio.addEventListener('loadeddata', handleDurationUpdate);
    audio.addEventListener('canplay', handleDurationUpdate);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handlePlaybackEnd);

    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('durationchange', handleDurationUpdate);
      audio.removeEventListener('loadeddata', handleDurationUpdate);
      audio.removeEventListener('canplay', handleDurationUpdate);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handlePlaybackEnd);
    };
  }, [audioURL]);

  const togglePlayPause = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // If the audio has finished playing, restart from the beginning.
            if (audioRef.current.ended) {
                audioRef.current.currentTime = 0;
            }
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
        setIsPlaying(!isPlaying);
    }
  };

  const onScrub = (value: string) => {
    if (audioRef.current) {
        const newTime = Number(value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }
  };

  return (
    <div className="bg-slate-200/50 rounded-lg p-3 mt-4 flex items-center gap-4 animate-fade-in">
        <button onClick={togglePlayPause} className="p-2 bg-white rounded-full shadow text-[#FF8A65] hover:bg-slate-100 transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <PlayerPauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
        </button>
        <div className="flex-grow flex items-center gap-2">
            <span className="text-sm font-mono text-slate-600">{formatTime(currentTime)}</span>
            <input
                type="range"
                value={currentTime}
                step="1"
                min="0"
                max={duration || 0}
                className="w-full h-1 bg-slate-300 rounded-full appearance-none cursor-pointer accent-[#FF8A65]"
                onChange={(e) => onScrub(e.target.value)}
                aria-label="Audio progress"
            />
            <span className="text-sm font-mono text-slate-600">{formatTime(duration || 0)}</span>
        </div>
        <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors group relative" aria-label="Delete recording">
            <TrashIcon className="w-5 h-5" />
            <span className="absolute bottom-full mb-2 right-0 whitespace-nowrap bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Delete Recording</span>
        </button>
    </div>
  );
};

export default AudioPlayer;
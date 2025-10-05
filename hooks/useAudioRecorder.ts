
import { useState, useRef, useCallback } from 'react';
import { RecordingState } from '../types';

export const useAudioRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>(RecordingState.IDLE);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  const clearRecording = useCallback(() => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAudioBlob(null);
  }, [audioURL]);

  const startRecording = useCallback(async () => {
    try {
      clearRecording();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm';
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
        // Stop all tracks on the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecordingState(RecordingState.RECORDING);
      
      setRecordingTime(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      // Handle permission denied or other errors
    }
  }, [clearRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState !== RecordingState.IDLE) {
      mediaRecorderRef.current.stop();
      setRecordingState(RecordingState.IDLE);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setRecordingTime(0);
    }
  }, [recordingState]);
  
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === RecordingState.RECORDING) {
      mediaRecorderRef.current.pause();
      setRecordingState(RecordingState.PAUSED);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, [recordingState]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === RecordingState.PAUSED) {
      mediaRecorderRef.current.resume();
      setRecordingState(RecordingState.RECORDING);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    }
  }, [recordingState]);


  return { recordingState, startRecording, stopRecording, pauseRecording, resumeRecording, audioURL, recordingTime, audioBlob, clearRecording };
};
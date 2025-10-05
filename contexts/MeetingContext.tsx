import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs';
import { Meeting, RecordingState } from '../types';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { generateSummary } from '../services/geminiService';


// Type declarations for libraries loaded via script tags
declare global {
  interface Window {
    mammoth: any;
  }
}

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

// Helper functions for parsing document files
const readDocx = async (file: File): Promise<string> => {
  if (!window.mammoth) throw new Error("Document parsing library (mammoth.js) is not loaded.");
  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const readPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let textContent = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    textContent += text.items.map((s: any) => s.str).join(' ');
    textContent += '\n';
  }
  return textContent;
};

const readTxt = (file: File): Promise<string> => {
  return file.text();
};

const extractTextFromFile = async (file: File): Promise<string> => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'docx') return readDocx(file);
    if (extension === 'pdf') return readPdf(file);
    if (extension === 'txt') return readTxt(file);
    throw new Error(`Unsupported document type: .${extension}. Please upload a .txt, .pdf, or .docx file.`);
};

const generateTitleFromFile = (file: File): string => {
    const fileName = file.name;
    const nameWithoutExt = fileName.lastIndexOf('.') > 0 ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
    return nameWithoutExt.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, char => char.toUpperCase());
};

const fileToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

interface MeetingContextState {
    title: string;
    notes: string;
    summary: string;
    uploadedFile: File | null;
    extractedText: string | null;
    isTextAppended: boolean;
    audioBlob: Blob | null;
    audioURL: string | null;
    currentMeetingId: string | null;
    isLoading: boolean;
    error: string | null;
    isUploading: boolean;
    uploadProgress: number;
    saveStatus: string;
    dashboardSaveStatus: string;
    recordingState: RecordingState;
    recordingTime: number;
    startInEditMode: boolean;
    summariesUsed: number;
    freeSummaryLimit: number;
    setStartInEditMode: (value: boolean) => void;
    setTitle: (title: string) => void;
    handleNotesChange: (notes: string) => void;
    onSummaryChange: (summary: string) => void;
    handleGenerate: () => Promise<void>;
    onExport: () => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleCancelUpload: () => void;
    handleShowText: () => void;
    startRecording: () => void;
    stopRecording: () => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
    handleClearRecording: () => void;
    resetMeeting: () => void;
    loadMeeting: (meeting: Meeting, startEditing: boolean) => void;
}

const MeetingContext = createContext<MeetingContextState | undefined>(undefined);

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [title, setTitle] = useState(() => localStorage.getItem('session_title') || '');
    const [notes, setNotes] = useState(() => localStorage.getItem('session_notes') || '');
    const [summary, setSummary] = useState(() => localStorage.getItem('session_summary') || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [isTextAppended, setIsTextAppended] = useState(false);
    const uploadIntervalRef = useRef<number | null>(null);
    
    const [saveStatus, setSaveStatus] = useState<string>('');
    const autosaveTimeoutRef = useRef<number | null>(null);

    const [currentMeetingId, setCurrentMeetingId] = useState<string | null>(() => localStorage.getItem('session_meetingId') || null);
    const [dashboardSaveStatus, setDashboardSaveStatus] = useState('');
    const dashboardSaveTimeoutRef = useRef<number | null>(null);

    const [startInEditMode, setStartInEditMode] = useState(false);

    const [summariesUsed, setSummariesUsed] = useState(() => {
        const storedCount = localStorage.getItem('summariesUsed_count');
        return storedCount ? parseInt(storedCount, 10) : 0;
    });
    const FREE_SUMMARY_LIMIT = 3;

    const { 
        recordingState, 
        startRecording: startRecorder, 
        stopRecording, 
        pauseRecording, 
        resumeRecording, 
        recordingTime,
        audioURL,
        audioBlob,
        clearRecording
    } = useAudioRecorder();

    // Resets the meeting context to a "new" meeting, severing the link to any previously loaded meeting.
    // This prevents accidental overwrites.
    const startNewContext = useCallback(() => {
        setCurrentMeetingId(null);
        setSummary('');
        setDashboardSaveStatus('');
        if (dashboardSaveTimeoutRef.current) clearTimeout(dashboardSaveTimeoutRef.current);
        
        localStorage.removeItem('session_summary');
        localStorage.removeItem('session_meetingId');
    }, []);

    useEffect(() => {
        if (!title && !notes) return; // Don't save empty initial state

        setSaveStatus('Saving...');
        if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);

        autosaveTimeoutRef.current = window.setTimeout(() => {
            localStorage.setItem('session_title', title);
            localStorage.setItem('session_notes', notes);
            const now = new Date();
            setSaveStatus(`Last saved: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
        }, 1500);

        return () => {
            if(autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
        };
    }, [title, notes]);

    useEffect(() => {
        if (!summary.trim() || !title.trim()) return;
        
        setDashboardSaveStatus('Saving...');
        if (dashboardSaveTimeoutRef.current) clearTimeout(dashboardSaveTimeoutRef.current);

        const debounceTimeout = setTimeout(() => {
            localStorage.setItem('session_summary', summary);
            if(currentMeetingId) localStorage.setItem('session_meetingId', currentMeetingId);

            const existingMeetings: Meeting[] = JSON.parse(localStorage.getItem('meetings') || '[]');
            
            const meetingData = {
                title,
                notes,
                summary,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            };
            
            let meetingId = currentMeetingId;
            if (meetingId) {
                const meetingIndex = existingMeetings.findIndex(m => m.id === meetingId);
                if (meetingIndex > -1) {
                    existingMeetings[meetingIndex] = { ...existingMeetings[meetingIndex], ...meetingData };
                } else {
                    meetingId = new Date().toISOString();
                    existingMeetings.unshift({ id: meetingId, ...meetingData });
                    setCurrentMeetingId(meetingId);
                }
                setDashboardSaveStatus('Changes saved');
            } else {
                meetingId = new Date().toISOString();
                existingMeetings.unshift({ id: meetingId, ...meetingData });
                setCurrentMeetingId(meetingId);
                setDashboardSaveStatus('Saved to dashboard');
            }
            localStorage.setItem('meetings', JSON.stringify(existingMeetings));
            
            dashboardSaveTimeoutRef.current = window.setTimeout(() => setDashboardSaveStatus(''), 2500);
        }, 1500);

        return () => clearTimeout(debounceTimeout);
    }, [summary, title, notes, currentMeetingId]);

    const handleGenerate = async () => {
        if (!notes.trim() && !audioBlob && !uploadedFile) return;

        if (summariesUsed >= FREE_SUMMARY_LIMIT) {
            setError("You have reached your free summary limit. Please upgrade for more.");
            return;
        }

        setIsLoading(true);
        setSummary('');
        setError(null);
        try {
            let audioPayload: { data: string, mimeType: string } | undefined = undefined;
            
            if (audioBlob) {
                 audioPayload = { data: await fileToBase64(audioBlob), mimeType: audioBlob.type };
            } else if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
                audioPayload = { data: await fileToBase64(uploadedFile), mimeType: uploadedFile.type };
            }

            let contentForSummary = notes;
            if (extractedText && !isTextAppended && uploadedFile) {
                const fileContentHeader = `--- Content from ${uploadedFile.name} ---\n`;
                const fileContent = fileContentHeader + extractedText;
                contentForSummary = notes.trim() ? `${notes}\n\n${fileContent}` : fileContent;
            }

            const result = await generateSummary({ notes: contentForSummary, audio: audioPayload });
            if (result.startsWith("Error:")) {
                setError(result);
            } else {
                setSummary(result);
                const newCount = summariesUsed + 1;
                setSummariesUsed(newCount);
                localStorage.setItem('summariesUsed_count', newCount.toString());
            }
        } catch (error) {
            console.error("Error generating summary:", error);
            setError("An unexpected error occurred while generating the summary.");
        } finally {
            setIsLoading(false);
        }
    };

    const onExport = () => {
        if (!summary) return;
        const sanitizedTitle = (title.trim() || 'Untitled_Meeting').replace(/[\s/\\?%*:|"<>]/g, '_');
        const filename = `${sanitizedTitle}.md`;
        const blob = new Blob([summary], { type: 'text/markdown;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };
    
    const handleNotesChange = (newNotes: string) => {
        const notesWereCleared = notes.trim().length > 0 && newNotes.trim().length === 0;
        if (notesWereCleared && !uploadedFile && !audioBlob) {
            setTitle('');
            startNewContext();
        }
        setNotes(newNotes);
    };

    const resetFileState = useCallback(() => {
        if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
        setUploadedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        setExtractedText(null);
        setIsTextAppended(false);
    }, []);

    const handleCancelUpload = useCallback(() => {
        startNewContext();
        resetFileState();
        if (!notes.trim() && !audioBlob) {
            setTitle('');
        }
    }, [resetFileState, notes, audioBlob, startNewContext]);

    const handleClearRecording = useCallback(() => {
        startNewContext();
        clearRecording();
        if (!notes.trim() && !uploadedFile) {
            setTitle('');
        }
    }, [clearRecording, notes, uploadedFile, startNewContext]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        startNewContext();
        clearRecording();
        resetFileState();
    
        setTitle(generateTitleFromFile(file));
        setUploadedFile(file);
    
        const isDocument = !file.type.startsWith('audio/');
        setIsUploading(true);
        setUploadProgress(0);
        
        uploadIntervalRef.current = window.setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 10, 100));
        }, 150);

        if (isDocument) {
            try {
                const text = await extractTextFromFile(file);
                setExtractedText(text);
                setIsTextAppended(false);
            } catch (err: any) {
                alert(`Error processing file: ${err.message}`);
                handleCancelUpload();
            } finally {
                if(uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
                setUploadProgress(100);
                setTimeout(() => setIsUploading(false), 300);
            }
        } else {
            // For audio, just simulate completion
            setTimeout(() => {
                if(uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
                setUploadProgress(100);
                setIsUploading(false);
            }, 1500);
        }
    };

    const handleShowText = () => {
        if (!extractedText || !uploadedFile) return;
        setNotes(prev => (prev.trim() ? `${prev}\n\n` : '') + `--- Content from ${uploadedFile.name} ---\n${extractedText}`);
        setIsTextAppended(true);
    };

    const startRecording = () => {
        startNewContext();
        resetFileState();
        if (!notes.trim()) {
            setTitle('');
        }
        startRecorder();
    };

    const resetMeeting = useCallback(() => {
        setTitle('');
        setNotes('');
        setSummary('');
        setIsLoading(false);
        setError(null);
        setUploadedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        setExtractedText(null);
        setIsTextAppended(false);
        setSaveStatus('');
        setCurrentMeetingId(null);
        setDashboardSaveStatus('');
        
        clearRecording();

        localStorage.removeItem('session_title');
        localStorage.removeItem('session_notes');
        localStorage.removeItem('session_summary');
        localStorage.removeItem('session_meetingId');
    }, [clearRecording]);

    const loadMeeting = useCallback((meeting: Meeting, startEditing: boolean) => {
        // This is a partial reset, focused on clearing generator-specific inputs
        setIsLoading(false);
        setError(null);
        clearRecording();
        resetFileState();
        
        // Now load the new meeting data from dashboard
        setTitle(meeting.title);
        setNotes(meeting.notes);
        setSummary(meeting.summary);
        setCurrentMeetingId(meeting.id);
        setStartInEditMode(startEditing);

        // Persist this loaded session to localStorage
        localStorage.setItem('session_title', meeting.title);
        localStorage.setItem('session_notes', meeting.notes);
        localStorage.setItem('session_summary', meeting.summary);
        localStorage.setItem('session_meetingId', meeting.id);
    }, [clearRecording, resetFileState]);

    const value = {
        title, setTitle,
        notes, handleNotesChange,
        summary, onSummaryChange: setSummary,
        isLoading, error,
        uploadedFile, isUploading, uploadProgress, extractedText, isTextAppended,
        audioBlob, audioURL,
        currentMeetingId,
        saveStatus, dashboardSaveStatus,
        recordingState, recordingTime,
        startInEditMode, setStartInEditMode,
        summariesUsed, freeSummaryLimit: FREE_SUMMARY_LIMIT,
        handleGenerate, onExport,
        handleFileChange, handleCancelUpload, handleShowText,
        startRecording, stopRecording, pauseRecording, resumeRecording, handleClearRecording,
        resetMeeting, loadMeeting,
    };

    return <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>;
};

export const useMeeting = () => {
    const context = useContext(MeetingContext);
    if (context === undefined) {
        throw new Error('useMeeting must be used within a MeetingProvider');
    }
    return context;
};
import React, { useState, useRef, useEffect } from 'react';
import * as marked from 'marked';
import TurndownService from 'turndown';
import { Link } from 'react-router-dom';
import { RecordingState } from '../types';
import ActionButton from '../components/ActionButton';
import { MicIcon, StopIcon, GenerateIcon, LoadingSpinner, UploadIcon, PauseIcon, AlertTriangleIcon, ExportIcon } from '../components/Icons';
import MarkdownRenderer from '../components/MarkdownRenderer';
import AudioPlayer from '../components/AudioPlayer';
import FileUploadStatus from '../components/FileUploadStatus';
import { useMeeting } from '../contexts/MeetingContext';
import RichTextToolbar from '../components/RichTextToolbar';


const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-white rounded-2xl shadow-lg shadow-slate-200/80 p-4 sm:p-6 lg:p-8 h-full flex flex-col ${className}`}>
        {children}
    </div>
);

const NotesInput: React.FC<{ notes: string; onNotesChange: (notes: string) => void; title: string; onTitleChange: (title: string) => void; children?: React.ReactNode; placeholder?: string; saveStatus: string; }> = ({ notes, onNotesChange, title, onTitleChange, children, placeholder, saveStatus }) => {
    return (
        <Card>
            <input
                type="text"
                placeholder="Untitled Meeting"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="text-xl sm:text-2xl font-bold text-slate-800 placeholder-slate-300 w-full bg-transparent border-none focus:outline-none focus:ring-0 mb-3 sm:mb-4"
            />
            {children}
            <div className="bg-slate-50 rounded-lg flex-grow flex flex-col">
                <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder={placeholder ?? "Start typing your meeting notes here, or record/upload audio to be summarized."}
                    className="w-full p-3 text-base bg-transparent text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-0 flex-grow rounded-lg"
                />
                 <div className="text-right px-3 pb-1 h-5 flex items-center justify-end">
                    {saveStatus && (
                        <span className="text-xs text-slate-400 italic transition-opacity duration-300">
                            {saveStatus}
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
};

const SummaryDisplay: React.FC = () => {
    const { summary, isLoading, onSummaryChange, error, onExport, dashboardSaveStatus, startInEditMode, setStartInEditMode } = useMeeting();
    const [isEditing, setIsEditing] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const turndownServiceRef = useRef(new TurndownService());
    const debounceTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (startInEditMode) {
            setIsEditing(true);
            setStartInEditMode(false); // Consume the flag
        }
    }, [startInEditMode, setStartInEditMode]);

    useEffect(() => {
        const editor = editorRef.current;
        if (isEditing && editor) {
            const handleInput = () => {
                if (debounceTimeoutRef.current) {
                    clearTimeout(debounceTimeoutRef.current);
                }
                debounceTimeoutRef.current = window.setTimeout(() => {
                    const htmlContent = editor.innerHTML;
                    const markdownContent = turndownServiceRef.current.turndown(htmlContent);
                    onSummaryChange(markdownContent);
                }, 1500);
            };

            editor.addEventListener('input', handleInput);

            return () => {
                editor.removeEventListener('input', handleInput);
                if (debounceTimeoutRef.current) {
                    clearTimeout(debounceTimeoutRef.current);
                }
            };
        }
    }, [isEditing, onSummaryChange]);

    const handleToggleEdit = () => {
        if (isEditing) { // Switching from edit to view
             if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            if (editorRef.current) {
                const htmlContent = editorRef.current.innerHTML;
                const markdownContent = turndownServiceRef.current.turndown(htmlContent);
                onSummaryChange(markdownContent);
            }
        }
        setIsEditing(!isEditing);
    };

    return (
        <Card className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 sm:gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Generated Minutes</h2>
                     {dashboardSaveStatus && (
                        <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-md animate-fade-in">
                            {dashboardSaveStatus}
                        </span>
                    )}
                </div>

                {summary && !isLoading && !error && (
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button onClick={onExport} className="text-xs sm:text-sm font-semibold text-[#FF8A65] hover:underline focus:outline-none flex items-center gap-1.5">
                            <ExportIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            <span>Export</span>
                        </button>
                        <button onClick={handleToggleEdit} className="text-xs sm:text-sm font-semibold text-[#FF8A65] hover:underline focus:outline-none">
                            {isEditing ? 'View' : 'Edit'}
                        </button>
                    </div>
                )}
            </div>
            <div className="flex-grow w-full bg-slate-50 rounded-lg relative min-h-0">
                <div className="absolute inset-0 overflow-y-auto">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-red-500 p-4">
                            <AlertTriangleIcon className="w-16 h-16 mb-4 text-red-400" />
                            <p className="text-lg font-bold text-red-700">Generation Failed</p>
                            <p className="text-sm mt-1">{error.replace('Error: ', '')}</p>
                        </div>
                    ) : isLoading ? (
                        <div className="space-y-4 animate-pulse p-4">
                            <div className="h-4 bg-slate-300 rounded w-1/4"></div>
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-300 rounded w-1/3 mt-6"></div>
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                        </div>
                    ) : !summary && !isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-4">
                             <GenerateIcon className="w-16 h-16 mb-4 text-slate-300" />
                            <p className="text-lg font-medium text-slate-500">Your meeting summary will appear here.</p>
                            <p className="text-sm">Type notes or upload content, then click "Generate Minutes".</p>
                        </div>
                    ) : isEditing ? (
                        <div className="flex flex-col h-full">
                            <RichTextToolbar editorRef={editorRef} />
                            <div
                                ref={editorRef}
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                                className="w-full p-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FF8A65] rounded-b-lg prose prose-slate max-w-none flex-grow"
                                dangerouslySetInnerHTML={{ __html: marked.parse(summary) as string }}
                            />
                        </div>
                    ) : (
                        <div className="p-4">
                            <MarkdownRenderer content={summary} />
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};


const MainPage: React.FC = () => {
    const {
        title,
        notes,
        summary,
        isLoading,
        error,
        uploadedFile,
        isUploading,
        uploadProgress,
        isTextAppended,
        audioBlob,
        audioURL,
        saveStatus,
        dashboardSaveStatus,
        recordingState,
        recordingTime,
        summariesUsed,
        freeSummaryLimit,
        setTitle,
        onSummaryChange,
        handleNotesChange,
        handleGenerate,
        onExport,
        handleFileChange,
        handleCancelUpload,
        handleShowText,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        handleClearRecording,
        resetMeeting,
    } = useMeeting();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasAudioOrFile = !!audioURL || !!uploadedFile;
    const isRecordingActive = recordingState === RecordingState.RECORDING || recordingState === RecordingState.PAUSED;
    const hasContent = !!notes.trim() || !!audioBlob || !!uploadedFile;
    const summariesLeft = Math.max(0, freeSummaryLimit - summariesUsed);
    
    const notesPlaceholder = hasAudioOrFile
        ? "Optionally add context for the AI, like speaker names or key terms..."
        : "Start typing your meeting notes here, or record/upload audio to be summarized.";

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
        const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="h-full flex flex-col px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex-grow flex flex-col lg:flex-row gap-4 sm:gap-6">
                <div className="w-full lg:w-5/12 min-h-0 flex-shrink-0">
                    <NotesInput
                        notes={notes}
                        onNotesChange={handleNotesChange}
                        title={title}
                        onTitleChange={setTitle}
                        placeholder={notesPlaceholder}
                        saveStatus={saveStatus}
                    >
                        {audioURL && (
                            <AudioPlayer audioURL={audioURL} onDelete={handleClearRecording} />
                        )}
                        {uploadedFile && (
                            <FileUploadStatus
                                fileName={uploadedFile.name}
                                progress={uploadProgress}
                                isUploading={isUploading}
                                onCancel={handleCancelUpload}
                                isDocument={!uploadedFile.type.startsWith('audio/')}
                                isTextAppended={isTextAppended}
                                onShowText={handleShowText}
                            />
                        )}
                    </NotesInput>
                </div>
                <div className="w-full lg:w-7/12 flex-shrink-0">
                    <SummaryDisplay />
                </div>
            </div>

            <footer className="flex-shrink-0 mt-4">
                <div className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg shadow-slate-200/80 p-3 sm:p-4 max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 transition-colors duration-300 ${isRecordingActive ? 'bg-red-50/80' : ''}`}>
                    <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
                        <button onClick={resetMeeting} className="flex items-center gap-1.5 sm:gap-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full px-3 sm:px-4 py-2 transition-all duration-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                            <span>New Meeting</span>
                        </button>
                        <div className="h-6 border-l border-slate-300"></div>
                         {recordingState === RecordingState.IDLE ? (
                            <>
                                <button onClick={startRecording} className="flex items-center gap-1.5 sm:gap-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full px-3 sm:px-4 py-2 transition-all duration-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                    <MicIcon className="w-4 h-4" />
                                    <span>Record</span>
                                </button>
                                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 sm:gap-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full px-3 sm:px-4 py-2 transition-all duration-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                    <UploadIcon className="w-4 h-4" />
                                    <span>Upload</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="audio/*,application/pdf,text/plain,.docx"
                                />
                            </>
                        ) : (
                            <>
                                <button onClick={stopRecording} className="flex items-center gap-1.5 sm:gap-2 text-white bg-red-500 hover:bg-red-600 rounded-full px-3 sm:px-4 py-2 transition-all duration-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                    <StopIcon className="w-4 h-4" />
                                    <span>Stop</span>
                                </button>
                                {recordingState === RecordingState.RECORDING ? (
                                    <button onClick={pauseRecording} className="flex items-center gap-1.5 sm:gap-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full px-3 sm:px-4 py-2 transition-all duration-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                        <PauseIcon className="w-4 h-4" />
                                        <span>Pause</span>
                                    </button>
                                ) : (
                                    <button onClick={resumeRecording} className="flex items-center gap-1.5 sm:gap-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full px-3 sm:px-4 py-2 transition-all duration-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                                        <MicIcon className="w-4 h-4" />
                                        <span>Resume</span>
                                    </button>
                                )}
                                <div className="flex items-center gap-2">
                                     <div className={`w-3 h-3 bg-red-500 rounded-full ${recordingState === RecordingState.RECORDING ? 'animate-pulse' : ''}`}></div>
                                     <span className="font-mono text-sm text-slate-700 w-12 text-center">{formatTime(recordingTime)}</span>
                                </div>
                            </>
                        )}
                        <div className="hidden lg:block border-l border-slate-200 pl-4 ml-2">
                            <p className="text-xs text-slate-500">Summaries left: <span className="font-semibold text-slate-800">{summariesLeft}/{freeSummaryLimit}</span></p>
                            <Link to="/pricing" className="text-xs text-[#FF8A65] hover:underline font-semibold">Upgrade Plan</Link>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                        <div className="lg:hidden text-center sm:text-left">
                            <p className="text-xs text-slate-500">Summaries: <span className="font-semibold text-slate-800">{summariesLeft}/{freeSummaryLimit}</span> • <Link to="/pricing" className=\"text-[#FF8A65] hover:underline font-semibold">Upgrade</Link></p>
                        </div>
                        <ActionButton onClick={handleGenerate} disabled={isLoading || !hasContent || summariesLeft <= 0} icon={isLoading ? <LoadingSpinner className="w-5 h-5" /> : <GenerateIcon className="w-5 h-5" />}>
                            <span className="hidden sm:inline">{isLoading ? 'Generating' : 'Generate Minutes'}</span>
                            <span className="sm:hidden">{isLoading ? 'Generating' : 'Generate'}</span>
                        </ActionButton>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainPage;
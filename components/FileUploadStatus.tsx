import React from 'react';
import { FileIcon, CloseIcon, CheckCircleIcon } from './Icons';

interface FileUploadStatusProps {
  fileName: string;
  progress: number;
  isUploading: boolean;
  onCancel: () => void;
  isDocument: boolean;
  isTextAppended: boolean;
  onShowText: () => void;
}

const FileUploadStatus: React.FC<FileUploadStatusProps> = ({ fileName, progress, isUploading, onCancel, isDocument, isTextAppended, onShowText }) => {
  const isComplete = progress === 100 && !isUploading;

  return (
    <div className="bg-slate-200/50 rounded-lg p-3 mt-4 flex items-center gap-4 animate-fade-in">
      <div className={`p-2 bg-white rounded-full shadow ${!isComplete ? 'text-slate-600' : 'text-green-500'}`}>
        {!isComplete ? <FileIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-slate-700 truncate" title={fileName}>{fileName}</span>
          {isUploading && <span className="text-sm font-mono text-slate-600">{Math.round(progress)}%</span>}
        </div>
        {isUploading ? (
            <div className="w-full bg-slate-300 rounded-full h-1.5">
                <div
                    className="bg-[#FF8A65] h-1.5 rounded-full transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        ) : (
            isDocument ? (
                isTextAppended ? (
                    <p className="text-xs text-green-600 font-medium">Content added to notes below.</p>
                ) : (
                    <button 
                        onClick={onShowText} 
                        className="text-xs font-semibold text-[#FF8A65] hover:underline focus:outline-none"
                    >
                        View & Edit Content
                    </button>
                )
            ) : (
                <p className="text-xs text-green-600 font-medium">Ready to summarize</p>
            )
        )}
      </div>
      <button onClick={onCancel} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors group relative">
        <CloseIcon className="w-5 h-5" />
        <span className="absolute bottom-full mb-2 right-0 whitespace-nowrap bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Remove File</span>
      </button>
    </div>
  );
};

export default FileUploadStatus;
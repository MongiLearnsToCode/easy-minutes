import React, { useEffect } from 'react';
import { Meeting } from '../types';
import { CloseIcon, EditIcon, TrashIcon } from './Icons';

interface DayMeetingsModalProps {
    date: Date;
    meetings: Meeting[];
    onClose: () => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const MeetingItem: React.FC<{ meeting: Meeting; onView: () => void; onEdit: () => void; onDelete: () => void; }> = ({ meeting, onView, onEdit, onDelete }) => (
     <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between items-center transition-shadow hover:shadow-md">
        <div>
            <h4 className="font-bold text-slate-800 cursor-pointer hover:text-[#FF8A65]" onClick={onView}>{meeting.title}</h4>
            <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                {meeting.summary ? 
                    meeting.summary.replace(/###\s(Key Points|Decisions Made|Action Items)/g, '').replace(/- /g, '').trim().substring(0, 120) + '...'
                    : meeting.notes.substring(0, 120) + '...'
                }
            </p>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0 ml-4">
            <button 
                onClick={onEdit} 
                className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors group relative"
                aria-label="Edit Meeting"
            >
                <EditIcon className="w-4 h-4"/>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Edit</span>
            </button>
            <button 
                onClick={onDelete} 
                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors group relative"
                aria-label="Delete Meeting"
            >
                <TrashIcon className="w-4 h-4"/>
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Delete</span>
            </button>
        </div>
    </div>
);


const DayMeetingsModal: React.FC<DayMeetingsModalProps> = ({ date, meetings, onClose, onView, onEdit, onDelete }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
                style={{ height: 'auto', maxHeight: '80vh' }}
            >
                <div className="flex-shrink-0 p-8 pb-4 flex justify-between items-center border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Meetings on {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close modal">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 pt-4">
                    {meetings.length > 0 ? (
                        <div className="space-y-4">
                            {meetings.map(meeting => (
                                <MeetingItem
                                    key={meeting.id}
                                    meeting={meeting}
                                    onView={() => onView(meeting.id)}
                                    onEdit={() => onEdit(meeting.id)}
                                    onDelete={() => onDelete(meeting.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-8">No meetings scheduled for this day.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DayMeetingsModal;

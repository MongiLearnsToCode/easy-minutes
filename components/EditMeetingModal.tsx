import React, { useState, useEffect } from 'react';
import { Meeting } from '../types';
import ActionButton from './ActionButton';
import { CloseIcon } from './Icons';

interface EditMeetingModalProps {
  meeting: Meeting;
  onSave: (updatedMeeting: Meeting) => void;
  onClose: () => void;
}

const EditMeetingModal: React.FC<EditMeetingModalProps> = ({ meeting, onSave, onClose }) => {
  const [title, setTitle] = useState(meeting.title);
  const [notes, setNotes] = useState(meeting.notes);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSave = () => {
    onSave({ ...meeting, title, notes });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Edit Meeting</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label htmlFor="meeting-title" className="text-sm font-semibold text-slate-600 mb-2 block">Title</label>
          <input
            id="meeting-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A65]"
          />
        </div>

        <div className="flex-grow flex flex-col">
          <label htmlFor="meeting-notes" className="text-sm font-semibold text-slate-600 mb-2 block">Notes</label>
          <textarea
            id="meeting-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-64 p-3 bg-slate-50 border border-slate-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-[#FF8A65]"
          />
        </div>

        <div className="flex justify-end items-center gap-4">
          <ActionButton variant="secondary" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton onClick={handleSave}>
            Save Changes
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default EditMeetingModal;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meeting } from '../types';
import { useMeeting } from '../contexts/MeetingContext';
import { ListIcon, CalendarIcon, TrashIcon, EditIcon, GridIcon, SearchIcon } from '../components/Icons';
import ConfirmationModal from '../components/ConfirmationModal';
import CalendarView from '../components/CalendarView';

const MeetingCard: React.FC<{ meeting: Meeting; onDelete: (id: string) => void; onView: (id: string) => void; onEdit: (id: string) => void; }> = ({ meeting, onDelete, onView, onEdit }) => (
    <div 
        className="bg-white rounded-2xl shadow-lg shadow-slate-200/80 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        onClick={() => onView(meeting.id)}
    >
        <div>
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-800">{meeting.title}</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600 line-clamp-3">
                {meeting.summary ? 
                    meeting.summary.replace(/###\s(Key Points|Decisions Made|Action Items)/g, '').replace(/- /g, '').trim().substring(0, 150) + '...'
                    : meeting.notes.substring(0, 150) + '...'
                }
            </p>
        </div>
        <div className="mt-6 flex justify-between items-center">
             <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5"/>
                {meeting.date}
            </span>
            <div className="flex items-center space-x-1">
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(meeting.id); }} 
                    className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors group relative"
                >
                    <EditIcon className="w-4 h-4"/>
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Edit</span>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(meeting.id); }} 
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors group relative"
                >
                    <TrashIcon className="w-4 h-4"/>
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Delete</span>
                </button>
            </div>
        </div>
    </div>
);

const MeetingListItem: React.FC<{ meeting: Meeting; onDelete: (id: string) => void; onView: (id: string) => void; onEdit: (id: string) => void; }> = ({ meeting, onDelete, onView, onEdit }) => (
    <div 
        className="bg-white rounded-2xl shadow-lg shadow-slate-200/80 p-4 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:border-slate-300 border border-transparent"
    >
        <div className="flex items-center gap-4 flex-grow cursor-pointer min-w-0" onClick={() => onView(meeting.id)}>
            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-slate-100 rounded-lg p-2 w-20 text-center">
                 <span className="text-xs text-slate-500 font-semibold uppercase">{new Date(meeting.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="text-2xl font-bold text-slate-800">{new Date(meeting.date).getDate()}</span>
            </div>
            <div className="flex-grow min-w-0">
                <h3 className="text-lg font-bold text-slate-800 hover:text-[#FF8A65] transition-colors truncate">{meeting.title}</h3>
                <p className="mt-1 text-sm text-slate-600 line-clamp-1">
                    {meeting.summary ? 
                        meeting.summary.replace(/###\s(Key Points|Decisions Made|Action Items)/g, '').replace(/- /g, '').trim()
                        : meeting.notes
                    }
                </p>
            </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0 ml-4">
            <button 
                onClick={(e) => { e.stopPropagation(); onEdit(meeting.id); }} 
                className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors group relative"
            >
                <EditIcon className="w-4 h-4"/>
                <span className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Edit</span>
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(meeting.id); }} 
                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors group relative"
            >
                <TrashIcon className="w-4 h-4"/>
                <span className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Delete</span>
            </button>
        </div>
    </div>
);


const DashboardPage: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>('grid');
    const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { loadMeeting } = useMeeting();

    useEffect(() => {
        const storedMeetings = JSON.parse(localStorage.getItem('meetings') || '[]');
        const sortedMeetings = storedMeetings.sort((a: Meeting, b: Meeting) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setMeetings(sortedMeetings);
    }, []);

    const filteredMeetings = useMemo(() => {
        if (!searchQuery.trim()) {
            return meetings;
        }
        const lowercasedQuery = searchQuery.toLowerCase().trim();
        return meetings.filter(meeting => 
            meeting.title.toLowerCase().includes(lowercasedQuery) ||
            meeting.notes.toLowerCase().includes(lowercasedQuery) ||
            meeting.summary.toLowerCase().includes(lowercasedQuery)
        );
    }, [meetings, searchQuery]);

    const handleRequestDelete = (id: string) => {
        setMeetingToDelete(id);
    };

    const handleConfirmDelete = useCallback(() => {
        if (!meetingToDelete) return;
        
        const updatedMeetings = meetings.filter(m => m.id !== meetingToDelete);
        setMeetings(updatedMeetings);
        localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
        setMeetingToDelete(null);
    }, [meetings, meetingToDelete]);

    const handleCancelDelete = () => {
        setMeetingToDelete(null);
    };

    const handleViewMeeting = (id: string) => {
        const meeting = meetings.find(m => m.id === id);
        if (meeting) {
            loadMeeting(meeting, false);
            navigate('/');
        }
    };
    
    const handleEditMeeting = (id: string) => {
        const meeting = meetings.find(m => m.id === id);
        if (meeting) {
            loadMeeting(meeting, true);
            navigate('/');
        }
    };

    return (
        <div className="container mx-auto p-6 h-full flex flex-col">
            <header className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-8 flex-shrink-0">
                <h2 className="text-3xl font-bold text-slate-800 flex-shrink-0">Your Meetings</h2>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full flex-grow">
                    <div className="relative w-full flex-grow">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search meetings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-slate-200 rounded-full w-full pl-11 pr-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#FF8A65] transition-all"
                        />
                    </div>
                    <div className="flex items-center self-end md:self-center space-x-1 bg-slate-200 p-1 rounded-full flex-shrink-0">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
                            <ListIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
                            <GridIcon className="w-5 h-5" />
                        </button>
                         <button onClick={() => setViewMode('calendar')} className={`p-2 rounded-full transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
                            <CalendarIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>
            
            <div className="flex-grow min-h-0 overflow-y-auto">
                {filteredMeetings.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMeetings.map(meeting => (
                                <MeetingCard key={meeting.id} meeting={meeting} onDelete={handleRequestDelete} onView={handleViewMeeting} onEdit={handleEditMeeting} />
                            ))}
                        </div>
                    ) : viewMode === 'list' ? (
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {filteredMeetings.map(meeting => (
                               <MeetingListItem key={meeting.id} meeting={meeting} onDelete={handleRequestDelete} onView={handleViewMeeting} onEdit={handleEditMeeting} />
                            ))}
                        </div>
                    ) : (
                        <CalendarView
                            meetings={filteredMeetings}
                            onView={handleViewMeeting}
                            onEdit={handleEditMeeting}
                            onDelete={handleRequestDelete}
                        />
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 bg-white rounded-2xl shadow-lg shadow-slate-200/80">
                        {searchQuery ? (
                             <>
                                <SearchIcon className="w-20 h-20 mb-4 text-slate-300" />
                                <h3 className="text-2xl font-bold text-slate-700">No Results Found</h3>
                                <p className="mt-2 text-base">Try adjusting your search terms to find your meeting.</p>
                            </>
                        ) : (
                            <>
                                <ListIcon className="w-20 h-20 mb-4 text-slate-300" />
                                <h3 className="text-2xl font-bold text-slate-700">No Meetings Found</h3>
                                <p className="mt-2 text-base">Create your first meeting summary on the Generator page.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
            
            <ConfirmationModal 
                isOpen={!!meetingToDelete}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Meeting"
                message="Are you sure you want to delete this meeting summary? This action cannot be undone."
            />
        </div>
    );
};

export default DashboardPage;
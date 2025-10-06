import React, { useState, useMemo } from 'react';
import { Meeting } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import DayMeetingsModal from './DayMeetingsModal';

// Helper functions for date manipulation
const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const toISODateString = (date: Date) => date.toISOString().split('T')[0];


const CalendarView: React.FC<{ meetings: Meeting[]; onView: (id: string) => void; onEdit: (id: string) => void; onDelete: (id: string) => void; }> = ({ meetings, onView, onEdit, onDelete }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalDate, setModalDate] = useState<Date | null>(null);

    const meetingsByDate = useMemo(() => {
        const map = new Map<string, Meeting[]>();
        meetings.forEach(meeting => {
            const date = new Date(meeting.date);
            const key = toISODateString(date);
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)!.push(meeting);
        });
        return map;
    }, [meetings]);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startingDay = new Date(firstDayOfMonth);
    startingDay.setDate(startingDay.getDate() - startingDay.getDay());

    const calendarDays = useMemo(() => {
        const days = [];
        let day = new Date(startingDay);
        for (let i = 0; i < 42; i++) {
            days.push(new Date(day));
            day.setDate(day.getDate() + 1);
        }
        return days;
    }, [startingDay]);

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };
    
    const handleOpenModal = (day: Date, dayMeetings: Meeting[]) => {
        if (dayMeetings.length > 0) {
            setModalDate(day);
        }
    };

    const handleCloseModal = () => {
        setModalDate(null);
    };

    const today = new Date();

    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/80 p-4 sm:p-6 flex flex-col animate-fade-in">
            <header className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <div className="flex items-center space-x-1">
                    <button onClick={() => changeMonth(-1)} className="p-1.5 sm:p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeftIcon className="w-4 sm:w-5 h-4 sm:h-5"/></button>
                    <button onClick={() => changeMonth(1)} className="p-1.5 sm:p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"><ChevronRightIcon className="w-4 sm:w-5 h-4 sm:h-5"/></button>
                </div>
            </header>

            <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-semibold text-slate-500 border-b border-slate-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-1.5 sm:py-2">{day}</div>)}
            </div>

            <div className="grid grid-cols-7 grid-rows-6 border-l border-t border-slate-200">
                {calendarDays.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = isSameDay(day, today);
                    const dayMeetings = meetingsByDate.get(toISODateString(day)) || [];
                    const MAX_VISIBLE_MEETINGS = 2;

                    const cellClasses = `
                        border-r border-b border-slate-200 p-1 sm:p-2 flex flex-col h-20 sm:h-28 overflow-hidden relative transition-colors duration-200
                        ${isCurrentMonth ? 'bg-white' : 'bg-slate-50'}
                        ${dayMeetings.length > 0 && isCurrentMonth ? 'cursor-pointer hover:bg-slate-100' : ''}
                    `;
                    
                    const dayNumberClasses = `
                        flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs sm:text-sm font-medium
                        ${isCurrentMonth ? 'text-slate-600' : 'text-slate-400'}
                        ${isToday ? 'bg-[#FF8A65] text-white' : ''}
                    `;

                    return (
                        <div key={index} className={cellClasses} onClick={() => handleOpenModal(day, dayMeetings)}>
                            <div className="flex justify-end items-center">
                                {isCurrentMonth && dayMeetings.length > 0 && !isToday && (
                                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-1"></div>
                                )}
                                <span className={dayNumberClasses}>{day.getDate()}</span>
                            </div>
                            {isCurrentMonth && (
                                <div className="flex-grow mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1 overflow-y-auto -mr-1 sm:-mr-2 pr-1 sm:pr-2">
                                    {dayMeetings.slice(0, MAX_VISIBLE_MEETINGS).map(meeting => (
                                        <div key={meeting.id} className="group relative">
                                            <div
                                                onClick={(e) => { e.stopPropagation(); onView(meeting.id); }}
                                                className="w-full text-left text-[10px] sm:text-xs bg-orange-100 text-orange-800 font-semibold rounded px-1 sm:px-2 py-0.5 sm:py-1 truncate cursor-pointer hover:bg-orange-200 hover:text-orange-900"
                                                title={meeting.title}
                                            >
                                                {meeting.title}
                                            </div>
                                            <div className="hidden sm:block absolute bottom-full mb-1 w-max max-w-xs left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                {meeting.title}
                                            </div>
                                        </div>
                                    ))}
                                    {dayMeetings.length > MAX_VISIBLE_MEETINGS && (
                                        <div className="text-[10px] sm:text-xs text-blue-600 font-bold pt-0.5 sm:pt-1 cursor-pointer hover:underline">
                                            + {dayMeetings.length - MAX_VISIBLE_MEETINGS} more
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {modalDate && (
                <DayMeetingsModal
                    date={modalDate}
                    meetings={meetingsByDate.get(toISODateString(modalDate)) || []}
                    onClose={handleCloseModal}
                    onView={(id) => { onView(id); handleCloseModal(); }}
                    onEdit={(id) => { onEdit(id); handleCloseModal(); }}
                    onDelete={(id) => { onDelete(id); handleCloseModal(); }}
                />
            )}
        </div>
    );
};

export default CalendarView;
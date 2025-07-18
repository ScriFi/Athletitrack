import React, { useState } from 'react';
import { Event } from '../types';

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onDrop: (buildingId: string, date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthView: React.FC<MonthViewProps> = ({ currentDate, events, onDayClick, onEventClick, onDrop }) => {
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, day: number) => {
    e.preventDefault();
    setDragOverDay(day);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, date: Date) => {
    e.preventDefault();
    setDragOverDay(null);
    try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (data.buildingId) {
            onDrop(data.buildingId, date);
        }
    } catch(err) {
        console.error("Failed to parse drop data", err);
    }
  };

  const days = [];
  // Add blank days for the start of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-start-${i}`} className="border-r border-b border-gray-200"></div>);
  }

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const today = new Date();

  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEvents = events.filter(e => isSameDay(e.start, date)).sort((a,b) => a.start.getTime() - b.start.getTime());
    const isDraggingOver = dragOverDay === day;

    days.push(
      <div 
        key={day} 
        className={`border-r border-b border-gray-200 p-2 flex flex-col min-h-[120px] relative transition-colors duration-150 ${isDraggingOver ? 'bg-brand-accent/20' : 'hover:bg-gray-50'}`}
        onClick={() => onDayClick(date)}
        onDragOver={(e) => handleDragOver(e, day)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, date)}
      >
        <span className={`text-sm font-medium ${isSameDay(date, today) ? 'bg-brand-primary text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-700'}`}>{day}</span>
        <div className="mt-1.5 space-y-1 overflow-y-auto">
          {dayEvents.slice(0, 3).map(event => (
            <div 
              key={event.id} 
              onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
              className={`${event.color} p-1 rounded-md text-xs border cursor-pointer hover:shadow-md transition-shadow`}
            >
              <p className="font-bold truncate">{event.title}</p>
              <p className="truncate opacity-80">{event.team}</p>
            </div>
          ))}
          {dayEvents.length > 3 && <p className="text-xs text-gray-500 mt-1">+{dayEvents.length - 3} more</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-b border-gray-200">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-3">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5">
        {days}
      </div>
    </div>
  );
};
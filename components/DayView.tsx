import React, { useState } from 'react';
import { Event } from '../types';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onDropOnTimeSlot: (buildingId: string, date: Date) => void;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

export const DayView: React.FC<DayViewProps> = ({ currentDate, events, onEventClick, onDropOnTimeSlot }) => {
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, slotId: string) => {
    e.preventDefault();
    setDragOverSlot(slotId);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, date: Date) => {
    e.preventDefault();
    setDragOverSlot(null);
    try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (data.buildingId) {
            onDropOnTimeSlot(data.buildingId, date);
        }
    } catch(err) {
        console.error("Failed to parse drop data", err);
    }
  };
  
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const dayEvents = events.filter(event => isSameDay(event.start, currentDate));

  return (
    <div className="flex-grow flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-[auto,1fr]">
          <div className="w-16">
            {HOURS.map(hour => (
              <div key={hour} className="h-20 flex items-start justify-center pt-1 border-r border-gray-200">
                <span className="text-xs text-gray-500">{hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'am' : 'pm'}</span>
              </div>
            ))}
          </div>
          <div className="relative">
            {HOURS.map(hour => {
               const slotDate = new Date(currentDate);
               slotDate.setHours(hour, 0, 0, 0);
               const slotId = `day-${hour}`;
               const isDraggingOver = dragOverSlot === slotId;
               return (
                  <div
                    key={hour}
                    className={`h-20 border-b border-gray-200 ${isDraggingOver ? 'bg-brand-accent/20' : ''}`}
                    onDragOver={(e) => handleDragOver(e, slotId)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, slotDate)}
                  ></div>
               )
            })}
            {dayEvents.map(event => {
                const startHour = event.start.getHours() + event.start.getMinutes() / 60;
                const endHour = event.end.getHours() + event.end.getMinutes() / 60;
                const duration = endHour - startHour;

                const top = (startHour - 6) * 5; // 5rem (h-20) per hour
                const height = duration * 5;
                
                if (top < 0) return null;

                return (
                    <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`${event.color} absolute left-2 right-2 rounded-lg p-2 text-xs border cursor-pointer hover:shadow-lg transition-all duration-200 ease-in-out z-10 flex flex-col overflow-hidden`}
                        style={{ top: `${top}rem`, height: `${height}rem`, minHeight: '2.5rem' }}
                    >
                        <p className="font-bold truncate">{event.title}</p>
                        <p className="truncate opacity-80">{event.team}</p>
                        <p className="truncate opacity-60">{event.coach}</p>
                    </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
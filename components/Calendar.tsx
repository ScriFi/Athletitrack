
import React, { useRef, useEffect } from 'react';
import { Event, CalendarView, Team } from '../types';

interface CalendarProps {
  currentDate: Date;
  events: Event[];
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  view: CalendarView;
  teams: Team[];
  onTeamDrop: (teamId: string, date: Date) => void;
  onFacilityDrop: (facilityId: string, date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date();

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const MonthView: React.FC<Omit<CalendarProps, 'view'>> = ({ currentDate, events, onTimeSlotClick, onEventClick, teams, onTeamDrop, onFacilityDrop }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const teamId = e.dataTransfer.getData('application/athletica-track-team');
    const facilityId = e.dataTransfer.getData('application/athletica-track-facility');
    if (teamId) {
      onTeamDrop(teamId, date);
    } else if (facilityId) {
      onFacilityDrop(facilityId, date);
    }
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-start-${i}`} className="border-r border-b border-gray-200"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEvents = events.filter(e => isSameDay(e.start, date)).sort((a,b) => a.start.getTime() - b.start.getTime());

    days.push(
      <div 
        key={day} 
        className="border-r border-b border-gray-200 p-2 flex flex-col min-h-[120px] relative hover:bg-gray-50/70 transition-colors duration-200 cursor-pointer group droppable-cell"
        onClick={() => onTimeSlotClick(date)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, date)}
      >
        <span className={`text-sm font-medium self-start ${isSameDay(date, today) ? 'bg-brand-primary text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-700'}`}>{day}</span>
        <div className="mt-1.5 space-y-1 overflow-y-auto">
          {dayEvents.slice(0, 3).map(event => {
            const team = teams.find(t => t.id === event.teamId);
            return (
              <div key={event.id} onClick={(e) => { e.stopPropagation(); onEventClick(event); }} className={`px-2 py-1 text-xs rounded border cursor-pointer hover:opacity-80 ${team?.color || 'bg-gray-200 text-gray-800 border-gray-300'}`}>
                <p className="font-semibold truncate">{event.title}</p>
                <p className="truncate">{event.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
              </div>
            );
          })}
          {dayEvents.length > 3 && (
            <div className="text-xs text-gray-500 font-medium pt-1">+{dayEvents.length - 3} more</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600">
        {WEEKDAYS.map(day => <div key={day} className="py-3 border-b border-r border-gray-200">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 flex-1">
        {days}
      </div>
    </div>
  );
};


const TimeGridView: React.FC<Omit<CalendarProps, 'view'> & { numDays: number }> = ({ currentDate, events, onTimeSlotClick, onEventClick, teams, numDays, onTeamDrop, onFacilityDrop }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollTo7AM = () => {
      if (containerRef.current) {
        // 7am slot is the 8th child (index 7), each slot is 64px high
        containerRef.current.scrollTop = 7 * 64; 
      }
    };
    // Use a timeout to ensure layout has been painted
    const timer = setTimeout(scrollTo7AM, 0);
    return () => clearTimeout(timer);
  }, [currentDate, numDays]);


  const days = [];
  const startDay = new Date(currentDate);
  if (numDays === 7) { // Week view
    startDay.setDate(startDay.getDate() - startDay.getDay());
  }

  for (let i = 0; i < numDays; i++) {
    const day = new Date(startDay);
    day.setDate(day.getDate() + i);
    days.push(day);
  }
  
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const teamId = e.dataTransfer.getData('application/athletica-track-team');
    const facilityId = e.dataTransfer.getData('application/athletica-track-facility');
    if (teamId) {
      onTeamDrop(teamId, date);
    } else if (facilityId) {
        onFacilityDrop(facilityId, date);
    }
  };


  return (
    <div className="flex flex-col flex-1 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="flex">
        <div className="w-16 border-r border-b border-gray-200"></div>
        {days.map(day => (
          <div key={day.toISOString()} className="flex-1 text-center py-3 border-b border-r border-gray-200">
            <p className="text-sm text-gray-500">{WEEKDAYS[day.getDay()]}</p>
            <p className={`text-2xl font-bold ${isSameDay(day, today) ? 'text-brand-primary' : 'text-gray-700'}`}>{day.getDate()}</p>
          </div>
        ))}
      </div>
      <div ref={containerRef} className="flex-1 overflow-y-auto relative">
        <div className="flex">
          <div className="w-16">
            {hours.map(hour => (
              <div key={hour} className="h-16 text-right pr-2 text-xs text-gray-500 border-r border-gray-200 relative -top-2">
                {hour > 0 ? `${hour % 12 === 0 ? 12 : hour % 12} ${hour < 12 ? 'AM' : 'PM'}` : ''}
              </div>
            ))}
          </div>
          <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${numDays}, 1fr)`}}>
            {days.map(day => {
                const dayEvents = events.filter(e => isSameDay(e.start, day));
                return (
                  <div key={day.toISOString()} className="relative border-r border-gray-200">
                    {hours.map(hour => {
                        const slotDate = new Date(day);
                        slotDate.setHours(hour, 0, 0, 0);
                        return (
                          <div
                            key={hour}
                            className="h-16 border-b border-gray-200 cursor-pointer hover:bg-gray-50 droppable-cell"
                            onClick={() => onTimeSlotClick(slotDate)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, slotDate)}
                          ></div>
                        );
                    })}
                    {dayEvents.map(event => {
                        const startHour = event.start.getHours() + event.start.getMinutes() / 60;
                        const endHour = event.end.getHours() + event.end.getMinutes() / 60;
                        const duration = endHour - startHour;
                        const team = teams.find(t => t.id === event.teamId);

                        return (
                            <div
                                key={event.id}
                                className={`absolute w-full p-2 text-xs rounded-lg border cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg hover:z-20 ${team?.color || 'bg-gray-200 text-gray-800 border-gray-300'}`}
                                style={{
                                    top: `${startHour * 64}px`,
                                    height: `${duration * 64}px`,
                                    left: '2px',
                                    right: '2px',
                                    width: 'calc(100% - 4px)',
                                    zIndex: 10,
                                }}
                                onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                            >
                                <p className="font-bold">{event.title}</p>
                                <p>{event.start.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})} - {event.end.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}</p>
                            </div>
                        );
                    })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


export const Calendar: React.FC<CalendarProps> = (props) => {
  switch (props.view) {
    case 'month':
      return <MonthView {...props} />;
    case 'week':
      return <TimeGridView {...props} numDays={7} />;
    case 'day':
      return <TimeGridView {...props} numDays={1} />;
    default:
      return null;
  }
};

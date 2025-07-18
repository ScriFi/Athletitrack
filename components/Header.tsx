import React from 'react';
import { Icon } from './Icon';
import { CalendarView } from '../types';

interface HeaderProps {
  currentDate: Date;
  onNext: () => void;
  onPrev: () => void;
  onToday: () => void;
  onAddEvent: () => void;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDate, onNext, onPrev, onToday, onAddEvent, view, onViewChange }) => {
  
  const getHeaderTitle = () => {
    const year = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    if (view === 'month') {
      return `${monthName} ${year}`;
    }

    if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
      const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });
      
      if (startOfWeek.getFullYear() !== endOfWeek.getFullYear()) {
         return `${startMonth} ${startOfWeek.getDate()}, ${startOfWeek.getFullYear()} - ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
      }
      if (startMonth !== endMonth) {
         return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${year}`;
      }
      return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${year}`;
    }

    // Day view
    return `${monthName} ${currentDate.getDate()}, ${year}`;
  };

  const views: CalendarView[] = ['day', 'week', 'month'];

  return (
    <header className="flex items-center justify-between p-4 mb-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-brand-dark min-w-[280px]">{getHeaderTitle()}</h1>
        <div className="flex items-center gap-1">
          <button onClick={onPrev} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></Icon>
          </button>
          <button onClick={onNext} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></Icon>
          </button>
        </div>
        <button onClick={onToday} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
          Today
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-200/80 rounded-lg p-1">
            {views.map(v => (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors capitalize ${
                  view === v ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        <button onClick={onAddEvent} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md font-medium hover:bg-brand-dark transition-colors shadow-sm">
          <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></Icon>
          Add Event
        </button>
      </div>
    </header>
  );
};

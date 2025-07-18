import React from 'react';
import { Icon } from './Icon';
import { Season, ViewMode } from '../types';

interface HeaderProps {
  currentDate: Date;
  onNavigate: (direction: 'next' | 'prev' | 'today') => void;
  onAddEvent: () => void;
  viewMode: ViewMode;
  onViewChange: (view: ViewMode) => void;
  currentSeason: { name: Season, icon: string };
}

const viewConfig = {
    month: { name: 'Month', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg> },
    week: { name: 'Week', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg> },
    day: { name: 'Day', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5A2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M12 12.75h.007v.008H12v-.008Z" /></svg> },
    list: { name: 'List', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> },
}

export const Header: React.FC<HeaderProps> = ({ currentDate, onNavigate, onAddEvent, viewMode, onViewChange, currentSeason }) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  
  const getHeaderText = () => {
    switch(viewMode) {
        case 'month':
            return `${monthName} ${year}`;
        case 'week':
            const startOfWeek = new Date(currentDate);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
                return `${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${monthName} ${year}`;
            }
            return `${startOfWeek.toLocaleDateString('default', {month: 'short', day: 'numeric'})} - ${endOfWeek.toLocaleDateString('default', {month: 'short', day: 'numeric'})}, ${year}`;
        case 'day':
            return currentDate.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        case 'list':
            return `Schedule for ${monthName} ${year}`;
    }
  }

  return (
    <header className="flex items-center justify-between p-4 mb-4 flex-none">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-brand-dark">{getHeaderText()}</h1>
            <div className="text-sm font-semibold text-gray-500 flex items-center gap-1.5 h-5">
                <span className="text-lg">{currentSeason.icon}</span> {currentSeason.name}
            </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onNavigate('prev')} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></Icon>
          </button>
          <button onClick={() => onNavigate('next')} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></Icon>
          </button>
        </div>
        <button onClick={() => onNavigate('today')} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
          Today
        </button>
        <div className="bg-gray-200 p-1 rounded-lg flex items-center">
            {(Object.keys(viewConfig) as ViewMode[]).map(view => (
                 <button
                    key={view}
                    onClick={() => onViewChange(view)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        viewMode === view ? 'bg-white shadow text-brand-primary' : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    <Icon className="w-5 h-5">{viewConfig[view].icon}</Icon>
                    {viewConfig[view].name}
              </button>
            ))}
        </div>
      </div>
      <button onClick={onAddEvent} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md font-medium hover:bg-brand-dark transition-colors shadow-sm">
        <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></Icon>
        Add Event
      </button>
    </header>
  );
};
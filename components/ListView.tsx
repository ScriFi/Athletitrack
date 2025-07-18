import React from 'react';
import { Event, Building } from '../types';
import { Icon } from './Icon';

interface ListViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  buildings: Building[];
}

const findBuilding = (buildings: Building[], buildingId: string) => buildings.find(b => b.id === buildingId);
const findSubSection = (building: Building | undefined, subSectionId: string | undefined) => {
    if (!building || !subSectionId || !building.subSections) return null;
    return building.subSections.find(s => s.id === subSectionId);
};

const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

const formatDateHeader = (date: Date) => date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

export const ListView: React.FC<ListViewProps> = ({ currentDate, events, onEventClick, buildings }) => {
  
  const sortedEvents = events.sort((a, b) => a.start.getTime() - b.start.getTime());

  const groupedEvents = sortedEvents.reduce<Record<string, Event[]>>((acc, event) => {
    const day = event.start.toISOString().split('T')[0];
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(event);
    return acc;
  }, {});

  const sortedDays = Object.keys(groupedEvents).sort();
  
  if (sortedDays.length === 0) {
    return (
      <div className="flex-grow bg-white rounded-lg shadow-sm flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <Icon className="w-12 h-12 mx-auto mb-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 11.25h.008v.008H12v-.008z" /></svg></Icon>
          <p className="font-semibold">No events scheduled this month.</p>
          <p className="text-sm">Try adding a new event or changing the selected facility.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-50 rounded-lg shadow-inner p-6 overflow-y-auto">
      <div className="space-y-8">
        {sortedDays.map(dayString => {
          const dayDate = new Date(dayString + 'T00:00:00'); // To get correct date object
          const eventsForDay = groupedEvents[dayString];
          return (
            <div key={dayString}>
              <h3 className="text-base font-semibold text-brand-dark sticky top-[-25px] bg-gray-50/80 backdrop-blur-sm py-3 z-10 -mx-6 px-6 border-b border-t border-gray-200">
                {formatDateHeader(dayDate)}
              </h3>
              <ul className="mt-2 divide-y divide-gray-100">
                {eventsForDay.map(event => {
                  const building = findBuilding(buildings, event.buildingId);
                  const subSection = findSubSection(building, event.subSectionId);
                  return (
                    <li key={event.id} onClick={() => onEventClick(event)} className="flex items-center gap-4 py-4 px-2 cursor-pointer hover:bg-white hover:shadow-sm rounded-md -mx-2 transition-all duration-150">
                       <div className="flex-none w-24 text-sm font-semibold text-brand-primary text-right">
                          {formatTime(event.start)}
                       </div>
                       <div className={`w-1 h-10 rounded-full ${event.color.split(' ')[0]}`}></div>
                       <div className="flex-1 min-w-0">
                         <p className="font-semibold text-gray-800 truncate">{event.title} <span className="text-gray-500 font-normal">({event.team})</span></p>
                         <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                           {building?.icon}
                           {building?.name} {subSection && <span className="text-gray-400">/ {subSection.name}</span>}
                         </p>
                       </div>
                       <div className="flex-none w-48 text-sm text-gray-600 truncate hidden md:block" title={event.coach}>
                          {event.coach}
                       </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

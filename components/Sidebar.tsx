import React from 'react';
import { Building, User } from '../types';
import { Icon } from './Icon';

interface SidebarProps {
  buildings: Building[];
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
  onNavigate: (view: 'scheduler' | 'admin') => void;
  currentView: 'scheduler' | 'admin';
  currentUser: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ buildings, selectedBuildingId, onSelectBuilding, onNavigate, currentView, currentUser, onLogout }) => {
  const handleBuildingSelect = (id: string | null) => {
    onNavigate('scheduler');
    onSelectBuilding(id);
  }
  
  const handleDragStart = (e: React.DragEvent<HTMLAnchorElement>, buildingId: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ buildingId }));
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
         <Icon className="w-8 h-8 text-brand-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
            </svg>
         </Icon>
        <h1 className="text-xl font-bold text-brand-dark">AthleticaTrack</h1>
      </div>
      <nav className="flex-grow">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Facilities</h2>
        <p className="text-xs text-gray-400 px-2 mb-2">Drag a facility onto the calendar to schedule.</p>
        <ul>
          <li>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleBuildingSelect(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                selectedBuildingId === null && currentView === 'scheduler'
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </Icon>
              All Buildings
            </a>
          </li>
          {buildings.map((building) => (
            <li key={building.id}>
              <a
                href="#"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, building.id)}
                onClick={(e) => { e.preventDefault(); handleBuildingSelect(building.id); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-1 cursor-grab active:cursor-grabbing ${
                  selectedBuildingId === building.id && currentView === 'scheduler'
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {building.icon}
                {building.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
        <div className="border-t border-gray-200 mt-4 pt-4">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate('admin'); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'admin'
                  ? 'bg-brand-secondary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
              </Icon>
              Admin Panel
            </a>
        </div>
      {currentUser && (
        <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="flex items-center justify-between px-3">
                <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
                <button onClick={onLogout} className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Logout</button>
            </div>
        </div>
      )}
    </aside>
  );
};
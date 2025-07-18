import React, { useState, useMemo, useCallback } from 'react';
import { Event, Building, SubSection, User, ViewMode, Season } from './types';
import { INITIAL_BUILDINGS, INITIAL_EVENTS, USERS } from './constants';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MonthView } from './components/MonthView';
import { WeekView } from './components/WeekView';
import { DayView } from './components/DayView';
import { EventModal } from './components/EventModal';
import { ListView } from './components/ListView';
import { AdminPanel } from './components/AdminPanel';
import { Icon } from './components/Icon';
import { LoginView } from './components/LoginView';

const getSeason = (date: Date): { name: Season, icon: string } => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return { name: 'Spring', icon: '🌸' };
    if (month >= 5 && month <= 7) return { name: 'Summer', icon: '☀️' };
    if (month >= 8 && month <= 10) return { name: 'Fall', icon: '🍂' };
    return { name: 'Winter', icon: '❄️' };
}

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [buildings, setBuildings] = useState<Building[]>(INITIAL_BUILDINGS);
  const [users, setUsers] = useState<User[]>(USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [initialModalData, setInitialModalData] = useState<Partial<Event> | undefined>(undefined);
  
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [mainView, setMainView] = useState<'scheduler' | 'admin'>('scheduler');

  const handleLogin = useCallback((username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if(user) {
        setCurrentUser(user);
        setMainView('scheduler');
        return true;
    }
    return false;
  }, [users]);
  
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const handleCreateTeam = useCallback((teamName: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, teams: [...currentUser.teams, teamName]};
    setCurrentUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
  }, [currentUser]);

  const filteredEvents = useMemo(() => {
    if (!selectedBuildingId) {
      return events;
    }
    return events.filter(event => event.buildingId === selectedBuildingId);
  }, [events, selectedBuildingId]);
  
  const handleNavigate = useCallback((direction: 'next' | 'prev' | 'today') => {
    if (direction === 'today') {
        setCurrentDate(new Date());
        return;
    }

    setCurrentDate(prev => {
        const newDate = new Date(prev);
        const increment = direction === 'next' ? 1 : -1;
        switch (viewMode) {
            case 'month':
            case 'list':
                newDate.setMonth(newDate.getMonth() + increment);
                break;
            case 'week':
                newDate.setDate(newDate.getDate() + (7 * increment));
                break;
            case 'day':
                newDate.setDate(newDate.getDate() + increment);
                break;
        }
        return newDate;
    });
  }, [viewMode]);

  const handleDayClick = useCallback((date: Date) => {
    setInitialModalData({ start: date });
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, []);
  
  const handleAddEventClick = useCallback(() => {
    setInitialModalData({ start: new Date() });
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, []);

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setInitialModalData(undefined);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setInitialModalData(undefined);
  }, []);

  const handleSaveEvent = useCallback((eventData: Omit<Event, 'id' | 'season'> | (Omit<Event, 'season'> & {id: string})) => {
    const season = getSeason(eventData.start).name;
    
    if ('id' in eventData && events.some(e => e.id === eventData.id)) {
      // Update existing event
      setEvents(prev => prev.map(e => e.id === eventData.id ? { ...e, ...eventData, season } as Event : e));
    } else {
      // Add new event
      const newEvent: Event = {
        id: new Date().toISOString(),
        ...(eventData as Omit<Event, 'id' | 'season'>),
        season
      };
      setEvents(prev => [...prev, newEvent]);
    }
    handleCloseModal();
  }, [events, handleCloseModal]);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    handleCloseModal();
  }, [handleCloseModal]);

  const handleSaveBuilding = useCallback((buildingName: string) => {
      const newBuilding: Building = {
          id: buildingName.toLowerCase().replace(/\s+/g, '_') + `_${Date.now()}`,
          name: buildingName,
          icon: (
              <Icon className="w-5 h-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.291 3.118c.244.588.765.998 1.396 1.057l3.43.501c.854.124 1.197 1.163.573 1.76l-2.48 2.418a1.523 1.523 0 00-.438 1.354l.585 3.417c.145.848-.744 1.502-1.494 1.118l-3.065-1.612a1.523 1.523 0 00-1.42 0l-3.065 1.612c-.75.384-1.639-.27-1.494-1.118l.585-3.417a1.523 1.523 0 00-.438-1.354l-2.48-2.418c-.624-.597-.28-1.636.574-1.76l3.43-.501c.63-.092 1.152-.47 1.396-1.057l1.29-3.118z" clipRule="evenodd" /></svg>
              </Icon>
          ),
          subSections: []
      };
      setBuildings(prev => [...prev, newBuilding]);
  }, []);

  const handleSaveSubSection = useCallback((buildingId: string, subSectionName: string) => {
      setBuildings(prev => prev.map(b => {
          if (b.id === buildingId) {
              const newSubSection: SubSection = {
                  id: `${buildingId}_${subSectionName.toLowerCase().replace(/\s+/g, '_')}`,
                  name: subSectionName
              };
              return {
                  ...b,
                  subSections: [...(b.subSections || []), newSubSection]
              };
          }
          return b;
      }));
  }, []);
  
  const handleImportEvents = useCallback((newEvents: Event[]) => {
      setEvents(prev => [...prev, ...newEvents]);
  }, []);

  const handleDropOnCalendar = useCallback((buildingId: string, date: Date) => {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(start.getHours() + 1);

    setInitialModalData({ buildingId, start, end });
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, []);

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderView = () => {
    const monthEvents = events.filter(e => e.start.getFullYear() === currentDate.getFullYear() && e.start.getMonth() === currentDate.getMonth());
    const eventsForView = selectedBuildingId ? monthEvents.filter(e => e.buildingId === selectedBuildingId) : monthEvents;

    switch(viewMode) {
      case 'month':
        return <MonthView currentDate={currentDate} events={filteredEvents} onDayClick={handleDayClick} onEventClick={handleEventClick} onDrop={handleDropOnCalendar} />;
      case 'week':
        return <WeekView currentDate={currentDate} events={filteredEvents} onEventClick={handleEventClick} onDropOnTimeSlot={handleDropOnCalendar} />;
      case 'day':
        return <DayView currentDate={currentDate} events={filteredEvents} onEventClick={handleEventClick} onDropOnTimeSlot={handleDropOnCalendar} />;
      case 'list':
        return <ListView currentDate={currentDate} events={eventsForView} onEventClick={handleEventClick} buildings={buildings} />;
      default:
        return <WeekView currentDate={currentDate} events={filteredEvents} onEventClick={handleEventClick} onDropOnTimeSlot={handleDropOnCalendar} />;
    }
  }

  return (
    <div className="flex h-screen font-sans text-gray-900 bg-brand-light">
      <Sidebar 
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        onSelectBuilding={setSelectedBuildingId}
        onNavigate={setMainView}
        currentView={mainView}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex flex-col p-6 max-h-screen">
        {mainView === 'scheduler' ? (
          <>
            <Header 
              currentDate={currentDate}
              onNavigate={handleNavigate}
              onAddEvent={handleAddEventClick}
              viewMode={viewMode}
              onViewChange={setViewMode}
              currentSeason={getSeason(currentDate)}
            />
            {renderView()}
          </>
        ) : (
          <AdminPanel
            buildings={buildings}
            onSaveBuilding={handleSaveBuilding}
            onSaveSubSection={handleSaveSubSection}
            onImportEvents={handleImportEvents}
            currentUser={currentUser}
            onCreateTeam={handleCreateTeam}
          />
        )}
      </main>
      <EventModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        initialData={initialModalData}
        buildings={buildings}
        currentUser={currentUser}
      />
    </div>
  );
};

export default App;
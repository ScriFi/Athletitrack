
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Event, CalendarView, Team, Building, User, Organization } from './types';
import { BUILDINGS, INITIAL_EVENTS, TEAMS, USERS, ORGANIZATIONS } from './constants';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { TeamSettingsModal } from './components/TeamSettingsModal';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentOrganizationId, setCurrentOrganizationId] = useState<string | null>(null);
  
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [buildings, setBuildings] = useState<Building[]>(BUILDINGS);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTeamForSettings, setSelectedTeamForSettings] = useState<Team | null>(null);
  const [initialTeamIdForModal, setInitialTeamIdForModal] = useState<string | null>(null);
  const [initialBuildingIdForModal, setInitialBuildingIdForModal] = useState<string | null>(null);
  const [appView, setAppView] = useState<'calendar' | 'admin'>('calendar');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Superadmins or users in multiple orgs must select one.
    // A standard admin or coach in one org gets it automatically.
    if (user.role === 'superadmin' || user.organizationIds.length > 1) {
      setCurrentOrganizationId(null);
    } else if (user.organizationIds.length === 1) {
      setCurrentOrganizationId(user.organizationIds[0]);
    } else {
      setCurrentOrganizationId(null); // No orgs assigned
    }
    setAppView('calendar');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentOrganizationId(null);
  };

  const handleOrganizationChange = (orgId: string) => {
      setCurrentOrganizationId(orgId);
      setSelectedBuildingId(null); // Reset filter when changing org
      setAppView('calendar');
  }

  // Memoized filtered data based on current organization
  const currentOrganization = useMemo(() => ORGANIZATIONS.find(o => o.id === currentOrganizationId), [currentOrganizationId]);
  
  const visibleBuildings = useMemo(() => buildings.filter(b => b.organizationId === currentOrganizationId), [buildings, currentOrganizationId]);
  
  const visibleTeams = useMemo(() => {
    if (!currentUser || !currentOrganizationId) return [];
    const orgTeams = teams.filter(t => t.organizationId === currentOrganizationId);
    if (currentUser.role === 'coach') {
      return orgTeams.filter(t => t.coachEmail === currentUser.email);
    }
    return orgTeams;
  }, [teams, currentUser, currentOrganizationId]);

  const filteredEvents = useMemo(() => {
    const orgEvents = events.filter(event => event.organizationId === currentOrganizationId);
    if (!selectedBuildingId) {
      return orgEvents;
    }
    return orgEvents.filter(event => event.buildingId === selectedBuildingId);
  }, [events, selectedBuildingId, currentOrganizationId]);
  
  // Reset selected building if it's not in the new visible set
  useEffect(() => {
    if (selectedBuildingId && !visibleBuildings.some(b => b.id === selectedBuildingId)) {
        setSelectedBuildingId(null);
    }
  }, [visibleBuildings, selectedBuildingId]);


  const handleNext = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (calendarView === 'month') newDate.setMonth(newDate.getMonth() + 1, 1);
      else if (calendarView === 'week') newDate.setDate(newDate.getDate() + 7);
      else newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }, [calendarView]);

  const handlePrev = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (calendarView === 'month') newDate.setMonth(newDate.getMonth() - 1, 1);
       else if (calendarView === 'week') newDate.setDate(newDate.getDate() - 7);
      else newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, [calendarView]);

  const handleToday = useCallback(() => { setCurrentDate(new Date()); }, []);
  const handleTimeSlotClick = useCallback((date: Date) => {
    setInitialTeamIdForModal(null);
    setInitialBuildingIdForModal(null);
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, []);
  
  const handleAddEventClick = useCallback(() => {
    if (!currentOrganizationId) return;
    setInitialTeamIdForModal(null);
    setInitialBuildingIdForModal(null);
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    setSelectedDate(now);
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, [currentOrganizationId]);

  const handleEventClick = useCallback((event: Event) => {
    setInitialTeamIdForModal(null);
    setInitialBuildingIdForModal(null);
    setSelectedEvent(event);
    setSelectedDate(event.start);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
    setInitialTeamIdForModal(null);
    setInitialBuildingIdForModal(null);
  }, []);

  const handleSaveEvent = useCallback((eventData: Omit<Event, 'id'> | Event) => {
    const saveData = { ...eventData, id: 'id' in eventData ? eventData.id : `evt_${new Date().toISOString()}` };
    if ('id' in eventData && events.some(e => e.id === eventData.id)) {
      setEvents(prev => prev.map(e => e.id === saveData.id ? saveData as Event : e));
    } else {
      setEvents(prev => [...prev, saveData as Event]);
    }
    handleCloseModal();
  }, [events, handleCloseModal]);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    handleCloseModal();
  }, [handleCloseModal]);

  const handleEditTeam = useCallback((team: Team) => {
    setSelectedTeamForSettings(team);
    setIsTeamModalOpen(true);
  }, []);

  const handleCloseTeamModal = useCallback(() => {
    setIsTeamModalOpen(false);
    setSelectedTeamForSettings(null);
  }, []);

  const handleSaveTeam = useCallback((updatedTeam: Team) => {
    setTeams(prevTeams => prevTeams.map(t => t.id === updatedTeam.id ? updatedTeam : t));
  }, []);
   
  const handleCreateTeam = (newTeam: Omit<Team, 'id'>) => {
    setTeams(prev => [...prev, { ...newTeam, id: `team_${new Date().toISOString()}`}]);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    setEvents(prev => prev.filter(e => e.teamId !== teamId));
  };
  
  const handleSaveBuilding = (updatedBuilding: Building) => {
     setBuildings(prev => prev.map(b => b.id === updatedBuilding.id ? updatedBuilding : b));
  };
  
  const handleCreateBuilding = (newBuilding: Omit<Building, 'id'>) => {
    setBuildings(prev => [...prev, {...newBuilding, id: `bldg_${new Date().toISOString()}`}]);
  };

  const handleDeleteBuilding = (buildingId: string) => {
    setBuildings(prev => prev.filter(b => b.id !== buildingId));
    setEvents(prev => prev.filter(e => e.buildingId !== buildingId));
  };

  const handleTeamDrop = useCallback((teamId: string, date: Date) => {
    setSelectedEvent(null);
    setSelectedDate(date);
    setInitialTeamIdForModal(teamId);
    setInitialBuildingIdForModal(null);
    setIsModalOpen(true);
  }, []);
  
  const handleFacilityDrop = useCallback((facilityId: string, date: Date) => {
    setSelectedEvent(null);
    setSelectedDate(date);
    setInitialBuildingIdForModal(facilityId);
    setInitialTeamIdForModal(null);
    setIsModalOpen(true);
  }, []);

  if (!currentUser) {
    return <Login users={USERS} onLogin={handleLogin} />;
  }

  const renderContent = () => {
      if (!currentOrganizationId) {
          return (
             <div className="flex-1 flex flex-col items-center justify-center text-center bg-white rounded-lg shadow-sm h-full">
                <Icon className="w-16 h-16 text-gray-300 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Icon>
                <h2 className="text-2xl font-bold text-gray-700">Select an Organization</h2>
                <p className="text-gray-500 mt-2 max-w-sm">Please choose an organization from the dropdown menu in the sidebar to view its schedule and resources.</p>
            </div>
          );
      }

      if (appView === 'admin') {
          return (
             <AdminPanel
                teams={visibleTeams}
                buildings={visibleBuildings}
                onTeamSave={handleSaveTeam}
                onTeamCreate={handleCreateTeam}
                onTeamDelete={handleDeleteTeam}
                onBuildingSave={handleSaveBuilding}
                onBuildingCreate={handleCreateBuilding}
                onBuildingDelete={handleDeleteBuilding}
                onBackToCalendar={() => setAppView('calendar')}
                organization={currentOrganization!}
            />
          );
      }

      return (
        <>
            <Header 
                currentDate={currentDate}
                onNext={handleNext}
                onPrev={handlePrev}
                onToday={handleToday}
                onAddEvent={handleAddEventClick}
                view={calendarView}
                onViewChange={setCalendarView}
            />
            <Calendar 
                currentDate={currentDate}
                events={filteredEvents}
                onTimeSlotClick={handleTimeSlotClick}
                onEventClick={handleEventClick}
                view={calendarView}
                teams={visibleTeams}
                onTeamDrop={handleTeamDrop}
                onFacilityDrop={handleFacilityDrop}
            />
        </>
      );
  }

  return (
    <div className="flex h-screen font-sans text-gray-900 bg-brand-light">
      <Sidebar 
        buildings={visibleBuildings}
        selectedBuildingId={selectedBuildingId}
        onSelectBuilding={setSelectedBuildingId}
        teams={visibleTeams}
        onEditTeam={handleEditTeam}
        user={currentUser}
        onLogout={handleLogout}
        organizations={ORGANIZATIONS}
        currentOrganizationId={currentOrganizationId}
        onOrganizationChange={handleOrganizationChange}
        onAdminPanelClick={() => setAppView('admin')}
        appView={appView}
      />
      <main className="flex-1 flex flex-col p-6">
        {renderContent()}
      </main>
      {isModalOpen && currentOrganizationId && (
        <EventModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            event={selectedEvent}
            selectedDate={selectedDate}
            teams={visibleTeams}
            buildings={visibleBuildings}
            organization={currentOrganization}
            initialTeamId={initialTeamIdForModal}
            initialBuildingId={initialBuildingIdForModal}
        />
      )}
      {isTeamModalOpen && currentOrganizationId && (
        <TeamSettingsModal
            isOpen={isTeamModalOpen}
            onClose={handleCloseTeamModal}
            onSave={handleSaveTeam}
            team={selectedTeamForSettings}
            isEditing={true}
        />
      )}
    </div>
  );
};

export default App;

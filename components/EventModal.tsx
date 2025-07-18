import React, { useState, useEffect, useCallback } from 'react';
import { Event, Building, Team, Organization } from '../types';
import { suggestDescription } from '../services/geminiService';
import { Icon } from './Icon';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'> | Event) => void;
  onDelete?: (eventId: string) => void;
  event: Event | null;
  selectedDate: Date | null;
  teams: Team[];
  buildings: Building[];
  organization: Organization | undefined;
  initialTeamId?: string | null;
  initialBuildingId?: string | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, event, selectedDate, teams, buildings, organization, initialTeamId, initialBuildingId }) => {
  const [formData, setFormData] = useState<Omit<Event, 'id' | 'start' | 'end'> & { start: string; end: string }>({
    title: '',
    description: '',
    buildingId: buildings.length > 0 ? buildings[0].id : '',
    teamId: initialTeamId || (teams.length > 0 ? teams[0].id : ''),
    organizer: '',
    start: '',
    end: '',
    organizationId: organization?.id || '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const initializeFormData = useCallback(() => {
    const defaultTeamId = initialTeamId || (teams.length > 0 ? teams[0].id : '');
    const defaultBuildingId = initialBuildingId || (buildings.length > 0 ? buildings[0].id : '');
    
    if (event) {
      setFormData({
        ...event,
        start: event.start.toTimeString().substring(0, 5),
        end: event.end.toTimeString().substring(0, 5),
      });
    } else if (selectedDate) {
      const startHour = selectedDate.getHours();
      const startMinute = selectedDate.getMinutes();
      
      const defaultEndTime = new Date(selectedDate);
      defaultEndTime.setHours(startHour + 1);

      setFormData({
        title: '',
        description: '',
        buildingId: defaultBuildingId,
        teamId: defaultTeamId,
        organizer: '',
        start: `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`,
        end: `${String(defaultEndTime.getHours()).padStart(2, '0')}:${String(defaultEndTime.getMinutes()).padStart(2, '0')}`,
        organizationId: organization?.id || '',
      });
    }
  }, [event, selectedDate, teams, buildings, initialTeamId, initialBuildingId, organization]);

  useEffect(() => {
    if (isOpen) {
      initializeFormData();
    }
  }, [isOpen, initializeFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionSuggestion = async () => {
    if (!formData.title) {
        alert("Please enter a title for the event first.");
        return;
    }
    if (!organization) {
        alert("Organization context is missing.");
        return;
    }
    setIsGenerating(true);
    const selectedBuilding = buildings.find(b => b.id === formData.buildingId);
    const selectedTeam = teams.find(t => t.id === formData.teamId);
    if(selectedBuilding && selectedTeam) {
        const suggestion = await suggestDescription(formData.title, selectedBuilding, selectedTeam, organization.name);
        setFormData(prev => ({ ...prev, description: suggestion }));
    }
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateToUse = event ? event.start : selectedDate;
    if (!dateToUse || !organization) return;

    const [startHour, startMinute] = formData.start.split(':').map(Number);
    const newStartDate = new Date(dateToUse);
    newStartDate.setHours(startHour, startMinute, 0, 0);

    const [endHour, endMinute] = formData.end.split(':').map(Number);
    const newEndDate = new Date(dateToUse);
    if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
        newEndDate.setDate(newEndDate.getDate() + 1);
    }
    newEndDate.setHours(endHour, endMinute, 0, 0);

    const eventToSave = {
      ...formData,
      start: newStartDate,
      end: newEndDate,
      id: event?.id || new Date().toISOString(),
      organizationId: organization.id,
    };
    onSave(eventToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-transform scale-100">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-brand-dark">{event ? 'Edit Event' : 'Add New Event'}</h2>
              <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600">
                <Icon className="w-6 h-6"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></Icon>
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                 <div className="relative mt-1">
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required></textarea>
                     <button type="button" onClick={handleDescriptionSuggestion} disabled={isGenerating} className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-xs font-semibold py-1 px-2 rounded-md transition-colors">
                        {isGenerating ? (
                            <>
                                <Icon className="w-4 h-4 animate-spin"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></Icon>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Icon className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.43 2.134a.75.75 0 011.14 0l2.25 3.501a.75.75 0 01-.64 1.115H7.82a.75.75 0 01-.64-1.115L9.43 2.134zM12.41 8.866a.75.75 0 01-1.14 0L9 5.365l-2.27 3.501a.75.75 0 01-1.14-1.018l2.85-4.434a.75.75 0 011.14 0l2.85 4.434a.75.75 0 010 1.018zM7.18 12.18a.75.75 0 00.64 1.115h4.36a.75.75 0 00.64-1.115l-2.25-3.501a.75.75 0 00-1.14 0L7.18 12.18z" /></svg></Icon>
                                Suggest
                            </>
                        )}
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="teamId" className="block text-sm font-medium text-gray-700">Team</label>
                  <select name="teamId" id="teamId" value={formData.teamId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary">
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                 <div>
                  <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700">Facility</label>
                  <select name="buildingId" id="buildingId" value={formData.buildingId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary">
                    {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                  <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizer</label>
                  <input type="text" name="organizer" id="organizer" value={formData.organizer} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label htmlFor="start" className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input type="time" name="start" id="start" value={formData.start} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
                </div>
                <div>
                  <label htmlFor="end" className="block text-sm font-medium text-gray-700">End Time</label>
                  <input type="time" name="end" id="end" value={formData.end} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div>
              {event && onDelete && (
                <button type="button" onClick={() => onDelete(event.id)} className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors">
                  Delete Event
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                Save Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
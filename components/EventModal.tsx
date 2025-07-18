import React, { useState, useEffect, useCallback } from 'react';
import { Event, Building, Season, User } from '../types';
import { EVENT_COLORS } from '../constants';
import { suggestDescription } from '../services/geminiService';
import { Icon } from './Icon';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id' | 'season'> | (Omit<Event, 'season'> & {id: string})) => void;
  onDelete?: (eventId: string) => void;
  event: Event | null;
  initialData?: Partial<Event>;
  buildings: Building[];
  currentUser: User | null;
}

const getLocalDateISO = (date: Date) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().split('T')[0];
    return localISOTime;
}

const initialFormState = {
    title: '',
    description: '',
    buildingId: '',
    subSectionId: undefined,
    coach: '',
    team: '',
    date: getLocalDateISO(new Date()),
    start: '09:00',
    end: '10:00',
    color: EVENT_COLORS[0],
};

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, event, initialData, buildings, currentUser }) => {
  const [formData, setFormData] = useState<Omit<Event, 'id' | 'start' | 'end' | 'season' | 'subSectionId'> & { subSectionId?: string; start: string; end: string; date: string }>({
    ...initialFormState,
    buildingId: buildings[0]?.id || ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const initializeFormData = useCallback(() => {
    const defaultBuildingId = buildings[0]?.id || '';
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        buildingId: event.buildingId,
        subSectionId: event.subSectionId,
        coach: event.coach,
        team: event.team,
        date: getLocalDateISO(event.start),
        start: event.start.toTimeString().substring(0, 5),
        end: event.end.toTimeString().substring(0, 5),
        color: event.color
      });
    } else {
      setFormData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        buildingId: initialData?.buildingId || defaultBuildingId,
        subSectionId: initialData?.subSectionId,
        coach: currentUser?.name || '',
        team: currentUser?.teams[0] || '',
        date: initialData?.start ? getLocalDateISO(initialData.start) : getLocalDateISO(new Date()),
        start: initialData?.start ? initialData.start.toTimeString().substring(0, 5) : '09:00',
        end: initialData?.end ? initialData.end.toTimeString().substring(0, 5) : '10:00',
        color: initialData?.color || EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
      });
    }
  }, [event, initialData, buildings, currentUser]);

  useEffect(() => {
    if(isOpen) {
        initializeFormData();
    }
  }, [isOpen, initializeFormData]);

  // Reset sub-section when building changes
  useEffect(() => {
    setFormData(prev => ({...prev, subSectionId: undefined }));
  }, [formData.buildingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionSuggestion = async () => {
    if (!formData.title || !formData.team) {
        alert("Please enter a Title and Team for the event first.");
        return;
    }
    setIsGenerating(true);
    const selectedBuilding = buildings.find(b => b.id === formData.buildingId);
    if(selectedBuilding) {
        // We pass a dummy season as it's required by the function, but not used for saving
        const suggestion = await suggestDescription(formData.title, selectedBuilding, formData.team, 'Summer');
        setFormData(prev => ({ ...prev, description: suggestion }));
    }
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [year, month, day] = formData.date.split('-').map(Number);
    const [startHour, startMinute] = formData.start.split(':').map(Number);
    const newStartDate = new Date(year, month - 1, day, startHour, startMinute);

    const [endHour, endMinute] = formData.end.split(':').map(Number);
    const newEndDate = new Date(year, month - 1, day, endHour, endMinute);

    const eventToSave = {
      ...formData,
      subSectionId: formData.subSectionId === 'whole_facility' ? undefined : formData.subSectionId,
      start: newStartDate,
      end: newEndDate,
      id: event?.id || new Date().toISOString(),
    };
    
    const { date, ...finalEvent } = eventToSave;
    onSave(finalEvent);
  };

  if (!isOpen) return null;

  const selectedBuildingForSubSections = buildings.find(b => b.id === formData.buildingId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-transform scale-100 max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-brand-dark">{event ? 'Edit Event' : 'Add New Event'}</h2>
              <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600">
                <Icon className="w-6 h-6"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></Icon>
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
              </div>
              
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="coach" className="block text-sm font-medium text-gray-700">Coach</label>
                  <input type="text" name="coach" id="coach" value={formData.coach} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 focus:outline-none" required readOnly={!!currentUser} />
                </div>
                <div>
                  <label htmlFor="team" className="block text-sm font-medium text-gray-700">Team</label>
                  {currentUser && currentUser.teams.length > 0 ? (
                    <select name="team" id="team" value={formData.team} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required>
                      {currentUser.teams.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="team" id="team" value={formData.team} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                 <div className="relative mt-1">
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required></textarea>
                     <button type="button" onClick={handleDescriptionSuggestion} disabled={isGenerating} className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed text-xs font-semibold py-1 px-2 rounded-md transition-colors">
                        {isGenerating ? (<><Icon className="w-4 h-4 animate-spin"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></Icon>Generating...</>) : (<><Icon className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.43 2.134a.75.75 0 011.14 0l2.25 3.501a.75.75 0 01-.64 1.115H7.82a.75.75 0 01-.64-1.115L9.43 2.134zM12.41 8.866a.75.75 0 01-1.14 0l-2.27 3.501a.75.75 0 01-1.14-1.018l2.85-4.434a.75.75 0 011.14 0l2.85 4.434a.75.75 0 010 1.018zM7.18 12.18a.75.75 0 00.64 1.115h4.36a.75.75 0 00.64-1.115l-2.25-3.501a.75.75 0 00-1.14 0L7.18 12.18z" /></svg></Icon>Suggest</>)}
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700">Facility</label>
                  <select name="buildingId" id="buildingId" value={formData.buildingId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary">
                    {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                    <label htmlFor="subSectionId" className="block text-sm font-medium text-gray-700">Sub-Section</label>
                    <select name="subSectionId" id="subSectionId" value={formData.subSectionId || 'whole_facility'} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" disabled={!selectedBuildingForSubSections?.subSections?.length}>
                        <option value="whole_facility">Whole Facility</option>
                        {selectedBuildingForSubSections?.subSections?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
                </div>
                 <div>
                  <label htmlFor="start" className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input type="time" name="start" id="start" value={formData.start} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required step="900" />
                </div>
                <div>
                  <label htmlFor="end" className="block text-sm font-medium text-gray-700">End Time</label>
                  <input type="time" name="end" id="end" value={formData.end} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required step="900" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center flex-shrink-0 border-t border-gray-200 rounded-b-lg">
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
import React, { useState, useEffect } from 'react';
import { Team, Organization } from '../types';
import { Icon } from './Icon';
import { TEAM_COLORS } from '../constants';

interface TeamSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: Team | Omit<Team, 'id'>) => void;
  team: Team | null;
  isEditing: boolean;
  organizationId?: string;
}

export const TeamSettingsModal: React.FC<TeamSettingsModalProps> = ({ isOpen, onClose, onSave, team, isEditing, organizationId }) => {
    
  const getInitialState = () => {
      if (isEditing && team) {
          return {
            name: team.name,
            color: team.color,
            coachEmail: team.coachEmail || '',
          }
      }
      return {
          name: '',
          color: TEAM_COLORS[0],
          coachEmail: '',
      }
  }

  const [formData, setFormData] = useState(getInitialState);

  useEffect(() => {
    if (isOpen) {
        setFormData(getInitialState());
    }
  }, [isOpen, team, isEditing]);

  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setFormData(prev => ({ ...prev, [name]: value}));
  }
  
  const handleColorSelect = (colorClass: string) => {
      setFormData(prev => ({...prev, color: colorClass}));
  }

  const handleSave = () => {
    if(isEditing && team) {
        onSave({ ...team, ...formData });
    } else if (!isEditing && organizationId) {
        const newTeam: Omit<Team, 'id'> = {
            ...formData,
            organizationId: organizationId,
        }
        onSave(newTeam);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-brand-dark">{isEditing ? `Edit Team: ${team?.name}` : 'Create New Team'}</h2>
            <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600">
              <Icon className="w-6 h-6"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></Icon>
            </button>
          </div>
          <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Team Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
              </div>
              <div>
                <label htmlFor="coachEmail" className="block text-sm font-medium text-gray-700">Coach's Email (Invite)</label>
                <input type="email" name="coachEmail" id="coachEmail" value={formData.coachEmail} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="coach.name@example.com"/>
              </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Color</label>
                <div className="grid grid-cols-8 gap-2">
                {TEAM_COLORS.map(colorClass => (
                    <button
                    key={colorClass}
                    type="button"
                    onClick={() => handleColorSelect(colorClass)}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${colorClass.split(' ')[0]} ${formData.color === colorClass ? 'border-brand-primary ring-2 ring-brand-primary' : 'border-white'}`}
                    aria-label={colorClass}
                    />
                ))}
                </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="px-4 py-2 bg-brand-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-dark">
            {isEditing ? 'Save Changes' : 'Create Team'}
          </button>
        </div>
      </div>
    </div>
  );
};

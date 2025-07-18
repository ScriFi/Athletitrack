import React, { useState } from 'react';
import { Team, Building, Organization } from '../types';
import { Icon, BuildingIcon, IconLibrary } from './Icon';
import { TeamSettingsModal } from './TeamSettingsModal';

interface AdminPanelProps {
    teams: Team[];
    buildings: Building[];
    onTeamSave: (team: Team) => void;
    onTeamCreate: (team: Omit<Team, 'id'>) => void;
    onTeamDelete: (teamId: string) => void;
    onBuildingSave: (building: Building) => void;
    onBuildingCreate: (building: Omit<Building, 'id'>) => void;
    onBuildingDelete: (buildingId: string) => void;
    onBackToCalendar: () => void;
    organization: Organization;
}

const FacilityForm: React.FC<{
    building: Building | null,
    onSave: (building: Building | Omit<Building, 'id'>) => void,
    onCancel: () => void,
    organizationId: string,
}> = ({ building, onSave, onCancel, organizationId }) => {
    
    const [name, setName] = useState(building?.name || '');
    const [icon, setIcon] = useState(building?.icon || 'default');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        if (building) {
            onSave({ ...building, name, icon });
        } else {
            onSave({ name, icon, organizationId });
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-brand-dark">{building ? 'Edit Facility' : 'Create New Facility'}</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="facilityName" className="block text-sm font-medium text-gray-700">Facility Name</label>
                    <input type="text" id="facilityName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                        {Object.keys(IconLibrary).map(iconName => (
                            <button
                                key={iconName}
                                type="button"
                                onClick={() => setIcon(iconName)}
                                className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${icon === iconName ? 'border-brand-primary ring-2 ring-brand-primary bg-brand-primary/10' : 'border-gray-300 bg-white'}`}
                                aria-label={iconName}
                            >
                                <BuildingIcon name={iconName} className="w-7 h-7 text-gray-600"/>
                            </button>
                        ))}
                    </div>
                 </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-brand-dark">{building ? 'Save Changes' : 'Create Facility'}</button>
            </div>
        </form>
    );
};


export const AdminPanel: React.FC<AdminPanelProps> = ({ teams, buildings, onTeamSave, onTeamCreate, onTeamDelete, onBuildingSave, onBuildingCreate, onBuildingDelete, onBackToCalendar, organization }) => {
    
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
    const [isCreatingBuilding, setIsCreatingBuilding] = useState(false);
    
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);

    const handleEditTeam = (team: Team) => {
        setEditingTeam(team);
    };

    const handleSaveTeam = (teamData: Team | Omit<Team, 'id'>) => {
        if ('id' in teamData) {
            onTeamSave(teamData);
        } else {
            onTeamCreate(teamData);
        }
        setEditingTeam(null);
        setIsCreatingTeam(false);
    };
    
    const handleDeleteBuilding = (id: string) => {
        if (window.confirm("Are you sure you want to delete this facility? All associated events will also be removed.")) {
            onBuildingDelete(id);
        }
    };

    const handleDeleteTeam = (id: string) => {
        if (window.confirm("Are you sure you want to delete this team? All associated events will also be removed.")) {
            onTeamDelete(id);
        }
    };
    
    return (
        <div className="h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div >
                    <h1 className="text-3xl font-bold text-brand-dark">Admin Panel</h1>
                    <p className="text-gray-600">Managing resources for <span className="font-semibold">{organization.name}</span></p>
                </div>
                <button onClick={onBackToCalendar} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                    Back to Calendar
                </button>
            </div>

            <div className="space-y-8">
                {/* Facilities Management */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-brand-dark">Manage Facilities</h2>
                         <button onClick={() => {setIsCreatingBuilding(true); setEditingBuilding(null);}} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md font-medium hover:bg-brand-dark transition-colors shadow-sm text-sm">
                            <Icon className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></Icon>
                            Add Facility
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {buildings.map(building => (
                            <div key={building.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200/80">
                                <div className="flex items-center gap-3">
                                    <BuildingIcon name={building.icon} className="w-6 h-6 text-brand-primary" />
                                    <span className="font-medium text-gray-800">{building.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => {setEditingBuilding(building); setIsCreatingBuilding(false);}} className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>
                                    <button onClick={() => handleDeleteBuilding(building.id)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {(isCreatingBuilding || editingBuilding) && (
                        <FacilityForm
                            building={editingBuilding}
                            onSave={(data) => {
                                if ('id' in data) {
                                    onBuildingSave(data)
                                } else {
                                    onBuildingCreate(data)
                                }
                                setEditingBuilding(null);
                                setIsCreatingBuilding(false);
                            }}
                            onCancel={() => {setEditingBuilding(null); setIsCreatingBuilding(false);}}
                            organizationId={organization.id}
                        />
                    )}

                </section>

                {/* Teams Management */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-brand-dark">Manage Teams</h2>
                         <button onClick={() => setIsCreatingTeam(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md font-medium hover:bg-brand-dark transition-colors shadow-sm text-sm">
                            <Icon className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></Icon>
                            Add Team
                        </button>
                    </div>
                    <div className="space-y-2">
                        {teams.map(team => (
                             <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200/80">
                                <div className="flex items-center gap-3">
                                    <span className={`w-4 h-4 rounded-full ${team.color.split(' ')[0]}`}></span>
                                    <div>
                                        <span className="font-medium text-gray-800">{team.name}</span>
                                        {team.coachEmail && <span className="text-xs text-gray-500 block">Coach: {team.coachEmail}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleEditTeam(team)} className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>
                                    <button onClick={() => handleDeleteTeam(team.id)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            {(isCreatingTeam || editingTeam) && (
                <TeamSettingsModal
                    isOpen={isCreatingTeam || !!editingTeam}
                    onClose={() => {setIsCreatingTeam(false); setEditingTeam(null);}}
                    onSave={handleSaveTeam}
                    team={editingTeam}
                    isEditing={!!editingTeam}
                    organizationId={organization.id}
                />
            )}
        </div>
    );
};

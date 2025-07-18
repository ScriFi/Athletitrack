import React, { useState } from 'react';
import { Building, Event, Season, User } from '../types';
import { EVENT_COLORS, SEASONS } from '../constants';
import { Icon } from './Icon';

interface SubSectionManagerProps {
    building: Building;
    onSaveSubSection: (buildingId: string, name: string) => void;
}

const SubSectionManager: React.FC<SubSectionManagerProps> = ({ building, onSaveSubSection }) => {
    const [newSubSectionName, setNewSubSectionName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddSubSection = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubSectionName.trim()) {
            onSaveSubSection(building.id, newSubSectionName.trim());
            setNewSubSectionName('');
            setIsAdding(false);
        }
    };

    return (
        <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-600">Sub-Sections</h4>
            {building.subSections && building.subSections.length > 0 ? (
                <ul className="mt-2 space-y-1 list-disc list-inside text-gray-500 text-sm">
                    {building.subSections.map(sub => <li key={sub.id}>{sub.name}</li>)}
                </ul>
            ) : (
                <p className="mt-1 text-sm text-gray-400">No sub-sections defined.</p>
            )}

            {isAdding ? (
                 <form onSubmit={handleAddSubSection} className="flex gap-2 mt-3">
                    <input
                        type="text"
                        value={newSubSectionName}
                        onChange={e => setNewSubSectionName(e.target.value)}
                        placeholder="e.g., Court 1"
                        className="flex-grow border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        required
                    />
                    <button type="submit" className="px-3 py-1.5 bg-brand-primary text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors">Save</button>
                    <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                </form>
            ) : (
                 <button onClick={() => setIsAdding(true)} className="mt-3 text-sm font-medium text-brand-primary hover:text-brand-dark transition-colors">+ Add Sub-Section</button>
            )}
        </div>
    );
};

const TeamManager: React.FC<{currentUser: User; onCreateTeam: (name: string) => void;}> = ({ currentUser, onCreateTeam }) => {
    const [newTeamName, setNewTeamName] = useState('');

    const handleAddTeam = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTeamName.trim() && !currentUser.teams.includes(newTeamName.trim())) {
            onCreateTeam(newTeamName.trim());
            setNewTeamName('');
        }
    };
    
    return (
        <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">My Teams</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Add New Team</h3>
                <form onSubmit={handleAddTeam} className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={newTeamName}
                        onChange={e => setNewTeamName(e.target.value)}
                        placeholder="e.g., Freshman Baseball"
                        className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        required
                    />
                    <button type="submit" className="flex-shrink-0 px-4 py-2 bg-brand-primary text-white rounded-md font-medium hover:bg-brand-dark transition-colors shadow-sm flex items-center justify-center gap-2">
                        <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg></Icon>
                        Create Team
                    </button>
                </form>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Teams</h3>
                {currentUser.teams.length > 0 ? (
                    <div className="space-y-2">
                        {currentUser.teams.map(team => (
                            <div key={team} className="bg-white border border-gray-200 rounded-md p-3 text-sm font-medium text-gray-700">
                                {team}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">You have not created any teams yet.</p>
                )}
            </div>
        </section>
    );
};

const getSeason = (date: Date): Season => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
}


interface AdminPanelProps {
  buildings: Building[];
  onSaveBuilding: (name: string) => void;
  onSaveSubSection: (buildingId: string, name: string) => void;
  onImportEvents: (events: Event[]) => void;
  currentUser: User | null;
  onCreateTeam: (name: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ buildings, onSaveBuilding, onSaveSubSection, onImportEvents, currentUser, onCreateTeam }) => {
  const [newBuildingName, setNewBuildingName] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);


  const handleAddBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBuildingName.trim()) {
      onSaveBuilding(newBuildingName.trim());
      setNewBuildingName('');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setImportFile(e.target.files[0]);
        setImportMessage(null);
    }
  }

  const handleImport = () => {
    if (!importFile) {
        setImportMessage({ type: 'error', text: 'Please select a file to import.' });
        return;
    }
    setIsImporting(true);
    setImportMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
            const rows = text.split('\n').map(r => r.trim()).filter(r => r.length > 0);
            if (rows.length < 2) throw new Error("CSV file is empty or has no data rows.");
            
            const header = rows[0].split(',').map(h => h.trim());
            const requiredHeaders = ['Date', 'StartTime', 'EndTime', 'EventTitle', 'Team', 'Coach', 'FacilityName'];
            const optionalHeaders = ['SubSectionName'];

            for (const reqHeader of requiredHeaders) {
                if (!header.includes(reqHeader)) {
                    throw new Error(`Missing required header column: ${reqHeader}.`);
                }
            }

            const newEvents: Event[] = [];
            for(let i = 1; i < rows.length; i++) {
                const values = rows[i].split(',');
                const rowData: {[key: string]: string} = {};
                header.forEach((h, index) => {
                    rowData[h] = values[index]?.trim();
                });
                
                const building = buildings.find(b => b.name.toLowerCase() === rowData.FacilityName?.toLowerCase());
                if (!building) {
                    console.warn(`Skipping row ${i+1}: Facility "${rowData.FacilityName}" not found.`);
                    continue;
                }
                
                let subSection;
                if(rowData.SubSectionName) {
                    subSection = building.subSections?.find(s => s.name.toLowerCase() === rowData.SubSectionName.toLowerCase());
                    if (!subSection) {
                        console.warn(`Skipping row ${i+1}: Sub-section "${rowData.SubSectionName}" not found in "${building.name}".`);
                        continue;
                    }
                }

                const start = new Date(`${rowData.Date}T${rowData.StartTime}`);
                const end = new Date(`${rowData.Date}T${rowData.EndTime}`);

                if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                    console.warn(`Skipping row ${i+1}: Invalid date or time format. Use YYYY-MM-DD for date and HH:MM for time.`);
                    continue;
                }

                newEvents.push({
                    id: `imported-${Date.now()}-${i}`,
                    buildingId: building.id,
                    subSectionId: subSection?.id,
                    title: rowData.EventTitle || 'Untitled Event',
                    description: `Imported event for ${rowData.Team}.`,
                    start,
                    end,
                    coach: rowData.Coach || 'N/A',
                    team: rowData.Team || 'N/A',
                    season: getSeason(start),
                    color: EVENT_COLORS[i % EVENT_COLORS.length]
                });
            }

            if(newEvents.length > 0) {
                onImportEvents(newEvents);
                setImportMessage({ type: 'success', text: `Successfully imported ${newEvents.length} events.` });
            } else {
                 setImportMessage({ type: 'error', text: 'No valid events could be imported. Check console for details and verify file format.' });
            }

        } catch (error: any) {
             setImportMessage({ type: 'error', text: `Import failed: ${error.message}` });
        } finally {
            setIsImporting(false);
            setImportFile(null); 
        }
    };
    reader.onerror = () => {
        setIsImporting(false);
        setImportMessage({ type: 'error', text: 'Failed to read the file.' });
    };
    reader.readAsText(importFile);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        
        {currentUser && <TeamManager currentUser={currentUser} onCreateTeam={onCreateTeam} />}

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Import Schedule</h2>
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Import from CSV</h3>
            <div className="text-sm text-gray-600 space-y-2 mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
                <p className="font-semibold">Required columns:</p>
                <code className="text-xs">Date, StartTime, EndTime, EventTitle, Team, Coach, FacilityName</code>
                <p className="font-semibold mt-1">Optional column:</p>
                <code className="text-xs">SubSectionName</code>
                <p className="mt-2">Date format: <code className="text-xs">YYYY-MM-DD</code>. Time format: <code className="text-xs">HH:MM</code> (24-hour).</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="flex-grow text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                />
                 <button onClick={handleImport} disabled={!importFile || isImporting} className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isImporting ? (
                        <>
                            <Icon className="w-5 h-5 animate-spin"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></Icon>
                            Importing...
                        </>
                    ) : (
                        <>
                            <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.7a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z" clipRule="evenodd" /></svg></Icon>
                            Import File
                        </>
                    )}
                 </button>
            </div>
            {importMessage && (
                <div className={`mt-4 text-sm p-3 rounded-md ${importMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {importMessage.text}
                </div>
            )}
           </div>
        </section>

        <section className="md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Manage Facilities</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Add New Facility</h3>
            <form onSubmit={handleAddBuilding} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={newBuildingName}
                    onChange={e => setNewBuildingName(e.target.value)}
                    placeholder="e.g., Tennis Courts"
                    className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                    required
                />
                <button type="submit" className="flex-shrink-0 px-4 py-2 bg-brand-primary text-white rounded-md font-medium hover:bg-brand-dark transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg></Icon>
                    Create Facility
                </button>
            </form>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Facilities</h3>
            <div className="space-y-4">
              {buildings.map(building => (
                <div key={building.id} className="border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="text-brand-primary">{building.icon}</div>
                    <h3 className="font-bold text-gray-900 text-lg">{building.name}</h3>
                  </div>
                  <SubSectionManager building={building} onSaveSubSection={onSaveSubSection} />
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
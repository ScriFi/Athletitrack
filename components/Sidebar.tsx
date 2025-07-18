import React, { useState } from 'react';
import { Building, Team, User, Organization } from '../types';
import { Icon, BuildingIcon } from './Icon';

interface SidebarProps {
  buildings: Building[];
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
  teams: Team[];
  onEditTeam: (team: Team) => void;
  user: User;
  onLogout: () => void;
  organizations: Organization[];
  currentOrganizationId: string | null;
  onOrganizationChange: (orgId: string) => void;
  onAdminPanelClick: () => void;
  appView: 'calendar' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({
  buildings,
  selectedBuildingId,
  onSelectBuilding,
  teams,
  onEditTeam,
  user,
  onLogout,
  organizations,
  currentOrganizationId,
  onOrganizationChange,
  onAdminPanelClick,
  appView
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isOrgSwitcherOpen, setIsOrgSwitcherOpen] = useState(false);

  const handleTeamDragStart = (e: React.DragEvent<HTMLLIElement>, teamId: string) => {
    e.dataTransfer.setData('application/athletica-track-team', teamId);
    e.dataTransfer.effectAllowed = 'move';
    document.body.classList.add('is-dragging');
  };

  const handleFacilityDragStart = (e: React.DragEvent<HTMLLIElement>, buildingId: string) => {
    e.dataTransfer.setData('application/athletica-track-facility', buildingId);
    e.dataTransfer.effectAllowed = 'move';
    document.body.classList.add('is-dragging');
  };

  const handleDragEnd = () => {
    document.body.classList.remove('is-dragging');
  };

  const currentOrganization = organizations.find(o => o.id === currentOrganizationId);
  const userOrganizations = organizations.filter(o => user.organizationIds.includes(o.id));
  const canSwitchOrgs = user.role === 'superadmin' && userOrganizations.length > 1;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
      <div className="relative">
        {canSwitchOrgs ? (
            <>
            <button onClick={() => setIsOrgSwitcherOpen(!isOrgSwitcherOpen)} className="flex items-center justify-between gap-3 mb-6 px-2 w-full text-left hover:bg-gray-100 rounded-md py-2">
                <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8 text-brand-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" /></svg>
                    </Icon>
                    <h1 className="text-xl font-bold text-brand-dark">{currentOrganization?.name || 'Select School'}</h1>
                </div>
                <Icon className="w-5 h-5 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.24a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" /></svg></Icon>
            </button>
            {isOrgSwitcherOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-20">
                    {userOrganizations.map(org => (
                        <a href="#" key={org.id} onClick={(e) => { e.preventDefault(); onOrganizationChange(org.id); setIsOrgSwitcherOpen(false); }} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">{org.name}</a>
                    ))}
                </div>
            )}
            </>
        ) : (
            <div className="flex items-center gap-3 mb-8 px-2">
                <Icon className="w-8 h-8 text-brand-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" /></svg>
                </Icon>
                <h1 className="text-xl font-bold text-brand-dark">{currentOrganization?.name}</h1>
            </div>
        )}
      </div>

      <nav className="flex-grow space-y-6">
        {(user.role === 'admin' || user.role === 'superadmin') && currentOrganizationId && (
             <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Admin</h2>
                 <ul>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); onAdminPanelClick(); }} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${appView === 'admin' ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-600 hover:bg-gray-100'}`}>
                           <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg></Icon>
                            Admin Panel
                        </a>
                    </li>
                </ul>
            </div>
        )}
        {currentOrganizationId && (
        <>
            <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Facilities</h2>
                <ul className="space-y-1">
                <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); onSelectBuilding(null); }} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${ selectedBuildingId === null ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-600 hover:bg-gray-100' }`} >
                        <Icon className="w-5 h-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg></Icon>
                        All Buildings
                    </a>
                </li>
                {buildings.map((building) => (
                    <li 
                      key={building.id}
                      draggable
                      onDragStart={(e) => handleFacilityDragStart(e, building.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onSelectBuilding(building.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer hover:bg-gray-100 active:cursor-grabbing ${ selectedBuildingId === building.id ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-600' }`}
                    >
                        <BuildingIcon name={building.icon} />
                        {building.name}
                    </li>
                ))}
                </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Teams</h2>
              <ul className="space-y-1">
                {teams.map((team) => (
                  <li key={team.id} draggable onDragStart={(e) => handleTeamDragStart(e, team.id)} onDragEnd={handleDragEnd} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-grab active:cursor-grabbing group">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${team.color.split(' ')[0]}`}></span>
                      <span>{team.name}</span>
                    </div>
                    {(user.role === 'admin' || user.role === 'superadmin') && (
                      <button onClick={() => onEditTeam(team)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-brand-primary transition-opacity" aria-label={`Edit ${team.name}`}>
                        <Icon className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25-1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg></Icon>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
        </>
        )}
      </nav>
      
      <div className="mt-auto relative">
         {isUserMenuOpen && (
             <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border rounded-md shadow-lg py-1">
                <a href="#" onClick={(e) => { e.preventDefault(); onLogout();}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                </a>
             </div>
         )}
        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-left">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-semibold text-sm text-brand-dark">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
            </div>
        </button>
      </div>
    </aside>
  );
};
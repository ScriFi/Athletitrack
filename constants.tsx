import { Building, Event, Team, Organization, User } from './types';

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

export const ORGANIZATIONS: Organization[] = [
    { id: 'athleticatrack', name: 'AthleticaTrack' },
    { id: 'pcseniorhigh', name: 'Park Center Senior High' },
];

export const USERS: User[] = [
    {
        id: 'user_admin',
        name: 'Admin User',
        email: 'admin@athleticatrack.com',
        role: 'superadmin',
        organizationIds: ['athleticatrack', 'pcseniorhigh'],
        avatar: `https://i.pravatar.cc/150?u=user_admin`,
    },
    {
        id: 'user_drew',
        name: 'Drew Williams',
        email: 'drew.williams@pcseniorhigh.org',
        role: 'admin',
        organizationIds: ['pcseniorhigh'],
        avatar: `https://i.pravatar.cc/150?u=user_drew`,
    },
    {
        id: 'user_coach_miller',
        name: 'Coach Miller',
        email: 'miller@athleticatrack.com',
        role: 'coach',
        organizationIds: ['athleticatrack'],
        avatar: `https://i.pravatar.cc/150?u=user_coach_miller`,
    },
     {
        id: 'user_coach_davis',
        name: 'Coach Davis',
        email: 'davis@athleticatrack.com',
        role: 'coach',
        organizationIds: ['athleticatrack'],
        avatar: `https://i.pravatar.cc/150?u=user_coach_davis`,
    },
];

export const BUILDINGS: Building[] = [
  // AthleticaTrack Buildings
  { id: 'gym', name: 'Main Gymnasium', icon: 'gym', organizationId: 'athleticatrack' },
  { id: 'baseball_field', name: 'Baseball Field', icon: 'baseball', organizationId: 'athleticatrack' },
  { id: 'pool', name: 'Aquatic Center', icon: 'pool', organizationId: 'athleticatrack' },
  { id: 'track_field', name: 'Track & Field', icon: 'track', organizationId: 'athleticatrack' },
  
  // Park Center Senior High Buildings
  { id: 'pc_weight_room', name: 'Weight Room', icon: 'weight-room', organizationId: 'pcseniorhigh' },
  { id: 'pc_north_gym', name: 'North Gym', icon: 'gym', organizationId: 'pcseniorhigh' },
  { id: 'pc_west_gym', name: 'West Gym', icon: 'gym', organizationId: 'pcseniorhigh' },
  { id: 'pc_stadium', name: 'Stadium', icon: 'stadium', organizationId: 'pcseniorhigh' },
  { id: 'pc_north_turf', name: 'North Turf Field', icon: 'turf', organizationId: 'pcseniorhigh' },
  { id: 'pc_south_turf', name: 'South Turf Field', icon: 'turf', organizationId: 'pcseniorhigh' },
];

export const TEAM_COLORS = [
    'bg-blue-200 text-blue-800 border-blue-300',
    'bg-green-200 text-green-800 border-green-300',
    'bg-purple-200 text-purple-800 border-purple-300',
    'bg-red-200 text-red-800 border-red-300',
    'bg-yellow-200 text-yellow-800 border-yellow-300',
    'bg-indigo-200 text-indigo-800 border-indigo-300',
    'bg-pink-200 text-pink-800 border-pink-300',
    'bg-cyan-200 text-cyan-800 border-cyan-300',
];

export const TEAMS: Team[] = [
    // AthleticaTrack Teams
    { id: 'team_bball_varsity', name: 'Varsity Basketball', color: TEAM_COLORS[0], organizationId: 'athleticatrack', coachEmail: 'miller@athleticatrack.com' },
    { id: 'team_baseball', name: 'Baseball', color: TEAM_COLORS[3], organizationId: 'athleticatrack' },
    { id: 'team_swim', name: 'Swim Team', color: TEAM_COLORS[7], organizationId: 'athleticatrack' },
    { id: 'team_track', name: 'Track & Field', color: TEAM_COLORS[4], organizationId: 'athleticatrack' },
    { id: 'team_vball', name: 'Volleyball', color: TEAM_COLORS[1], organizationId: 'athleticatrack', coachEmail: 'davis@athleticatrack.com' },
    { id: 'team_staff', name: 'Staff Wellness', color: TEAM_COLORS[2], organizationId: 'athleticatrack' },
    { id: 'team_community', name: 'Community League', color: TEAM_COLORS[5], organizationId: 'athleticatrack' },

    // Park Center Senior High Teams
    { id: 'pc_football_varsity', name: 'PC Varsity Football', color: TEAM_COLORS[1], organizationId: 'pcseniorhigh' },
    { id: 'pc_girls_soccer', name: 'PC Girls Soccer', color: TEAM_COLORS[6], organizationId: 'pcseniorhigh' },
    { id: 'pc_wrestling', name: 'PC Wrestling', color: TEAM_COLORS[4], organizationId: 'pcseniorhigh' },
];

export const INITIAL_EVENTS: Event[] = [
  // AthleticaTrack Events
  {
    id: 'evt1',
    buildingId: 'gym',
    teamId: 'team_bball_varsity',
    title: 'Varsity Basketball Practice',
    description: 'Full-court drills and scrimmage.',
    start: new Date(currentYear, currentMonth, 2, 16, 0),
    end: new Date(currentYear, currentMonth, 2, 18, 0),
    organizer: 'Coach Miller',
    organizationId: 'athleticatrack'
  },
  {
    id: 'evt2',
    buildingId: 'baseball_field',
    teamId: 'team_baseball',
    title: 'Baseball Team Tryouts',
    description: 'Open tryouts for the new season.',
    start: new Date(currentYear, currentMonth, 5, 15, 30),
    end: new Date(currentYear, currentMonth, 5, 17, 30),
    organizer: 'Athletics Dept.',
    organizationId: 'athleticatrack'
  },
  {
    id: 'evt3',
    buildingId: 'pool',
    teamId: 'team_swim',
    title: 'Swim Team Morning Practice',
    description: 'Lap drills and relay practice.',
    start: new Date(currentYear, currentMonth, 6, 6, 0),
    end: new Date(currentYear, currentMonth, 6, 7, 30),
    organizer: 'Coach Sarah',
    organizationId: 'athleticatrack'
  },
  {
    id: 'evt4',
    buildingId: 'track_field',
    teamId: 'team_track',
    title: 'Annual Track Meet',
    description: 'Inter-school competition.',
    start: new Date(currentYear, currentMonth, 10, 9, 0),
    end: new Date(currentYear, currentMonth, 10, 15, 0),
    organizer: 'Regional Committee',
    organizationId: 'athleticatrack'
  },
  // Park Center Events
  {
    id: 'pc_evt_1',
    buildingId: 'pc_stadium',
    teamId: 'pc_football_varsity',
    title: 'Football vs. Osseo',
    description: 'Big rivalry game under the lights!',
    start: new Date(currentYear, currentMonth, 3, 19, 0),
    end: new Date(currentYear, currentMonth, 3, 21, 30),
    organizer: 'PC Athletics',
    organizationId: 'pcseniorhigh',
  },
  {
    id: 'pc_evt_2',
    buildingId: 'pc_north_gym',
    teamId: 'pc_wrestling',
    title: 'Wrestling Practice',
    description: 'Prepping for the regional tournament.',
    start: new Date(currentYear, currentMonth, 4, 15, 0),
    end: new Date(currentYear, currentMonth, 4, 17, 0),
    organizer: 'Coach Reynolds',
    organizationId: 'pcseniorhigh',
  },
];
import React from 'react';
import { Building, Event, Season, User } from './types';
import { Icon } from './components/Icon';

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

export const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'gym',
    name: 'Main Gymnasium',
    icon: (
      <Icon className="w-5 h-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.125 1.125 0 00-.928.928.143.048 1.125 1.125 0 00.928.928l.143.048a2.25 2.25 0 011.161.886l.51.766c.319.48.226 1.121-.216 1.49l-1.068.89a1.125 1.125 0 00-.405.864v.568m-1.5 0v-.568c0-.334-.148-.65-.405-.864l-1.068-.89a1.725 1.725 0 01-.216-1.49l.51-.766a2.25 2.25 0 00-1.161-.886l-.143-.048a1.125 1.125 0 01-.928-.928 1.125 1.125 0 01.928-.928l.143-.048a2.25 2.25 0 001.161-.886l-.51-.766a1.725 1.725 0 01.216-1.49l1.068-.89a1.125 1.125 0 00.405-.864v-.568a1.5 1.5 0 013 0z" />
        </svg>
      </Icon>
    ),
    subSections: [
        { id: 'gym_court_1', name: 'Court 1' },
        { id: 'gym_court_2', name: 'Court 2' },
        { id: 'gym_weight_room', name: 'Weight Room' },
    ]
  },
  {
    id: 'baseball_field',
    name: 'Baseball Field',
    icon: (
      <Icon className="w-5 h-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H5.25a7.5 7.5 0 00-7.5 7.5v.75m15-7.5a7.5 7.5 0 01-7.5 7.5H5.25a7.5 7.5 0 01-7.5-7.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Icon>
    ),
    subSections: [
        { id: 'bf_main', name: 'Main Diamond' },
        { id: 'bf_batting_cages', name: 'Batting Cages' },
    ]
  },
  {
    id: 'pool',
    name: 'Aquatic Center',
    icon: (
      <Icon className="w-5 h-5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.277 8.12a.75.75 0 01.06-1.057 5.25 5.25 0 017.33 0 .75.75 0 01-1.117 1.002 3.75 3.75 0 00-5.225 0 .75.75 0 01-1.048.055zM12.75 12a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
        </svg>
      </Icon>
    ),
  },
  {
    id: 'track_field',
    name: 'Track & Field',
    icon: (
      <Icon className="w-5 h-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.792V6.31a2.25 2.25 0 00-2.25-2.25h-4.032M2.25 12.792V6.31a2.25 2.25 0 012.25-2.25h4.032M2.25 12.792h4.032M21 12.792h-4.032M13.788 5.034a2.25 2.25 0 013.376 0l.162.162a2.25 2.25 0 010 3.376l-.162.162a2.25 2.25 0 01-3.376 0l-.162-.162a2.25 2.25 0 010-3.376l.162-.162zM6.84 5.034a2.25 2.25 0 013.376 0l.162.162a2.25 2.25 0 010 3.376l-.162.162a2.25 2.25 0 01-3.376 0l-.162-.162a2.25 2.25 0 010-3.376l.162-.162z" />
        </svg>
      </Icon>
    ),
  },
];

export const SEASONS: Season[] = ['Spring', 'Summer', 'Fall', 'Winter'];

export const USERS: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    password: 'password',
    name: 'Coach Miller',
    teams: ["Men's Varsity Basketball", "Women's JV Volleyball", "Badminton Club"],
    role: 'admin',
  },
  {
    id: 'user-2',
    username: 'coachj',
    password: 'baseball',
    name: 'Coach Johnson',
    teams: ['Varsity Baseball', 'JV Baseball', 'Summer Sluggers'],
    role: 'coach',
  },
];


export const EVENT_COLORS = [
    'bg-blue-200 text-blue-800 border-blue-300',
    'bg-green-200 text-green-800 border-green-300',
    'bg-purple-200 text-purple-800 border-purple-300',
    'bg-red-200 text-red-800 border-red-300',
    'bg-yellow-200 text-yellow-800 border-yellow-300',
    'bg-indigo-200 text-indigo-800 border-indigo-300',
    'bg-pink-200 text-pink-800 border-pink-300',
    'bg-cyan-200 text-cyan-800 border-cyan-300',
];

const sampleTitles: Record<string, string[]> = {
  gym: ['Varsity Basketball Practice', 'Junior Volleyball Game', 'Badminton Club Meetup', 'Indoor Soccer Drills', 'Gymnastics Training', 'Community Dodgeball Night'],
  baseball_field: ['Baseball Team Tryouts', 'Little League Championship', 'Softball Practice', 'Pitching Clinic', 'Alumni Baseball Game', 'Batting Practice'],
  pool: ['Swim Team Practice', 'Water Polo Match', 'Diving Lessons', 'Public Lap Swim', 'Aqua Aerobics Class', 'Lifeguard Training'],
  track_field: ['Track & Field Meet', 'Hurdles Practice', 'Long Jump Competition', 'Relay Race Training', 'Javelin Throw Practice', 'Community Fun Run'],
};

const sampleCoaches = ['Coach Miller', 'Athletics Dept.', 'Coach Sarah', 'Regional Committee', 'Coach Davis', 'Student Council', 'Mr. Smith', 'Ms. Jones'];
const sampleTeams = ["Men's Varsity", "Women's JV", "U12s", "Community League A", "Faculty Team", "Rookies", "Alumni"];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockEvents = (building: Building, count: number, year: number, month: number): Event[] => {
    const events: Event[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const buildingTitles = sampleTitles[building.id] || ['General Use', 'Private Booking'];

    for (let i = 0; i < count; i++) {
        const day = getRandomInt(1, daysInMonth);
        const startHour = getRandomInt(7, 20); // Events between 7 AM and 8 PM
        const durationMinutes = getRandomInt(1, 3) * 60; // 1 to 3 hours duration

        const startDate = new Date(year, month, day, startHour, 0);
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

        const subSection = building.subSections && building.subSections.length > 0
            ? getRandomElement(building.subSections) 
            : undefined;

        const event: Event = {
            id: `${building.id}-evt-${i}-${Date.now()}`,
            buildingId: building.id,
            subSectionId: subSection?.id,
            title: getRandomElement(buildingTitles),
            description: 'This is a generated event description. Details to be confirmed.',
            start: startDate,
            end: endDate,
            coach: getRandomElement(sampleCoaches),
            team: getRandomElement(sampleTeams),
            season: getRandomElement(SEASONS),
            color: getRandomElement(EVENT_COLORS),
        };
        events.push(event);
    }
    return events;
}

export const INITIAL_EVENTS: Event[] = [
    ...generateMockEvents(INITIAL_BUILDINGS[0], 50, currentYear, currentMonth),
    ...generateMockEvents(INITIAL_BUILDINGS[1], 50, currentYear, currentMonth),
    ...generateMockEvents(INITIAL_BUILDINGS[2], 50, currentYear, currentMonth),
    ...generateMockEvents(INITIAL_BUILDINGS[3], 50, currentYear, currentMonth),
];
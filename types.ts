import { ReactNode } from 'react';

export interface SubSection {
  id: string;
  name: string;
}

export interface Building {
  id:string;
  name: string;
  icon: ReactNode;
  subSections?: SubSection[];
}

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';

export interface Event {
  id: string;
  buildingId: string;
  subSectionId?: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  coach: string;
  team: string;
  season: Season;
  color: string;
}

export interface User {
  id: string;
  username: string;
  // Note: Password stored for demo purposes, NEVER do this in a real app.
  password?: string;
  name: string;
  teams: string[];
  role: 'admin' | 'coach';
}

export type ViewMode = 'month' | 'week' | 'day' | 'list';
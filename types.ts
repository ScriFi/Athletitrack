export type CalendarView = 'month' | 'week' | 'day';

export interface Organization {
  id: string;
  name: string;
}

export type UserRole = 'admin' | 'coach' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationIds: string[]; // Can belong to multiple orgs
  avatar: string;
}

export interface Building {
  id: string;
  name: string;
  icon: string; // Icon name from library
  organizationId: string;
}

export interface Team {
  id:string;
  name: string;
  color: string;
  organizationId: string;
  coachEmail?: string;
}

export interface Event {
  id: string;
  buildingId: string;
  teamId: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  organizer: string;
  organizationId: string;
}
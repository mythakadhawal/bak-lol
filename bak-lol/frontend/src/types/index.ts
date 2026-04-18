// ============================================================
// Shared TypeScript Types — Bak-Lol
// ============================================================

export interface Student {
  id: string;
  name: string;
  email?: string;
  ug_number?: string;
  year: 1 | 2 | 3 | 4;
  department: string;
  hostel: string;
  avatar_seed?: string;
  bio?: string;
  created_at: string;
}

export interface Activity {
  id: string;
  creator_id: string;
  creator?: Student;
  title: string;
  description?: string;
  scheduled_at: string;
  hostel?: string;
  max_participants?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participant_count: number;
  is_joined?: boolean;
  created_at: string;
}

export interface ActivityMessage {
  id: string;
  activity_id: string;
  sender_id: string;
  sender?: Student;
  content: string;
  sent_at: string;
}

export interface HelpRequest {
  id: string;
  poster_id: string;
  poster?: Student;
  category: 'item' | 'help' | 'other';
  title: string;
  description?: string;
  is_resolved: boolean;
  response_count: number;
  created_at: string;
}

export interface HelpResponse {
  id: string;
  request_id: string;
  responder_id: string;
  responder?: Student;
  content: string;
  is_accepted: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  author?: Student;
  title: string;
  body?: string;
  tag?: 'study-group' | 'project' | 'collaboration' | 'announcement' | 'other';
  created_at: string;
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender?: Student;
  content: string;
  is_read: boolean;
  sent_at: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email?: string;
  ug_number?: string;
  year: number;
  department: string;
  hostel: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  student: Student;
}

export interface StudentFilters {
  hostel?: string;
  year?: string;
  department?: string;
  search?: string;
}

export const HOSTELS = [
  'NH-1 (Boys)',
  'NH-2 (Boys)',
  'Narmada (Boys)',
  'Kaveri (Boys)',
  'Saraswati (Girls)',
  'Yamuna (Girls)',
  'GH-1 (Girls)',
] as const;

export const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Chemical',
  'Biotechnology',
  'Mathematics',
  'Physics',
] as const;

export const YEARS = [1, 2, 3, 4] as const;

export const POST_TAGS = [
  'study-group',
  'project',
  'collaboration',
  'announcement',
  'other',
] as const;

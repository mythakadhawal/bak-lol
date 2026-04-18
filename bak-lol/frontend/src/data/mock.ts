import { Student, Activity, HelpRequest, Post, ActivityMessage, HelpResponse } from '../types';

// ── Students ──────────────────────────────────────────────────
export const MOCK_STUDENTS: Student[] = [
  {
    id: 's1', name: 'Arjun Mehta', email: 'arjun.mehta@college.edu',
    year: 3, department: 'Computer Science', hostel: 'NH-1 (Boys)',
    bio: 'Into competitive coding and badminton. Always up for a chai run.', created_at: '2024-07-15T10:00:00Z',
  },
  {
    id: 's2', name: 'Priya Sharma', email: 'priya.sharma@college.edu',
    year: 2, department: 'Electronics', hostel: 'Saraswati (Girls)',
    bio: 'IoT enthusiast. Looking for project partners.', created_at: '2024-07-16T10:00:00Z',
  },
  {
    id: 's3', name: 'Rahul Nair', email: 'rahul.nair@college.edu',
    year: 4, department: 'Mechanical', hostel: 'Narmada (Boys)',
    bio: 'Final year. CAT prep + cricket.', created_at: '2024-07-17T10:00:00Z',
  },
  {
    id: 's4', name: 'Sneha Iyer', email: 'sneha.iyer@college.edu',
    year: 1, department: 'Biotechnology', hostel: 'Yamuna (Girls)',
    ug_number: 'UG24001',
    bio: 'First year, still figuring things out!', created_at: '2024-08-01T10:00:00Z',
  },
  {
    id: 's5', name: 'Karthik Rao', email: 'karthik.rao@college.edu',
    year: 2, department: 'Civil', hostel: 'Kaveri (Boys)',
    bio: 'Photography and trekking.', created_at: '2024-07-20T10:00:00Z',
  },
  {
    id: 's6', name: 'Divya Pillai', email: 'divya.pillai@college.edu',
    year: 3, department: 'Mathematics', hostel: 'GH-1 (Girls)',
    bio: 'Math olympiad, chess, quiet evenings.', created_at: '2024-07-22T10:00:00Z',
  },
  {
    id: 's7', name: 'Varun Singh', email: 'varun.singh@college.edu',
    year: 1, department: 'Computer Science', hostel: 'NH-2 (Boys)',
    ug_number: 'UG24002',
    bio: 'Game dev hobbyist. PS5 gang.', created_at: '2024-08-02T10:00:00Z',
  },
  {
    id: 's8', name: 'Ananya Krishnan', email: 'ananya.k@college.edu',
    year: 4, department: 'Chemical', hostel: 'Saraswati (Girls)',
    bio: 'Research intern. Coffee addict.', created_at: '2024-07-18T10:00:00Z',
  },
];

export const MOCK_ME: Student = {
  id: 'me', name: 'You (Demo User)', email: 'demo@college.edu',
  year: 2, department: 'Computer Science', hostel: 'NH-1 (Boys)',
  bio: 'This is your demo profile. Log in for the real experience.',
  created_at: '2024-08-10T10:00:00Z',
};

// ── Activities ────────────────────────────────────────────────
const now = new Date();
const soon = (h: number) => new Date(now.getTime() + h * 3600000).toISOString();
const past = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1', creator_id: 's1', creator: MOCK_STUDENTS[0],
    title: 'Evening Badminton — Open Court',
    description: 'Casual badminton session at the NH-1 court. All skill levels welcome. Bring your own racket if you have one.',
    scheduled_at: soon(3), hostel: 'NH-1 (Boys)',
    max_participants: 8, status: 'upcoming', participant_count: 5, is_joined: true,
    created_at: past(2),
  },
  {
    id: 'a2', creator_id: 's3', creator: MOCK_STUDENTS[2],
    title: 'GATE Study Group — Fluid Mechanics',
    description: 'Preparing for GATE. We cover 2 topics per session with practice questions. 4th year MECH students preferred, but all welcome.',
    scheduled_at: soon(24), hostel: undefined,
    max_participants: 6, status: 'upcoming', participant_count: 3, is_joined: false,
    created_at: past(5),
  },
  {
    id: 'a3', creator_id: 's2', creator: MOCK_STUDENTS[1],
    title: 'Movie Night — Girls Hostel Common Room',
    description: 'Streaming a movie tonight. Voting happening in the GH common WhatsApp group. Snacks are welcome!',
    scheduled_at: soon(6), hostel: 'Saraswati (Girls)',
    max_participants: 20, status: 'upcoming', participant_count: 12, is_joined: false,
    created_at: past(1),
  },
  {
    id: 'a4', creator_id: 's5', creator: MOCK_STUDENTS[4],
    title: 'Campus Photography Walk',
    description: 'Short 1-hour walk around campus to capture golden-hour shots. Any phone or DSLR welcome.',
    scheduled_at: soon(0.5), hostel: undefined,
    max_participants: 10, status: 'ongoing', participant_count: 7, is_joined: false,
    created_at: past(3),
  },
  {
    id: 'a5', creator_id: 's1', creator: MOCK_STUDENTS[0],
    title: 'Hackathon Team Formation Meeting',
    description: 'Internal SmartIndia Hackathon prep. Looking to form a 5-member team. Need: 2 devs, 1 designer, 1 domain expert.',
    scheduled_at: soon(48), hostel: undefined,
    max_participants: 5, status: 'upcoming', participant_count: 2, is_joined: true,
    created_at: past(12),
  },
  {
    id: 'a6', creator_id: 's8', creator: MOCK_STUDENTS[7],
    title: 'Yoga & Stretching — Terrace',
    description: 'Morning yoga session. 30 minutes, beginner-friendly. Bring a mat or towel.',
    scheduled_at: past(2), hostel: 'Saraswati (Girls)',
    max_participants: 15, status: 'completed', participant_count: 9, is_joined: false,
    created_at: past(26),
  },
];

// ── Help Requests ─────────────────────────────────────────────
export const MOCK_HELP_REQUESTS: HelpRequest[] = [
  {
    id: 'h1', poster_id: 's4', poster: MOCK_STUDENTS[3],
    category: 'item', title: 'Need a calculator for tomorrows exam',
    description: 'My Casio broke. Anyone in Yamuna or nearby can lend a scientific calculator for the morning? Will return by noon.',
    is_resolved: false, response_count: 2, created_at: past(3),
  },
  {
    id: 'h2', poster_id: 's7', poster: MOCK_STUDENTS[6],
    category: 'help', title: 'Stuck on Pointers in C — urgent',
    description: 'Lab test tomorrow and I am completely lost on double pointers. Anyone free to explain over voice call or in person?',
    is_resolved: false, response_count: 4, created_at: past(1),
  },
  {
    id: 'h3', poster_id: 's3', poster: MOCK_STUDENTS[2],
    category: 'item', title: 'Ironing iron — anyone have?',
    description: 'Need to iron formal clothes for placement interview tomorrow morning.',
    is_resolved: true, response_count: 1, created_at: past(18),
  },
  {
    id: 'h4', poster_id: 's6', poster: MOCK_STUDENTS[5],
    category: 'help', title: 'Can someone pick up my parcel from the gate?',
    description: 'Got a delivery notification but I have a class until 4 PM. Parcel is at the main gate security. Someone from GH please?',
    is_resolved: false, response_count: 0, created_at: past(0.5),
  },
  {
    id: 'h5', poster_id: 's2', poster: MOCK_STUDENTS[1],
    category: 'other', title: 'Looking for a roommate swap for this weekend',
    description: 'My roommate is going home. Anyone want to swap rooms for the weekend so we can study together? 2nd year EEE/CS preferred.',
    is_resolved: false, response_count: 1, created_at: past(6),
  },
];

// ── Posts ─────────────────────────────────────────────────────
export const MOCK_POSTS: Post[] = [
  {
    id: 'p1', author_id: 's1', author: MOCK_STUDENTS[0],
    title: 'Looking for DSA study partners — LeetCode grind',
    body: 'Targeting 2-3 problems a day. Lets solve together and discuss approaches. Preferably 2nd/3rd year CS/IT. DM or reply here.',
    tag: 'study-group', created_at: past(4),
  },
  {
    id: 'p2', author_id: 's5', author: MOCK_STUDENTS[4],
    title: 'Minor project partner needed — Smart Irrigation System',
    body: 'Working on an IoT-based smart irrigation project for the mini project submission. Need 1–2 more members. Hardware + coding required.',
    tag: 'project', created_at: past(8),
  },
  {
    id: 'p3', author_id: 's8', author: MOCK_STUDENTS[7],
    title: 'Research paper — seeking collaborators (ML domain)',
    body: 'Writing a paper on anomaly detection in chemical processes using ML. Looking for co-authors or reviewers from CS / Chem Engg.',
    tag: 'collaboration', created_at: past(14),
  },
  {
    id: 'p4', author_id: 's2', author: MOCK_STUDENTS[1],
    title: 'Hostel cultural committee is open for applications',
    body: 'The hostel cultural committee is accepting applications for the new academic year. Roles: event coordinator, décor, media. Open to all years.',
    tag: 'announcement', created_at: past(22),
  },
  {
    id: 'p5', author_id: 's6', author: MOCK_STUDENTS[5],
    title: 'Soft skills reading circle — starting this Saturday',
    body: 'Starting a bi-weekly reading circle focused on communication and leadership books. Currently reading "The Pragmatic Programmer". Room 204, GH-1.',
    tag: 'study-group', created_at: past(36),
  },
];

// ── Activity Chat Messages ─────────────────────────────────────
export const MOCK_ACTIVITY_MESSAGES: Record<string, ActivityMessage[]> = {
  a1: [
    { id: 'm1', activity_id: 'a1', sender_id: 's1', sender: MOCK_STUDENTS[0], content: 'I have 2 rackets. Anyone need one?', sent_at: past(1.5) },
    { id: 'm2', activity_id: 'a1', sender_id: 's7', sender: MOCK_STUDENTS[6], content: 'I will take one. Thanks!', sent_at: past(1.2) },
    { id: 'm3', activity_id: 'a1', sender_id: 's5', sender: MOCK_STUDENTS[4], content: 'Court will be free at 6 PM. Lets confirm then?', sent_at: past(0.8) },
  ],
  a5: [
    { id: 'm4', activity_id: 'a5', sender_id: 's1', sender: MOCK_STUDENTS[0], content: 'Problem statement drops at 9 AM tomorrow. We should finalize team tonight.', sent_at: past(10) },
    { id: 'm5', activity_id: 'a5', sender_id: 's2', sender: MOCK_STUDENTS[1], content: 'I can handle the IoT hardware domain. Count me in!', sent_at: past(9) },
  ],
};

// ── Help Responses ─────────────────────────────────────────────
export const MOCK_HELP_RESPONSES: Record<string, HelpResponse[]> = {
  h1: [
    { id: 'r1', request_id: 'h1', responder_id: 's6', responder: MOCK_STUDENTS[5], content: 'I have a Casio fx-991EX. Come to GH-1 Room 312 before 8 AM.', is_accepted: true, created_at: past(2) },
    { id: 'r2', request_id: 'h1', responder_id: 's2', responder: MOCK_STUDENTS[1], content: 'I have one too if the first one does not work out!', is_accepted: false, created_at: past(1.5) },
  ],
  h2: [
    { id: 'r3', request_id: 'h2', responder_id: 's1', responder: MOCK_STUDENTS[0], content: 'I can help. Come to NH-1 common room in 20 mins.', is_accepted: true, created_at: past(0.8) },
    { id: 'r4', request_id: 'h2', responder_id: 's3', responder: MOCK_STUDENTS[2], content: 'Check K&R C book page 97-112 for a clear explanation.', is_accepted: false, created_at: past(0.5) },
  ],
};

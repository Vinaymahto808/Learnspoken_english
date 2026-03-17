export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  level: Level;
  description: string;
  icon: string;
  xp: number;
}

export interface VocabularyCard {
  word: string;
  phonetic: string;
  definition: string;
  example: string;
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastActive: string;
  completedLessons: string[];
  badges: string[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'greetings-1',
    title: 'Warm Welcomes',
    topic: 'Greetings',
    level: 'Beginner',
    description: 'Learn how to introduce yourself and greet others naturally.',
    icon: 'MessageCircle',
    xp: 50,
  },
  {
    id: 'shopping-1',
    title: 'At the Market',
    topic: 'Shopping',
    level: 'Beginner',
    description: 'Essential phrases for asking prices and making purchases.',
    icon: 'ShoppingBag',
    xp: 60,
  },
  {
    id: 'travel-1',
    title: 'Airport Essentials',
    topic: 'Travel',
    level: 'Intermediate',
    description: 'Navigate the airport and check-in with confidence.',
    icon: 'Plane',
    xp: 80,
  },
  {
    id: 'business-1',
    title: 'Meeting Etiquette',
    topic: 'Business',
    level: 'Advanced',
    description: 'Master professional introductions and meeting participation.',
    icon: 'Briefcase',
    xp: 100,
  },
  {
    id: 'interview-1',
    title: 'The Dream Job',
    topic: 'Interviews',
    level: 'Advanced',
    description: 'Practice answering common interview questions fluently.',
    icon: 'UserCheck',
    xp: 120,
  },
];

export const VOCABULARY: VocabularyCard[] = [
  {
    word: 'Enthusiastic',
    phonetic: '/ɪnˌθuːziˈæstɪk/',
    definition: 'Having or showing intense and eager enjoyment, interest, or approval.',
    example: 'She was very enthusiastic about the new project.',
  },
  {
    word: 'Persistent',
    phonetic: '/pəˈsɪstənt/',
    definition: 'Continuing firmly or obstinately in a course of action in spite of difficulty or opposition.',
    example: 'His persistent efforts finally paid off.',
  },
  {
    word: 'Eloquent',
    phonetic: '/ˈɛləkwənt/',
    definition: 'Fluent or persuasive in speaking or writing.',
    example: 'The speaker gave an eloquent defense of his ideas.',
  },
  {
    word: 'Collaborative',
    phonetic: '/kəˈlæb.ə.reɪ.tɪv/',
    definition: 'Produced or conducted by two or more parties working together.',
    example: 'We need to foster a collaborative working environment.',
  },
  {
    word: 'Adaptability',
    phonetic: '/əˌdæp.təˈbɪl.ə.ti/',
    definition: 'The quality of being able to adjust to new conditions.',
    example: 'Adaptability is a key skill in the modern workplace.',
  },
];

export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface RolePlay {
  id: string;
  title: string;
  scenario: string;
  tutorRole: string;
  userRole: string;
}

export const ROLE_PLAYS: RolePlay[] = [
  {
    id: 'rp-1',
    title: 'Ordering Coffee',
    scenario: 'You are at a busy cafe in London.',
    tutorRole: 'Barista',
    userRole: 'Customer',
  },
  {
    id: 'rp-2',
    title: 'Job Interview',
    scenario: 'You are interviewing for a software engineer position.',
    tutorRole: 'Hiring Manager',
    userRole: 'Candidate',
  },
  {
    id: 'rp-4',
    title: 'Behavioral Interview',
    scenario: 'You are answering "Tell me about a time..." questions.',
    tutorRole: 'HR Specialist',
    userRole: 'Job Seeker',
  },
  {
    id: 'rp-5',
    title: 'Salary Negotiation',
    scenario: 'You have received an offer and want to negotiate terms.',
    tutorRole: 'Recruiter',
    userRole: 'Candidate',
  },
  {
    id: 'rp-6',
    title: 'Technical Presentation',
    scenario: 'You are presenting your project to a technical panel.',
    tutorRole: 'Senior Architect',
    userRole: 'Lead Developer',
  },
  {
    id: 'rp-3',
    title: 'Asking for Directions',
    scenario: 'You are lost in New York City.',
    tutorRole: 'Local Resident',
    userRole: 'Tourist',
  },
];


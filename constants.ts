
import { Course, SubscriptionPlan } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Advanced React Architecture',
    description: 'Learn how to scale large applications with modern React patterns, performance optimization, and custom hooks.',
    teacherId: 't1',
    teacherName: 'Sarah Jenkins',
    thumbnail: 'https://picsum.photos/seed/react/800/450',
    category: 'Development',
    language: 'en',
    isGroup: true,
    price: 49.99,
    rating: 4.8,
    studentsCount: 1240,
    nextSession: '2023-11-25T15:00:00Z',
    zoomLink: 'https://zoom.us/j/mock-meeting-1'
  },
  {
    id: '2',
    title: 'Data Science Fundamentals',
    description: 'Master Python, Pandas, and Scikit-Learn to start your journey into data analysis and machine learning.',
    teacherId: 't2',
    teacherName: 'Dr. Alan Turing',
    thumbnail: 'https://picsum.photos/seed/data/800/450',
    category: 'Data Science',
    language: 'ru',
    isGroup: true,
    price: 39.99,
    rating: 4.9,
    studentsCount: 850,
    nextSession: '2023-11-26T10:00:00Z',
    zoomLink: 'https://zoom.us/j/mock-meeting-2'
  },
  {
    id: '3',
    title: 'Personalized UI/UX Coaching',
    description: 'One-on-one sessions focused on building your portfolio and mastering Figma with industry veterans.',
    teacherId: 't3',
    teacherName: 'Elena Rossi',
    thumbnail: 'https://picsum.photos/seed/design/800/450',
    category: 'Design',
    language: 'en',
    isGroup: false,
    price: 120.00,
    rating: 5.0,
    studentsCount: 15,
    nextSession: '2023-11-27T14:30:00Z',
    zoomLink: 'https://zoom.us/j/mock-meeting-3'
  },
  {
    id: '4',
    title: 'O\'zbek tilida Dasturlash',
    description: 'Dasturlash asoslarini o\'zbek tilida professional darajada o\'rganing. Front-end va Back-end asoslari.',
    teacherId: 't4',
    teacherName: 'Abdurahmon Azizov',
    thumbnail: 'https://picsum.photos/seed/uzbek/800/450',
    category: 'Development',
    language: 'uz',
    isGroup: true,
    price: 29.99,
    rating: 4.7,
    studentsCount: 1500,
    nextSession: '2023-11-28T09:00:00Z',
    zoomLink: 'https://zoom.us/j/mock-meeting-5'
  }
];

export const PLANS = [
  {
    name: SubscriptionPlan.BASIC,
    price: '$19/mo',
    features: ['Access to 5 Courses', 'Group Study Sessions', 'Community Forum'],
    color: 'bg-blue-500'
  },
  {
    name: SubscriptionPlan.PRO,
    price: '$49/mo',
    features: ['Unlimited Courses', 'Priority Support', '1-on-1 Sessions', 'Certificates'],
    color: 'bg-indigo-600',
    popular: true
  },
  {
    name: SubscriptionPlan.ENTERPRISE,
    price: 'Custom',
    features: ['Team Management', 'Custom Learning Paths', 'Analytics Dashboard'],
    color: 'bg-slate-800'
  }
];

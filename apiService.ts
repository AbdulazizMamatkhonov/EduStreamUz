const API_URL = '/api';

export const api = {
  // Auth
  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  // Courses
  getCourses: async () => {
    const res = await fetch(`${API_URL}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },

  createCourse: async (courseData: any) => {
    const res = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
    if (!res.ok) throw new Error('Failed to create course');
    return res.json();
  },

  // Quizzes
  getQuizzes: async (courseId: string) => {
    const res = await fetch(`${API_URL}/quizzes/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch quizzes');
    return res.json();
  },

  createQuiz: async (quizData: any) => {
    const res = await fetch(`${API_URL}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData)
    });
    if (!res.ok) throw new Error('Failed to create quiz');
    return res.json();
  },

  // Homework
  getHomework: async (courseId: string) => {
    const res = await fetch(`${API_URL}/homework/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch homework');
    return res.json();
  },

  createHomework: async (hwData: any) => {
    const res = await fetch(`${API_URL}/homework`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hwData)
    });
    if (!res.ok) throw new Error('Failed to create homework');
    return res.json();
  }
};

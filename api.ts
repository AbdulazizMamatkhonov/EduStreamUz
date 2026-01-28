
const API_URL = 'http://localhost:5000/api';

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
    return res.json();
  },

  createCourse: async (courseData: any) => {
    const res = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });
    return res.json();
  },

  // Quizzes
  getQuizzes: async (courseId: string) => {
    const res = await fetch(`${API_URL}/quizzes/${courseId}`);
    return res.json();
  },

  createQuiz: async (quizData: any) => {
    const res = await fetch(`${API_URL}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData)
    });
    return res.json();
  },

  // Homework
  getHomework: async (courseId: string) => {
    const res = await fetch(`${API_URL}/homework/${courseId}`);
    return res.json();
  },

  createHomework: async (hwData: any) => {
    const res = await fetch(`${API_URL}/homework`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hwData)
    });
    return res.json();
  }
};

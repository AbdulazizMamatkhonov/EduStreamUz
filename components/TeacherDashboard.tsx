
import React, { useState, useEffect } from 'react';
import { User, Course, AppLanguage, Homework, Quiz, QuizQuestion, QuizResult, QuestionType } from '../types';
import { translations } from '../translations';
import { api } from '../apiService';

interface TeacherDashboardProps {
  user: User;
  appLanguage: AppLanguage;
  onStartSession: (course: Course) => void;
  onCreateCourse: (course: Course) => void;
  courses: Course[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, appLanguage, onStartSession, onCreateCourse, courses }) => {
  const t = translations[appLanguage];
  const teacherCourses = courses.filter((c: Course) => c.teacherId === user.id);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'results'>('overview');
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateHomework, setShowCreateHomework] = useState(false);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([
    { id: 'r1', quizId: 'q1', studentId: 's1', studentName: 'Alex Student', score: 85, totalQuestions: 10, completedAt: '2023-10-20' },
    { id: 'r2', quizId: 'q1', studentId: 's5', studentName: 'Maria Garcia', score: 40, totalQuestions: 10, completedAt: '2023-10-21' }
  ]);

  useEffect(() => {
    if (teacherCourses.length > 0) {
      const loadData = async () => {
        const courseId = teacherCourses[0].id;
        try {
          const [qData, hwData] = await Promise.all([
            api.getQuizzes(courseId),
            api.getHomework(courseId)
          ]);
          setQuizzes(qData || []);
          setHomeworks(hwData || []);
        } catch (err) {
          console.warn("Could not load teacher data from backend.");
        }
      };
      loadData();
    }
  }, [courses]);

  const [quizTitle, setQuizTitle] = useState('');
  const [quizCourseId, setQuizCourseId] = useState(teacherCourses[0]?.id || '');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const addQuestion = (type: QuestionType) => {
    const newQ: QuizQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      question: '',
      points: 10,
      hint: '',
      options: type === 'multiple-choice' ? ['', ''] : undefined,
      correctOptionIndex: type === 'multiple-choice' ? 0 : undefined
    };
    setQuizQuestions([...quizQuestions, newQ]);
  };

  const removeQuestion = (id: string) => {
    setQuizQuestions(quizQuestions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    setQuizQuestions(quizQuestions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle || quizQuestions.length === 0) {
      alert("Please provide a title and at least one question.");
      return;
    }
    const newQuiz: Partial<Quiz> = {
      courseId: quizCourseId,
      title: quizTitle,
      description: `Assessment for ${quizTitle}`,
      questions: quizQuestions,
    };
    try {
      const saved = await api.createQuiz(newQuiz);
      setQuizzes([...quizzes, saved]);
      setShowQuizBuilder(false);
      setQuizTitle('');
      setQuizQuestions([]);
    } catch (err) {
      alert("Failed to save quiz to server.");
    }
  };

  const [newCourse, setNewCourse] = useState({ title: '', category: 'Development', price: 0, description: '' });
  const [newHomework, setNewHomework] = useState<Partial<Homework>>({ type: 'text', title: '', description: '', courseId: teacherCourses[0]?.id || '' });

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const course: Partial<Course> = {
      title: newCourse.title,
      description: newCourse.description,
      teacherId: user.id,
      teacherName: user.name,
      thumbnail: `https://picsum.photos/seed/${newCourse.title}/800/450`,
      category: newCourse.category,
      language: appLanguage,
      isGroup: true,
      price: newCourse.price,
      rating: 0,
      studentsCount: 0,
      nextSession: new Date().toISOString()
    };
    try {
      await onCreateCourse(course as Course);
      setShowCreateCourse(false);
      setNewCourse({ title: '', category: 'Development', price: 0, description: '' });
    } catch (err) {
      alert("Error saving course");
    }
  };

  const handleSaveHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    const hw: Partial<Homework> = {
      courseId: newHomework.courseId!,
      title: newHomework.title!,
      description: newHomework.description!,
      type: newHomework.type as 'text' | 'file',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    try {
      const saved = await api.createHomework(hw);
      setHomeworks((prev: Homework[]) => [...prev, saved]);
      setShowCreateHomework(false);
    } catch (err) {
      alert("Error saving homework");
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{t.teacher_dashboard}</h2>
            <p className="text-slate-500 font-medium">Manage your educational kingdom from one place.</p>
          </div>
          <div className="flex gap-4">
             <button 
                onClick={() => setShowCreateCourse(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Create Course
              </button>
          </div>
        </div>
        <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl border border-slate-200 w-fit">
          <button onClick={() => setActiveTab('overview')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('curriculum')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'curriculum' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Homework & Quizzes</button>
          <button onClick={() => setActiveTab('results')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'results' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Quiz Results</button>
        </div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Your Live Courses</h3>
                  <div className="space-y-4">
                    {teacherCourses.map((course: Course) => (
                      <div key={course.id} className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <img src={course.thumbnail} className="w-24 h-16 rounded-lg object-cover" alt="" />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{course.title}</h4>
                          <p className="text-xs text-slate-500">{course.studentsCount} Students enrolled</p>
                        </div>
                        <button onClick={() => onStartSession(course)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100">Go Live</button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
               <h3 className="text-xl font-bold mb-6">Quick Stats</h3>
               <div className="space-y-6">
                 <div><p className="text-xs text-indigo-400 font-bold uppercase mb-1">Total Revenue</p><p className="text-3xl font-black">$12,450.00</p></div>
                 <div><p className="text-xs text-indigo-400 font-bold uppercase mb-1">Active Students</p><p className="text-3xl font-black">2,482</p></div>
               </div>
            </div>
          </div>
        )}
        {showCreateCourse && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black text-slate-900">New Course</h3><button onClick={() => setShowCreateCourse(false)}><i className="fas fa-times text-xl"></i></button></div>
                <form onSubmit={handleSaveCourse} className="space-y-6">
                  <input required value={newCourse.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourse({...newCourse, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Title" />
                  <textarea required value={newCourse.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewCourse({...newCourse, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Description" rows={3} />
                  <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl">Launch Course</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;

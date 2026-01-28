
import React, { useState } from 'react';
import { User, Course, AppLanguage, Homework, Quiz, QuizQuestion, QuizResult, QuestionType } from '../types';
import { translations } from '../translations';

interface TeacherDashboardProps {
  user: User;
  appLanguage: AppLanguage;
  onStartSession: (course: Course) => void;
  onCreateCourse: (course: Course) => void;
  courses: Course[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, appLanguage, onStartSession, onCreateCourse, courses }) => {
  const t = translations[appLanguage];
  const teacherCourses = courses.filter(c => c.teacherId === user.id);
  
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

  // Quiz Builder State
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

  const addOption = (qId: string) => {
    setQuizQuestions(quizQuestions.map(q => {
      if (q.id === qId && q.options) {
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    }));
  };

  const handleSaveQuiz = () => {
    if (!quizTitle || quizQuestions.length === 0) {
      alert("Please provide a title and at least one question.");
      return;
    }
    const newQuiz: Quiz = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: quizCourseId,
      title: quizTitle,
      description: `Assessment for ${quizTitle}`,
      questions: quizQuestions,
      createdAt: new Date().toISOString()
    };
    setQuizzes([...quizzes, newQuiz]);
    setShowQuizBuilder(false);
    resetQuizBuilder();
  };

  const resetQuizBuilder = () => {
    setQuizTitle('');
    setQuizQuestions([]);
  };

  // Course & Homework logic (previous)
  const [newCourse, setNewCourse] = useState({ title: '', category: 'Development', price: 0, description: '' });
  const [newHomework, setNewHomework] = useState<Partial<Homework>>({ type: 'text', title: '', description: '', courseId: teacherCourses[0]?.id || '' });

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const course: Course = {
      id: Math.random().toString(36).substr(2, 9),
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
    onCreateCourse(course);
    setShowCreateCourse(false);
    setNewCourse({ title: '', category: 'Development', price: 0, description: '' });
  };

  const handleSaveHomework = (e: React.FormEvent) => {
    e.preventDefault();
    const hw: Homework = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: newHomework.courseId!,
      title: newHomework.title!,
      description: newHomework.description!,
      type: newHomework.type as 'text' | 'file',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    setHomeworks(prev => [...prev, hw]);
    setShowCreateHomework(false);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
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

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl border border-slate-200 w-fit">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('curriculum')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'curriculum' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Homework & Quizzes
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'results' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Quiz Results
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Your Live Courses</h3>
                  <div className="space-y-4">
                    {teacherCourses.map(course => (
                      <div key={course.id} className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <img src={course.thumbnail} className="w-24 h-16 rounded-lg object-cover" alt="" />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{course.title}</h4>
                          <p className="text-xs text-slate-500">{course.studentsCount} Students enrolled</p>
                        </div>
                        <button 
                          onClick={() => onStartSession(course)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100"
                        >
                          Go Live
                        </button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
            
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
               <h3 className="text-xl font-bold mb-6">Quick Stats</h3>
               <div className="space-y-6">
                 <div>
                   <p className="text-xs text-indigo-400 font-bold uppercase mb-1">Total Revenue</p>
                   <p className="text-3xl font-black">$12,450.00</p>
                 </div>
                 <div>
                   <p className="text-xs text-indigo-400 font-bold uppercase mb-1">Active Students</p>
                   <p className="text-3xl font-black">2,482</p>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Homework Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Homework Assignments</h3>
                <button 
                  onClick={() => setShowCreateHomework(true)}
                  className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-100 transition-colors"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="space-y-4">
                {homeworks.length > 0 ? homeworks.map(hw => (
                  <div key={hw.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                    <div className="flex justify-between items-start">
                       <h4 className="font-bold text-slate-900">{hw.title}</h4>
                       <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${hw.type === 'file' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                         {hw.type}
                       </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-1">{hw.description}</p>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 text-center py-10">No homework created yet.</p>
                )}
              </div>
            </div>

            {/* Quiz Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Dynamic Quizzes</h3>
                <button 
                  onClick={() => setShowQuizBuilder(true)}
                  className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-100 transition-colors"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="space-y-4">
                {quizzes.length > 0 ? quizzes.map(q => (
                  <div key={q.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900">{q.title}</h4>
                      <p className="text-xs text-slate-500">{q.questions.length} Questions • {q.questions.reduce((acc, curr) => acc + curr.points, 0)} Pts</p>
                    </div>
                    <i className="fas fa-chevron-right text-slate-300"></i>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 text-center py-10">Use the (+) to build a dynamic quiz.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm overflow-hidden">
             <h3 className="text-xl font-bold text-slate-900 mb-8">Latest Assessment Results</h3>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-slate-100">
                     <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Student</th>
                     <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Quiz Title</th>
                     <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2">Score</th>
                     <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest px-2 text-right">Date</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {quizResults.map(res => (
                     <tr key={res.id}>
                       <td className="py-4 px-2">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-bold">
                              {res.studentName.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-800">{res.studentName}</span>
                         </div>
                       </td>
                       <td className="py-4 px-2 text-sm text-slate-600 font-medium">Core Concepts Final</td>
                       <td className="py-4 px-2">
                         <span className={`px-2 py-1 rounded-lg text-xs font-black ${res.score >= 80 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                           {res.score}%
                         </span>
                       </td>
                       <td className="py-4 px-2 text-right text-xs text-slate-400">{res.completedAt}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {/* MODALS SECTION */}

        {/* Quiz Builder Modal */}
        {showQuizBuilder && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
              
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Quiz Constructor</h3>
                  <p className="text-sm text-slate-500 font-medium">Build a dynamic assessment for your students.</p>
                </div>
                <button onClick={() => setShowQuizBuilder(false)} className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* General Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Assessment Title</label>
                    <input 
                      type="text" 
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-500 focus:ring-0 transition-all"
                      placeholder="e.g. Midterm Programming Quiz"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Target Course</label>
                    <select 
                      value={quizCourseId}
                      onChange={(e) => setQuizCourseId(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-500 focus:ring-0 transition-all"
                    >
                      {teacherCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                </div>

                {/* Questions Stack */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-black text-slate-900">Question List ({quizQuestions.length})</h4>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => addQuestion('multiple-choice')}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all flex items-center gap-2"
                       >
                         <i className="fas fa-list-ul"></i>
                         + Multiple Choice
                       </button>
                       <button 
                        onClick={() => addQuestion('text-box')}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-100 transition-all flex items-center gap-2"
                       >
                         <i className="fas fa-align-left"></i>
                         + Open Text
                       </button>
                    </div>
                  </div>

                  {quizQuestions.length === 0 ? (
                    <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 text-3xl mx-auto mb-4">
                        <i className="fas fa-puzzle-piece"></i>
                      </div>
                      <p className="text-slate-400 font-bold">Start by adding your first question above.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {quizQuestions.map((q, idx) => (
                        <div key={q.id} className="bg-slate-50 rounded-[2rem] border border-slate-200 p-8 relative group hover:border-indigo-200 transition-all shadow-sm">
                           {/* Toolbar */}
                           <div className="absolute top-6 right-6 flex gap-2">
                             <button onClick={() => removeQuestion(q.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
                               <i className="fas fa-trash text-xs"></i>
                             </button>
                           </div>

                           <div className="flex items-start gap-4 mb-6">
                             <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black flex-shrink-0">
                               {idx + 1}
                             </div>
                             <div className="flex-1">
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Question Description</label>
                                <textarea 
                                  value={q.question}
                                  onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:border-indigo-500 transition-all"
                                  placeholder="Write your question here..."
                                  rows={2}
                                />
                             </div>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ml-14">
                              <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Hint (Optional)</label>
                                <div className="relative">
                                  <i className="fas fa-lightbulb absolute left-3 top-3.5 text-amber-400"></i>
                                  <input 
                                    type="text" 
                                    value={q.hint}
                                    onChange={(e) => updateQuestion(q.id, { hint: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs italic text-slate-500"
                                    placeholder="Help students with a small clue..."
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Points</label>
                                <input 
                                  type="number" 
                                  value={q.points}
                                  onChange={(e) => updateQuestion(q.id, { points: parseInt(e.target.value) || 0 })}
                                  className="w-32 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold"
                                />
                              </div>
                           </div>

                           {/* MCQ Options */}
                           {q.type === 'multiple-choice' && (
                             <div className="mt-8 ml-14 space-y-4">
                                <label className="block text-[10px] font-black uppercase text-slate-400">Options (Select the correct one)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {q.options?.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex items-center gap-2 group/opt">
                                      <input 
                                        type="radio" 
                                        checked={q.correctOptionIndex === optIdx}
                                        onChange={() => updateQuestion(q.id, { correctOptionIndex: optIdx })}
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                      />
                                      <input 
                                        type="text" 
                                        value={opt}
                                        onChange={(e) => {
                                          const newOpts = [...q.options!];
                                          newOpts[optIdx] = e.target.value;
                                          updateQuestion(q.id, { options: newOpts });
                                        }}
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:border-indigo-500"
                                        placeholder={`Option ${optIdx + 1}`}
                                      />
                                    </div>
                                  ))}
                                  <button 
                                    onClick={() => addOption(q.id)}
                                    className="px-4 py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all"
                                  >
                                    + Add Option
                                  </button>
                                </div>
                             </div>
                           )}

                           {/* Text Box Option */}
                           {q.type === 'text-box' && (
                             <div className="mt-8 ml-14">
                               <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Sample Correct Answer (for grading context)</label>
                               <textarea 
                                  value={q.correctAnswerText}
                                  onChange={(e) => updateQuestion(q.id, { correctAnswerText: e.target.value })}
                                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs italic text-slate-500"
                                  placeholder="What should the ideal response look like?"
                                  rows={2}
                                />
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                <button 
                  onClick={() => setShowQuizBuilder(false)}
                  className="px-8 py-3 rounded-2xl text-slate-600 font-bold hover:bg-slate-200 transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSaveQuiz}
                  className="px-10 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Publish Quiz
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Existing modals... */}
        {showCreateCourse && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900">New Course</h3>
                  <button onClick={() => setShowCreateCourse(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times text-xl"></i></button>
                </div>
                <form onSubmit={handleSaveCourse} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Title</label>
                    <input 
                      required
                      type="text" 
                      value={newCourse.title}
                      onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. Mastering Advanced React"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                      <select 
                        value={newCourse.category}
                        onChange={e => setNewCourse({...newCourse, category: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                      >
                        <option>Development</option>
                        <option>Design</option>
                        <option>Business</option>
                        <option>Data Science</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Price ($)</label>
                      <input 
                        type="number" 
                        value={newCourse.price}
                        onChange={e => setNewCourse({...newCourse, price: parseFloat(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                    <textarea 
                      required
                      value={newCourse.description}
                      onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                    Launch Course
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {showCreateHomework && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-8">
                 <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900">Add Homework</h3>
                  <button onClick={() => setShowCreateHomework(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times text-xl"></i></button>
                </div>
                <form onSubmit={handleSaveHomework} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Course</label>
                    <select 
                      value={newHomework.courseId}
                      onChange={e => setNewHomework({...newHomework, courseId: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                    >
                      {teacherCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Homework Title</label>
                    <input 
                      required
                      type="text" 
                      value={newHomework.title}
                      onChange={e => setNewHomework({...newHomework, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Type</label>
                    <div className="flex gap-4">
                       <button 
                        type="button"
                        onClick={() => setNewHomework({...newHomework, type: 'text'})}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${newHomework.type === 'text' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                       >
                         Text Input
                       </button>
                       <button 
                        type="button"
                        onClick={() => setNewHomework({...newHomework, type: 'file'})}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${newHomework.type === 'file' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                       >
                         File Upload
                       </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Instructions</label>
                    <textarea 
                      required
                      value={newHomework.description}
                      onChange={e => setNewHomework({...newHomework, description: e.target.value})}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl">
                    Assign Homework
                  </button>
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

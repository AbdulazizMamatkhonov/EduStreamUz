import React, { useState, useEffect } from 'react';
import { User, UserRole, SubscriptionPlan, AppLanguage, Course } from './types';
import { PLANS, MOCK_COURSES } from './constants';
import { translations } from './translations';
import Navbar from './components/Navbar';
import CourseCard from './components/CourseCard';
import Classroom from './components/Classroom';
import TeacherDashboard from './components/TeacherDashboard';
import LoginPage from './components/LoginPage';
import CourseDetails from './components/CourseDetails';
import AdminDashboard from './components/AdminDashboard';
import { api } from './apiService';

type ViewType = 'landing' | 'courses' | 'pricing' | 'dashboard' | 'course-details' | 'classroom';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [view, setView] = useState<ViewType>('landing');
  const [activeClassroom, setActiveClassroom] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const data = await api.getCourses();
        if (data && Array.isArray(data) && data.length > 0) {
          const normalized = data.map((course: Course & { _id?: string }) => ({
            ...course,
            id: course.id || course._id || course.title
          }));
          setCourses(normalized);
        }
        setIsBackendConnected(true);
      } catch (err) {
        console.warn('Backend not reachable or empty. Using mock data.');
        setIsBackendConnected(false);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const handleLogin = async (payload: { email: string; password: string; role: UserRole }) => {
    try {
      const data = await api.login({ email: payload.email, password: payload.password });
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (err) {
      const isTeacher = payload.role === UserRole.TEACHER;
      const isAdmin = payload.role === UserRole.ADMIN;

      setUser({
        id: isAdmin ? 'a1' : isTeacher ? 't1' : 's1',
        name: isAdmin ? 'Admin User' : isTeacher ? 'Sarah Jenkins' : 'Alex Student',
        email:
          payload.email ||
          (isAdmin ? 'admin@edustream.com' : isTeacher ? 'sarah@edustream.com' : 'student@edustream.com'),
        role: payload.role,
        avatar: `https://i.pravatar.cc/150?u=${isAdmin ? 'admin' : isTeacher ? 'teacher' : 'student'}`,
        subscription: isTeacher || isAdmin ? undefined : SubscriptionPlan.PRO,
      });
    }

    setShowLogin(false);
    setView('dashboard');
  };

  const handleRegister = async (payload: { name: string; email: string; password: string; role: UserRole }) => {
    try {
      const data = await api.register(payload);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (err) {
      // UI only allows student signup; keep fallback simple
      setUser({
        id: 's1',
        name: payload.name || 'Alex Student',
        email: payload.email || 'student@edustream.com',
        role: UserRole.STUDENT,
        avatar: `https://i.pravatar.cc/150?u=${payload.email || 'student'}`,
        subscription: SubscriptionPlan.FREE,
      });
    }

    setShowLogin(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setEnrolledCourses([]);
    setActiveClassroom(null);
    setSelectedCourse(null);
    localStorage.removeItem('token');
    setView('landing');
  };

  const handleCreateCourse = async (newCourse: Course) => {
    try {
      const saved = await api.createCourse(newCourse);
      setCourses((prev: Course[]) => [saved, ...prev]);
    } catch (err) {
      setCourses((prev: Course[]) => [{ ...newCourse, id: Date.now().toString() }, ...prev]);
    }
  };

  const t = translations[language];

  const enrollInCourse = async (e: React.MouseEvent, courseId: string) => {
    if (e && (e as any).stopPropagation) e.stopPropagation();
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (enrolledCourses.includes(courseId)) return;

    setEnrolledCourses((prev: string[]) => [...prev, courseId]);

    // optional backend enrollment (safe fallback if endpoint not available)
    try {
      const updated = await api.enrollCourse(courseId);
      setCourses((prev: Course[]) =>
        prev.map((course) =>
          course.id === updated._id || course.id === updated.id
            ? { ...course, studentsCount: updated.studentsCount }
            : course
        )
      );
    } catch (err) {
      setCourses((prev: Course[]) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, studentsCount: (course.studentsCount || 0) + 1 } : course
        )
      );
    }
  };

  const joinClassroom = (course: Course) => {
    setActiveClassroom(course);
    setView('classroom');
  };

  const viewCourse = (course: Course) => {
    setSelectedCourse(course);
    setView('course-details');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">
            Initializing EduStream...
          </p>
        </div>
      </div>
    );
  }

  const mainView = () => {
    // Classroom
    if (view === 'classroom' && activeClassroom) {
      return <Classroom course={activeClassroom} onExit={() => setView('dashboard')} appLanguage={language} />;
    }

    // Course details
    if (view === 'course-details' && selectedCourse) {
      return (
        <CourseDetails
          course={selectedCourse}
          appLanguage={language}
          onEnroll={(id: string) => enrollInCourse({ stopPropagation: () => {} } as React.MouseEvent, id)}
          isEnrolled={enrolledCourses.includes(selectedCourse.id)}
          onJoin={() => joinClassroom(selectedCourse)}
          onBack={() => setView('courses')}
        />
      );
    }

    // Dashboard
    if (view === 'dashboard' && user) {
      if (user.role === UserRole.ADMIN) {
        return <AdminDashboard user={user} appLanguage={language} />;
      }

      if (user.role === UserRole.TEACHER) {
        return (
          <TeacherDashboard
            user={user}
            appLanguage={language}
            onStartSession={joinClassroom}
            onCreateCourse={handleCreateCourse}
            courses={courses}
          />
        );
      }

      // Student dashboard
      return (
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  {t.welcome_back}, {user.name}!
                </h2>
                <p className="text-slate-500 mt-2 font-medium">{t.dashboard_subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-6">
                  <i className="fas fa-book-open"></i>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{t.stat_active_courses}</p>
                <p className="text-3xl font-black text-slate-900">{enrolledCourses.length}</p>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">{t.course_progress}</h3>

              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {courses
                    .filter((c: Course) => enrolledCourses.includes(c.id))
                    .map((course: Course) => (
                      <div
                        key={course.id}
                        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => viewCourse(course)}
                      >
                        <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm">
                          <img src={course.thumbnail} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 text-lg mb-4">{course.title}</h4>
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              joinClassroom(course);
                            }}
                            className="text-xs font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                          >
                            {t.continue_learning}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200 text-slate-400">
                  <button onClick={() => setView('courses')} className="font-bold text-indigo-600 hover:underline">
                    {t.btn_find_course}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    // Courses page
    if (view === 'courses') {
      return (
        <section id="courses" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">{t.featured_courses}</h2>
              <p className="mt-4 text-xl text-slate-500 font-medium">{t.courses_subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course: Course) => (
                <div key={course.id} onClick={() => viewCourse(course)} className="cursor-pointer">
                  <CourseCard
                    course={course}
                    onEnroll={(id: string) => enrollInCourse({ stopPropagation: () => {} } as React.MouseEvent, id)}
                    isEnrolled={enrolledCourses.includes(course.id)}
                    appLanguage={language}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Pricing page
    if (view === 'pricing') {
      return (
        <section id="pricing" className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold mb-12">{t.pricing_title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-slate-800 p-8 rounded-[2.5rem] border ${
                    plan.popular ? 'border-indigo-500 scale-105' : 'border-slate-700'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                  <div className="text-4xl font-black mb-6">{plan.price}</div>
                  <button className="w-full bg-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                    {t.btn_get_started}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Landing
    return (
      <>
        {user ? null : (
          <section className="relative py-20 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 mb-6 ring-1 ring-indigo-200">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-ping"></span>
                    {t.hero_badge}
                  </span>
                  <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl leading-tight">
                    {t.hero_title.split('Live')[0]}
                    <span className="text-indigo-600 italic">Live</span>
                    {t.hero_title.split('Live')[1]}
                  </h1>
                  <p className="mt-6 text-lg text-slate-500 leading-relaxed">{t.hero_subtitle}</p>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                    <button
                      onClick={() => setView('courses')}
                      className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg transition-all shadow-xl shadow-indigo-100 active:scale-95"
                    >
                      {t.btn_explore}
                    </button>
                    <button
                      onClick={() => setView('pricing')}
                      className="inline-flex items-center justify-center px-8 py-3.5 border border-slate-200 text-base font-bold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 md:text-lg transition-all border shadow-sm active:scale-95"
                    >
                      {t.btn_view_plans}
                    </button>
                  </div>
                </div>
                <div className="mt-12 lg:mt-0 lg:col-span-6 relative">
                  <div className="bg-white rounded-[2rem] shadow-2xl p-5 transform lg:rotate-2 hover:rotate-0 transition-all duration-700 ease-out border border-slate-100">
                    <div className="relative rounded-2xl overflow-hidden aspect-video shadow-inner">
                      <img
                        src="https://picsum.photos/seed/learning-modern/1200/800"
                        alt="Live session preview"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white text-3xl animate-pulse cursor-pointer hover:scale-110 transition-transform ring-4 ring-white/30">
                          <i className="fas fa-play ml-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="courses" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">{t.featured_courses}</h2>
              <p className="mt-4 text-xl text-slate-500 font-medium">{t.courses_subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course: Course) => (
                <div key={course.id} onClick={() => viewCourse(course)} className="cursor-pointer">
                  <CourseCard
                    course={course}
                    onEnroll={(id: string) => enrollInCourse({ stopPropagation: () => {} } as React.MouseEvent, id)}
                    isEnrolled={enrolledCourses.includes(course.id)}
                    appLanguage={language}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {view !== 'classroom' && (
        <Navbar
          user={user}
          onLogout={handleLogout}
          onLogin={() => setShowLogin(true)}
          language={language}
          onLanguageChange={setLanguage}
          onNavigate={(v) => setView(v as ViewType)}
          currentView={view}
          isBackendConnected={isBackendConnected}
        />
      )}

      <main className="flex-1">{mainView()}</main>

      {showLogin && (
        <LoginPage onLogin={handleLogin} onRegister={handleRegister} appLanguage={language} onClose={() => setShowLogin(false)} />
      )}

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase">
          <span>© 2023 EDUSTREAM ACADEMY. BUILT FOR GLOBAL LEARNERS.</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <span>Backend: {isBackendConnected ? 'Connected' : 'Local Only'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

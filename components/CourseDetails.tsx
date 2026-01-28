
import React from 'react';
import { Course, AppLanguage } from '../types';
import { translations } from '../translations';

interface CourseDetailsProps {
  course: Course;
  appLanguage: AppLanguage;
  onEnroll: (id: string) => void;
  isEnrolled: boolean;
  onJoin: () => void;
  onBack: () => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course, appLanguage, onEnroll, isEnrolled, onJoin, onBack }) => {
  const t = translations[appLanguage];

  const curriculum = [
    { title: "Introduction & Foundations", duration: "45 mins" },
    { title: "Core Concepts and Principles", duration: "1 hour" },
    { title: "Advanced Techniques", duration: "1.5 hours" },
    { title: "Real-world Case Studies", duration: "2 hours" },
    { title: "Live Q&A and Final Review", duration: "1 hour" }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[400px] overflow-hidden">
        <img src={course.thumbnail} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="absolute top-8 left-8">
           <button 
            onClick={onBack}
            className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
        <div className="absolute bottom-12 left-8 right-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              {course.category}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              {course.language.toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight max-w-3xl">
            {course.title}
          </h1>
          <div className="flex items-center gap-6 text-white/80 text-sm font-medium">
             <div className="flex items-center gap-2">
               <img src={`https://i.pravatar.cc/150?u=${course.teacherId}`} className="w-8 h-8 rounded-full border border-white/20" alt="" />
               <span>By <span className="text-white font-bold">{course.teacherName}</span></span>
             </div>
             <div className="flex items-center gap-2">
               <i className="fas fa-users text-indigo-400"></i>
               <span>{course.studentsCount} Students</span>
             </div>
             <div className="flex items-center gap-2">
               <i className="fas fa-star text-amber-400"></i>
               <span>{course.rating} Rating</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6">{t.course_details}</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {course.description} {course.description} This comprehensive course is designed to take you from fundamentals to advanced mastery in record time. Join live interactive sessions where you can ask questions in real-time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6">{t.curriculum}</h2>
              <div className="space-y-4">
                {curriculum.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-slate-800">{item.title}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{item.duration}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
               <h2 className="text-2xl font-black text-slate-900 mb-6">{t.about_instructor}</h2>
               <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <img src={`https://i.pravatar.cc/150?u=${course.teacherId}`} className="w-24 h-24 rounded-[2rem] object-cover shadow-lg" alt="" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{course.teacherName}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      A dedicated professional with over 10 years of experience in the industry. Sarah has helped thousands of students achieve their career goals through clear instruction and practical mentorship.
                    </p>
                    <div className="flex gap-4 mt-4">
                      <a href="#" className="text-indigo-600 hover:text-indigo-700"><i className="fab fa-linkedin"></i></a>
                      <a href="#" className="text-indigo-600 hover:text-indigo-700"><i className="fab fa-twitter"></i></a>
                    </div>
                  </div>
               </div>
            </section>
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl shadow-slate-100">
                <div className="mb-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">${course.price}</span>
                    <span className="text-sm font-bold text-slate-400 line-through">$199.99</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <i className="fas fa-video text-indigo-500 w-5"></i>
                    Live Interactive Sessions
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <i className="fas fa-file-alt text-indigo-500 w-5"></i>
                    Study Materials Included
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <i className="fas fa-certificate text-indigo-500 w-5"></i>
                    Official Certificate
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <i className="fas fa-infinity text-indigo-500 w-5"></i>
                    Lifetime Access
                  </div>
                </div>

                {isEnrolled ? (
                  <button 
                    onClick={onJoin}
                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-play"></i>
                    {t.btn_join_live}
                  </button>
                ) : (
                  <button 
                    onClick={() => onEnroll(course.id)}
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-100 hover:bg-slate-800 active:scale-95 transition-all"
                  >
                    {t.btn_enroll}
                  </button>
                )}
                
                <p className="mt-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Money-back guarantee within 7 days
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

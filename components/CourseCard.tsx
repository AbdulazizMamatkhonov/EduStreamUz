
import React from 'react';
import { Course, AppLanguage } from '../types';
import { translations } from '../translations';

interface CourseCardProps {
  course: Course;
  onEnroll?: (id: string) => void;
  isEnrolled?: boolean;
  appLanguage: AppLanguage;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, isEnrolled, appLanguage }) => {
  const t = translations[appLanguage];
  
  const getLangBadge = (lang: AppLanguage) => {
    switch(lang) {
      case 'en': return { label: 'EN', flag: '🇺🇸', color: 'bg-indigo-100 text-indigo-700' };
      case 'ru': return { label: 'RU', flag: '🇷🇺', color: 'bg-red-100 text-red-700' };
      case 'uz': return { label: 'UZ', flag: '🇺🇿', color: 'bg-emerald-100 text-emerald-700' };
      // Fix: Cast lang to string to resolve 'never' type error in exhaustive switch
      default: return { label: (lang as string).toUpperCase(), flag: '', color: 'bg-slate-100 text-slate-700' };
    }
  };

  const langInfo = getLangBadge(course.language);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase rounded-md text-slate-800 shadow-sm">
            {course.category}
          </span>
          <span className={`px-2 py-1 ${langInfo.color} backdrop-blur-sm text-[10px] font-bold uppercase rounded-md shadow-sm flex items-center gap-1`}>
            <span>{langInfo.flag}</span>
            {langInfo.label}
          </span>
        </div>
        {!course.isGroup && (
          <div className="absolute top-3 right-3">
             <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-md shadow-sm">
              1-on-1
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 leading-tight group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>
          <div className="flex items-center text-amber-500 text-xs font-bold whitespace-nowrap bg-amber-50 px-2 py-1 rounded-full">
            <i className="fas fa-star mr-1"></i>
            {course.rating}
          </div>
        </div>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
          {course.description}
        </p>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <img src={`https://i.pravatar.cc/150?u=${course.teacherId}`} className="w-8 h-8 rounded-full border border-slate-100" alt={course.teacherName} />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <span className="text-xs font-semibold text-slate-700">{course.teacherName}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.next_session}</span>
            <span className="text-xs font-bold text-slate-800">
              {course.nextSession ? new Date(course.nextSession).toLocaleDateString(appLanguage === 'en' ? 'en-US' : (appLanguage === 'ru' ? 'ru-RU' : 'uz-UZ')) : 'TBD'}
            </span>
          </div>
          
          {isEnrolled ? (
            <a 
              href={course.zoomLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-100 active:scale-95"
            >
              <i className="fas fa-video"></i>
              {t.btn_join_live}
            </a>
          ) : (
            <button 
              onClick={() => onEnroll?.(course.id)}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              {t.btn_enroll} ${course.price}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

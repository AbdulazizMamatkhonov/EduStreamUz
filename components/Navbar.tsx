
import React, { useState } from 'react';
import { User, UserRole, AppLanguage } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onLogin: (role: UserRole) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onLogin, language, onLanguageChange, onNavigate, currentView }) => {
  const t = translations[language];
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: AppLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
  ];

  const handleLinkClick = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    onNavigate(view);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-100">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hidden md:block">
                EduStream
              </span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <button 
                onClick={(e) => handleLinkClick(e, 'landing')}
                className={`${currentView === 'landing' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-16`}
              >
                {t.nav_home}
              </button>
              <button 
                onClick={(e) => handleLinkClick(e, 'courses')}
                className={`${currentView === 'courses' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-16`}
              >
                {t.nav_courses}
              </button>
              <button 
                onClick={(e) => handleLinkClick(e, 'pricing')}
                className={`${currentView === 'pricing' ? 'border-indigo-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-16`}
              >
                {t.nav_pricing}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              >
                <span>{languages.find(l => l.code === language)?.flag}</span>
                <span className="hidden md:inline uppercase">{language}</span>
                <i className={`fas fa-chevron-down text-[10px] transition-transform ${showLangMenu ? 'rotate-180' : ''}`}></i>
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                        language === lang.code ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            {!user ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => onLogin(UserRole.STUDENT)}
                  className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {t.btn_student_login}
                </button>
                <button 
                  onClick={() => onLogin(UserRole.TEACHER)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <span className="md:inline hidden">{t.btn_teacher_access}</span>
                  <i className="fas fa-chalkboard-teacher md:hidden"></i>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end text-right hidden sm:flex cursor-pointer" onClick={() => onNavigate('dashboard')}>
                  <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                </div>
                <img 
                  className="h-9 w-9 rounded-full ring-2 ring-indigo-100 object-cover cursor-pointer" 
                  src={user.avatar} 
                  alt={user.name}
                  onClick={() => onNavigate('dashboard')}
                />
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

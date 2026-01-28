
import React, { useState } from 'react';
import { UserRole, AppLanguage } from '../types';
import { translations } from '../translations';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  appLanguage: AppLanguage;
  onClose: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, appLanguage, onClose }) => {
  const t = translations[appLanguage];
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.STUDENT);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl shadow-indigo-100">
            <i className="fas fa-graduation-cap"></i>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 font-medium mb-8">Login to your EduStream account</p>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => setActiveTab(UserRole.STUDENT)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === UserRole.STUDENT ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.btn_student_login}
            </button>
            <button 
              onClick={() => setActiveTab(UserRole.TEACHER)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === UserRole.TEACHER ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.btn_teacher_access}
            </button>
          </div>
          
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Email Address</label>
              <input 
                type="email" 
                defaultValue={activeTab === UserRole.STUDENT ? 'student@edustream.com' : 'teacher@edustream.com'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Password</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            onClick={() => onLogin(activeTab)}
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl mt-8 shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Login as {activeTab === UserRole.STUDENT ? 'Student' : 'Teacher'}
          </button>
          
          <p className="mt-8 text-sm text-slate-500">
            Don't have an account? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Sign up for free</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

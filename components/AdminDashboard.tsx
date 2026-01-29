import React, { useState } from 'react';
import { User, AppLanguage } from '../types';
import { translations } from '../translations';
import { api } from '../apiService';

interface AdminDashboardProps {
  user: User;
  appLanguage: AppLanguage;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, appLanguage }) => {
  const t = translations[appLanguage];
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);
    try {
      await api.createTeacher(formValues);
      setFeedback('Teacher account created successfully.');
      setFormValues({ name: '', email: '', password: '' });
    } catch (err) {
      setFeedback('Unable to create teacher. Check permissions and details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-900">Admin Panel</h2>
          <p className="text-slate-500 font-medium">
            {t.welcome_back}, {user.name}. Manage teacher access here.
          </p>
          <p className="text-xs text-slate-400 font-semibold">
            Default admin: admin@edustream.com / password123
          </p>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Add a Teacher Account</h3>
          <form onSubmit={handleCreateTeacher} className="space-y-4">
            <input
              name="name"
              value={formValues.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
              placeholder="Full name"
              required
            />
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
              placeholder="Email address"
              required
            />
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
              placeholder="Temporary password"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white font-black py-3 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-60"
            >
              {isSubmitting ? 'Creating...' : 'Create Teacher Account'}
            </button>
          </form>
          {feedback && (
            <p className="mt-4 text-sm font-semibold text-slate-500">{feedback}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;

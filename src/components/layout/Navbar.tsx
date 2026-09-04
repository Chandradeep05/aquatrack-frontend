import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Droplets, Calendar, Shield, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to={user.role === 'admin' ? '/admin' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-900 via-brand-700 to-cyan-600 bg-clip-text text-transparent">
              AquaTrack
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-500 block -mt-1">
              Hydration
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {user.role === 'user' && (
            <>
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/')
                    ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>Today</span>
              </Link>
              <Link
                to="/history"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/history')
                    ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>History</span>
              </Link>
            </>
          )}

          {user.role === 'admin' && (
            <Link
              to="/admin"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive('/admin')
                  ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-bold text-slate-800 leading-tight">{user.name}</span>
            <span className="text-[11px] font-semibold text-slate-500 flex items-center justify-end gap-1">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-purple-500' : 'bg-brand-500'}`} />
              {user.role === 'admin' ? 'Administrator' : 'Tracker'}
            </span>
          </div>

          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${
            user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-brand-100 text-brand-800 border-brand-200'
          }`}>
            {user.name.charAt(0).toUpperCase()}
          </div>

          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

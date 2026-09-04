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
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to={user.role === 'admin' ? '/admin' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              AquaTrack
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 block -mt-1">
              Hydration Tracker
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
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/history"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/history')
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-bold text-slate-100 leading-tight">{user.name}</span>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-end gap-1">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-purple-400 shadow-sm shadow-purple-400' : 'bg-cyan-400 shadow-sm shadow-cyan-400'}`} />
              {user.role === 'admin' ? 'Administrator' : 'Tracker'}
            </span>
          </div>

          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${
            user.role === 'admin'
              ? 'bg-purple-950/80 text-purple-300 border-purple-800/80'
              : 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80'
          }`}>
            {user.name.charAt(0).toUpperCase()}
          </div>

          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

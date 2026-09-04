import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-200/80 bg-white/50 py-6 text-center text-xs text-slate-400 font-medium">
        AquaTrack — Daily Water Intake Tracker • Production-Grade Web Application
      </footer>
    </div>
  );
};

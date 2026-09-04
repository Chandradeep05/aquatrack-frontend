import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* Subtle ambient lighting gradients */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>
      <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-6 text-center text-xs text-slate-500 font-medium relative z-10">
        AquaTrack — Full-Stack Hydration Tracker • Kravix Tech Engineering
      </footer>
    </div>
  );
};

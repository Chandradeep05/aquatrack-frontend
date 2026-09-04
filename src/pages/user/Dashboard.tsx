import React, { useEffect, useState, useCallback } from 'react';
import { getTodayIntakeApi, logIntakeApi, deleteIntakeApi } from '../../api/intakeApi';
import { TodaySummary } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Droplets,
  Plus,
  Minus,
  Trash2,
  Clock,
  Sparkles,
  Sun,
  Moon,
  Target,
  Flame,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Activity
} from 'lucide-react';
import {
  RealisticCup,
  RealisticGlass,
  RealisticBottle,
  RealisticFlask,
  RealisticCylinder
} from '../../components/common/RealisticObjects';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<TodaySummary | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { user } = useAuth();
  const { showToast } = useToast();

  const loadSummary = useCallback(async () => {
    try {
      const res = await getTodayIntakeApi();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch {
      showToast('Failed to load today intake summary', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handleAddIntake = async (amountToAdd: number) => {
    if (!amountToAdd || amountToAdd <= 0) {
      showToast('Water intake amount must be greater than 0.', 'error');
      return;
    }
    if (amountToAdd > 10000) {
      showToast('Water intake cannot exceed 10,000 ml per entry.', 'error');
      return;
    }

    setIsAdding(true);
    try {
      await logIntakeApi(amountToAdd);
      showToast(`Added ${amountToAdd} ml of water!`, 'success');
      await loadSummary();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to log water intake';
      showToast(msg, 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this intake entry?')) return;

    setDeletingId(id);
    try {
      await deleteIntakeApi(id);
      showToast('Entry removed', 'info');
      await loadSummary();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete intake entry';
      showToast(msg, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: <Sun className="w-5 h-5 text-amber-400" /> };
    if (hour < 17) return { text: 'Good Afternoon', icon: <Sun className="w-5 h-5 text-amber-400" /> };
    return { text: 'Good Evening', icon: <Moon className="w-5 h-5 text-indigo-400" /> };
  };

  const greeting = getGreeting();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="relative">
          <Droplets className="w-12 h-12 text-cyan-400 animate-bounce" />
          <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
        </div>
        <p className="text-slate-400 font-medium mt-4">Syncing your hydration metrics...</p>
      </div>
    );
  }

  const dailyGoal = summary?.dailyGoalMl || 2000;
  const totalIntake = summary?.totalIntakeMl || 0;
  const percentage = Math.min(100, Math.round((totalIntake / dailyGoal) * 100));
  const isGoalMet = totalIntake >= dailyGoal;
  const glassesConsumed = Math.round(totalIntake / 250);
  const totalGlassesGoal = Math.ceil(dailyGoal / 250);

  const containerPresets = [
    {
      amount: 150,
      label: 'Cup',
      desc: '150 ml',
      renderObject: (size = 38) => <RealisticCup size={size} />
    },
    {
      amount: 250,
      label: 'Glass',
      desc: '250 ml',
      renderObject: (size = 38) => <RealisticGlass size={size} />
    },
    {
      amount: 500,
      label: 'Bottle',
      desc: '500 ml',
      renderObject: (size = 38) => <RealisticBottle size={size} />
    },
    {
      amount: 750,
      label: 'Flask',
      desc: '750 ml',
      renderObject: (size = 38) => <RealisticFlask size={size} />
    }
  ];

  const getEntryObject = (amount: number) => {
    if (amount <= 175) return <RealisticCup size={22} />;
    if (amount <= 350) return <RealisticGlass size={22} />;
    if (amount <= 600) return <RealisticBottle size={22} />;
    return <RealisticFlask size={22} />;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center shadow-inner">
            {greeting.icon}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {greeting.text}, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.name || 'Hydrator'}</span>!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Let's keep your body refreshed and hydrated today.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-semibold self-start sm:self-center">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Grid: Left Column (Hero & Graphics) | Right Column (Intake & Log) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Main Section (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Circular Progress Hero Card */}
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              {/* Circular Gauge */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <defs>
                    <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  {/* Background Track */}
                  <path
                    className="text-slate-800/90"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Animated Foreground Progress */}
                  <path
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                    strokeDasharray={`${percentage}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="url(#cyanGradient)"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                {/* Gauge Inner Text */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {percentage}%
                  </span>
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-widest mt-1">
                    Daily Goal
                  </span>
                  {isGoalMet && (
                    <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> Done!
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar under Circle */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400 px-1">
                  <span>{totalIntake.toLocaleString()} ml consumed</span>
                  <span>Target: {dailyGoal.toLocaleString()} ml</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* 4 Stat Tiles (matching Image 1) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-2">
                <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1.5">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-black text-white">{totalIntake.toLocaleString()} ml</span>
                  <span className="text-[11px] font-semibold text-slate-400">Consumed</span>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1.5">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-black text-white">{Math.max(0, dailyGoal - totalIntake).toLocaleString()} ml</span>
                  <span className="text-[11px] font-semibold text-slate-400">Remaining</span>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1.5">
                    <RealisticGlass size={20} />
                  </div>
                  <span className="text-lg font-black text-white">{glassesConsumed}/{totalGlassesGoal}</span>
                  <span className="text-[11px] font-semibold text-slate-400">Glasses</span>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5">
                    <Flame className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-black text-emerald-400">{isGoalMet ? 'Goal Met' : 'Active'}</span>
                  <span className="text-[11px] font-semibold text-slate-400">Status</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Visualizer Row: Realistic Graduated Cylinder & Daily Cadence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Realistic Graduated Cylinder Graphic */}
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Graduated Hydrometer</h4>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">{percentage}%</span>
              </div>

              {/* Realistic Borosilicate Glass Cylinder */}
              <div className="flex items-center justify-center py-1">
                <RealisticCylinder percentage={percentage} />
              </div>

              <p className="text-center text-[11px] font-medium text-slate-400 mt-2">
                {isGoalMet ? 'Optimal fluid volume achieved!' : 'Maintain periodic hydration throughout the day.'}
              </p>
            </div>

            {/* Hydration Intake Schedule & Daily Cadence */}
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Hydration Cadence</h4>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Daily Pace</span>
              </div>

              <div className="space-y-2.5">
                <div className="bg-slate-800/50 border border-slate-700/60 p-2.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <RealisticGlass size={22} />
                    <div>
                      <span className="text-xs font-extrabold text-slate-200 block">Morning Kickstart</span>
                      <span className="text-[10px] text-slate-400">Wake up — 12:00 PM</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">500 ml</span>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 p-2.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <RealisticBottle size={22} />
                    <div>
                      <span className="text-xs font-extrabold text-slate-200 block">Midday Replenish</span>
                      <span className="text-[10px] text-slate-400">12:00 PM — 5:00 PM</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">1,000 ml</span>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 p-2.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <RealisticCup size={22} />
                    <div>
                      <span className="text-xs font-extrabold text-slate-200 block">Evening Balance</span>
                      <span className="text-[10px] text-slate-400">5:00 PM — Sleep</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-400">500 ml</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Steady fluid distribution optimizes cellular hydration and focus.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section (5 cols): Add Water Intake & Today's Activity Log */}
        <div className="lg:col-span-5 space-y-8">
          {/* Add Water Intake Module (Image 1 Reference) */}
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">Add Water Intake</h3>
              <p className="text-xs text-slate-400 mt-0.5">Quick add or customize your amount</p>
            </div>

            {/* 4 Container Preset Cards */}
            <div className="grid grid-cols-2 gap-3">
              {containerPresets.map((preset) => {
                const isSelected = selectedAmount === preset.amount;
                return (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => setSelectedAmount(preset.amount)}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 group relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-500/25 via-blue-500/15 to-indigo-500/15 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="group-hover:scale-105 transition-transform">
                      {preset.renderObject(38)}
                    </div>
                    <span className="text-sm font-extrabold text-white">{preset.label}</span>
                    <span className="text-[11px] font-semibold text-cyan-400">{preset.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Stepper Control */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedAmount((prev) => Math.max(50, prev - 50))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95"
                title="Decrease 50ml"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={selectedAmount || ''}
                  onChange={(e) => setSelectedAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-24 text-center text-xl font-black text-white bg-transparent focus:outline-none"
                />
                <span className="text-xs font-bold text-slate-500">ml</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAmount((prev) => Math.min(10000, prev + 50))}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors active:scale-95"
                title="Increase 50ml"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              disabled={isAdding || selectedAmount <= 0}
              onClick={() => handleAddIntake(selectedAmount)}
              className="w-full py-4 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              {isAdding ? 'Recording...' : `+ Add ${selectedAmount} ml`}
            </button>
          </div>

          {/* Today's Activity Drink Log (Image 2 Reference) */}
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Today's Drink Log</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                {summary?.entries?.length || 0} logs
              </span>
            </div>

            {!summary?.entries || summary.entries.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-slate-800/80 rounded-2xl">
                <Droplets className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-slate-400 font-medium text-xs">No entries recorded today.</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Use the presets above to log your first glass!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {summary.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 p-1">
                        {getEntryObject(entry.amount)}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-slate-100 block">
                          +{entry.amount} ml
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatTime(entry.consumedAt)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deletingId === entry.id}
                      title="Delete Entry"
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors opacity-70 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

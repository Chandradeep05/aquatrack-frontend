import React, { useEffect, useState, useCallback } from 'react';
import { getTodayIntakeApi, logIntakeApi, deleteIntakeApi } from '../../api/intakeApi';
import { TodaySummary } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Droplets, Plus, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<TodaySummary | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleAddIntake = async (amount: number) => {
    if (!amount || amount <= 0) {
      showToast('Water intake amount must be greater than 0.', 'error');
      return;
    }
    if (amount > 10000) {
      showToast('Water intake cannot exceed 10,000 ml per entry.', 'error');
      return;
    }

    setIsAdding(true);
    try {
      await logIntakeApi(amount);
      showToast(`Added ${amount} ml of water!`, 'success');
      setCustomAmount('');
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Droplets className="w-10 h-10 text-brand-500 animate-bounce mb-3" />
        <p className="text-slate-500 font-medium">Fetching your hydration metrics...</p>
      </div>
    );
  }

  const dailyGoal = summary?.dailyGoalMl || 2000;
  const totalIntake = summary?.totalIntakeMl || 0;
  const percentage = Math.min(100, Math.round((totalIntake / dailyGoal) * 100));
  const isGoalMet = totalIntake >= dailyGoal;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-white to-brand-50/50 rounded-3xl p-6 sm:p-8 border border-brand-100 shadow-xl shadow-brand-500/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Hydration Goal
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {totalIntake.toLocaleString()} <span className="text-lg font-medium text-slate-500">/ {dailyGoal.toLocaleString()} ml</span>
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              {isGoalMet ? (
                <span className="text-emerald-600 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Goal achieved today! Excellent job staying hydrated.
                </span>
              ) : (
                <span>{(dailyGoal - totalIntake).toLocaleString()} ml remaining to hit your target.</span>
              )}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-brand-500 transition-all duration-700 ease-out"
                  strokeDasharray={`${percentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900">{percentage}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-200/80 rounded-full h-3 mt-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Quick Add */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900">Quick Log Water Intake</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { amount: 250, label: 'Cup', icon: '🥛' },
            { amount: 500, label: 'Bottle', icon: '🧴' },
            { amount: 750, label: 'Flask', icon: '🧊' },
            { amount: 1000, label: 'Carafe', icon: '🍶' }
          ].map((item) => (
            <button
              key={item.amount}
              disabled={isAdding}
              onClick={() => handleAddIntake(item.amount)}
              className="group p-4 rounded-2xl border-2 border-slate-100 hover:border-brand-500 bg-slate-50/50 hover:bg-brand-50/50 text-slate-700 hover:text-brand-900 font-bold transition-all flex flex-col items-center justify-center gap-1 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-base font-black">+{item.amount} ml</span>
              <span className="text-xs text-slate-400 font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddIntake(parseInt(customAmount, 10));
          }}
          className="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <div className="relative flex-1">
            <input
              type="number"
              min="1"
              max="5000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter custom amount (e.g. 350 ml)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">ml</span>
          </div>
          <button
            type="submit"
            disabled={isAdding || !customAmount}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Custom
          </button>
        </form>
      </div>

      {/* Today's Entries */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Today's Intake Log</h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
            {summary?.entries?.length || 0} entries
          </span>
        </div>

        {!summary?.entries || summary.entries.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <Droplets className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium text-sm">No water logged yet today.</p>
            <p className="text-slate-400 text-xs mt-0.5">Use the quick add buttons above to record your first glass!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-hidden">
            {summary.entries.map((entry) => (
              <div key={entry.id} className="py-3.5 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-slate-800 block">+{entry.amount} ml</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatTime(entry.consumedAt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  title="Delete Entry"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors opacity-70 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { getIntakeHistoryApi } from '../../api/intakeApi';
import { HistoryGroup } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Calendar, CheckCircle2, AlertCircle, Droplets, TrendingUp, Award, Clock } from 'lucide-react';

export const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryGroup[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number>(2000);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getIntakeHistoryApi();
        if (res.success && res.data) {
          setHistory(res.data.history || []);
          setDailyGoal(res.data.dailyGoalMl || 2000);
        }
      } catch {
        showToast('Failed to load hydration history', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [showToast]);

  const totalDays = history.length;
  const achievedDays = history.filter((h) => h.isGoalAchieved).length;
  const totalVolume = history.reduce((sum, h) => sum + h.totalIntakeMl, 0);
  const avgIntake = totalDays > 0 ? Math.round(totalVolume / totalDays) : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00Z');
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="relative">
          <Droplets className="w-12 h-12 text-cyan-400 animate-bounce" />
          <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
        </div>
        <p className="text-slate-400 font-medium mt-4">Loading history logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & KPI Summary Cards */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Intake History</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Review your past hydration habits grouped by date.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{totalDays}</span>
              <span className="text-xs text-slate-400 font-medium block">Days Tracked</span>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{achievedDays}</span>
              <span className="text-xs text-slate-400 font-medium block">Goals Achieved</span>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{avgIntake.toLocaleString()} ml</span>
              <span className="text-xs text-slate-400 font-medium block">Daily Average</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Records List */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <h3 className="text-lg font-black text-white tracking-tight">Historical Day Records</h3>

        {history.length === 0 ? (
          <div className="py-14 text-center border-2 border-dashed border-slate-800 rounded-3xl">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-medium text-sm">No historical records found.</p>
            <p className="text-slate-500 text-xs mt-0.5">Start logging today to begin your hydration journey!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((day) => (
              <div
                key={day.date}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-950/50 hover:bg-slate-900/80 hover:border-slate-700 transition-all shadow-md space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-base text-white">{formatDate(day.date)}</span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                        day.isGoalAchieved
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {day.isGoalAchieved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Goal Achieved
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Below Goal
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-slate-300">
                    <span className="font-black text-white text-base">{day.totalIntakeMl.toLocaleString()} ml</span>
                    <span className="text-slate-400 text-xs"> / {dailyGoal.toLocaleString()} ml</span>
                    <span className="text-xs text-cyan-400 font-bold ml-2">({day.percentage}%)</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      day.isGoalAchieved
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, day.percentage)}%` }}
                  />
                </div>

                {/* Individual Logs */}
                {day.entries && day.entries.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {day.entries.map((entry) => (
                      <span
                        key={entry.id}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-300 shadow-sm"
                      >
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {formatTime(entry.consumedAt)}: <strong className="text-white">+{entry.amount}ml</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

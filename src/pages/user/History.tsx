import React, { useEffect, useState } from 'react';
import { getIntakeHistoryApi } from '../../api/intakeApi';
import { HistoryGroup } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Calendar, CheckCircle2, XCircle, Droplets, TrendingUp, Award, Clock } from 'lucide-react';

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
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const local = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const utc = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    return `${local} (${utc} UTC)`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Droplets className="w-10 h-10 text-brand-500 animate-bounce mb-3" />
        <p className="text-slate-500 font-medium">Loading history logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Intake History</h2>
          <p className="text-slate-500 text-sm mt-1">Review your past hydration habits grouped by date.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">{totalDays}</span>
              <span className="text-xs text-slate-400 font-medium block">Days Tracked</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">{achievedDays}</span>
              <span className="text-xs text-slate-400 font-medium block">Goals Achieved</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">{avgIntake.toLocaleString()} ml</span>
              <span className="text-xs text-slate-400 font-medium block">Daily Average</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Historical Records</h3>

        {history.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium text-sm">No historical records found.</p>
            <p className="text-slate-400 text-xs mt-0.5">Start logging today to begin your hydration journey!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((day) => (
              <div
                key={day.date}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-brand-200 transition-all shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-slate-900">{formatDate(day.date)}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        day.isGoalAchieved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {day.isGoalAchieved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Goal achieved
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-amber-600" /> Below goal
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-slate-600">
                    <span className="font-extrabold text-slate-900">{day.totalIntakeMl.toLocaleString()} ml</span>
                    <span className="text-slate-400"> / {dailyGoal.toLocaleString()} ml</span>
                    <span className="text-xs text-brand-600 font-bold ml-2">({day.percentage}%)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      day.isGoalAchieved ? 'bg-emerald-500' : 'bg-brand-500'
                    }`}
                    style={{ width: `${Math.min(100, day.percentage)}%` }}
                  />
                </div>

                {day.entries && day.entries.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {day.entries.map((entry) => (
                      <span
                        key={entry.id}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600"
                      >
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatTime(entry.consumedAt)}: <strong className="text-slate-800">+{entry.amount}ml</strong>
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

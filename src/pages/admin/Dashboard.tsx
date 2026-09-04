import React, { useEffect, useState, useCallback } from 'react';
import { getAllUsersApi, deleteUserApi, getUserIntakeHistoryApi } from '../../api/adminApi';
import { updateDailyGoalApi } from '../../api/settingsApi';
import { User, AdminMetrics, HistoryGroup } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Database,
  Droplets,
  Target,
  Trash2,
  Eye,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [dailyGoalInput, setDailyGoalInput] = useState<string>('2000');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingGoal, setIsUpdatingGoal] = useState<boolean>(false);

  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectedUser, setInspectedUser] = useState<User | null>(null);
  const [inspectedHistory, setInspectedHistory] = useState<HistoryGroup[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user: currentAdmin } = useAuth();
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const res = await getAllUsersApi();
      if (res.success && res.data) {
        setUsers(res.data.users);
        setMetrics(res.data.metrics);
        setDailyGoalInput(String(res.data.metrics.currentDailyGoalMl || 2000));
      }
    } catch {
      showToast('Failed to load admin metrics', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(dailyGoalInput, 10);
    if (!parsed || parsed <= 0) {
      showToast('Daily goal must be greater than 0 ml', 'error');
      return;
    }

    setIsUpdatingGoal(true);
    try {
      await updateDailyGoalApi(parsed);
      showToast(`System daily goal updated to ${parsed} ml`, 'success');
      await loadData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update daily goal', 'error');
    } finally {
      setIsUpdatingGoal(false);
    }
  };

  const handleInspectUser = async (u: User) => {
    setInspectedUser(u);
    setInspectModalOpen(true);
    setIsLoadingHistory(true);

    try {
      const res = await getUserIntakeHistoryApi(u.id);
      if (res.success && res.data) {
        setInspectedHistory(res.data.history || []);
      }
    } catch {
      showToast('Failed to fetch user intake history', 'error');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    if (userToDelete.id === currentAdmin?.id) {
      showToast('Admins cannot delete their own account.', 'error');
      setDeleteModalOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteUserApi(userToDelete.id);
      showToast(
        `Deleted user ${userToDelete.name} and purged ${res.data?.cascadeDeletedLogsCount || 0} intake logs`,
        'success'
      );
      setDeleteModalOpen(false);
      await loadData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Droplets className="w-10 h-10 text-purple-600 animate-bounce mb-3" />
        <p className="text-slate-500 font-medium">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          Admin Console <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold uppercase tracking-wider">Superuser</span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Monitor system metrics, inspect member intake histories, and configure the global hydration target.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">{metrics?.totalUsers || 0}</span>
            <span className="text-xs text-slate-400 font-medium block">Total Users</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">{metrics?.totalIntakeLogs || 0}</span>
            <span className="text-xs text-slate-400 font-medium block">Total Intake Logs</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">
              {(metrics?.todayTotalIntakeMl || 0).toLocaleString()} ml
            </span>
            <span className="text-xs text-slate-400 font-medium block">Today's Total Intake</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">
              {(metrics?.currentDailyGoalMl || 2000).toLocaleString()} ml
            </span>
            <span className="text-xs text-slate-400 font-medium block">Current Daily Goal</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Configure System Daily Goal</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Sets the recommended daily intake goal for all users (defaults to 2000 ml if unconfigured).
          </p>
        </div>

        <form onSubmit={handleUpdateGoal} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <div className="relative flex-1">
            <input
              type="number"
              min="100"
              max="10000"
              step="50"
              value={dailyGoalInput}
              onChange={(e) => setDailyGoalInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 font-medium"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">ml</span>
          </div>
          <button
            type="submit"
            disabled={isUpdatingGoal}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all text-sm disabled:opacity-50"
          >
            {isUpdatingGoal ? 'Updating...' : 'Update Goal'}
          </button>
        </form>
      </div>

      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">User Management</h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {users.length} registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400 tracking-wider">
                <th className="pb-3 px-2">User</th>
                <th className="pb-3 px-2">Email</th>
                <th className="pb-3 px-2">Role</th>
                <th className="pb-3 px-2 text-center">Total Logs</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {users.map((u) => {
                const isSelf = u.id === currentAdmin?.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-2 font-bold text-white">{u.name}</td>
                    <td className="py-4 px-2 text-slate-400">{u.email}</td>
                    <td className="py-4 px-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          u.role === 'admin'
                            ? 'bg-purple-950/80 text-purple-300 border-purple-800/80'
                            : 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center font-semibold text-slate-300">
                      {u.totalIntakeLogs || 0}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleInspectUser(u)}
                          title="Inspect Intake History"
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isSelf}
                          onClick={() => {
                            setUserToDelete(u);
                            setDeleteModalOpen(true);
                          }}
                          title={isSelf ? 'Cannot delete your own admin account' : 'Delete User'}
                          className={`p-2 rounded-xl transition-colors ${
                            isSelf
                              ? 'text-slate-600 cursor-not-allowed'
                              : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        title={`Intake History — ${inspectedUser?.name || 'User'}`}
      >
        {isLoadingHistory ? (
          <div className="py-12 text-center text-slate-400">
            <Droplets className="w-8 h-8 text-cyan-400 animate-bounce mx-auto mb-2" />
            Loading history...
          </div>
        ) : inspectedHistory.length === 0 ? (
          <p className="py-8 text-center text-slate-400 text-sm">No intake logs recorded for this user.</p>
        ) : (
          <div className="space-y-3">
            {inspectedHistory.map((day) => (
              <div key={day.date} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-white">{day.date}</span>
                  <span className="font-extrabold text-slate-200">
                    {day.totalIntakeMl.toLocaleString()} ml{' '}
                    <span className="text-xs font-semibold text-cyan-400">({day.percentage}%)</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {day.entries?.map((e) => (
                    <span
                      key={e.id}
                      className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                    >
                      +{e.amount}ml
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm User Account Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200 space-y-1">
              <p className="font-bold text-rose-300">Cascade Deletion Warning</p>
              <p className="text-rose-300/80">
                Deleting this user will permanently remove their profile and <strong>cascade-delete all associated water intake logs</strong>. This action is irreversible.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            Are you sure you want to permanently delete account for{' '}
            <strong className="text-white">{userToDelete?.name}</strong> ({userToDelete?.email})?
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteUser}
              disabled={isDeleting}
              className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/25 transition-all disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

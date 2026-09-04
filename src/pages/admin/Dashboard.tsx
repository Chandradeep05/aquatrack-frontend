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
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h2>
        <p className="text-slate-500 text-sm mt-1">
          Monitor system metrics, inspect member intake histories, and update the global hydration target.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{metrics?.totalUsers || 0}</span>
            <span className="text-xs text-slate-400 font-medium block">Total Users</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{metrics?.totalIntakeLogs || 0}</span>
            <span className="text-xs text-slate-400 font-medium block">Total Intake Logs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {(metrics?.todayTotalIntakeMl || 0).toLocaleString()} ml
            </span>
            <span className="text-xs text-slate-400 font-medium block">Today's Total Intake</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {(metrics?.currentDailyGoalMl || 2000).toLocaleString()} ml
            </span>
            <span className="text-xs text-slate-400 font-medium block">Current Daily Goal</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Configure System Daily Goal</h3>
          <p className="text-xs text-slate-500 mt-0.5">
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">ml</span>
          </div>
          <button
            type="submit"
            disabled={isUpdatingGoal}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all text-sm disabled:opacity-50"
          >
            {isUpdatingGoal ? 'Updating...' : 'Update Goal'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">User Management</h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
            {users.length} registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase text-slate-400 tracking-wider">
                <th className="pb-3 px-2">User</th>
                <th className="pb-3 px-2">Email</th>
                <th className="pb-3 px-2">Role</th>
                <th className="pb-3 px-2 text-center">Total Logs</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isSelf = u.id === currentAdmin?.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-2 font-bold text-slate-900">{u.name}</td>
                    <td className="py-4 px-2 text-slate-600">{u.email}</td>
                    <td className="py-4 px-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-brand-100 text-brand-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center font-semibold text-slate-700">
                      {u.totalIntakeLogs || 0}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleInspectUser(u)}
                          title="Inspect Intake History"
                          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
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
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
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
          <div className="py-12 text-center text-slate-500">
            <Droplets className="w-8 h-8 text-brand-500 animate-bounce mx-auto mb-2" />
            Loading history...
          </div>
        ) : inspectedHistory.length === 0 ? (
          <p className="py-8 text-center text-slate-400 text-sm">No intake logs recorded for this user.</p>
        ) : (
          <div className="space-y-3">
            {inspectedHistory.map((day) => (
              <div key={day.date} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">{day.date}</span>
                  <span className="font-extrabold text-slate-800">
                    {day.totalIntakeMl.toLocaleString()} ml{' '}
                    <span className="text-xs font-semibold text-brand-600">({day.percentage}%)</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {day.entries?.map((e) => (
                    <span
                      key={e.id}
                      className="text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600"
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
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 space-y-1">
              <p className="font-bold">Cascade Deletion Warning</p>
              <p>
                Deleting this user will permanently remove their profile and <strong>cascade-delete all associated water intake logs</strong>. This action is irreversible.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete account for{' '}
            <strong className="text-slate-900">{userToDelete?.name}</strong> ({userToDelete?.email})?
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteUser}
              disabled={isDeleting}
              className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-500/20 transition-all disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

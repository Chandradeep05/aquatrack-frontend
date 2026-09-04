export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
  totalIntakeLogs?: number;
}

export interface IntakeEntry {
  id: string;
  amount: number;
  consumedAt: string;
}

export interface TodaySummary {
  date: string;
  totalIntakeMl: number;
  dailyGoalMl: number;
  progressPercentage: number;
  remainingMl: number;
  entries: IntakeEntry[];
}

export interface HistoryGroup {
  date: string;
  totalIntakeMl: number;
  dailyGoalMl: number;
  percentage: number;
  isGoalAchieved: boolean;
  status: string;
  entriesCount: number;
  entries: IntakeEntry[];
}

export interface AdminMetrics {
  totalUsers: number;
  totalIntakeLogs: number;
  todayTotalIntakeMl: number;
  currentDailyGoalMl: number;
}

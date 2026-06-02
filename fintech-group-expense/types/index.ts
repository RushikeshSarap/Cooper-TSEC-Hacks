export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  walletAddress?: string;
  balance: number;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'settled' | 'pending';
  totalBudget: number;
  currentSpent: number;
  participantCount: number;
  createdBy: string;
  createdAt: string;
}

export interface Participant {
  id: string;
  user: User;
  role: 'organizer' | 'member';
  depositAmount: number;
  spentAmount: number;
  balance: number;
  joinedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  spent: number;
  participantIds: string[];
}

export interface Transaction {
  id: string;
  eventId: string;
  categoryId?: string;
  description: string;
  amount: number;
  paidBy: User;
  splitBetween: User[];
  receipt?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Settlement {
  id: string;
  eventId: string;
  from: User;
  to: User;
  amount: number;
  status: 'pending' | 'completed';
  completedAt?: string;
}

export interface Wallet {
  id: string;
  address: string;
  balance: number;
  currency: string;
  connected: boolean;
}

export interface Rule {
  id: string;
  name: string;
  type: 'spending_limit' | 'category_limit' | 'approval_required' | 'time_restriction';
  value: number | string;
  enabled: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

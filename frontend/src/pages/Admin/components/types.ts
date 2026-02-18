export interface User {
  id: number;
  name: string;
  age: number;
  gender: string;
  religion: string;
  profession: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredDate: string;
  premium: boolean;
  email?: string;
  mobile?: string;
  profilePhoto?: string;
  education?: string;
  caste?: string;
  height?: string;
  maritalStatus?: string;
  motherTongue?: string;
  annualIncome?: string;
  country?: string;
  dob?: string;
  profileFor?: string;
}

export interface Match {
  id: number;
  user1: string;
  user2: string;
  status: string;
  date: string;
}

export interface Stats {
  totalUsers: number;
  pendingApprovals: number;
  activeUsers: number;
  successMatches: number;
  premiumUsers: number;
}
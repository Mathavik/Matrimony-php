import axios from '../../../axiosInstance';
import { User } from '../components/types';

interface UserStats {
    totalUsers: number;
    pendingApprovals: number;
    activeUsers: number;
    premiumUsers: number;
    successMatches: number;
    recentUsers: User[];
}

interface UserStatsResponse {
    users: User[];
    stats: UserStats;
}

// Normalize backend user object to the frontend `User` shape
const normalizeUser = (u: any): User => ({
    id: u.id,
    name: u.fullName || u.name || 'Unknown',
    age: u.age ?? 0,
    gender: u.gender || '',
    religion: u.religion || '',
    profession: u.occupation || u.profession || '',
    location: u.city || u.location || `${u.state || ''}`,
    status: u.status || 'pending',
    registeredDate: u.createdAt || u.registeredDate || new Date().toISOString(),
    premium: !!(u.isPremium || u.premium)
});

export const fetchUserStats = async (): Promise<UserStatsResponse> => {
    try {
        const response = await axios.get<{ users: any[] }>('/api/register/users');
        const apiUsers = response.data.users || [];

        // Map/normalize users so frontend components always have expected fields
        const users: User[] = apiUsers.map(normalizeUser);

        const stats: UserStats = {
            totalUsers: users.length,
            pendingApprovals: users.filter((u) => u.status === 'pending').length,
            activeUsers: users.filter((u) => u.status === 'approved').length,
            premiumUsers: users.filter((u) => u.premium).length,
            successMatches: 0, // placeholder, integrate matches API when ready
            recentUsers: users
                .slice() // copy
                .sort((a, b) => new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime())
                .slice(0, 5)
        };

        return { users, stats };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw new Error('Failed to fetch user statistics');
    }
};

export const deleteUserById = async (id: number): Promise<void> => {
  try {
    const response = await axios.delete(`/api/register/users/${id}`);
    console.log('Delete success:', response.data);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};
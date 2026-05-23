import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import Layout from '../components/Layout';
import { BookingStatus, type Booking } from '../types';

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getSummary(),
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return 'bg-green-100 text-green-800';
      case BookingStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.Cancelled:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} />
        </div>
        <span className="text-sm font-medium text-gray-400">Total</span>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );

  return (
    <Layout isAdmin={true}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your business performance and bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Active Offers" 
          value={stats?.activeOffers || 0} 
          icon={ShoppingBag} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Total Bookings" 
          value={stats?.totalBookings || 0} 
          icon={Users} 
          color="bg-purple-50 text-purple-600" 
        />
        <StatCard 
          title="Today's Bookings" 
          value={stats?.todayBookings || 0} 
          icon={Calendar} 
          color="bg-orange-50 text-orange-600" 
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${stats?.conversionRate || 0}%`} 
          icon={TrendingUp} 
          color="bg-green-50 text-green-600" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
          <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm font-semibold text-gray-600">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Offer</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">People</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4 h-16 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : stats?.recentBookings && stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking: Booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.offer?.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} className="text-gray-400" />
                        <span>{booking.slot?.startTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.peopleCount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No recent bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

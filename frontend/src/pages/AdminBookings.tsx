import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import Layout from '../components/Layout';
import { BookingStatus } from '../types';

const AdminBookings: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => bookingService.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => 
      bookingService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
  });

  const handleStatusChange = (id: string, status: BookingStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <Layout isAdmin={true}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
        <p className="text-gray-600">Track and update the status of customer reservations.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Reference</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Offer / Slot</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">People</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4 h-16 bg-gray-50/50"></td>
                </tr>
              ))
            ) : bookings?.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-medium text-blue-600">{booking.bookingReference}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{booking.customerName}</div>
                  <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{booking.offer?.title}</div>
                  <div className="text-xs text-gray-500">{booking.slot?.slotDate} @ {booking.slot?.startTime}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{booking.peopleCount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === BookingStatus.Confirmed ? 'bg-green-100 text-green-800' : 
                    booking.status === BookingStatus.Pending ? 'bg-yellow-100 text-yellow-800' : 
                    booking.status === BookingStatus.Cancelled ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {booking.status === BookingStatus.Pending && (
                    <button 
                      onClick={() => handleStatusChange(booking.id, BookingStatus.Confirmed)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Confirm"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {booking.status !== BookingStatus.Cancelled && booking.status !== BookingStatus.Completed && (
                    <button 
                      onClick={() => handleStatusChange(booking.id, BookingStatus.Cancelled)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  {booking.status === BookingStatus.Confirmed && (
                    <button 
                      onClick={() => handleStatusChange(booking.id, BookingStatus.Completed)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mark Completed"
                    >
                      <Clock size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdminBookings;

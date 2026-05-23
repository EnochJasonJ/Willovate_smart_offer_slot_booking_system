import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, Tag as TagIcon } from 'lucide-react';
import api from '../services/api';
import Layout from '../components/Layout';
import { BookingStatus, type Booking } from '../types';

const MyBookings: React.FC = () => {
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
        const response = await api.get<Booking[]>('/customer/bookings');
        return response.data;
    },
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

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="mb-12">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">My Bookings</h1>
            <p className="text-slate-500 font-bold text-lg uppercase tracking-widest text-xs">Your exclusive reservations</p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card h-40 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
            <div className="text-center py-20 glass-card">
                <p className="text-rose-600 font-black text-xl">Failed to load bookings</p>
            </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {bookings.map((booking: Booking) => (
              <div key={booking.id} className="glass-card p-8 flex flex-col md:flex-row justify-between items-start md:items-center group">
                <div className="flex items-center space-x-6">
                    <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                        <TagIcon size={32} />
                    </div>
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-2xl font-black text-slate-900">{booking.offer?.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center">
                                <Calendar size={14} className="mr-2" />
                                {booking.slot?.slotDate}
                            </div>
                            <div className="flex items-center">
                                <Clock size={14} className="mr-2" />
                                {booking.slot?.startTime} - {booking.slot?.endTime}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2 text-indigo-500">REF:</span>
                                <span className="text-slate-600">{booking.bookingReference}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex items-center space-x-4">
                    <div className="text-right mr-4 hidden md:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reserved for</p>
                        <p className="text-lg font-black text-slate-900">{booking.peopleCount} People</p>
                    </div>
                    <button className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-slate-900">
                        <MapPin size={20} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 glass-card">
            <TagIcon className="mx-auto text-slate-200 mb-6" size={64} />
            <h3 className="text-2xl font-black text-slate-900 mb-2">No bookings yet</h3>
            <p className="text-slate-400 font-bold mb-8">Start exploring the best deals in your city.</p>
            <a href="/" className="btn-vibrant">Explore Offers</a>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;

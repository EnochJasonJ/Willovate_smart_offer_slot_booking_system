import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, User, Phone, Tag, Home } from 'lucide-react';
import Layout from '../components/Layout';
import type { Booking } from '../types';

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const booking = location.state?.booking as Booking;

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-green-600 p-8 text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-green-50 opacity-90">Your reservation has been successfully placed.</p>
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Reference</p>
                <p className="text-2xl font-mono font-bold text-gray-900">{booking.bookingReference}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">CONFIRMED</span>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <Tag size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{booking.offer?.title}</p>
                  <p className="text-xs text-gray-500">Offer Selected</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {booking.slot ? new Date(booking.slot.slotDate).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">Date</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {booking.slot?.startTime} - {booking.slot?.endTime}
                    </p>
                    <p className="text-xs text-gray-500">Time Window</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{booking.customerName}</p>
                    <p className="text-xs text-gray-500">{booking.peopleCount} People</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{booking.customerPhone}</p>
                    <p className="text-xs text-gray-500">Contact Number</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-8">
              <p className="text-xs text-gray-500 leading-relaxed">
                Please show this confirmation screen or provide your booking reference at the merchant location to avail the offer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/"
                className="flex-1 flex items-center justify-center space-x-2 bg-white border border-gray-200 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Home size={18} />
                <span>Back to Home</span>
              </Link>
              <button 
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition-colors"
              >
                <span>Print Confirmation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingConfirmation;

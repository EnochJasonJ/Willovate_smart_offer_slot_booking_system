import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Clock, MapPin, Phone, Info, ChevronRight } from 'lucide-react';
import { offerService } from '../services/offerService';
import { bookingService } from '../services/bookingService';
import Layout from '../components/Layout';
import type { OfferSlot, BookingRequest } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import CountdownTimer from '../components/CountdownTimer';

const OfferDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<OfferSlot | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    peopleCount: 1,
    specialNote: ''
  });

  const { data: offer, isLoading: isLoadingOffer } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => offerService.getById(id!),
    enabled: !!id,
  });

  const { data: slots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ['slots', id],
    queryFn: () => offerService.getSlotsByOfferId(id!),
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: (request: BookingRequest) => bookingService.create(request),
    onSuccess: (data) => {
      navigate('/confirmation', { state: { booking: data } });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to book slot. Please try again.');
    }
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !id) return;

    bookingMutation.mutate({
      offerId: id,
      slotId: selectedSlot.id,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email || undefined,
      peopleCount: customerInfo.peopleCount,
      specialNote: customerInfo.specialNote || undefined,
    });
  };

  if (isLoadingOffer) return <Layout><div className="animate-pulse h-96 bg-gray-200 rounded-xl"></div></Layout>;
  if (!offer) return <Layout><div className="text-center py-12">Offer not found.</div></Layout>;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Details */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="h-64 bg-blue-600 flex items-center justify-center">
              <span className="text-white text-6xl font-bold">{offer.discountPercentage}% OFF</span>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {offer.category}
                </span>
                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{offer.title}</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">{offer.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Location</h4>
                    <p className="text-sm text-gray-500">{offer.business?.address || 'Available at merchant location'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Phone className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Contact</h4>
                    <p className="text-sm text-gray-500">{offer.business?.phone || 'Contact merchant for details'}</p>
                  </div>
                </div>
              </div>

              {offer.termsAndConditions && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Info size={18} className="mr-2 text-blue-600" />
                    Terms & Conditions
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-500 space-y-2">
                    {offer.termsAndConditions.split('\n').map((term, i) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Booking */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-bold text-blue-600">₹{offer.offerPrice}</span>
                <span className="text-lg text-gray-400 line-through">₹{offer.originalPrice}</span>
              </div>
              <div className="mt-4 mb-6">
                <CountdownTimer targetDate={offer.endDate} />
              </div>
            </div>

            <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Scan & Share Deal</p>
                <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200">
                    <QRCodeSVG value={window.location.href} size={120} />
                </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <Clock size={18} className="mr-2 text-blue-600" />
                Select a Time Slot
              </h4>
              
              {isLoadingSlots ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg"></div>)}
                </div>
              ) : slots && slots.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {slots.map((slot: OfferSlot) => (
                    <button
                      key={slot.id}
                      disabled={slot.bookedCount >= slot.capacity}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                        selectedSlot?.id === slot.id
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                          : slot.bookedCount >= slot.capacity
                          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-left">
                        <div className={`font-semibold ${selectedSlot?.id === slot.id ? 'text-blue-700' : 'text-gray-900'}`}>
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          {slot.capacity - slot.bookedCount} seats left
                        </div>
                      </div>
                      <ChevronRight size={16} className={selectedSlot?.id === slot.id ? 'text-blue-600' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No slots available for this offer.</div>
              )}
            </div>

            {selectedSlot && (
              <form onSubmit={handleBooking} className="space-y-4 animate-in slide-in-from-bottom duration-300">
                <div className="h-px bg-gray-100 my-6"></div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Your Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Enoch Jason"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="+91 98765 43210"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">People</label>
                        <input
                            type="number"
                            min="1"
                            max={selectedSlot.capacity - selectedSlot.bookedCount}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={customerInfo.peopleCount}
                            onChange={(e) => setCustomerInfo({...customerInfo, peopleCount: parseInt(e.target.value)})}
                        />
                    </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center space-x-2"
                >
                  {bookingMutation.isPending ? 'Confirming...' : 'Complete Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfferDetail;

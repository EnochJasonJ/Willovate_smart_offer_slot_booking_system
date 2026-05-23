import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Clock, MapPin, Phone, Info, ChevronRight, ArrowLeft, Sparkles, User, Smartphone } from 'lucide-react';
import { offerService } from '../services/offerService';
import { bookingService } from '../services/bookingService';
import Layout from '../components/Layout';
import type { OfferSlot, BookingRequest } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import CountdownTimer from '../components/CountdownTimer';
import { getEliteImage } from '../services/imageService';

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

  if (isLoadingOffer) return <Layout><div className="animate-pulse h-screen bg-slate-50 rounded-[4rem] mx-4"></div></Layout>;
  if (!offer) return <Layout><div className="text-center py-40 font-black text-4xl">Experience Expired.</div></Layout>;

  const imageUrl = getEliteImage(offer.category, offer.id, 1600);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pb-40">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center space-x-3 text-slate-400 hover:text-slate-900 transition-all font-black text-[10px] uppercase tracking-[0.3em] mb-12 group">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:shadow-xl group-hover:-translate-x-1 transition-all">
                <ArrowLeft size={16} />
            </div>
            <span>Back to Collection</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Column: Visuals & Info */}
          <div className="w-full lg:w-3/5 space-y-16">
            {/* Cinematic Hero Image */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)]">
                <img 
                    src={imageUrl} 
                    alt={offer.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                
                {/* Overlay Text */}
                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                    <div>
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-4">
                            <Sparkles size={12} className="text-indigo-400" />
                            <span>{offer.category}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">{offer.title}</h1>
                    </div>
                    <div className="bg-indigo-600 text-white px-8 py-4 rounded-[2rem] font-black text-3xl shadow-2xl shadow-indigo-500/40">
                        {offer.discountPercentage}% OFF
                    </div>
                </div>
            </div>

            {/* Detailed Description */}
            <div className="px-4 space-y-12">
                <div className="space-y-6">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">The Experience</h2>
                    <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-3xl italic font-serif">
                        "{offer.description}"
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="glass-card p-10 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <MapPin size={24} />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Location</h4>
                        <p className="text-slate-500 font-bold leading-tight">{offer.business?.address || 'Premium Merchant Location'}</p>
                    </div>
                    <div className="glass-card p-10 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Phone size={24} />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Concierge</h4>
                        <p className="text-slate-500 font-bold leading-tight">{offer.business?.phone || 'Priority Support'}</p>
                    </div>
                </div>

                {offer.termsAndConditions && (
                    <div className="pt-8 border-t border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Access Requirements</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {offer.termsAndConditions.split('\n').map((term, i) => (
                            <li key={i} className="flex items-start space-x-4 text-slate-500 font-bold text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                                <span>{term}</span>
                            </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
          </div>

          {/* Right Column: High-End Booking Sidebar */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-32">
            <div className="glass-card p-10 md:p-14 border-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 space-y-12">
                    <div className="flex justify-between items-center pb-8 border-b border-slate-100">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Member Price</p>
                            <div className="flex items-baseline space-x-3">
                                <span className="text-5xl font-black text-slate-900">₹{offer.offerPrice}</span>
                                <span className="text-lg text-slate-300 font-bold line-through tracking-tighter">₹{offer.originalPrice}</span>
                            </div>
                        </div>
                        <CountdownTimer targetDate={offer.endDate} />
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center">
                            <Clock size={16} className="mr-3 text-indigo-500" />
                            Select Preferred Slot
                        </h4>
                        
                        <div className="space-y-3">
                            {isLoadingSlots ? (
                                [...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-3xl"></div>)
                            ) : slots?.map((slot: OfferSlot) => (
                                <button
                                    key={slot.id}
                                    disabled={slot.bookedCount >= slot.capacity}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`w-full group/slot p-6 rounded-[2rem] border transition-all duration-500 text-left ${
                                        selectedSlot?.id === slot.id
                                        ? 'bg-slate-900 border-slate-900 shadow-2xl translate-x-2'
                                        : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                                    } ${slot.bookedCount >= slot.capacity ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={`text-xl font-black tracking-tight ${selectedSlot?.id === slot.id ? 'text-white' : 'text-slate-900'}`}>
                                                {slot.startTime} - {slot.endTime}
                                            </p>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedSlot?.id === slot.id ? 'text-indigo-300' : 'text-slate-400'}`}>
                                                {slot.capacity - slot.bookedCount} spots remaining
                                            </p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${selectedSlot?.id === slot.id ? 'bg-indigo-600 text-white rotate-90' : 'bg-slate-100 text-slate-300 group-hover/slot:bg-indigo-50 group-hover/slot:text-indigo-400'}`}>
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedSlot && (
                        <form onSubmit={handleBooking} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="h-px bg-slate-100"></div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center">
                                            <User size={12} className="mr-2" /> Identification
                                        </label>
                                        <input
                                            required
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                                            placeholder="Guest Name"
                                            value={customerInfo.name}
                                            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center">
                                            <Smartphone size={12} className="mr-2" /> Contact
                                        </label>
                                        <input
                                            required
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                                            placeholder="+91 Contact"
                                            value={customerInfo.phone}
                                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={bookingMutation.isPending}
                                className="w-full btn-premium py-6 flex items-center justify-center space-x-4 !rounded-[2.5rem]"
                            >
                                <span className="tracking-[0.2em] font-black">{bookingMutation.isPending ? 'SECURING...' : 'CONFIRM RESERVATION'}</span>
                                <ArrowUpRight size={24} className="text-indigo-400" />
                            </button>

                            <div className="flex flex-col items-center pt-8 space-y-4">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Priority Digital Pass</p>
                                <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100">
                                    <QRCodeSVG value={window.location.href} size={140} />
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfferDetail;

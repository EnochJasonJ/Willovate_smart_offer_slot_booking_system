import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Clock, Save, Plus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import Layout from '../components/Layout';

const CreateOffer: React.FC = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([{ startTime: '10:00', endTime: '11:00', capacity: 10 }]);

  const { data: business } = useQuery({
    queryKey: ['admin-business'],
    queryFn: async () => {
        const response = await api.get('/business');
        return response.data;
    },
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Food',
    originalPrice: 1000,
    offerPrice: 499,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    termsAndConditions: '1. Valid for app members only.\n2. Non-refundable.',
    status: 'Active'
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // 1. Create Offer
      const offerResp = await api.post('/offers', {
        ...data,
        businessId: business.id,
        discountPercentage: Math.round((1 - data.offerPrice / data.originalPrice) * 100)
      });
      
      const offerId = offerResp.data.id;

      // 2. Create Slots
      for (const slot of slots) {
        await api.post('/slots', {
          ...slot,
          offerId,
          slotDate: data.startDate,
          status: 'Available'
        });
      }

      return offerResp.data;
    },
    onSuccess: () => {
      navigate('/admin/offers');
    }
  });

  const addSlot = () => setSlots([...slots, { startTime: '12:00', endTime: '13:00', capacity: 10 }]);
  const removeSlot = (index: number) => setSlots(slots.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) {
        alert("Please set up your Business Profile first!");
        navigate('/admin/business');
        return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Layout isAdmin={true}>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-12">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">Post New Offer</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Launch your next elite experience</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Offer Details */}
            <div className="lg:col-span-2 space-y-10">
                <div className="glass-card p-12">
                    <div className="flex items-center space-x-3 text-indigo-600 mb-10">
                        <Sparkles size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Campaign Details</span>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Offer Title</label>
                            <input
                                required
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-black text-2xl text-slate-900"
                                placeholder="e.g. Royal Sunset Dinner"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-600 resize-none"
                                placeholder="Describe the exclusive experience..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category</label>
                                <select 
                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white outline-none font-bold text-slate-900"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="Food">Fine Dining</option>
                                    <option value="Wellness">Retreats & Spa</option>
                                    <option value="Gym">Elite Fitness</option>
                                    <option value="Activity">Activities</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pricing (Original vs Offer)</label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="number"
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-black text-slate-400"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({...formData, originalPrice: parseInt(e.target.value)})}
                                    />
                                    <ArrowRight className="text-slate-300" />
                                    <input
                                        type="number"
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-black text-indigo-600"
                                        value={formData.offerPrice}
                                        onChange={(e) => setFormData({...formData, offerPrice: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-12">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center space-x-3 text-indigo-600">
                            <Clock size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Inventory Slots</span>
                        </div>
                        <button 
                            type="button"
                            onClick={addSlot}
                            className="bg-slate-900 text-white p-2 rounded-full hover:bg-indigo-600 transition-all"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {slots.map((slot, index) => (
                            <div key={index} className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex-grow grid grid-cols-3 gap-4">
                                    <input 
                                        type="time" 
                                        className="bg-white border-none rounded-xl px-4 py-2 font-black text-xs" 
                                        value={slot.startTime}
                                        onChange={(e) => {
                                            const newSlots = [...slots];
                                            newSlots[index].startTime = e.target.value;
                                            setSlots(newSlots);
                                        }}
                                    />
                                    <input 
                                        type="time" 
                                        className="bg-white border-none rounded-xl px-4 py-2 font-black text-xs" 
                                        value={slot.endTime}
                                        onChange={(e) => {
                                            const newSlots = [...slots];
                                            newSlots[index].endTime = e.target.value;
                                            setSlots(newSlots);
                                        }}
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Cap"
                                        className="bg-white border-none rounded-xl px-4 py-2 font-black text-xs" 
                                        value={slot.capacity}
                                        onChange={(e) => {
                                            const newSlots = [...slots];
                                            newSlots[index].capacity = parseInt(e.target.value);
                                            setSlots(newSlots);
                                        }}
                                    />
                                </div>
                                {slots.length > 1 && (
                                    <button onClick={() => removeSlot(index)} className="text-rose-400 hover:text-rose-600 p-2">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Sidebar Controls */}
            <div className="space-y-8">
                <div className="glass-card p-10 space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Validity Window</label>
                        <div className="space-y-3">
                            <input 
                                type="date" 
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            />
                            <div className="text-center text-slate-300">to</div>
                            <input 
                                type="date" 
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900"
                                value={formData.endDate}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Status</label>
                        <select 
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-indigo-600 uppercase tracking-widest text-xs"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="Active">Live & Active</option>
                            <option value="Draft">Save as Draft</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="w-full btn-premium py-6 flex items-center justify-center space-x-3 !rounded-[2rem]"
                    >
                        <Save size={20} className="text-indigo-400" />
                        <span className="tracking-widest">{createMutation.isPending ? 'LAUNCHING...' : 'PUBLISH OFFER'}</span>
                    </button>
                </div>
            </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateOffer;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, MapPin, Save } from 'lucide-react';
import api from '../services/api';
import Layout from '../components/Layout';

const AdminBusiness: React.FC = () => {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const { data: business, isLoading } = useQuery({
    queryKey: ['admin-business'],
    queryFn: async () => {
        try {
            const response = await api.get('/business');
            return response.data;
        } catch (e) {
            return null; // Business might not exist yet
        }
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    businessType: 'Restaurant',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    openingTime: '09:00',
    closingTime: '22:00'
  });

  // Sync form when data loads
  React.useEffect(() => {
    if (business) {
      setFormData({
        name: business.name,
        businessType: business.businessType,
        ownerName: business.ownerName,
        phone: business.phone,
        email: business.email,
        address: business.address,
        city: business.city,
        openingTime: business.openingTime,
        closingTime: business.closingTime
      });
    }
  }, [business]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (business?.id) {
        return api.put(`/business/${business.id}`, data);
      } else {
        return api.post('/business', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-business'] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) return <Layout isAdmin={true}><div className="animate-pulse h-96 bg-white/20 rounded-[3rem]"></div></Layout>;

  return (
    <Layout isAdmin={true}>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-12">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">Shop Profile</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Establish your brand identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Store Identity */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-indigo-600 mb-2">
                        <Store size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Store Identity</span>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Business Name</label>
                        <input
                            required
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                            placeholder="e.g. Blue Lagoon Spa"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category</label>
                        <select
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900 appearance-none"
                            value={formData.businessType}
                            onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                        >
                            <option value="Restaurant">Restaurant</option>
                            <option value="Gym">Fitness & Gym</option>
                            <option value="Salon">Salon & Wellness</option>
                            <option value="Clinic">Clinic</option>
                            <option value="Coaching">Coaching</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Owner Name</label>
                        <input
                            required
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                            placeholder="Full Legal Name"
                            value={formData.ownerName}
                            onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                        />
                    </div>
                </div>

                {/* Contact & Location */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-emerald-600 mb-2">
                        <MapPin size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contact & Location</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone</label>
                            <input
                                required
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">City</label>
                            <input
                                required
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Address</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-900 resize-none"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                </div>
            </div>
            
            <div className="h-px bg-slate-100 my-12"></div>

            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                <div className="flex items-center space-x-8">
                    <div className="space-y-2 text-center md:text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Open From</label>
                        <input
                            type="time"
                            className="block px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm"
                            value={formData.openingTime}
                            onChange={(e) => setFormData({...formData, openingTime: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Close At</label>
                        <input
                            type="time"
                            className="block px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm"
                            value={formData.closingTime}
                            onChange={(e) => setFormData({...formData, closingTime: e.target.value})}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    {success && (
                        <span className="text-emerald-600 font-black text-xs uppercase tracking-widest animate-pulse">Changes Saved!</span>
                    )}
                    <button
                        type="submit"
                        disabled={saveMutation.isPending}
                        className="btn-premium flex items-center space-x-3 !py-5 !px-12"
                    >
                        <Save size={18} className="text-indigo-400" />
                        <span className="tracking-widest">{saveMutation.isPending ? 'SYNCING...' : 'SAVE PROFILE'}</span>
                    </button>
                </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AdminBusiness;

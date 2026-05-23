import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Power, PowerOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { offerService } from '../services/offerService';
import Layout from '../components/Layout';
import { OfferStatus } from '../types';

const AdminOffers: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: offers, isLoading } = useQuery({
    queryKey: ['admin-offers'],
    queryFn: () => offerService.getAll({}),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => offerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OfferStatus }) => 
      offerService.update(id, { status } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (offer: any) => {
    const newStatus = offer.status === 'Active' ? 'Paused' : 'Active';
    toggleStatusMutation.mutate({ id: offer.id, status: newStatus as any });
  };

  return (
    <Layout isAdmin={true}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Offers</h1>
          <p className="text-gray-600">Create and manage your business offers and time slots.</p>
        </div>
        <Link to="/admin/offers/create" className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 font-black text-xs tracking-widest">
          <Plus size={18} />
          <span>CREATE NEW OFFER</span>
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Offer Title</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Validity</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-8 py-6 h-20 bg-slate-50/30"></td>
                </tr>
              ))
            ) : offers?.map((offer) => (
              <tr key={offer.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="font-black text-slate-900 tracking-tight">{offer.title}</div>
                </td>
                <td className="px-8 py-6">
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{offer.category}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="text-indigo-600 font-black tracking-tight text-lg">₹{offer.offerPrice}</div>
                  <div className="text-[10px] text-slate-300 font-bold line-through">₹{offer.originalPrice}</div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    offer.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    offer.status === 'Draft' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {offer.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-xs font-bold text-slate-400">
                  {offer.startDate} to {offer.endDate}
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button 
                    onClick={() => handleToggleStatus(offer)}
                    className="p-3 text-slate-300 hover:text-indigo-600 transition-all bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-lg"
                    title={offer.status === 'Active' ? 'Pause' : 'Activate'}
                  >
                    {offer.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(offer.id)}
                    className="p-3 text-slate-300 hover:text-rose-600 transition-all bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-lg" 
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdminOffers;

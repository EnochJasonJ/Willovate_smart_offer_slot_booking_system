import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
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
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          <span>Create New Offer</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Offer Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">Validity</th>
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
            ) : offers?.map((offer) => (
              <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{offer.title}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{offer.category}</td>
                <td className="px-6 py-4">
                  <div className="text-gray-900 font-medium">₹{offer.offerPrice}</div>
                  <div className="text-xs text-gray-400 line-through">₹{offer.originalPrice}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    offer.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    offer.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {offer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {offer.startDate} to {offer.endDate}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleToggleStatus(offer)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title={offer.status === 'Active' ? 'Pause' : 'Activate'}
                  >
                    {offer.status === 'Active' ? <PowerOff size={18} /> : <Power size={18} />}
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(offer.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors" 
                    title="Delete"
                  >
                    <Trash2 size={18} />
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

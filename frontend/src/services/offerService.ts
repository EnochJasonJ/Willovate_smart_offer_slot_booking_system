import api from './api';
import type { Offer, OfferSlot } from '../types';

export const offerService = {
  getAll: async (params: { businessType?: string; category?: string; date?: string }) => {
    const response = await api.get<Offer[]>('/offers', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<Offer>(`/offers/${id}`);
    return response.data;
  },
  
  getSlotsByOfferId: async (offerId: string) => {
    const response = await api.get<OfferSlot[]>(`/offers/${offerId}/slots`);
    return response.data;
  },
  
  create: async (data: Partial<Offer>) => {
    const response = await api.post<Offer>('/offers', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Offer>) => {
    const response = await api.put(`/offers/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`/offers/${id}`);
  }
};

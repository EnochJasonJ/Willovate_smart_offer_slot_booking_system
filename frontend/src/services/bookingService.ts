import api from './api';
import type { Booking, BookingRequest, BookingStatus } from '../types';

export const bookingService = {
  create: async (booking: BookingRequest) => {
    const response = await api.post<Booking>('/bookings', booking);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },
  updateStatus: async (id: string, status: BookingStatus) => {
    const response = await api.put<Booking>(`/bookings/${id}/status`, status);
    return response.data;
  }
};

export const UserRole = {
  Admin: 'Admin',
  Customer: 'Customer',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const OfferStatus = {
  Draft: 'Draft',
  Active: 'Active',
  Paused: 'Paused',
  Expired: 'Expired',
  Cancelled: 'Cancelled',
} as const;
export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];

export const SlotStatus = {
  Available: 'Available',
  Full: 'Full',
  Closed: 'Closed',
  Expired: 'Expired',
  Cancelled: 'Cancelled',
} as const;
export type SlotStatus = (typeof SlotStatus)[keyof typeof SlotStatus];

export const BookingStatus = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Cancelled: 'Cancelled',
  Completed: 'Completed',
  NoShow: 'NoShow',
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export interface Business {
  id: string;
  name: string;
  businessType: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  logoUrl?: string;
}

export interface Offer {
  id: string;
  businessId: string;
  business?: Business;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  termsAndConditions?: string;
  status: OfferStatus;
  slots?: OfferSlot[];
}

export interface OfferSlot {
  id: string;
  offerId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  status: SlotStatus;
}

export interface Booking {
  id: string;
  bookingReference: string;
  offerId: string;
  offer?: Offer;
  slotId: string;
  slot?: OfferSlot;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  peopleCount: number;
  specialNote?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingRequest {
  offerId: string;
  slotId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  peopleCount: number;
  specialNote?: string;
}

export interface DashboardStats {
  totalOffers: number;
  activeOffers: number;
  totalBookings: number;
  todayBookings: number;
  totalCapacity: number;
  bookedSeats: number;
  availableSeats: number;
  conversionRate: number;
  recentBookings?: Booking[];
}

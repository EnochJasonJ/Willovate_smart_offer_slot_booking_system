import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import type { Offer } from '../types';
import CountdownTimer from './CountdownTimer';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-indigo-50/50 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 group">
      <div className="relative h-56 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
            </svg>
        </div>
        
        <Tag className="text-indigo-200 group-hover:text-indigo-300 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 ease-out" size={80} />
        
        <div className="absolute top-5 right-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-1.5 rounded-2xl font-black text-xs tracking-wider shadow-lg shadow-pink-200">
          {offer.discountPercentage}% OFF
        </div>

        <div className="absolute top-5 left-5">
            <CountdownTimer targetDate={offer.endDate} />
        </div>
        
        <div className="absolute bottom-5 left-5 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-black text-indigo-600 border border-white uppercase tracking-widest shadow-sm">
          {offer.category}
        </div>
      </div>
      
      <div className="p-7">
        <h3 className="text-xl font-black text-brand-text-dark mb-2 group-hover:text-brand-primary transition-colors line-clamp-1">{offer.title}</h3>
        <p className="text-brand-text-light text-sm mb-6 line-clamp-2 h-10 leading-relaxed font-medium">{offer.description}</p>
        
        <div className="flex items-end justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-brand-text-light uppercase tracking-widest mb-1">Offer Price</span>
            <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-indigo-600">₹{offer.offerPrice}</span>
                <span className="text-sm text-brand-text-light line-through decoration-rose-400/50 decoration-2 font-bold">₹{offer.originalPrice}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-xs font-bold text-brand-text-light space-x-4 mb-7 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-indigo-400" />
            <span>Valid till {new Date(offer.endDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <Link 
          to={`/offers/${offer.id}`}
          className="group/btn flex items-center justify-center space-x-2 w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-brand-primary transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-indigo-200"
        >
          <span>VIEW DETAILS</span>
          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default OfferCard;

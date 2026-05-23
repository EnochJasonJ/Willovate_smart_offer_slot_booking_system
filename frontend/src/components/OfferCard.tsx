import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Offer } from '../types';
import { getEliteImage } from '../services/imageService';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const imageUrl = getEliteImage(offer.category, offer.id, 800);

  return (
    <Link to={`/offers/${offer.id}`} className="group block">
      <div className="space-y-10">
        {/* Elite Card Frame */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-slate-900 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rounded-[4.5rem] group-hover:shadow-[0_80px_120px_-20px_rgba(0,0,0,0.3)] group-hover:-translate-y-6">
            
            {/* Background Image Layer */}
            <div className="absolute inset-0 transition-all duration-1000 scale-105 group-hover:scale-125">
                <img 
                    src={imageUrl} 
                    alt={offer.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 ease-out"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <pattern id="cardGridDetailed" width="12" height="12" patternUnits="userSpaceOnUse">
                            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="white" strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#cardGridDetailed)" />
                </svg>
            </div>

            {/* Float Category Badge */}
            <div className="absolute top-10 left-10">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-2.5 rounded-full shadow-2xl transition-all duration-500 group-hover:bg-white group-hover:text-slate-900">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">{offer.category}</span>
                </div>
            </div>

            {/* Price Floating Tag */}
            <div className="absolute top-10 right-10">
                <div className="bg-indigo-600 text-white px-5 py-2 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-500/50">
                    ₹{offer.offerPrice}
                </div>
            </div>

            {/* Large Discount Badge */}
            <div className="absolute bottom-12 left-12 flex flex-col items-start translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Exclusive Deal</span>
                <div className="flex items-baseline space-x-2">
                    <span className="text-6xl font-black text-white tracking-tighter leading-none">{offer.discountPercentage}%</span>
                    <span className="text-2xl font-black text-indigo-400 leading-none">OFF</span>
                </div>
            </div>

            {/* View Action Circle */}
            <div className="absolute bottom-10 right-10">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 ease-out">
                    <ArrowUpRight size={32} className="text-slate-900" />
                </div>
            </div>
        </div>

        {/* Content Info */}
        <div className="px-6 space-y-5">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors duration-500">{offer.title}</h3>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Mumbai • Limited Slots</p>
                </div>
            </div>
            <p className="text-slate-500 font-medium text-lg leading-snug line-clamp-2 max-w-[90%]">{offer.description}</p>
            <div className="flex items-center space-x-4 pt-2">
                <div className="h-px flex-grow bg-slate-100 group-hover:bg-indigo-100 transition-colors duration-500"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Discover More</span>
            </div>
        </div>
      </div>
    </Link>
  );
};

export default OfferCard;

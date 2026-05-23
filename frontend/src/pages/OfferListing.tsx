import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { offerService } from '../services/offerService';
import OfferCard from '../components/OfferCard';
import Layout from '../components/Layout';

const OfferListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const { data: offers, isLoading, error } = useQuery({
    queryKey: ['offers', category],
    queryFn: () => offerService.getAll({ category: category || undefined }),
  });

  const filteredOffers = offers?.filter(offer => 
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {/* Premium Hero Section */}
      <div className="relative mb-24 py-28 px-8 rounded-[4rem] overflow-hidden bg-slate-900 shadow-[0_48px_100px_-12px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/30 rounded-full blur-[160px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/30 rounded-full blur-[160px] animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full text-indigo-300 text-sm font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-md shadow-2xl">
                <Sparkles size={16} className="animate-spin-slow" />
                <span>Award Winning Experiences</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                Elevate Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-300">Daily Life</span>
            </h1>
            
            <p className="text-slate-400 text-xl md:text-2xl font-semibold mb-14 max-w-2xl mx-auto leading-relaxed">
                Premium reservations for the city's most exclusive venues. Handpicked. Limited. Elite.
            </p>
            
            {/* Ultra-Sleek Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative flex items-center bg-white/5 backdrop-blur-3xl rounded-[2rem] p-3 border border-white/10 shadow-2xl">
                    <Search className="ml-6 text-indigo-300/50" size={24} />
                    <input
                        type="text"
                        placeholder="Search exclusive experiences..."
                        className="flex-grow px-6 py-5 bg-transparent border-none focus:ring-0 text-white text-lg font-bold placeholder:text-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="hidden md:block btn-vibrant !rounded-2xl !px-10">
                        FIND NOW
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-8 md:space-y-0 px-4">
        <div>
            <div className="h-1 w-20 bg-indigo-600 rounded-full mb-6"></div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-3">Live Collections</h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[0.65rem]">Curated Selection • Updated Hourly</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative group">
              <select 
                className="appearance-none bg-white/50 backdrop-blur-xl px-10 py-5 pr-14 border border-white rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-100 font-black text-slate-800 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all cursor-pointer hover:bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Experiences</option>
                <option value="Food">Fine Dining</option>
                <option value="Wellness">Retreats & Spa</option>
                <option value="Gym">Elite Fitness</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                  <SlidersHorizontal size={18} />
              </div>
          </div>
        </div>
      </div>

      {/* High-End Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/40 backdrop-blur-md animate-pulse h-[600px] rounded-[4rem] border border-white"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24 glass-card mx-4 border-rose-100/50">
          <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-100">
              <Sparkles className="text-rose-400" size={32} />
          </div>
          <p className="text-rose-900 font-black text-3xl tracking-tighter mb-4">Connection Interrupted</p>
          <p className="text-slate-500 font-bold max-w-md mx-auto">We couldn't load the latest collections. Please verify your connection and try again.</p>
        </div>
      ) : filteredOffers && filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 px-4">
          {filteredOffers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-40 glass-card mx-4 border-dashed border-slate-200">
          <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-200">
            <Search className="text-slate-200" size={40} />
          </div>
          <p className="text-slate-900 font-black text-3xl tracking-tight mb-4">No results found</p>
          <p className="text-slate-400 font-bold max-w-md mx-auto text-lg">We couldn't find any experiences matching your current search criteria.</p>
        </div>
      )}
      
      {/* Spacing for Mesh Gradient Visibility */}
      <div className="h-32"></div>
    </Layout>
  );
};

export default OfferListing;

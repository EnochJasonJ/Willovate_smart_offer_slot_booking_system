import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowUpRight } from 'lucide-react';
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
      {/* Cinematic Awwwards-Style Hero */}
      <div className="relative mb-28 pt-12 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center space-x-2 bg-slate-900/5 px-4 py-1.5 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-12 border border-slate-900/5">
                <div className="w-1 h-1 bg-indigo-600 rounded-full animate-ping"></div>
                <span>Curating Elite Experiences</span>
            </div>
            
            <h1 className="text-[clamp(3.5rem,10vw,8.5rem)] font-black leading-[0.9] tracking-[-0.06em] text-slate-900 mb-12">
                Reserved for <br/>
                <span className="text-slate-400 italic font-serif">the bold.</span>
            </h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8 mb-20">
                <p className="text-slate-500 text-lg font-bold max-w-sm text-center md:text-left leading-tight tracking-tight">
                    Exclusive access to the city's most coveted slots. Refined. Rare. Yours.
                </p>
                <div className="h-px w-12 bg-slate-200 hidden md:block"></div>
                <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-xl">
                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                        </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-white text-[10px] font-black shadow-xl">
                        +12K
                    </div>
                </div>
            </div>
            
            {/* Minimalist Search */}
            <div className="max-w-3xl mx-auto px-4">
                <div className="group relative">
                    <div className="absolute inset-0 bg-slate-900/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-all duration-1000"></div>
                    <div className="relative flex items-center border-b-2 border-slate-900 py-6">
                        <Search className="text-slate-900" size={24} />
                        <input
                            type="text"
                            placeholder="Find your next experience..."
                            className="flex-grow px-8 bg-transparent border-none focus:ring-0 text-2xl font-black text-slate-900 placeholder:text-slate-300 tracking-tighter"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-slate-900 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all duration-500 shadow-2xl">
                            <ArrowUpRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-8 md:space-y-0 px-4 max-w-7xl mx-auto">
        <div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4 block">The Collection</span>
            <h2 className="text-6xl font-black text-slate-900 tracking-[-0.04em]">Fresh Drops</h2>
        </div>
        
        <div className="flex items-center space-x-4">
            {['All', 'Food', 'Wellness', 'Gym'].map(cat => (
                <button 
                    key={cat}
                    onClick={() => setCategory(cat === 'All' ? '' : cat)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                        (category === cat || (cat === 'All' && !category)) 
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* High-End Design Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-8">
                    <div className="bg-slate-100 animate-pulse aspect-[4/5] rounded-[3rem]"></div>
                    <div className="h-8 w-2/3 bg-slate-100 animate-pulse rounded-full"></div>
                </div>
            ))}
            </div>
        ) : error ? (
            <div className="text-center py-40 bg-rose-50 rounded-[4rem] border border-rose-100/50">
            <p className="text-rose-900 font-black text-4xl tracking-tighter">System Offline</p>
            </div>
        ) : filteredOffers && filteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {filteredOffers.map(offer => (
                <OfferCard key={offer.id} offer={offer} />
            ))}
            </div>
        ) : (
            <div className="text-center py-60 border-2 border-dashed border-slate-200 rounded-[4rem]">
                <p className="text-slate-300 font-black text-5xl tracking-tighter italic">Nothing found.</p>
            </div>
        )}
      </div>
      
      <div className="h-40"></div>
    </Layout>
  );
};

export default OfferListing;

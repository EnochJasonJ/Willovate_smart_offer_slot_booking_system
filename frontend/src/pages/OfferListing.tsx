import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowUpRight } from 'lucide-react';
import { offerService } from '../services/offerService';
import OfferCard from '../components/OfferCard';
import Layout from '../components/Layout';

const CATEGORIES = ['All', 'Food', 'Wellness', 'Gym', 'Activity', 'Coaching'];

// ── Scroll reveal hook ──────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Inline-style reveal helper — NO blur (blur filter is GPU-expensive at scale)
function revealStyle(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                 transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    willChange: 'opacity,transform',
  };
}

const OfferListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [category, setCategory] = useState('');
  const [heroMounted, setHeroMounted] = useState(false);
  const gridHeader = useReveal();

  // Trigger hero animations shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setHeroMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const { data: offers, isLoading, error } = useQuery({
    queryKey: ['offers', category],
    queryFn: () => offerService.getAll({ category: category || undefined }),
  });

  const filteredOffers = offers?.filter((o) =>
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterClick = (cat: string) => {
    setActiveFilter(cat);
    setCategory(cat === 'All' ? '' : cat);
  };

  return (
    <Layout>
      {/* ══════════════════════════════════════════════════════
          HERO — floating orbs + stagger text entrance
      ══════════════════════════════════════════════════════ */}
      <div className="relative mb-28 pt-12 pb-20 overflow-hidden">

        {/* Ambient orbs — radial gradients fade to transparent naturally (no filter:blur needed) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div
            className="orb-a absolute rounded-full"
            style={{
              width: 500, height: 500,
              top: '-15%', left: '-10%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)',
              opacity: 0.7,
            }}
          />
          <div
            className="orb-b absolute rounded-full"
            style={{
              width: 600, height: 600,
              top: '-18%', right: '-14%',
              background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 50%, transparent 70%)',
              opacity: 0.65,
            }}
          />
          <div
            className="orb-c absolute rounded-full"
            style={{
              width: 360, height: 360,
              bottom: '-6%', left: '40%',
              background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, rgba(236,72,153,0.04) 50%, transparent 70%)',
              opacity: 0.55,
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">

          {/* Live badge */}
          <div style={revealStyle(heroMounted, 0)} className="inline-flex items-center space-x-2 bg-slate-900/5 px-4 py-1.5 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-12 border border-slate-900/5">
            <span className="live-dot" aria-hidden />
            <span>Curating Elite Experiences</span>
          </div>

          {/* Hero heading */}
          <h1
            style={revealStyle(heroMounted, 100)}
            className="text-[clamp(3.5rem,10vw,8.5rem)] font-black leading-[0.9] tracking-[-0.06em] text-slate-900 mb-12"
          >
            Reserved for <br />
            <span className="text-slate-400 italic font-serif">the bold.</span>
          </h1>

          {/* Sub-copy + avatar row */}
          <div
            style={revealStyle(heroMounted, 220)}
            className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8 mb-20"
          >
            <p className="text-slate-500 text-lg font-bold max-w-sm text-center md:text-left leading-tight tracking-tight">
              Exclusive access to the city's most coveted slots. Refined. Rare. Yours.
            </p>
            <div className="h-px w-12 bg-slate-200 hidden md:block" />
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-xl">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Member" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-white text-[10px] font-black shadow-xl">
                +12K
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div style={revealStyle(heroMounted, 340)} className="max-w-3xl mx-auto px-4">
            <div className="group relative">
              <div className="absolute inset-0 bg-slate-900/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-all duration-1000" />
              <div className="relative flex items-center border-b-2 border-slate-900 py-6">
                <Search className="text-slate-900 shrink-0" size={24} />
                <input
                  type="text"
                  placeholder="Find your next experience..."
                  className="flex-grow px-8 bg-transparent border-none focus:ring-0 text-2xl font-black text-slate-900 placeholder:text-slate-300 tracking-tighter outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-slate-900 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-500 shadow-2xl shrink-0">
                  <ArrowUpRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          COLLECTION HEADER + FILTER TABS
      ══════════════════════════════════════════════════════ */}
      <div
        ref={gridHeader.ref}
        className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-8 md:space-y-0 px-4 max-w-7xl mx-auto"
      >
        <div style={revealStyle(gridHeader.visible, 0)}>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4 block">
            The Collection
          </span>
          <h2 className="text-6xl font-black text-slate-900 tracking-[-0.04em]">Fresh Drops</h2>
        </div>

        <div style={revealStyle(gridHeader.visible, 80)} className="flex items-center flex-wrap gap-3">
          {CATEGORIES.map((cat, i) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => handleFilterClick(cat)}
                style={{ transitionDelay: `${i * 35}ms` }}
                className={[
                  'px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest',
                  'transition-all duration-300 active:scale-90',
                  isActive
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-[1.04]'
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 hover:-translate-y-0.5',
                ].join(' ')}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          OFFERS GRID
      ══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-8">
                <div className="skeleton aspect-[4/5] rounded-[3rem]" />
                <div className="skeleton h-8 w-2/3 rounded-full" />
                <div className="skeleton h-5 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-40 bg-rose-50 rounded-[4rem] border border-rose-100/50">
            <p className="text-rose-900 font-black text-4xl tracking-tighter">System Offline</p>
          </div>
        ) : filteredOffers && filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {filteredOffers.map((offer, i) => (
              <OfferCard key={offer.id} offer={offer} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-60 border-2 border-dashed border-slate-200 rounded-[4rem]">
            <p className="text-slate-300 font-black text-5xl tracking-tighter italic">Nothing found.</p>
          </div>
        )}
      </div>

      <div className="h-40" />
    </Layout>
  );
};

export default OfferListing;

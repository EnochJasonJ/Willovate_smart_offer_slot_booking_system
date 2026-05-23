import React, { useState, useRef, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Offer } from '../types';
import { getEliteImage, getFallbackImage, getCategoryFallbackStyle } from '../services/imageService';
import { observeReveal } from '../utils/revealObserver';

interface OfferCardProps {
  offer: Offer;
  index?: number;
}

// Vignette gradient — constant, defined outside component so it's never recreated
const VIGNETTE = 'linear-gradient(to top,rgba(2,6,23,.97) 0%,rgba(2,6,23,.60) 32%,rgba(2,6,23,.22) 62%,rgba(2,6,23,.04) 100%)';

const OfferCard: React.FC<OfferCardProps> = memo(({ offer, index = 0 }) => {
  // 3-state image machine: primary (Unsplash) → fallback (Picsum) → gradient
  const [imgState, setImgState] = useState<'primary' | 'fallback' | 'gradient'>('primary');
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Shared observer — one IntersectionObserver for ALL cards on the page
  useEffect(() => {
    if (!cardRef.current) return;
    return observeReveal(cardRef.current, () => setIsVisible(true));
  }, []);

  // Stagger: 0-480ms based on position in the grid row (capped at 6)
  const delay = `${(index % 6) * 80}ms`;

  const imageUrl =
    imgState === 'primary'   ? getEliteImage(offer.category, offer.id, 600) :
    imgState === 'fallback'  ? getFallbackImage(offer.id, 600, 750)         : null;

  const fallbackGradient = getCategoryFallbackStyle(offer.category);

  const handleImageError = () =>
    setImgState(p => p === 'primary' ? 'fallback' : 'gradient');

  // Reveal: opacity + translateY only — NO blur filter (blur is GPU-expensive at scale)
  const revealStyle: React.CSSProperties = {
    opacity:   isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(48px)',
    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay},
                 transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}`,
    // will-change only on opacity+transform (not filter) — fewer compositor layers
    willChange: 'opacity,transform',
  };

  return (
    <div ref={cardRef} style={revealStyle}>
      <Link to={`/offers/${offer.id}`} className="group block">
        <div className="space-y-10">

          {/* ── Card Frame ── */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-slate-900
            shadow-[0_2px_16px_rgba(0,0,0,0.10)]
            transition-[border-radius,box-shadow,transform]
            duration-700 ease-out
            group-hover:rounded-[4.5rem]
            group-hover:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.35)]
            group-hover:-translate-y-5">

            {/* Background image — scale handled on parent to avoid extra stacking context */}
            <div className="absolute inset-0 transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]">
              {imgState !== 'gradient' && imageUrl ? (
                <img
                  src={imageUrl}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.75) saturate(1.05)' }}
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full" style={{ background: fallbackGradient }} />
              )}
            </div>

            {/* Overlay stack — all pointer-events-none, no backdrop-filter here */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(2,6,23,0.18)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: VIGNETTE }} />

            {/* Category badge */}
            <div className="absolute top-8 left-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full
                transition-all duration-500 group-hover:bg-white group-hover:shadow-xl">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white
                  group-hover:text-slate-900 transition-colors duration-500">
                  {offer.category}
                </span>
              </div>
            </div>

            {/* Price tag */}
            <div className="absolute top-8 right-8">
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/40">
                ₹{offer.offerPrice}
              </div>
            </div>

            {/* Discount — hover reveal */}
            <div className="absolute bottom-10 left-10 flex flex-col items-start
              translate-y-4 opacity-0
              group-hover:translate-y-0 group-hover:opacity-100
              transition-all duration-500 delay-75">
              <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">
                Exclusive Deal
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-5xl font-black text-white tracking-tighter leading-none">
                  {offer.discountPercentage}%
                </span>
                <span className="text-xl font-black text-indigo-400">OFF</span>
              </div>
            </div>

            {/* View arrow — hover reveal */}
            <div className="absolute bottom-10 right-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl
                scale-75 opacity-0
                group-hover:scale-100 group-hover:opacity-100
                transition-all duration-500 ease-out">
                <ArrowUpRight size={28} className="text-slate-900" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="px-4 space-y-4">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight
                group-hover:text-indigo-600 transition-colors duration-400">
                {offer.title}
              </h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                Mumbai • Limited Slots
              </p>
            </div>
            <p className="text-slate-500 text-base leading-relaxed line-clamp-2">
              {offer.description}
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <div className="h-px flex-grow bg-slate-100 group-hover:bg-indigo-100 transition-colors duration-500" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                Discover More
              </span>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
});

OfferCard.displayName = 'OfferCard';
export default OfferCard;

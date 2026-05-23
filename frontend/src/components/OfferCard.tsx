import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Offer } from '../types';
import { getEliteImage, getFallbackImage, getCategoryFallbackStyle } from '../services/imageService';

interface OfferCardProps {
  offer: Offer;
  index?: number;
}

// Cinematic vignette — applied directly as inline style, always works
const CARD_VIGNETTE =
  'linear-gradient(to top, rgba(2,6,23,0.97) 0%, rgba(2,6,23,0.65) 35%, rgba(2,6,23,0.28) 65%, rgba(2,6,23,0.06) 100%)';

const OfferCard: React.FC<OfferCardProps> = ({ offer, index = 0 }) => {
  // ── Image state machine: primary → fallback → gradient ──
  const [imgState, setImgState] = useState<'primary' | 'fallback' | 'gradient'>('primary');

  // ── Scroll-reveal state ──
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const staggerDelay = `${(index % 6) * 80}ms`;

  const imageUrl =
    imgState === 'primary'
      ? getEliteImage(offer.category, offer.id, 800)
      : imgState === 'fallback'
      ? getFallbackImage(offer.id, 800, 1000)
      : null;

  const fallbackGradient = getCategoryFallbackStyle(offer.category);

  const handleImageError = () => {
    setImgState((prev) => (prev === 'primary' ? 'fallback' : 'gradient'));
  };

  // Scroll-reveal inline styles (100% reliable, no CSS class dependency)
  const revealStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.96)',
    filter: isVisible ? 'blur(0px)' : 'blur(6px)',
    transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${staggerDelay},
                 transform 0.85s cubic-bezier(0.16,1,0.3,1) ${staggerDelay},
                 filter 0.85s cubic-bezier(0.16,1,0.3,1) ${staggerDelay}`,
    willChange: 'opacity, transform, filter',
  };

  return (
    <div ref={cardRef} style={revealStyle}>
      <Link to={`/offers/${offer.id}`} className="group block">
        <div className="space-y-10">

          {/* ── Elite Card Frame ── */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-slate-900 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition-[border-radius,box-shadow,transform] duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rounded-[4.5rem] group-hover:shadow-[0_80px_120px_-20px_rgba(0,0,0,0.38)] group-hover:-translate-y-6">

            {/* Image / Gradient background */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="w-full h-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                style={{ transform: 'scale(1.04)' }}
              >
                {imgState !== 'gradient' && imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                    // Directly darken the image so even pure-white yoga photos look premium
                    style={{ filter: 'brightness(0.72) saturate(1.05)' }}
                    loading="lazy"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full" style={{ background: fallbackGradient }} />
                )}
              </div>
            </div>

            {/* ── Cinematic overlay (inline — guaranteed to render) ── */}
            {/* Layer 1: dark tint rescues any bright image */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'rgba(2,6,23,0.22)' }}
            />
            {/* Layer 2: vignette gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: CARD_VIGNETTE }}
            />
            {/* Layer 3: grid texture */}
            <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id={`cg-${offer.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.4" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill={`url(#cg-${offer.id})`} />
              </svg>
            </div>

            {/* ── Category Badge ── */}
            <div className="absolute top-10 left-10 transition-all duration-700 group-hover:top-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 rounded-full shadow-xl transition-all duration-500 group-hover:bg-white">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white group-hover:text-slate-900 transition-colors duration-500">
                  {offer.category}
                </span>
              </div>
            </div>

            {/* ── Price Tag ── */}
            <div className="absolute top-10 right-10 transition-all duration-700 group-hover:top-8">
              <div
                className="bg-indigo-600 text-white px-5 py-2 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-500/50"
                style={{ animation: 'glowPulse 2.5s ease-in-out infinite' }}
              >
                ₹{offer.offerPrice}
              </div>
            </div>

            {/* ── Discount (hover reveal) ── */}
            <div className="absolute bottom-12 left-12 flex flex-col items-start translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
              <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Exclusive Deal</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-6xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
                  {offer.discountPercentage}%
                </span>
                <span className="text-2xl font-black text-indigo-400 leading-none">OFF</span>
              </div>
            </div>

            {/* ── View CTA ── */}
            <div className="absolute bottom-10 right-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 ease-out">
                <ArrowUpRight size={32} className="text-slate-900" />
              </div>
            </div>

            {/* ── Shimmer sweep on hover ── */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms] pointer-events-none"
              style={{
                background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)',
              }}
            />
          </div>

          {/* ── Text content ── */}
          <div className="px-6 space-y-5">
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors duration-500">
                {offer.title}
              </h3>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Mumbai • Limited Slots</p>
            </div>
            <p className="text-slate-500 font-medium text-lg leading-snug line-clamp-2 max-w-[90%]">
              {offer.description}
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <div
                className="h-px bg-slate-100 group-hover:bg-indigo-100 transition-all duration-700"
                style={{
                  flexGrow: 1,
                  transformOrigin: 'left',
                  transform: 'scaleX(0.3)',
                  transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1), background-color 0.5s',
                }}
              />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Discover More</span>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
};

export default OfferCard;

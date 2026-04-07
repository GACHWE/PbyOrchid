import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, TrendingUp, Users, ShoppingBag, Star } from 'lucide-react';
import { SNEAKERS } from '../data/sneakers';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';

export default function Home() {
  const [countdown, setCountdown] = useState({ hours: 12, minutes: 45, seconds: 30 });
  const featuredSneaker = SNEAKERS[0];
  const trendingSneakers = SNEAKERS.filter(s => s.isTrending).slice(0, 4);
  const newDrops = SNEAKERS.filter(s => s.isNew).slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-accent/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary-accent/10 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-primary-accent/20 text-primary-accent px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-primary-accent/30">Limited Drop</span>
                <div className="flex items-center gap-2 text-tertiary-accent font-black text-xs uppercase tracking-widest">
                  <Zap size={14} /> Live Now
                </div>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 italic">
                STEP INTO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-accent via-secondary-accent to-orange-500">THE VIBE.</span>
              </h1>
              
              <p className="text-app-text-muted text-lg md:text-xl max-w-lg mb-10 font-bold leading-relaxed">
                The most exclusive kicks, the rarest drops, and the ultimate streetwear experience. Get plugged into the culture.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary flex items-center gap-2 px-8 py-4 text-lg">
                  SHOP THE DROP <ArrowRight size={20} />
                </Link>
                <Link to="/shop?isNew=true" className="btn-outline px-8 py-4 text-lg">
                  NEW ARRIVALS
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-black tracking-tighter">30+</p>
                  <p className="text-xs text-app-text-muted font-bold uppercase tracking-widest">Premium Brands</p>
                </div>
                <div className="w-px h-10 bg-app-border" />
                <div>
                  <p className="text-3xl font-black tracking-tighter">15K+</p>
                  <p className="text-xs text-app-text-muted font-bold uppercase tracking-widest">Happy Heads</p>
                </div>
                <div className="w-px h-10 bg-app-border" />
                <div>
                  <p className="text-3xl font-black tracking-tighter">24/7</p>
                  <p className="text-xs text-app-text-muted font-bold uppercase tracking-widest">Support</p>
                </div>
              </div>
            </div>

            <div className="relative" data-aos="zoom-in" data-aos-delay="200">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <img 
                  src={featuredSneaker.image} 
                  alt="Featured Sneaker" 
                  className="w-full max-w-2xl mx-auto drop-shadow-[0_35px_35px_rgba(var(--color-primary-accent-rgb),0.4)] rotate-[-15deg] hover:rotate-0 transition-transform duration-700 cursor-pointer"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              
              {/* Countdown Card */}
              <div className="absolute -bottom-10 -left-10 md:left-0 bg-app-card/80 backdrop-blur-xl border border-app-border p-6 rounded-3xl neon-glow z-20">
                <p className="text-xs font-black text-app-text-muted uppercase tracking-widest mb-4">Next Drop Ends In:</p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-black tracking-tighter text-primary-accent">{String(countdown.hours).padStart(2, '0')}</p>
                    <p className="text-[10px] font-bold text-app-text-muted uppercase">HRS</p>
                  </div>
                  <span className="text-2xl font-black text-app-border">:</span>
                  <div className="text-center">
                    <p className="text-3xl font-black tracking-tighter text-primary-accent">{String(countdown.minutes).padStart(2, '0')}</p>
                    <p className="text-[10px] font-bold text-app-text-muted uppercase">MIN</p>
                  </div>
                  <span className="text-2xl font-black text-app-border">:</span>
                  <div className="text-center">
                    <p className="text-3xl font-black tracking-tighter text-primary-accent">{String(countdown.seconds).padStart(2, '0')}</p>
                    <p className="text-[10px] font-bold text-app-text-muted uppercase">SEC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-24 bg-app-bg relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div data-aos="fade-up">
              <div className="flex items-center gap-2 text-secondary-accent font-black text-xs uppercase tracking-widest mb-2">
                <TrendingUp size={14} /> Trending Now
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic">THE HEAT IS ON.</h2>
            </div>
            <Link to="/shop?isTrending=true" className="text-primary-accent font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all duration-300" data-aos="fade-up">
              View All Trending <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingSneakers.map((sneaker, index) => (
              <ProductCard key={sneaker.id} product={sneaker} />
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Gender */}
      <section className="py-24 bg-app-card border-y border-app-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/shop?gender=Men" className="group relative h-[500px] rounded-3xl overflow-hidden" data-aos="fade-up">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-4xl font-black tracking-tighter italic mb-2 text-white">MEN</h3>
                <p className="text-primary-accent font-bold text-sm tracking-widest uppercase">Shop Collection</p>
              </div>
            </Link>
            
            <Link to="/shop?gender=Women" className="group relative h-[500px] rounded-3xl overflow-hidden" data-aos="fade-up" data-aos-delay="100">
              <img 
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-4xl font-black tracking-tighter italic mb-2 text-white">WOMEN</h3>
                <p className="text-secondary-accent font-bold text-sm tracking-widest uppercase">Shop Collection</p>
              </div>
            </Link>

            <Link to="/shop" className="group relative h-[500px] rounded-3xl overflow-hidden" data-aos="fade-up" data-aos-delay="200">
              <img 
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-4xl font-black tracking-tighter italic mb-2 text-white">UNISEX</h3>
                <p className="text-tertiary-accent font-bold text-sm tracking-widest uppercase">Shop Collection</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Just Dropped */}
      <section className="py-24 bg-app-bg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div data-aos="fade-up">
              <div className="flex items-center gap-2 text-tertiary-accent font-black text-xs uppercase tracking-widest mb-2">
                <Zap size={14} /> Fresh Picks
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic">JUST DROPPED.</h2>
            </div>
            <Link to="/shop?isNew=true" className="text-primary-accent font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all duration-300" data-aos="fade-up">
              View All New <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newDrops.map((sneaker, index) => (
              <ProductCard key={sneaker.id} product={sneaker} />
            ))}
          </div>
        </div>
      </section>

      {/* Community / Social Proof */}
      <section className="py-24 bg-app-card overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic mb-4" data-aos="fade-up">JOIN THE SQUAD.</h2>
          <p className="text-app-text-muted font-bold tracking-widest uppercase text-sm" data-aos="fade-up" data-aos-delay="100">Tag us @PLUGGEDBYORCHID to get featured</p>
        </div>

        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="w-64 h-64 rounded-2xl overflow-hidden flex-shrink-0 border border-app-border">
              <img 
                src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&w=400&q=80`} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

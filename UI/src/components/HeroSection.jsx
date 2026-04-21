import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import CountdownTimer from './CountdownTimer';

export default function HeroSection({ featuredProduct, countdownProps }) {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-20">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-accent/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary-accent/10 blur-[100px] rounded-full animate-float" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-tertiary-accent/10 blur-[80px] rounded-full animate-float-delayed" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div data-aos="fade-right">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-primary-accent/20 text-primary-accent px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-primary-accent/30 backdrop-blur-sm">
                Limited Drop
              </span>
              <div className="flex items-center gap-2 text-tertiary-accent font-black text-xs uppercase tracking-widest animate-pulse">
                <Zap size={14} className="fill-current" /> Live Now
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 italic">
              STEP INTO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-accent via-secondary-accent to-orange-500 animate-gradient">
                THE VIBE.
              </span>
            </h1>

            <p className="text-app-text-muted text-lg md:text-xl max-w-lg mb-10 font-bold leading-relaxed">
              The most exclusive kicks, the rarest drops, and the ultimate streetwear experience. Get plugged into the culture.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="group btn-primary flex items-center gap-2 px-8 py-4 text-lg relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  SHOP THE DROP <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary-accent to-secondary-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </Link>
              <Link
                to="/shop?isNew=true"
                className="btn-outline px-8 py-4 text-lg hover:bg-app-card/30 backdrop-blur-sm transition-all duration-300"
              >
                NEW ARRIVALS
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <StatItem value="30+" label="Premium Brands" />
              <div className="w-px h-10 bg-app-border" />
              <StatItem value="15K+" label="Happy Heads" />
              <div className="w-px h-10 bg-app-border" />
              <StatItem value="24/7" label="Support" />
            </div>
          </div>

          {/* Right Column - Product Image & Countdown */}
          <div className="relative max-w-md" data-aos="zoom-in" data-aos-delay="200">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              {featuredProduct && (
                <img
                  src={featuredProduct.resources?.[0]?.url || 'https://via.placeholder.com/600'}
                  alt={featuredProduct.name}
                  className="w-full max-w-2xl mx-auto drop-shadow-[0_35px_35px_rgba(var(--color-primary-accent-rgb),0.4)] rotate-[-15deg] hover:rotate-0 transition-transform duration-700 cursor-pointer"
                  referrerPolicy="no-referrer"
                />
              )}
            </motion.div>

            {/* Countdown Card - Now uses reusable component */}
            <div className="absolute -bottom-10 -left-10 md:left-0 bg-app-card/80 backdrop-blur-xl border border-app-border p-6 rounded-3xl neon-glow z-20 hover:scale-105 transition-transform duration-300">
              <p className="text-xs font-black text-app-text-muted uppercase tracking-widest mb-4">
                Next Drop Ends In:
              </p>
              <CountdownTimer {...countdownProps} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const StatItem = ({ value, label }) => (
  <div className="group cursor-default">
    <p className="text-3xl font-black tracking-tighter group-hover:text-primary-accent transition-colors duration-300">
      {value}
    </p>
    <p className="text-xs text-app-text-muted font-bold uppercase tracking-widest">{label}</p>
  </div>
);
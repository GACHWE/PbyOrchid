import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-app-card border-t border-app-border pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-accent rounded-lg flex items-center justify-center rotate-12 neon-glow">
                <span className="font-black text-xl text-white italic">P</span>
              </div>
              <span className="text-2xl font-black tracking-tighter italic">PLUGGED</span>
            </Link>
            <p className="text-app-text-muted text-sm leading-relaxed">
              The ultimate destination for sneakerheads. We bring you the rarest drops, the hottest trends, and the most exclusive kicks in the game.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-app-bg border border-app-border flex items-center justify-center hover:bg-primary-accent hover:border-primary-accent transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-app-bg border border-app-border flex items-center justify-center hover:bg-primary-accent hover:border-primary-accent transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-app-bg border border-app-border flex items-center justify-center hover:bg-primary-accent hover:border-primary-accent transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-app-bg border border-app-border flex items-center justify-center hover:bg-primary-accent hover:border-primary-accent transition-all duration-300">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black mb-6 uppercase tracking-tighter">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-app-text-muted text-sm font-bold">
              <li><Link to="/shop" className="hover:text-primary-accent transition-colors">All Sneakers</Link></li>
              <li><Link to="/shop?gender=Men" className="hover:text-primary-accent transition-colors">Men's Collection</Link></li>
              <li><Link to="/shop?gender=Women" className="hover:text-primary-accent transition-colors">Women's Collection</Link></li>
              <li><Link to="/shop?isNew=true" className="hover:text-primary-accent transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?isTrending=true" className="hover:text-primary-accent transition-colors">Trending Now</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-black mb-6 uppercase tracking-tighter">Support</h4>
            <ul className="flex flex-col gap-4 text-app-text-muted text-sm font-bold">
              <li><a href="#" className="hover:text-primary-accent transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-primary-accent transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary-accent transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-primary-accent transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-primary-accent transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-black mb-6 uppercase tracking-tighter">Get Plugged</h4>
            <p className="text-app-text-muted text-sm mb-6">Subscribe to get notified about the latest drops and exclusive offers.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-app-bg border border-app-border rounded-full py-3 px-6 text-sm focus:outline-none focus:border-primary-accent transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary-accent rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-app-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-app-text-muted font-bold">
          <p>© 2026 PLUGGED BY ORCHID. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-primary-accent transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-white transition-colors">COOKIE SETTINGS</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

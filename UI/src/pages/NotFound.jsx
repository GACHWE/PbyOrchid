import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <div className="relative inline-block mb-12" data-aos="zoom-in">
        <h1 className="text-[150px] md:text-[250px] font-black tracking-tighter leading-none italic text-white/5">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80" 
            alt="Lost Sneaker" 
            className="w-48 h-48 object-contain rotate-[-25deg] drop-shadow-[0_20px_20px_rgba(168,85,247,0.4)]"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      
      <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic mb-6 uppercase" data-aos="fade-up">Laced Up & Lost.</h2>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-12 max-w-md mx-auto" data-aos="fade-up" data-aos-delay="100">
        The sneaker you're looking for has been snatched up or never existed. Don't worry, we've got plenty more heat in the vault.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
        <Link to="/" className="btn-primary flex items-center gap-2 px-8">
          <ArrowLeft size={20} /> BACK TO HOME
        </Link>
        <Link to="/shop" className="btn-outline flex items-center gap-2 px-8">
          <Search size={20} /> BROWSE SHOP
        </Link>
      </div>
    </div>
  );
}

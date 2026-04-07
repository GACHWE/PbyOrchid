import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Grid, List as ListIcon, ChevronDown } from 'lucide-react';
import { SNEAKERS } from '../data/sneakers';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  // Filters
  const genderFilter = searchParams.get('gender') || 'All';
  const brandFilter = searchParams.get('brand') || 'All';
  const isNewFilter = searchParams.get('isNew') === 'true';
  const isTrendingFilter = searchParams.get('isTrending') === 'true';

  const brands = useMemo(() => ['All', ...new Set(SNEAKERS.map(s => s.brand))], []);

  const filteredProducts = useMemo(() => {
    return SNEAKERS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender = genderFilter === 'All' || product.gender === genderFilter || product.gender === 'Unisex';
      const matchesBrand = brandFilter === 'All' || product.brand === brandFilter;
      const matchesNew = !isNewFilter || product.isNew;
      const matchesTrending = !isTrendingFilter || product.isTrending;

      return matchesSearch && matchesGender && matchesBrand && matchesNew && matchesTrending;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.id - a.id; // newest
    });
  }, [searchQuery, genderFilter, brandFilter, isNewFilter, isTrendingFilter, sortBy]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div data-aos="fade-right">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-2">THE VAULT.</h1>
          <p className="text-app-text-muted font-bold uppercase tracking-widest text-xs">Showing {filteredProducts.length} Sneakers</p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4" data-aos="fade-left">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-app-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search sneakers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-card border border-app-border rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-primary-accent transition-all"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${isFilterOpen ? 'bg-primary-accent text-white' : 'bg-app-card border border-app-border hover:border-primary-accent'}`}
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="bg-app-card border border-app-border p-8 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Gender */}
              <div>
                <h4 className="text-xs font-black text-app-text-muted uppercase tracking-widest mb-4">Gender</h4>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Men', 'Women'].map(g => (
                    <button
                      key={g}
                      onClick={() => updateFilter('gender', g)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${genderFilter === g ? 'bg-primary-accent text-white' : 'bg-app-bg border border-app-border hover:border-primary-accent'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <h4 className="text-xs font-black text-app-text-muted uppercase tracking-widest mb-4">Brand</h4>
                <div className="flex flex-wrap gap-2">
                  {brands.map(b => (
                    <button
                      key={b}
                      onClick={() => updateFilter('brand', b)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${brandFilter === b ? 'bg-primary-accent text-white' : 'bg-app-bg border border-app-border hover:border-primary-accent'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-xs font-black text-app-text-muted uppercase tracking-widest mb-4">Status</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateFilter('isNew', isNewFilter ? null : 'true')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isNewFilter ? 'bg-tertiary-accent text-black' : 'bg-app-bg border border-app-border hover:border-tertiary-accent'}`}
                  >
                    New Drops
                  </button>
                  <button
                    onClick={() => updateFilter('isTrending', isTrendingFilter ? null : 'true')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isTrendingFilter ? 'bg-quaternary-accent text-white' : 'bg-app-bg border border-app-border hover:border-quaternary-accent'}`}
                  >
                    Trending
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-xs font-black text-app-text-muted uppercase tracking-widest mb-4">Sort By</h4>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-app-bg border border-app-border rounded-xl py-2 px-4 text-xs font-bold focus:outline-none focus:border-primary-accent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLayout('grid')}
            className={`p-2 rounded-lg transition-all ${layout === 'grid' ? 'bg-primary-accent text-white' : 'text-app-text-muted hover:text-app-text'}`}
          >
            <Grid size={20} />
          </button>
          <button 
            onClick={() => setLayout('list')}
            className={`p-2 rounded-lg transition-all ${layout === 'list' ? 'bg-primary-accent text-white' : 'text-app-text-muted hover:text-app-text'}`}
          >
            <ListIcon size={20} />
          </button>
        </div>
        
        {(genderFilter !== 'All' || brandFilter !== 'All' || isNewFilter || isTrendingFilter || searchQuery) && (
          <button 
            onClick={() => {
              setSearchParams({});
              setSearchQuery('');
            }}
            className="text-xs font-black text-secondary-accent uppercase tracking-widest flex items-center gap-1 hover:brightness-110"
          >
            <X size={14} /> Clear All
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className={layout === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-6"}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} layout={layout} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center" data-aos="fade-up">
          <div className="w-20 h-20 bg-app-card border border-app-border rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-app-text-muted" />
          </div>
          <h3 className="text-3xl font-black tracking-tighter mb-2 italic">NO KICKS FOUND.</h3>
          <p className="text-app-text-muted font-bold uppercase tracking-widest text-xs">Try adjusting your filters or search query.</p>
        </div>
      )}

      {/* Infinite Scroll Mock */}
      {filteredProducts.length > 0 && (
        <div className="mt-20 text-center">
          <button className="btn-outline px-12">LOAD MORE</button>
        </div>
      )}
    </div>
  );
}

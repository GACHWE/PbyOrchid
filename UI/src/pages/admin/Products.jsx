// import React, { useState } from 'react';
// import { 
//   Plus, 
//   Search, 
//   Edit2, 
//   Trash2, 
//   Filter, 
//   ChevronLeft, 
//   ChevronRight,
//   MoreVertical,
//   Image as ImageIcon
// } from 'lucide-react';
// import { useProductsStore } from '../../store/productsStore';
// import { motion, AnimatePresence } from 'motion/react';

// export default function Products() {
//   const { products, removeProduct } = useProductsStore();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   const filteredProducts = products.filter(p => 
//     p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//     p.brand.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between" data-aos="fade-down">
//         <div>
//           <h1 className="text-4xl font-black tracking-tighter italic uppercase">Products</h1>
//           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Manage your sneaker inventory</p>
//         </div>
//         <button 
//           onClick={() => setIsAddModalOpen(true)}
//           className="btn-primary flex items-center gap-2 py-3 px-6 text-xs"
//         >
//           <Plus size={18} /> ADD NEW PRODUCT
//         </button>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4" data-aos="fade-up">
//         <div className="relative w-full sm:w-96">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
//           <input 
//             type="text" 
//             placeholder="Search products..." 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full bg-dark-card border border-dark-border rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-neon-purple transition-all"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <button className="p-3 rounded-xl bg-dark-card border border-dark-border hover:border-neon-purple text-gray-400 hover:text-white transition-all">
//             <Filter size={18} />
//           </button>
//           <select className="bg-dark-card border border-dark-border rounded-xl py-3 px-6 text-xs font-bold focus:outline-none focus:border-neon-purple">
//             <option>All Brands</option>
//             <option>Nike</option>
//             <option>Jordan</option>
//             <option>Adidas</option>
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden" data-aos="fade-up">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-dark-bg border-b border-dark-border">
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Product</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Brand</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Price</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Stock</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Rating</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-dark-border">
//               {filteredProducts.map((product) => (
//                 <tr key={product.id} className="hover:bg-white/5 transition-colors group">
//                   <td className="p-6">
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-xl overflow-hidden bg-dark-bg border border-dark-border">
//                         <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
//                       </div>
//                       <div>
//                         <p className="font-black text-sm">{product.name}</p>
//                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.category}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-6">
//                     <span className="text-xs font-bold text-neon-purple uppercase tracking-widest">{product.brand}</span>
//                   </td>
//                   <td className="p-6">
//                     <span className="text-sm font-black text-neon-green">${product.price}</span>
//                   </td>
//                   <td className="p-6">
//                     <span className="text-sm font-bold">42 Units</span>
//                   </td>
//                   <td className="p-6">
//                     <div className="flex items-center gap-1 text-neon-orange">
//                       <span className="text-sm font-black">{product.rating}</span>
//                     </div>
//                   </td>
//                   <td className="p-6">
//                     <div className="flex items-center gap-2">
//                       <button className="p-2 rounded-lg hover:bg-neon-purple/10 hover:text-neon-purple transition-all">
//                         <Edit2 size={16} />
//                       </button>
//                       <button 
//                         onClick={() => removeProduct(product.id)}
//                         className="p-2 rounded-lg hover:bg-neon-pink/10 hover:text-neon-pink transition-all"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                       <button className="p-2 rounded-lg hover:bg-white/10 transition-all">
//                         <MoreVertical size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="p-6 border-t border-dark-border flex items-center justify-between">
//           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Showing 1 to 10 of {filteredProducts.length} entries</p>
//           <div className="flex items-center gap-2">
//             <button className="p-2 rounded-lg border border-dark-border text-gray-500 hover:text-white transition-all"><ChevronLeft size={18} /></button>
//             <button className="w-8 h-8 rounded-lg bg-neon-purple text-white font-black text-xs">1</button>
//             <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-gray-500 font-black text-xs">2</button>
//             <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-gray-500 font-black text-xs">3</button>
//             <button className="p-2 rounded-lg border border-dark-border text-gray-500 hover:text-white transition-all"><ChevronRight size={18} /></button>
//           </div>
//         </div>
//       </div>

//       {/* Add Modal Mock */}
//       <AnimatePresence>
//         {isAddModalOpen && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsAddModalOpen(false)}
//               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
//             />
//             <motion.div 
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="relative w-full max-w-2xl bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl"
//             >
//               <div className="flex items-center justify-between mb-8">
//                 <h3 className="text-3xl font-black tracking-tighter italic uppercase">Add New Sneaker</h3>
//                 <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-white"><Plus size={24} className="rotate-45" /></button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Product Name</label>
//                   <input type="text" placeholder="e.g. Air Jordan 1" className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Brand</label>
//                   <select className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none">
//                     <option>Nike</option>
//                     <option>Jordan</option>
//                     <option>Adidas</option>
//                     <option>New Balance</option>
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Price (USD)</label>
//                   <input type="number" placeholder="180" className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Category</label>
//                   <select className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none">
//                     <option>Lifestyle</option>
//                     <option>Basketball</option>
//                     <option>Running</option>
//                     <option>Skate</option>
//                   </select>
//                 </div>
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Product Image</label>
//                   <div className="border-2 border-dashed border-dark-border rounded-2xl p-8 text-center hover:border-neon-purple transition-colors cursor-pointer group">
//                     <ImageIcon size={32} className="text-gray-500 group-hover:text-neon-purple mx-auto mb-2 transition-colors" />
//                     <p className="text-xs font-bold text-gray-500">Click to upload or drag and drop</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 rounded-xl border border-dark-border font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all">CANCEL</button>
//                 <button onClick={() => setIsAddModalOpen(false)} className="flex-1 btn-primary py-4 text-xs">SAVE PRODUCT</button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  getAllProducts, createProduct, updateProduct, deleteProduct, featureProduct, unfeatureProduct, toggleNewArrival} from '../../api/products';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = add mode
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    categoryId: '',
    description: '',
    images: [],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        sort: 'createdAt,desc',
        search: searchQuery || undefined,
        // brand filter if needed
      };
      if (selectedBrand !== 'All Brands') params.brand = selectedBrand;
      const data = await getAllProducts(params);
      setProducts(data.content || []);
      setPagination({
        page: data.number,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, pagination.size, searchQuery, selectedBrand]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        await fetchProducts(); // refresh
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleFeature = async (id, isFeatured) => {
    try {
      if (isFeatured) {
        await featureProduct(id, { featured: true });
      } else {
        await unfeatureProduct(id);
      }
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewArrival = async (id, isNewArrival) => {
    try {
      await toggleNewArrival(id, isNewArrival);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      categoryId: product.categoryId,
      description: product.description,
      images: product.images || [],
    });
    setImageFiles([]);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // For simplicity, we assume image upload is handled separately (we can later add file upload)
      // In a real scenario, you'd upload images first and get URLs, then pass to product API.
      const productData = { ...formData };
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      await fetchProducts();
      setIsAddModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', brand: '', price: '', categoryId: '', description: '', images: [] });
      setImageFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between" data-aos="fade-down">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">Products</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Manage your sneaker inventory</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setFormData({ name: '', brand: '', price: '', categoryId: '', description: '', images: [] }); setIsAddModalOpen(true); }}
          className="btn-primary flex items-center gap-2 py-3 px-6 text-xs"
        >
          <Plus size={18} /> ADD NEW PRODUCT
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4" data-aos="fade-up">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-neon-purple transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 rounded-xl bg-dark-card border border-dark-border hover:border-neon-purple text-gray-400 hover:text-white transition-all">
            <Filter size={18} />
          </button>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-dark-card border border-dark-border rounded-xl py-3 px-6 text-xs font-bold focus:outline-none focus:border-neon-purple"
          >
            <option>All Brands</option>
            <option>Nike</option>
            <option>Jordan</option>
            <option>Adidas</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden" data-aos="fade-up">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="p-12 text-center text-neon-pink">Error: {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-bg border-b border-dark-border">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Product</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Brand</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Price</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Stock</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Rating</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-dark-bg border border-dark-border">
                          <img src={product.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover" alt={product.name} />
                        </div>
                        <div>
                          <p className="font-black text-sm">{product.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.categoryName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-xs font-bold text-neon-purple uppercase tracking-widest">{product.brand}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-black text-neon-green">${product.price}</span>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-bold">{product.stock} Units</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1 text-neon-orange">
                        <span className="text-sm font-black">{product.rating || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFeature(product.id, !product.featured)}
                          className={`p-2 rounded-lg ${product.featured ? 'bg-neon-green/10 text-neon-green' : 'hover:bg-neon-purple/10 hover:text-neon-purple'} transition-all`}
                          title={product.featured ? 'Unfeature' : 'Feature'}
                        >
                          <Star size={16} />
                        </button>
                        <button
                          onClick={() => handleNewArrival(product.id, !product.newArrival)}
                          className={`p-2 rounded-lg ${product.newArrival ? 'bg-neon-orange/10 text-neon-orange' : 'hover:bg-neon-purple/10 hover:text-neon-purple'} transition-all`}
                          title={product.newArrival ? 'Remove from new arrivals' : 'Mark as new arrival'}
                        >
                          <Sparkles size={16} />
                        </button>
                        <button onClick={() => openEditModal(product)} className="p-2 rounded-lg hover:bg-neon-purple/10 hover:text-neon-purple transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-neon-pink/10 hover:text-neon-pink transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-6 border-t border-dark-border flex items-center justify-between">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Showing {products.length} of {pagination.totalElements} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 0}
              className="p-2 rounded-lg border border-dark-border text-gray-500 hover:text-white transition-all disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>
            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => (
              <button
                key={i}
                onClick={() => setPagination(prev => ({ ...prev, page: i }))}
                className={`w-8 h-8 rounded-lg font-black text-xs ${pagination.page === i ? 'bg-neon-purple text-white' : 'hover:bg-white/5 text-gray-500'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page + 1 >= pagination.totalPages}
              className="p-2 rounded-lg border border-dark-border text-gray-500 hover:text-white transition-all disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black tracking-tighter italic uppercase">
                  {editingProduct ? 'Edit Product' : 'Add New Sneaker'}
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-white">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Air Jordan 1"
                      className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Brand</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none"
                      required
                    >
                      <option value="">Select brand</option>
                      <option>Nike</option>
                      <option>Jordan</option>
                      <option>Adidas</option>
                      <option>New Balance</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="180"
                      className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none"
                      required
                    >
                      <option value="">Select category</option>
                      {/* Populate categories from API */}
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Description</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product description..."
                      className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Product Images</label>
                    <div className="border-2 border-dashed border-dark-border rounded-2xl p-8 text-center hover:border-neon-purple transition-colors cursor-pointer group">
                      <ImageIcon size={32} className="text-gray-500 group-hover:text-neon-purple mx-auto mb-2 transition-colors" />
                      <p className="text-xs font-bold text-gray-500">Click to upload or drag and drop</p>
                      <input type="file" multiple className="hidden" onChange={(e) => setImageFiles(Array.from(e.target.files))} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 rounded-xl border border-dark-border font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                    CANCEL
                  </button>
                  <button type="submit" disabled={formLoading} className="flex-1 btn-primary py-4 text-xs flex items-center justify-center gap-2">
                    {formLoading && <Loader2 size={16} className="animate-spin" />}
                    {editingProduct ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Loader2, Trash2 } from 'lucide-react';
import { createProduct, updateProduct, uploadFile, uploadMultipleFiles, getAllCategories, deleteFileByUrl } from '../../api/products';

const ProductForm = ({ isOpen, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    categoryId: '',
    description: '',
    images: [],
    featured: false,
    newArrival: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [deletingImageIndex, setDeletingImageIndex] = useState(null);
  const fileInputRef = useRef(null);

  const isEdit = !!product;

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
          const data = await getAllCategories();
          setCategories(data || []);
        } catch (err) {
          console.error('Failed to load categories:', err);
        } finally {
          setLoadingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
        description: product.description || '',
        images: product.images || [],
        featured: product.featured || false,
        newArrival: product.newArrival || false,
      });
      setImageFiles([]);
    } else {
      setFormData({
        name: '',
        brand: '',
        price: '',
        categoryId: '',
        description: '',
        images: [],
        featured: false,
        newArrival: false,
      });
      setImageFiles([]);
    }
  }, [product, isEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImageFile = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (index, imageUrl) => {
    // Ask user if they want to delete the file from server
    const deleteFromServer = window.confirm(
      'Remove this image from product. Do you also want to delete the image file from the server? (OK = Yes, Cancel = No)'
    );

    if (deleteFromServer) {
      setDeletingImageIndex(index);
      try {
        await deleteFileByUrl(imageUrl);
        // If successful, remove from state
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
        }));
      } catch (err) {
        setError(`Failed to delete image from server: ${err.message}`);
        // Still remove from product? Probably yes, but we'll keep it to avoid data inconsistency.
        // Optionally, we could keep it and not remove.
        // For now, we'll still remove from product, but show error.
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
        }));
      } finally {
        setDeletingImageIndex(null);
      }
    } else {
      // Just remove from product data
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    try {
      if (imageFiles.length === 1) {
        const fd = new FormData();
        fd.append('file', imageFiles[0]);
        const result = await uploadFile(fd);
        return [result.url];
      } else {
        const fd = new FormData();
        imageFiles.forEach(file => fd.append('files', file));
        const result = await uploadMultipleFiles(fd);
        const urls = Object.values(result.results).filter(v => !v.startsWith('ERROR'));
        if (urls.length !== imageFiles.length) {
          throw new Error(`Only ${urls.length} of ${imageFiles.length} images uploaded successfully.`);
        }
        return urls;
      }
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let uploadedUrls = [];
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        uploadedUrls = await uploadImages();
        setUploadingImages(false);
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        images: [...formData.images, ...uploadedUrls],
      };

      if (isEdit) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setUploadingImages(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-3xl bg-dark-card border border-dark-border rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-dark-border">
            <h3 className="text-2xl font-black tracking-tighter italic uppercase">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="bg-neon-pink/10 border border-neon-pink/20 text-neon-pink p-4 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Air Jordan 1 Retro High"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                  Brand *
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none"
                  required
                >
                  <option value="">Select brand</option>
                  <option>Nike</option>
                  <option>Jordan</option>
                  <option>Adidas</option>
                  <option>New Balance</option>
                  <option>Puma</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="180.00"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none"
                  required
                  disabled={loadingCategories}
                >
                  <option value="">{loadingCategories ? 'Loading...' : 'Select category'}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 focus:border-neon-purple outline-none"
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-neon-purple"
                />
                <span className="text-xs font-bold uppercase tracking-widest">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={formData.newArrival}
                  onChange={handleChange}
                  className="w-4 h-4 accent-neon-purple"
                />
                <span className="text-xs font-bold uppercase tracking-widest">New Arrival</span>
              </label>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">
                Product Images
              </label>

              {/* Existing Images Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt={`Product ${idx}`} className="w-full h-24 object-cover rounded-lg border border-dark-border" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx, url)}
                        disabled={deletingImageIndex === idx}
                        className="absolute top-1 right-1 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neon-pink disabled:opacity-50"
                      >
                        {deletingImageIndex === idx ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New Images Preview */}
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${idx}`}
                        className="w-full h-24 object-cover rounded-lg border border-dark-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageFile(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neon-pink"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-dark-border rounded-2xl p-6 text-center hover:border-neon-purple transition-colors cursor-pointer group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2"
                >
                  <Upload size={32} className="text-gray-500 group-hover:text-neon-purple transition-colors" />
                  <p className="text-xs font-bold text-gray-500">Click to upload images</p>
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-xl border border-dark-border font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="flex-1 btn-primary py-4 text-xs flex items-center justify-center gap-2"
              >
                {(loading || uploadingImages) && <Loader2 size={16} className="animate-spin" />}
                {isEdit ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductForm;
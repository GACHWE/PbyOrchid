import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Loader2, Trash2, Plus } from "lucide-react";
import { createProduct, updateProduct } from "../../api/products";
import { getAllCategories } from "../../api/categories";
import { deleteFileByUrl, uploadFile } from "../../api/files";

const ProductForm = ({ isOpen, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "", slug: "", brand: "", price: "", originalPrice: "",
    description: "", gender: "", category: null, categoryType: null, newArrival: false,
  });
  const [variants, setVariants] = useState([{ color: "", size: "", stockQuantity: 0 }]);
  const [existingResources, setExistingResources] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deletingIndex, setDeletingIndex] = useState(null);
  const fileInputRef = useRef(null);
  const isEdit = !!product;

  // Fetch categories
  useEffect(() => {
    if (isOpen) getAllCategories().then(setCategories).catch(() => setError("Failed to load categories"));
  }, [isOpen]);

  // Populate form
  useEffect(() => {
    if (isOpen) {
      if (isEdit && product) {
        setFormData({
          name: product.name || "", slug: product.slug || "", brand: product.brand || "",
          price: product.price?.toString() || "", originalPrice: product.originalPrice?.toString() || "",
          description: product.description || "", gender: product.gender || "",
          category: product.category || null, categoryType: product.categoryType || null,
          newArrival: product.newArrival || false,
        });
        setExistingResources(product.resources || []);
        setVariants(product.variants?.length ? product.variants : [{ color: "", size: "", stockQuantity: 0 }]);
      } else {
        setFormData({ name: "", slug: "", brand: "", price: "", originalPrice: "", description: "", gender: "", category: null, categoryType: null, newArrival: false });
        setExistingResources([]);
        setVariants([{ color: "", size: "", stockQuantity: 0 }]);
        setNewImageFiles([]);
      }
      setError("");
    }
  }, [isOpen, product, isEdit]);

  // Cleanup preview URLs
  useEffect(() => () => newImageFiles.forEach(f => f.previewUrl && URL.revokeObjectURL(f.previewUrl)), [newImageFiles]);

  const processFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
    if (valid.length !== Array.from(files).length) setError("Only images ≤10MB allowed.");
    valid.forEach(f => f.previewUrl = URL.createObjectURL(f));
    setNewImageFiles(prev => [...prev, ...valid]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImageFiles[index].previewUrl);
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingResource = async (index, url) => {
    if (!confirm("Delete this image?")) return;
    setDeletingIndex(index);
    try {
      await deleteFileByUrl(url);
      setExistingResources(prev => prev.filter((_, i) => i !== index));
    } catch { setError("Failed to delete image."); }
    setDeletingIndex(null);
  };

  const uploadImages = async () => {
    const results = [];
    for (const file of newImageFiles) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const { url } = await uploadFile(fd);
        results.push({ url, type: "image", isPrimary: false });
      } catch { setError(`Upload failed: ${file.name}`); }
    }
    return results;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.slug || !formData.brand || !formData.category?.id || !formData.price)
      return setError("Please fill all required fields.");
    if (variants.some(v => !v.color || !v.size))
      return setError("Each variant must have a color and size.");
    if (existingResources.length === 0 && newImageFiles.length === 0)
      return setError("At least one product image is required.");

    setLoading(true);
    setUploading(true);
    const uploaded = await uploadImages();
    setUploading(false);

    const allResources = [
      ...existingResources.map((res, idx) => ({ ...res, isPrimary: idx === 0 && uploaded.length === 0 })),
      ...uploaded.map((res, idx) => ({ ...res, isPrimary: existingResources.length === 0 && idx === 0 })),
    ];

    const payload = {
      name: formData.name, slug: formData.slug, brand: formData.brand,
      price: parseFloat(formData.price), originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      description: formData.description || null, gender: formData.gender || null,
      categoryId: formData.category.id, categoryTypeId: formData.categoryType?.id || null,
      variants: variants.map(v => ({ color: v.color, size: v.size, stockQuantity: parseInt(v.stockQuantity, 10) })),
      resources: allResources, newArrival: formData.newArrival,
    };

    try {
      isEdit ? await updateProduct(product.id, payload) : await createProduct(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/80 dark:bg-black/80 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEdit ? "Edit Product" : "New Product"}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400"><X size={22} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
            {error && <div className="p-3 text-sm font-medium text-red-700 bg-red-50 dark:bg-red-950/30 rounded-xl">{error}</div>}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Product Name *" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <Input label="Slug *" name="slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
              <Input label="Brand *" name="brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} required />
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                className="p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white">
                <option value="">Gender</option><option>MEN</option><option>WOMEN</option><option>UNISEX</option>
              </select>
              <Input label="Price (USD) *" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              <Input label="Original Price" type="number" step="0.01" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
            </div>

            {/* Category & Type */}
            <div className="grid grid-cols-2 gap-4">
              <select value={formData.category?.id || ""} onChange={e => {
                const cat = categories.find(c => c.id === e.target.value);
                setFormData({...formData, category: cat || null, categoryType: null});
              }} className="p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white" required>
                <option value="">Select Category *</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={formData.categoryType?.id || ""} onChange={e => {
                const type = formData.category?.categoryTypes?.find(t => t.id === e.target.value);
                setFormData({...formData, categoryType: type ? { id: type.id } : null});
              }} className="p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white" disabled={!formData.category}>
                <option value="">Category Type (optional)</option>
                {formData.category?.categoryTypes?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <textarea rows={3} placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white" />

            {/* Variants */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Variants</label>
                <button type="button" onClick={() => setVariants([...variants, { color: "", size: "", stockQuantity: 0 }])}
                  className="text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1"><Plus size={16}/> Add</button>
              </div>
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-end mb-3">
                  <div className="col-span-4"><input placeholder="Color *" value={v.color} onChange={e => setVariants(variants.map((item, idx) => idx === i ? {...item, color: e.target.value} : item))}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white" required /></div>
                  <div className="col-span-3"><select value={v.size} onChange={e => setVariants(variants.map((item, idx) => idx === i ? {...item, size: e.target.value} : item))}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"><option value="">Size *</option><option>38</option><option>40</option><option>42</option></select></div>
                  <div className="col-span-3"><input type="number" placeholder="Stock" value={v.stockQuantity} onChange={e => setVariants(variants.map((item, idx) => idx === i ? {...item, stockQuantity: e.target.value} : item))}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" /></div>
                  <div className="col-span-2 text-right">{variants.length > 1 && <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}><Trash2 size={18} className="text-red-500"/></button>}</div>
                </div>
              ))}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Product Images *</label>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {existingResources.map((res, idx) => (
                  <div key={res.id || idx} className="relative group">
                    <img src={res.url} className="w-full h-24 object-cover rounded-lg border dark:border-gray-700" />
                    <button type="button" onClick={() => removeExistingResource(idx, res.url)} className="absolute top-1 right-1 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100">
                      {deletingIndex === idx ? <Loader2 size={12} className="animate-spin"/> : <Trash2 size={12}/>}
                    </button>
                  </div>
                ))}
                {newImageFiles.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img src={file.previewUrl} className="w-full h-24 object-cover rounded-lg border" />
                    <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                    <span className="absolute bottom-0 left-0 right-0 text-[10px] bg-black/60 text-white truncate px-1 rounded-b-lg">{file.name}</span>
                  </div>
                ))}
              </div>
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer hover:border-purple-500 dark:border-gray-700">
                <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={e => processFiles(e.target.files)} className="hidden" />
                <Upload size={28} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">Click or drag images</span>
              </label>
            </div>

            {/* New Arrival */}
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.newArrival} onChange={e => setFormData({...formData, newArrival: e.target.checked})} className="accent-purple-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Mark as New Arrival</span>
            </label>

            {/* Actions */}
            <div className="flex gap-3 pt-2 bg-amber-500">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium">Cancel</button>
              <button type="submit" disabled={loading || uploading} className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium flex justify-center items-center gap-2 disabled:opacity-70">
                {(loading || uploading) && <Loader2 size={16} className="animate-spin"/>}
                {isEdit ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Reusable input component
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
    <input {...props} className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" />
  </div>
);

export default ProductForm;
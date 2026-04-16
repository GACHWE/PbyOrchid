import React, { useState, useEffect } from 'react';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/categories';

/**
 * Admin Categories Management Component
 * Allows admin to view, add, edit, and delete categories
 * Styled with Tailwind CSS
 * Includes required slug field
 */
const Categories = () => {
  // State for categories list
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories();
      // Handle different possible response structures
      const categoriesList = Array.isArray(data)
        ? data
        : data?.categories || data?.data || [];
      setCategories(categoriesList);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', slug: '' });
    setFormErrors({});
    setIsEditMode(false);
    setCurrentCategoryId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setFormData({
      name: category.name || '',
      description: category.description || '',
      slug: category.slug || '',
    });
    setIsEditMode(true);
    setCurrentCategoryId(category.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug.trim())) {
      errors.slug = 'Slug must be URL-friendly (lowercase letters, numbers, hyphens)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Optional: auto-generate slug from name when name changes and slug is empty or was auto-generated
  const handleNameChange = (e) => {
    const nameValue = e.target.value;
    setFormData((prev) => ({ ...prev, name: nameValue }));
    // Auto-generate slug only if slug is empty or user hasn't manually edited it
    // For simplicity, we only auto-generate in "add" mode when slug is empty
    if (!isEditMode && !formData.slug) {
      const autoSlug = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
    }
    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || '',
        slug: formData.slug.trim().toLowerCase(),
      };

      if (isEditMode && currentCategoryId) {
        // Update existing category
        await updateCategory(currentCategoryId, payload);
        setSuccessMessage('Category updated successfully!');
      } else {
        // Create new category
        await createCategory(payload);
        setSuccessMessage('Category created successfully!');
      }
      // Refresh categories list and close modal
      await fetchCategories();
      closeModal();
    } catch (err) {
      setError(err.message || 'Operation failed. Please try again.');
      console.error('Error saving category:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete category "${categoryName}"?`)) {
      return;
    }

    setError(null);
    try {
      await deleteCategory(categoryId);
      setSuccessMessage('Category deleted successfully!');
      await fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Manage Categories</h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add New Category
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-3 mb-5 text-sm">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-5 text-sm">
          {error}
        </div>
      )}

      {/* Categories Table */}
      {loading ? (
        <div className="text-center py-10 text-indigo-600 text-base">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          No categories found. Click "Add New Category" to create one.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">{category.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{category.name}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{category.slug}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {category.description || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="bg-amber-400 hover:bg-amber-500 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div
            className="bg-white rounded-2xl p-7 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-5">
              {isEditMode ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-5">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g., Electronics, Clothing, Books"
                  autoFocus
                />
                {formErrors.name && <div className="text-red-600 text-xs mt-1">{formErrors.name}</div>}
              </div>

              {/* Slug Field */}
              <div className="mb-5">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Slug *
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="e.g., electronics, clothing-books"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly identifier (lowercase, hyphens for spaces)
                </p>
                {formErrors.slug && <div className="text-red-600 text-xs mt-1">{formErrors.slug}</div>}
              </div>

              {/* Description Field */}
              <div className="mb-5">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-y"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the category..."
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors ${
                    submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                  }`}
                >
                  {submitting
                    ? isEditMode
                      ? 'Updating...'
                      : 'Creating...'
                    : isEditMode
                    ? 'Update Category'
                    : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
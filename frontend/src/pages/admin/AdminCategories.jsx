import { useState, useEffect } from 'react';
import { FiLayers, FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import SizeGuideBuilder from '@components/admin/SizeGuideBuilder';
import categoryService from '@services/category-service';
import uploadService from '@services/upload-service';

/**
 * AdminCategories Component - VSneakers Modern Style
 * Quản lý danh mục (CRUD)
 */
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentId: '',
    imageUrl: '',
    sizeGuide: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    document.title = 'Categories - VSneakers Admin';
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();

      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setNewCategory({ name: '', description: '', parentId: '', imageUrl: '', sizeGuide: '' });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setEditId(category.id);
    setNewCategory({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || '',
      imageUrl: category.imageUrl || '',
      sizeGuide: category.sizeGuide || ''
    });
    // If has existing image, show it
    if (category.imageUrl) {
      setImagePreview(category.imageUrl);
    } else {
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleCreateOrUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = newCategory.imageUrl;
      
      // Upload NEW image if selected
      if (imageFile) {
        toast.loading('Uploading image...');
        const uploadResponse = await uploadService.uploadFile(imageFile);
        
        if (uploadResponse.success && uploadResponse.data) {
          imageUrl = uploadResponse.data.url;
          toast.dismiss();
          toast.success('Image uploaded!');
        }
      }
      
      const data = {
        ...newCategory,
        parentId: newCategory.parentId || null,
        imageUrl: imageUrl || null,
        sizeGuide: newCategory.sizeGuide || null
      };
      
      if (isEditing) {
        await categoryService.updateCategory(editId, data);
        toast.success('Category updated successfully!');
      } else {
        await categoryService.createCategory(data);
        toast.success('Category created successfully!');
      }
      
      setShowModal(false);
      fetchCategories();
      resetForm();
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error(isEditing ? 'Failed to update category' : 'Failed to create category');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Failed to delete category');
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ─── Input class helper ─── */
  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark-950 placeholder-gray-400 text-sm focus:outline-none focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10 transition-all";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-dark-950">
              Categories
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Organize and manage your product catalog
            </p>
          </div>

          <button
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-dark-950 text-white rounded-xl text-sm font-semibold hover:bg-sneaker-orange transition-all shadow-sm hover:shadow-md"
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={18} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-dark-950 text-sm focus:outline-none focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10 transition-all"
            />
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <span className="w-4 h-4 border-2 border-gray-300 border-t-sneaker-orange rounded-full animate-spin" />
                        Loading categories...
                      </div>
                    </td>
                  </tr>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm text-dark-950">#{category.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-dark-950">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {category.description || <span className="text-gray-400 italic">No description</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 text-gray-400 hover:text-sneaker-orange hover:bg-orange-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiLayers size={24} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">No categories found</p>
                      <p className="text-sm text-gray-500">Create a category to organize your products.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Category Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-dark-950">
                    {isEditing ? 'Edit Category' : 'Add New Category'}
                  </h2>
                </div>
                <button 
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="p-2 text-gray-400 hover:bg-gray-100 hover:text-dark-950 rounded-full transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateOrUpdateCategory} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className={inputCls}
                    placeholder="e.g. Running Shoes"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Parent Category (Optional)</label>
                  <select
                    value={newCategory.parentId}
                    onChange={(e) => setNewCategory({...newCategory, parentId: e.target.value})}
                    className={inputCls}
                  >
                    <option value="">None (Root Category)</option>
                    {categories.filter(c => c.id !== editId).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                  <textarea
                    rows="3"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className={`${inputCls} resize-none`}
                    placeholder="Category description..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Size Guide Builder</label>
                  <SizeGuideBuilder
                    value={newCategory.sizeGuide}
                    onChange={(newVal) => setNewCategory({...newCategory, sizeGuide: newVal})}
                  />
                  <p className="text-xs text-gray-500 font-medium mt-2">Leave empty if this category does not require a size guide.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category Image (Optional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    {imagePreview ? (
                      <div className="space-y-3">
                        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            setNewCategory(prev => ({ ...prev, imageUrl: '' }));
                          }}
                          className="w-full px-4 py-2 bg-white border border-red-200 text-red-500 font-semibold text-sm rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 mb-3 group-hover:text-sneaker-orange group-hover:border-orange-200 transition-colors">
                          <FiImage size={20} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Click to upload image</span>
                        <span className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max 10MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-4 py-3 bg-dark-950 text-white rounded-xl font-semibold hover:bg-sneaker-orange transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Saving...
                      </>
                    ) : (
                      isEditing ? 'Update Category' : 'Create Category'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;

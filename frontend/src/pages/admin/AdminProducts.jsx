import { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import productService from '@services/product-service';
import categoryService from '@services/category-service';
import uploadService from '@services/upload-service';

/**
 * AdminProducts Component - VSneakers Modern Style
 * Quản lý sản phẩm (CRUD) với Variants (Size/Color) và Multiple Images
 */
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
    additionalImages: [], 
    isActive: true,
    isSale: false,
    saleDiscountPercentage: '',
    variants: [
      { size: 'M', color: 'BLACK', stock: 10, priceAdjustment: 0 }
    ]
  });
  
  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null);
  
  const [additionalFiles, setAdditionalFiles] = useState([]); 
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  
  const [uploading, setUploading] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    document.title = 'Products - VSneakers Admin';
    fetchProducts();
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProductsAdmin({
        page: currentPage,
        size: pageSize,
        search: searchQuery,
      });

      if (response.success && response.data) {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Main Image Handler
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

  // Additional Images Handler
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + additionalFiles.length > 5) {
      toast.error('Maximum 5 additional images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });

    setAdditionalFiles(prev => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index) => {
    const existingCount = newProduct.additionalImages.length;
    
    if (index < existingCount) {
        const updatedUrls = newProduct.additionalImages.filter((_, i) => i !== index);
        setNewProduct(prev => ({ ...prev, additionalImages: updatedUrls }));
    } else {
        const fileIndex = index - existingCount;
        setAdditionalFiles(prev => prev.filter((_, i) => i !== fileIndex));
        setAdditionalPreviews(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

  // Variant Handlers
  const handleAddVariant = () => {
    setNewProduct({
      ...newProduct,
      variants: [
        ...newProduct.variants,
        { size: '', color: '', stock: 0, priceAdjustment: 0 }
      ]
    });
  };

  const handleRemoveVariant = (index) => {
    if (newProduct.variants.length === 1) {
      toast.error('Must have at least one variant');
      return;
    }
    const updatedVariants = newProduct.variants.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, variants: updatedVariants });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...newProduct.variants];
    updatedVariants[index][field] = value;
    setNewProduct({ ...newProduct, variants: updatedVariants });
  };

  const calculateTotalStock = () => {
    return newProduct.variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
  };

  const resetForm = () => {
    setNewProduct({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        imageUrl: '',
        additionalImages: [],
        isActive: true,
        isSale: false,
        saleDiscountPercentage: '',
        variants: [{ size: 'M', color: 'BLACK', stock: 10, priceAdjustment: 0 }]
      });
      setImageFile(null);
      setImagePreview(null);
      setAdditionalFiles([]);
      setAdditionalPreviews([]);
      setIsEditing(false);
      setEditId(null);
  };

  const handleEdit = async (product) => {
    try {
        setLoading(true);
        const response = await productService.getProductById(product.id);
        if (response.success) {
            const data = response.data;
            setIsEditing(true);
            setEditId(data.id);
            setNewProduct({
                name: data.name,
                description: data.description || '',
                price: data.price,
                categoryId: data.categoryId || (data.category ? data.category.id : ''),
                imageUrl: data.imageUrl || '',
                additionalImages: data.additionalImages || [],
                isActive: data.isActive,
                isSale: data.isSale || false,
                saleDiscountPercentage: data.saleDiscountPercentage || '',
                variants: data.variants && data.variants.length > 0 ? data.variants : [{ size: 'M', color: 'BLACK', stock: 10, priceAdjustment: 0 }]
            });
            setImagePreview(data.imageUrl);
            setAdditionalPreviews([]);
            setShowModal(true);
        }
    } catch (err) {
        toast.error('Failed to fetch product details');
    } finally {
        setLoading(false);
    }
  };

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      if (!newProduct.categoryId) {
        toast.error('Please select a category');
        return;
      }
      
      if (newProduct.variants.some(v => !v.size || v.stock === '' || v.stock === null || v.stock === undefined)) {
        toast.error('Please fill all variant fields (Size & Stock)');
        return;
      }

      setUploading(true);
      toast.loading('Uploading images...');

      let mainImageUrl = newProduct.imageUrl;
      let additionalImageUrls = [...newProduct.additionalImages]; 

      const uploadPromises = [];
      let mainImageIndex = -1;
      
      if (imageFile) {
        mainImageIndex = uploadPromises.length;
        uploadPromises.push(uploadService.uploadFile(imageFile));
      }
      
      const additionalStartIdx = uploadPromises.length;
      for (const file of additionalFiles) {
        uploadPromises.push(uploadService.uploadFile(file));
      }
      
      if (uploadPromises.length > 0) {
        try {
          const uploadResults = await Promise.all(uploadPromises);
          
          if (mainImageIndex !== -1) {
            const mainRes = uploadResults[mainImageIndex];
            if (mainRes.success && mainRes.data) {
              mainImageUrl = mainRes.data.url;
            }
          }
          
          for (let i = 0; i < additionalFiles.length; i++) {
            const addRes = uploadResults[additionalStartIdx + i];
            if (addRes.success && addRes.data) {
              additionalImageUrls.push(addRes.data.url);
            }
          }
        } catch (error) {
          console.error("Image upload failed:", error);
          toast.dismiss();
          toast.error("Failed to upload images");
          setUploading(false);
          return;
        }
      }
      
      toast.dismiss();

      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        categoryId: parseInt(newProduct.categoryId),
        imageUrl: mainImageUrl || null,
        additionalImages: additionalImageUrls,
        isActive: newProduct.isActive,
        isSale: newProduct.isSale,
        saleDiscountPercentage: newProduct.isSale ? parseInt(newProduct.saleDiscountPercentage) : null,
        variants: newProduct.variants.map(v => ({
          size: v.size,
          color: v.color ? v.color : 'DEFAULT',
          stock: parseInt(v.stock),
          priceAdjustment: parseFloat(v.priceAdjustment || 0)
        }))
      };
      
      if (isEditing) {
          await productService.updateProduct(editId, productData);
          toast.success('Product updated successfully!');
      } else {
          await productService.createProduct(productData);
          toast.success('Product created successfully!');
      }

      setShowModal(false);
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error('Error saving product:', err);
      let errorMsg = 'Failed to save product';
      
      if (err.response?.data) {
          if (err.response.data.message) {
              errorMsg = err.response.data.message;
          }
          if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
              const firstError = err.response.data.errors[0];
              if (firstError.defaultMessage) {
                  errorMsg = firstError.defaultMessage;
              }
          }
      }
      
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  /* ─── Input class helper ─── */
  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark-950 placeholder-gray-400 text-sm focus:outline-none focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10 transition-all";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-dark-950">
              Products Management
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Manage your inventory, pricing, and product details
            </p>
          </div>

          <button
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-dark-950 text-white rounded-xl text-sm font-semibold hover:bg-sneaker-orange transition-all shadow-sm hover:shadow-md"
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={18} />
            <span>Add Product</span>
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
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-dark-950 text-sm focus:outline-none focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10 transition-all"
            />
          </div>
          <button
            onClick={() => { setCurrentPage(0); fetchProducts(); }}
            className="px-6 py-2.5 bg-dark-950 text-white rounded-xl text-sm font-semibold hover:bg-sneaker-orange transition-all"
          >
            Search
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <span className="w-4 h-4 border-2 border-gray-300 border-t-sneaker-orange rounded-full animate-spin" />
                        Loading products...
                      </div>
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm text-dark-950">#{product.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FiImage size={18} />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-sm text-dark-950 uppercase">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.categoryName || product.category || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-dark-950">
                          {formatPrice(product.price)}
                          {product.isSale && (
                            <div className="text-[10px] text-red-500 font-bold uppercase mt-0.5">
                              Sale {product.saleDiscountPercentage}% Off
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          px-2.5 py-1 text-xs font-bold rounded-md
                          ${product.stock > 10 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}
                        `}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${product.isActive ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-gray-400 hover:text-sneaker-orange hover:bg-orange-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
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
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiPackage size={24} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">No products found</p>
                      <p className="text-sm text-gray-500">Add some products to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
             <span className="text-sm text-gray-500">
                Showing page <span className="font-semibold text-dark-950">{currentPage + 1}</span> of <span className="font-semibold text-dark-950">{totalPages}</span>
              </span>
            <div className="flex space-x-1">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 text-gray-500 hover:text-dark-950 hover:bg-gray-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <FiChevronLeft size={20} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all
                    ${currentPage === i ? 'bg-sneaker-orange text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-dark-950'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2 text-gray-500 hover:text-dark-950 hover:bg-gray-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Create/Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-dark-950">
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isEditing ? 'Update the details of your product below.' : 'Fill in the information to add a new product.'}
                  </p>
                </div>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-dark-950 rounded-full transition-colors">
                  <FiX size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateOrUpdateProduct} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className={inputCls}
                      placeholder="e.g. VSneakers Air Max"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={newProduct.categoryId}
                      onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                      className={inputCls}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price (VND) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>

                {/* Variants Section */}
                <div className="p-5 border border-gray-200 rounded-xl bg-gray-50/50">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-bold text-dark-950">Product Variants <span className="text-red-500">*</span></label>
                    <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md">
                      Total Stock: {calculateTotalStock()}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {newProduct.variants.map((variant, index) => (
                      <div key={index} className="flex gap-3 items-end bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Size</label>
                          <input
                            type="text"
                            required
                            value={variant.size}
                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sneaker-orange focus:ring-1 focus:ring-sneaker-orange"
                            placeholder="S, M, 42..."
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sneaker-orange focus:ring-1 focus:ring-sneaker-orange"
                            placeholder="Black, Red..."
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sneaker-orange focus:ring-1 focus:ring-sneaker-orange"
                            placeholder="0"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="mt-3 flex items-center space-x-1.5 text-xs font-bold text-sneaker-orange hover:text-orange-600 px-3 py-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <FiPlus size={14} /> <span>Add Variant</span>
                  </button>
                </div>

                {/* Main Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Main Product Image</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    {imagePreview ? (
                      <div className="space-y-3">
                        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-white">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            setNewProduct(prev => ({ ...prev, imageUrl: '' }));
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
                        <span className="text-sm font-semibold text-gray-700">Click to upload main image</span>
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

                {/* Additional Images Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Additional Images (Max 5)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                        {/* Show Existing URLs */}
                        {newProduct.additionalImages.map((url, index) => (
                             <div key={`url-${index}`} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white aspect-square">
                              <img 
                                src={url} 
                                alt={`Existing ${index}`} 
                                className="w-full h-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => removeAdditionalImage(index)}
                                className="absolute top-1 right-1 p-1.5 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                        ))}

                        {/* Show New File Previews */}
                        {additionalPreviews.map((preview, index) => (
                            <div key={`preview-${index}`} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white aspect-square">
                              <img 
                                  src={preview} 
                                  alt={`Preview ${index}`} 
                                  className="w-full h-full object-contain"
                              />
                              <button
                                  type="button"
                                  onClick={() => removeAdditionalImage(newProduct.additionalImages.length + index)}
                                  className="absolute top-1 right-1 p-1.5 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                              >
                                  <FiX size={14} />
                              </button>
                            </div>
                        ))}
                      
                      {newProduct.additionalImages.length + additionalPreviews.length < 5 && (
                        <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 hover:border-sneaker-orange group transition-colors">
                          <FiPlus size={24} className="text-gray-400 group-hover:text-sneaker-orange mb-1" />
                          <span className="text-[10px] font-semibold text-gray-500 group-hover:text-sneaker-orange uppercase">Add More</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAdditionalImagesChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                  <textarea
                    rows="4"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className={`${inputCls} resize-none`}
                    placeholder="Write a compelling product description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={newProduct.isActive}
                        onChange={(e) => setNewProduct({...newProduct, isActive: e.target.checked})}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Active Status</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={newProduct.isSale}
                        onChange={(e) => setNewProduct({...newProduct, isSale: e.target.checked})}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </div>
                    <span className="text-sm font-semibold text-red-600">On Sale</span>
                  </label>
                </div>

                {newProduct.isSale && (
                  <div className="p-4 border border-red-200 bg-red-50 rounded-xl animate-fadeIn">
                    <label className="block text-xs font-semibold text-red-700 mb-1.5">Discount Percentage (%) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required={newProduct.isSale}
                      min="1"
                      max="100"
                      value={newProduct.saleDiscountPercentage}
                      onChange={(e) => setNewProduct({...newProduct, saleDiscountPercentage: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-red-200 text-red-700 font-bold focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 bg-white"
                      placeholder="e.g. 20"
                    />
                    <p className="text-xs text-red-600 mt-2 font-medium">
                      Price will be discounted by this percentage on the storefront.
                    </p>
                  </div>
                )}

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
                      isEditing ? 'Update Product' : 'Create Product'
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

export default AdminProducts;

import { useState, useEffect } from 'react';
import { FiTag, FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import couponService from '@services/coupon-service';

/**
 * AdminCoupons Component - VSneakers Modern Style
 * Quản lý mã giảm giá
 */
const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    document.title = 'Coupons - VSneakers Admin';
    fetchCoupons();
  }, [currentPage]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponService.getAllCoupons({
        page: currentPage,
        size: pageSize,
        search: searchQuery,
      });

      if (response.success && response.data) {
        setCoupons(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
      
      // Mock data
      setCoupons([
        { id: 1, code: 'WELCOME10', discountType: 'PERCENTAGE', discountValue: 10, status: 'ACTIVE', expiryDate: '2024-12-31' },
        { id: 2, code: 'SUMMER20', discountType: 'PERCENTAGE', discountValue: 20, status: 'EXPIRED', expiryDate: '2023-08-31' },
        { id: 3, code: 'FREESHIP', discountType: 'FIXED_AMOUNT', discountValue: 30000, status: 'ACTIVE', expiryDate: '2024-06-30' },
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCoupon = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await couponService.updateCoupon(editingId, newCoupon);
        toast.success('Coupon updated successfully!');
      } else {
        await couponService.createCoupon(newCoupon);
        toast.success('Coupon created successfully!');
      }
      setShowModal(false);
      fetchCoupons();
      resetForm();
    } catch (err) {
      console.error('Error saving coupon:', err);
      toast.error(editingId ? 'Failed to update coupon' : 'Failed to create coupon');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewCoupon({
      code: '',
      name: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '',
      maxDiscount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      isActive: true
    });
  };

  const handleEditClick = (coupon) => {
    setEditingId(coupon.id);
    setNewCoupon({
      code: coupon.code || '',
      name: coupon.name || '',
      description: coupon.description || '',
      discountType: coupon.discountType || 'PERCENTAGE',
      discountValue: coupon.discountValue || '',
      minOrderAmount: coupon.minOrderAmount || '',
      maxDiscount: coupon.maxDiscount || '',
      startDate: coupon.startDate ? String(coupon.startDate).slice(0, 16) : '',
      endDate: coupon.endDate ? String(coupon.endDate).slice(0, 16) : '',
      usageLimit: coupon.usageLimit || '',
      isActive: coupon.isActive !== undefined ? coupon.isActive : (coupon.status === 'ACTIVE')
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await couponService.deleteCoupon(id);
      toast.success('Coupon deleted successfully!');
      fetchCoupons();
    } catch (err) {
      console.error('Error deleting coupon:', err);
      toast.error('Failed to delete coupon');
    }
  };

  const formatValue = (type, value) => {
    if (type === 'PERCENTAGE') return `${value}%`;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
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
              Coupons Management
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Create and manage discount codes for customers
            </p>
          </div>

          <button
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-dark-950 text-white rounded-xl text-sm font-semibold hover:bg-sneaker-orange transition-all shadow-sm hover:shadow-md"
            onClick={() => { resetForm(); setShowModal(true); }}
          >
            <FiPlus size={18} />
            <span>Add Coupon</span>
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
              placeholder="Search coupons..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-dark-950 text-sm focus:outline-none focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10 transition-all"
            />
          </div>
          <button
            onClick={() => { setCurrentPage(0); fetchCoupons(); }}
            className="px-6 py-2.5 bg-dark-950 text-white rounded-xl text-sm font-semibold hover:bg-sneaker-orange transition-all"
          >
            Search
          </button>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <span className="w-4 h-4 border-2 border-gray-300 border-t-sneaker-orange rounded-full animate-spin" />
                        Loading coupons...
                      </div>
                    </td>
                  </tr>
                ) : coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-orange-50 border border-orange-100 text-sneaker-orange text-sm font-bold uppercase rounded-lg">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm text-gray-700 capitalize">
                          {coupon.discountType.replace('_', ' ').toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-sm text-dark-950">
                          {formatValue(coupon.discountType, coupon.discountValue)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-600">
                          {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : (coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No Expiry')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${(coupon.isActive || coupon.status === 'ACTIVE') ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {(coupon.isActive || coupon.status === 'ACTIVE') ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(coupon)}
                            className="p-2 text-gray-400 hover:text-sneaker-orange hover:bg-orange-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
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
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiTag size={24} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">No coupons found</p>
                      <p className="text-sm text-gray-500">Create your first discount code to boost sales.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing page <span className="font-semibold text-dark-950">{currentPage + 1}</span> of <span className="font-semibold text-dark-950">{totalPages}</span>
              </span>
              <div className="flex items-center gap-1">
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
                      ${currentPage === i 
                        ? 'bg-sneaker-orange text-white' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-dark-950'
                      }`}
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
        </div>

        {/* Create/Edit Coupon Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-dark-950">
                    {editingId ? 'Edit Coupon' : 'Add New Coupon'}
                  </h2>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 hover:text-dark-950 rounded-full transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmitCoupon} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Coupon Code <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                      className={`${inputCls} uppercase`}
                      placeholder="e.g. SUMMER24"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Coupon Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newCoupon.name}
                      onChange={(e) => setNewCoupon({...newCoupon, name: e.target.value})}
                      className={inputCls}
                      placeholder="e.g. Summer Sale 2024"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount Type</label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}
                      className={inputCls}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED_AMOUNT">Fixed Amount (VND)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Discount Value <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                      className={inputCls}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                    <input
                      type="datetime-local"
                      required
                      value={newCoupon.startDate}
                      onChange={(e) => setNewCoupon({...newCoupon, startDate: e.target.value})}
                      className={inputCls}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Date <span className="text-red-500">*</span></label>
                    <input
                      type="datetime-local"
                      required
                      value={newCoupon.endDate}
                      onChange={(e) => setNewCoupon({...newCoupon, endDate: e.target.value})}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Min Order Amount (VND)</label>
                    <input
                      type="number"
                      min="0"
                      value={newCoupon.minOrderAmount}
                      onChange={(e) => setNewCoupon({...newCoupon, minOrderAmount: e.target.value})}
                      className={inputCls}
                      placeholder="0 (No minimum)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Usage Limit</label>
                    <input
                      type="number"
                      min="1"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                      className={inputCls}
                      placeholder="Leave blank for unlimited"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                  <textarea
                    rows="3"
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                    className={`${inputCls} resize-none`}
                    placeholder="Brief description of the coupon..."
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={newCoupon.isActive}
                        onChange={(e) => setNewCoupon({...newCoupon, isActive: e.target.checked})}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Active Status</span>
                  </label>
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-dark-950 text-white rounded-xl font-semibold hover:bg-sneaker-orange transition-colors text-sm"
                  >
                    {editingId ? 'Update Coupon' : 'Create Coupon'}
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

export default AdminCoupons;

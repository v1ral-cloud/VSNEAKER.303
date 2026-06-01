import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiEye, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import orderService from '@services/order-service';

/**
 * AdminOrders Component - VSneakers Modern Style
 */
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    document.title = 'Orders - VSneakers Admin';
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders({
        page: currentPage,
        size: pageSize,
        search: searchQuery,
      });

      if (response.success && response.data) {
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      toast.success(`Order #${id} status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update status');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-dark-950">
              Orders Management
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Track, manage, and update customer orders
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or customer name..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-dark-950 text-sm focus:outline-none focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10 transition-all"
            />
          </div>
          <button
            onClick={() => { setCurrentPage(0); fetchOrders(); }}
            className="px-6 py-2.5 bg-dark-950 text-white rounded-xl text-sm font-semibold hover:bg-sneaker-orange transition-all"
          >
            Search
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <span className="w-4 h-4 border-2 border-gray-300 border-t-sneaker-orange rounded-full animate-spin" />
                        Loading orders...
                      </div>
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm text-dark-950">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-gray-900">{order.userName || 'Guest'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-sm text-dark-950">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className={`
                            px-3 py-1.5 text-xs font-bold uppercase rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none appearance-none pr-8 relative
                            ${order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 focus:ring-yellow-500' : 
                              order.status === 'CONFIRMED' ? 'bg-indigo-50 text-indigo-700 focus:ring-indigo-500' :
                              order.status === 'SHIPPING' ? 'bg-blue-50 text-blue-700 focus:ring-blue-500' :
                              order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 focus:ring-green-500' :
                              'bg-red-50 text-red-700 focus:ring-red-500'}
                          `}
                          style={{
                            backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.5rem center',
                            backgroundSize: '0.65em auto'
                          }}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="SHIPPING">Shipping</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="p-2 text-gray-400 hover:text-sneaker-orange hover:bg-orange-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiShoppingBag size={24} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">No orders found</p>
                      <p className="text-sm text-gray-500">We couldn't find any orders matching your criteria.</p>
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
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;

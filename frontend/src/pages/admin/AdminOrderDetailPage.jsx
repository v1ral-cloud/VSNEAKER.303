import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, FiClock, FiUser, FiSave } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import orderService from '@services/order-service';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    document.title = `Admin Order #${id} - VSneakers`;
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderByIdAdmin(id);
      if (response.success) {
        setOrder(response.data);
        setStatus(response.data.status);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      const response = await orderService.updateOrderStatus(id, status);
      if (response.success) {
        toast.success('Order status updated successfully');
        setOrder(response.data);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 focus:ring-yellow-500';
      case 'CONFIRMED': return 'bg-indigo-50 text-indigo-700 focus:ring-indigo-500';
      case 'SHIPPING': return 'bg-blue-50 text-blue-700 focus:ring-blue-500';
      case 'DELIVERED': return 'bg-green-50 text-green-700 focus:ring-green-500';
      case 'CANCELLED': return 'bg-red-50 text-red-700 focus:ring-red-500';
      default: return 'bg-gray-100 text-gray-700 focus:ring-gray-500';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-500 font-medium">
            <span className="w-5 h-5 border-2 border-gray-300 border-t-sneaker-orange rounded-full animate-spin"></span>
            Loading order details...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-lg mx-auto mt-10">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FiPackage size={24} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-dark-950 mb-2">Order Not Found</h1>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or has been removed.</p>
          <Link to="/admin/orders" className="px-6 py-2.5 bg-dark-950 text-white rounded-xl font-semibold hover:bg-sneaker-orange transition-all text-sm">
            Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link to="/admin/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-sneaker-orange transition-colors mb-4">
            <FiArrowLeft /> Back to Orders
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-display font-black tracking-tight text-dark-950">
                  Order #{order.id}
                </h1>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md ${
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus || 'PENDING'}
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`
                    w-full appearance-none pr-8 pl-4 py-2.5 text-sm font-bold uppercase rounded-xl border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:outline-none
                    ${getStatusStyle(status)}
                  `}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '0.65em auto'
                  }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPING">Shipping</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              
              <button
                onClick={handleStatusUpdate}
                disabled={updating || status === order.status}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-dark-950 text-white rounded-xl font-semibold hover:bg-sneaker-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
              >
                <FiSave size={16} /> {updating ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark-950 mb-5 flex items-center gap-2">
                <FiPackage className="text-sneaker-orange" /> Order Items
              </h2>
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <FiPackage size={24} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-dark-950 text-sm mb-1">{item.productName}</h3>
                        <p className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 inline-flex gap-2">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.color && item.size && <span className="text-gray-300">|</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-semibold text-gray-500">
                          {item.price?.toLocaleString('vi-VN')}đ <span className="text-gray-400 font-medium">x {item.quantity}</span>
                        </p>
                        <p className="font-bold text-dark-950">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline/Status Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark-950 mb-6 flex items-center gap-2">
                <FiClock className="text-sneaker-orange" /> Order History
              </h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                
                {/* Placed */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <FiClock size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-dark-950 text-sm">Order Placed</h3>
                      <time className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                        {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </time>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Last Updated (if different from placed) */}
                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <FiSave size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-dark-950 text-sm">Last Updated</h3>
                        <time className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                          {new Date(order.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </time>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Customer & Payment Info */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark-950 mb-5 flex items-center gap-2">
                <FiUser className="text-sneaker-orange" /> Customer Info
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-sneaker-orange flex items-center justify-center font-bold">
                    {order.receiverName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Name</p>
                    <p className="font-bold text-dark-950 text-sm">{order.receiverName}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                  <p className="font-bold text-dark-950 text-sm">{order.receiverPhone}</p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Account</p>
                  <p className="font-bold text-dark-950 text-sm">{order.userName || 'Guest'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark-950 mb-4 flex items-center gap-2">
                <FiMapPin className="text-sneaker-orange" /> Shipping Address
              </h2>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  {order.shippingAddress}
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {order.shippingDistrict}, {order.shippingCity}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-dark-950 mb-4 flex items-center gap-2">
                <FiCreditCard className="text-sneaker-orange" /> Payment
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-500">Method</span>
                  <span className="text-sm font-bold text-dark-950 uppercase bg-gray-50 px-2 py-1 rounded">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-500">Status</span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.paymentStatus || 'PENDING'}
                  </span>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500 uppercase">Total Amount</span>
                  <span className="text-xl font-black text-sneaker-orange">
                    {order.totalAmount?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetailPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiPackage,
  FiTag,
  FiLayers,
  FiTrendingUp,
  FiArrowRight,
  FiActivity
} from 'react-icons/fi';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import StatsCard from '@components/admin/StatsCard';
import dashboardService from '@services/dashboard-service';
import orderService from '@services/order-service';
import productService from '@services/product-service';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 bg-red-50 text-red-600 rounded-xl">
          <h2 className="font-bold mb-2">Something went wrong in AdminDashboard.</h2>
          <details className="whitespace-pre-wrap text-sm">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// Orange palette
const COLORS = ['#FF6B00', '#FFA94D', '#FFD8A8', '#FFE8CC', '#FFF4E6'];

/**
 * AdminDashboard Component - VSneakers Modern Style
 */
const AdminDashboardContent = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [timeRange, setTimeRange] = useState('7_days');
  const [loading, setLoading] = useState(true);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  useEffect(() => {
    document.title = 'Dashboard - VSneakers Admin';
    fetchAllData();
  }, [timeRange]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      if (timeRange === '7_days') startDate.setDate(endDate.getDate() - 6);
      else if (timeRange === '30_days') startDate.setDate(endDate.getDate() - 29);
      else if (timeRange === '90_days') startDate.setDate(endDate.getDate() - 89);
      else startDate.setFullYear(2020); // All time fallback

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Parallel Fetch
      const [overviewRes, salesRes, topProductsRes, ordersRes, lowStockRes, allOrdersRes] = await Promise.all([
        dashboardService.getDashboardOverview().catch(() => null),
        dashboardService.getSalesData('DAILY', startDateStr, endDateStr).catch(() => null),
        dashboardService.getTopProducts(5).catch(() => null),
        orderService.getAllOrders({ page: 0, size: 5 }).catch(() => null),
        productService.getAllProductsAdmin({ sort: 'stockQuantity,asc', size: 5 }).catch(() => null),
        orderService.getAllOrders({ page: 0, size: 100 }).catch(() => null)
      ]);

      // 1. Set Overview Stats
      if (overviewRes && overviewRes.success) {
        setStats(overviewRes.data);
      } else if (overviewRes && !overviewRes.success) {
         // Fallback if response structure is direct data (legacy check)
         setStats(overviewRes);
      }

      // 2. Set Sales Data
      if (salesRes && salesRes.data) {
        const formattedSales = salesRes.data.map(item => ({
          name: item.date.split('-').slice(1).reverse().join('/'), // 2024-12-10 -> 10/12
          revenue: item.revenue,
          orders: item.orderCount
        }));
        setSalesData(formattedSales);
      }

      // 3. Set Top Products
      if (topProductsRes && topProductsRes.data) {
        setTopProducts(topProductsRes.data.topProducts || []);
      }

      // 4. Set Recent Orders
      if (ordersRes && ordersRes.success && ordersRes.data) {
        setRecentOrders(ordersRes.data.content || (Array.isArray(ordersRes.data) ? ordersRes.data : []));
      }

      // 5. Set Low Stock Products
      if (lowStockRes && lowStockRes.success && lowStockRes.data) {
        setLowStockProducts(lowStockRes.data.content || (Array.isArray(lowStockRes.data) ? lowStockRes.data : []));
      }

      // 6. Set Order Status Distribution
      if (allOrdersRes && allOrdersRes.success && allOrdersRes.data) {
        const content = allOrdersRes.data.content || (Array.isArray(allOrdersRes.data) ? allOrdersRes.data : []);
        const statusCounts = {};
        content.forEach(o => {
          statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
        });
        const statusChartData = Object.keys(statusCounts).map(key => ({
          name: key,
          value: statusCounts[key]
        }));
        setOrderStatusData(statusChartData);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const quickActions = [
    { path: '/admin/products', icon: FiPackage, label: 'Add Product', color: 'bg-orange-50 text-sneaker-orange' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'View Orders', color: 'bg-blue-50 text-blue-600' },
    { path: '/admin/users', icon: FiUsers, label: 'Manage Users', color: 'bg-purple-50 text-purple-600' },
    { path: '/admin/coupons', icon: FiTag, label: 'Create Coupon', color: 'bg-green-50 text-green-600' },
  ];

  if (loading && !stats) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-80 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
              <div className="h-64 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="h-56 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
              <div className="h-80 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-dark-950">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10"
            >
              <option value="7_days">Last 7 Days</option>
              <option value="30_days">Last 30 Days</option>
              <option value="90_days">Last 90 Days</option>
              <option value="all_time">All Time</option>
            </select>
            <button onClick={fetchAllData} className="px-4 py-2 bg-dark-950 text-white rounded-xl text-sm font-semibold hover:bg-sneaker-orange transition-all">
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={FiDollarSign}
            label="Total Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            change={null} 
            changeLabel="vs last period"
          />
          <StatsCard
            icon={FiShoppingBag}
            label="Total Orders"
            value={stats?.totalOrders || 0}
            change={null}
            changeLabel="vs last period"
          />
          <StatsCard
            icon={FiUsers}
            label="Total Users"
            value={stats?.totalUsers || 0}
            change={stats?.newUsersThisMonth > 0 ? `+${stats.newUsersThisMonth}` : null}
            changeLabel="new this month"
          />
          <StatsCard
            icon={FiPackage}
            label="Total Products"
            value={stats?.totalProducts || 0}
            change={null}
            changeLabel="vs last period"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative ${loading ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-dark-950 flex items-center gap-2">
                  <FiTrendingUp className="text-sneaker-orange" /> Revenue Overview
                </h3>
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                  {timeRange.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000000}M`} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}}
                      itemStyle={{fontWeight: 'bold', color: '#FF6B00'}}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#FF6B00" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-dark-950 flex items-center gap-2">
                  <FiActivity className="text-sneaker-orange" /> Recent Orders
                </h3>
                <Link to="/admin/orders" className="text-sm font-semibold text-sneaker-orange hover:text-orange-600 flex items-center gap-1 transition-colors">
                  View All <FiArrowRight />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 font-semibold text-sm text-dark-950">#{order.orderNumber || order.id}</td>
                          <td className="py-3 text-sm text-gray-600">{order.receiverName || order.userName || 'Guest'}</td>
                          <td className="py-3 font-bold text-sm text-dark-950">{formatCurrency(order.totalAmount)}</td>
                          <td className="py-3">
                            <span className={`
                              px-2.5 py-1 text-[10px] font-bold uppercase rounded-md
                              ${order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' : 
                                order.status === 'DELIVERED' ? 'bg-green-50 text-green-700' : 
                                order.status === 'SHIPPING' ? 'bg-blue-50 text-blue-700' : 
                                order.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                                'bg-gray-100 text-gray-700'}
                            `}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <Link to={`/admin/orders/${order.id}`} className="text-gray-400 hover:text-sneaker-orange transition-colors inline-block p-1">
                              <FiArrowRight size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-gray-500 font-medium">No recent orders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Status Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-dark-950 mb-6 flex items-center gap-2">
                <FiPackage className="text-sneaker-orange" /> Order Status
              </h3>
              <div className="h-[250px] w-full flex items-center justify-center">
                {orderStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                        itemStyle={{fontWeight: 'bold', color: '#374151'}}
                      />
                      <Legend iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: '500', color: '#4b5563'}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-400 font-medium text-sm">No order data available</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions & Top Products */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-dark-950 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Link 
                      key={idx} 
                      to={action.path}
                      className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all hover:scale-[1.02] ${action.color}`}
                    >
                      <Icon size={20} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-dark-950 mb-5 flex items-center gap-2">
                <FiLayers className="text-sneaker-orange" /> Top Products
              </h3>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product, i) => (
                    <div key={product.productId} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center relative overflow-hidden">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 font-bold">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${product.productId}`} className="font-semibold text-sm text-dark-950 truncate block hover:text-sneaker-orange transition-colors">
                          {product.productName}
                        </Link>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-sneaker-orange rounded-full" 
                            style={{width: `${(product.totalSold / (topProducts[0]?.totalSold || 1)) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-500 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                        {product.totalSold} sold
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm">No sales data yet</div>
                )}
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-6 relative overflow-hidden">
              <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                <FiActivity /> Low Stock Alert
              </h3>
              <div className="space-y-3">
                {lowStockProducts?.length > 0 ? (
                  lowStockProducts.filter(p => (p.stockQuantity || p.stock || 0) <= 10).map((product) => (
                    <div key={product.id || product.productId} className="flex justify-between items-center bg-white p-3 rounded-xl border border-red-100/50">
                      <Link to={`/admin/products/edit/${product.id || product.productId}`} className="font-semibold text-sm text-gray-800 truncate hover:text-red-600 flex-1 mr-2">
                        {product.name || product.productName}
                      </Link>
                      <span className={`font-bold px-2 py-1 rounded-md text-[10px] uppercase tracking-wider ${
                        (product.stockQuantity || product.stock || 0) === 0 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.stockQuantity || product.stock || 0} left
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-red-400/80 font-medium text-sm">All stock levels look good.</div>
                )}
                {lowStockProducts?.filter(p => (p.stockQuantity || p.stock || 0) <= 10).length === 0 && lowStockProducts?.length > 0 && (
                  <div className="text-red-400/80 font-medium text-sm">All stock levels look good.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const AdminDashboard = () => {
  return (
    <ErrorBoundary>
      <AdminDashboardContent />
    </ErrorBoundary>
  );
};

export default AdminDashboard;

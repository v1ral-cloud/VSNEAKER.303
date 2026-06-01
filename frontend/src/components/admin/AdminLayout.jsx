import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiPackage, 
  FiShoppingBag, 
  FiUsers, 
  FiTag,
  FiImage,
  FiMenu,
  FiX,
  FiLogOut,
  FiLayers,
  FiLock
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import authService from '@services/auth-service';
import userService from '@services/user-service';
import useCartStore from '@store/use-cart-store';

/**
 * AdminLayout Component - VSneakers Modern Style
 */
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = authService.getCurrentUser();
  const clearCart = useCartStore((state) => state.clearCart);

  // Change Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: FiGrid,
      label: 'Dashboard',
    },
    {
      path: '/admin/products',
      icon: FiPackage,
      label: 'Products',
    },
    {
      path: '/admin/categories',
      icon: FiLayers,
      label: 'Categories',
    },
    {
      path: '/admin/orders',
      icon: FiShoppingBag,
      label: 'Orders',
    },
    {
      path: '/admin/users',
      icon: FiUsers,
      label: 'Users',
    },
    {
      path: '/admin/coupons',
      icon: FiTag,
      label: 'Coupons',
    },
    {
      path: '/admin/media',
      icon: FiImage,
      label: 'Hero Banner',
    },
  ];

  const handleLogout = () => {
    authService.logout();
    clearCart();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setIsChangingPassword(true);
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  /* ─── Input class helper ─── */
  const inputCls = `w-full px-4 py-2.5 rounded-xl border border-gray-200 transition-all duration-200 bg-white text-dark-950 placeholder-gray-400 text-sm focus:outline-none focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10`;

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex font-sans text-dark-950">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100
        transform transition-transform duration-300 ease-in-out flex flex-col shadow-sm
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <img src="/LOGOV.png" alt="VSneakers" className="h-7 object-contain" />
            <span className="px-2 py-0.5 bg-orange-100 text-sneaker-orange rounded-md text-[10px] font-bold uppercase tracking-wider">
              Admin
            </span>
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-dark-950" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 transition-all rounded-xl font-medium text-sm
                  ${active
                    ? 'bg-sneaker-orange text-white shadow-md shadow-sneaker-orange/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-dark-950'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-gray-100">
          <div className="px-4 py-3 bg-gray-50 rounded-xl mb-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sneaker-orange text-white flex items-center justify-center font-bold text-sm">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">Logged in as</p>
              <p className="text-sm font-bold text-dark-950 truncate">
                {user?.fullName || 'Administrator'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-dark-950 transition-all"
              title="Change Password"
            >
              <FiLock size={14} /> Password
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-all"
            >
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Bar (Mobile) */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-display font-black tracking-tight">
                V<span className="text-sneaker-orange">Sneakers</span>
              </h2>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -mr-2 text-gray-600 hover:text-dark-950"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-dark-950/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-dark-950">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={inputCls}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={inputCls}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={inputCls}
                  placeholder="Confirm new password"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-2.5 bg-dark-950 text-white font-semibold rounded-xl hover:bg-sneaker-orange transition-colors disabled:opacity-50 text-sm"
                >
                  {isChangingPassword ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;

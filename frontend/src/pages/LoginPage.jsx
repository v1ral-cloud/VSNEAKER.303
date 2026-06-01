import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import authService from '@services/auth-service';
import useCartStore from '@store/use-cart-store';

/**
 * LoginPage Component - VSneakers Modern Style
 * Soft borders, clean white card, orange accent
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const syncCart = useCartStore((state) => state.syncCart);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Sign In - VSneakers';
    if (authService.isAuthenticated()) navigate('/');
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      const response = await authService.login({ email: formData.email, password: formData.password });
      if (response.success && response.data) {
        authService.saveAuthData(response.data);
        await syncCart();
        toast.success('Welcome back! 👋', {
          style: { background: '#fff', color: '#0A0A0A', border: '1px solid #e5e5e5', borderLeft: '4px solid #FF6B00', fontWeight: '600' },
        });
        const userRole = response.data.user?.role;
        if (userRole === 'ADMIN') navigate('/admin/dashboard', { replace: true });
        else navigate(location.state?.from?.pathname || '/', { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
      if (err.errors) setErrors(err.errors);
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── Input class helper ─── */
  const inputCls = (field) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border transition-all duration-200 bg-white text-dark-950 placeholder-gray-400 text-sm font-medium focus:outline-none
     ${errors[field]
       ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
       : 'border-gray-200 focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10'
     }`;

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h2 className="text-2xl font-display font-black">
              V<span className="text-sneaker-orange">Sneakers</span>
            </h2>
          </Link>

          <h1 className="text-3xl font-display font-black text-dark-950 mb-1">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputCls('email')}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-sneaker-orange hover:text-sneaker-dark transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className={`${inputCls('password')} pr-11`}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-dark-950 text-white font-bold rounded-xl
                       hover:bg-sneaker-orange transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-sm tracking-wide mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-dark-950 hover:text-sneaker-orange transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-dark-950 transition-colors font-medium"
          >
            <FiArrowLeft size={15} />
            Back to VSneakers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

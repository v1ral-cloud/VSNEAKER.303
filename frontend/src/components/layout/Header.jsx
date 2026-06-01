import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiUser, 
  FiSearch,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import OrganizationSchema from '@components/seo/OrganizationSchema';
import useCartStore from '@store/use-cart-store';
import useWishlistStore from '@store/use-wishlist-store';
import authService from '@services/auth-service';
import productService from '@services/product-service';


/**
 * Header Component - VSneakers Premium Style
 * White navigation bar with orange accent
 */
const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  
  // Cart & Wishlist state
  const totalItems = useCartStore((state) => state.totalItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const wishlistItems = useWishlistStore((state) => state.items);

  // Scroll detection for shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    const handleAuthChange = () => {
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener('d4k-auth-change', handleAuthChange);
    return () => window.removeEventListener('d4k-auth-change', handleAuthChange);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    authService.logout();
    clearCart();
    useWishlistStore.getState().clearWishlist();
    setUser(null);
    setShowUserDropdown(false);
    navigate('/');
    toast.success('Logged out successfully!', {
      icon: '👋',
      style: {
        background: '#ffffff',
        color: '#0A0A0A',
        border: '2px solid #FF6B00',
        fontWeight: 'bold',
      },
    });
  };

  /* Suggestions Logic */
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        const fetchSuggestions = async () => {
          try {
            const response = await productService.searchProducts(searchQuery, { size: 5 });
            setSuggestions(response.data?.content || []);
            setShowSuggestions(true);
          } catch (error) {
            console.error('Error fetching suggestions:', error);
          }
        };
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSuggestionClick = (productId) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/product/${productId}`);
  };

  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;
    return (
      <div className="absolute top-full left-0 w-full bg-white border border-light-300 mt-1 shadow-card-hover z-[60] rounded-lg overflow-hidden">
        {suggestions.map((product) => (
          <div 
            key={product.id}
            onMouseDown={() => handleSuggestionClick(product.id)}
            className="flex items-center justify-between p-3 hover:bg-sneaker-light cursor-pointer border-b border-light-200 last:border-b-0 transition-colors"
          >
            <div className="flex items-center flex-1 min-w-0 mr-4">
              <img 
                src={product.imageUrl || 'https://placehold.co/48x48?text=No+Img'} 
                alt={product.name}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48?text=No+Img'; }}
                className="w-12 h-12 object-cover rounded mr-3 shrink-0 border border-light-300"
              />
              <p className="text-sm font-semibold text-dark-950 truncate">{product.name}</p>
            </div>
            <p className="text-sm text-sneaker-orange font-bold whitespace-nowrap flex-shrink-0">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Sneakers' },
    { to: '/categories', label: 'Collections' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema />
      
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'border-b border-light-200'}`}>
        <div className="container-street">
          {/* Main Header */}
          <div className="flex items-center justify-between py-3">
            
            {/* Logo */}
            <Link to="/" className="flex items-center group shrink-0">
              <img 
                src="/LOGOV.png" 
                alt="VSneakers" 
                className="h-9 md:h-11 object-contain group-hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ to, label }) => (
                <Link 
                  key={to}
                  to={to}
                  className="text-dark-950 hover:text-sneaker-orange transition-colors font-semibold text-sm relative group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sneaker-orange transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-sm mx-8 relative">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 1 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search sneakers..."
                  className="w-full px-4 py-2.5 pr-10 bg-light-200 rounded-lg border border-light-300
                           text-dark-950 placeholder-gray-400 focus:outline-none focus:border-sneaker-orange 
                           focus:bg-white transition-all text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sneaker-orange transition-colors"
                >
                  <FiSearch size={18} />
                </button>
              </form>
              {renderSuggestions()}
            </div>

            {/* Icons - Desktop */}
            <div className="hidden md:flex items-center space-x-5">
              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="relative group p-1"
                aria-label="Wishlist"
              >
                <FiHeart 
                  size={22} 
                  className="text-dark-700 group-hover:text-sneaker-orange transition-colors" 
                />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sneaker-orange text-white text-[10px] 
                                 w-4 h-4 flex items-center justify-center font-bold rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="relative group p-1"
                aria-label="Shopping Cart"
              >
                <FiShoppingCart 
                  size={22} 
                  className="text-dark-700 group-hover:text-sneaker-orange transition-colors" 
                />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-dark-950 text-white text-[10px] 
                                 w-4 h-4 flex items-center justify-center font-bold rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="group flex items-center space-x-2 p-1"
                  aria-label="User Menu"
                >
                  <div className="w-8 h-8 rounded-full bg-light-200 group-hover:bg-sneaker-light border border-light-300 group-hover:border-sneaker-orange/40 transition-all flex items-center justify-center">
                    <FiUser size={16} className="text-dark-700 group-hover:text-sneaker-orange transition-colors" />
                  </div>
                  {user && (
                    <span className="text-sm font-semibold text-dark-950 group-hover:text-sneaker-orange transition-colors hidden xl:block">
                      {user.fullName?.split(' ').slice(-1)[0] || 'Tài khoản'}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-light-200
                                shadow-card-hover z-50 animate-fadeIn rounded-xl overflow-hidden">
                    {user ? (
                      <div>
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-light-200 bg-sneaker-light">
                          <p className="text-sm font-bold text-dark-950 truncate">{user.fullName}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        {/* Menu Items */}
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3
                                   hover:bg-sneaker-light transition-colors text-sm font-medium text-dark-950"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <FiSettings size={16} className="text-sneaker-orange" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/profile/orders"
                          className="flex items-center space-x-3 px-4 py-3
                                   hover:bg-sneaker-light transition-colors text-sm font-medium text-dark-950"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <FiShoppingCart size={16} className="text-sneaker-orange" />
                          <span>My Orders</span>
                        </Link>
                        <div className="border-t border-light-200" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3
                                   hover:bg-red-50 transition-colors text-sm font-medium text-red-600 text-left"
                        >
                          <FiLogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        <Link
                          to="/login"
                          className="block px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold text-dark-950 text-center"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2.5 rounded-lg bg-sneaker-orange text-white hover:bg-orange-600 transition-colors text-sm font-semibold text-center shadow-sm"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Register
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Cart + Menu */}
            <div className="md:hidden flex items-center space-x-3">
              <Link to="/cart" className="relative p-1" aria-label="Cart">
                <FiShoppingCart size={22} className="text-dark-950" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sneaker-orange text-white text-[10px] 
                                 w-4 h-4 flex items-center justify-center font-bold rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleMenu}
                className="text-dark-950 hover:text-sneaker-orange transition-colors p-1"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-3 relative">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 1 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search sneakers..."
                className="w-full px-4 py-2.5 pr-10 bg-light-200 rounded-lg border border-light-300
                         text-dark-950 placeholder-gray-400 focus:outline-none focus:border-sneaker-orange 
                         focus:bg-white transition-all text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sneaker-orange transition-colors"
              >
                <FiSearch size={18} />
              </button>
            </form>
            {renderSuggestions()}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-light-200 shadow-lg">
            <nav className="container-street py-4 space-y-1">
              {navLinks.map(({ to, label }) => (
                <Link 
                  key={to}
                  to={to} 
                  onClick={toggleMenu}
                  className="block text-dark-950 hover:text-sneaker-orange hover:bg-sneaker-light transition-colors font-semibold py-3 px-4 rounded-lg"
                >
                  {label}
                </Link>
              ))}
              
              <div className="border-t border-light-200 pt-4 mt-2 space-y-2">
                <Link 
                  to="/wishlist" 
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 text-dark-950 hover:text-sneaker-orange transition-colors font-semibold py-3 px-4 rounded-lg hover:bg-sneaker-light"
                >
                  <FiHeart size={18} />
                  <span>Favourites ({wishlistItems.length})</span>
                </Link>
                <Link 
                  to="/cart" 
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 text-dark-950 hover:text-sneaker-orange transition-colors font-semibold py-3 px-4 rounded-lg hover:bg-sneaker-light"
                >
                  <FiShoppingCart size={18} />
                  <span>Cart ({totalItems})</span>
                </Link>
                <Link 
                  to="/profile" 
                  onClick={toggleMenu}
                  className="flex items-center space-x-3 text-dark-950 hover:text-sneaker-orange transition-colors font-semibold py-3 px-4 rounded-lg hover:bg-sneaker-light"
                >
                  <FiUser size={18} />
                  <span>Account</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import ProtectedRoute from '@components/layout/ProtectedRoute';
import AdminRoute from '@components/layout/AdminRoute';
import ScrollToTop from '@components/common/ScrollToTop';

// Lazy load pages for bundle splitting
const HomePage = React.lazy(() => import('@pages/HomePage'));
const CategoriesPage = React.lazy(() => import('@pages/CategoriesPage'));
const ProductsPage = React.lazy(() => import('@pages/ProductsPage'));
const CategoryPage = React.lazy(() => import('@pages/CategoryPage'));
const ProductDetailPage = React.lazy(() => import('@pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('@pages/CartPage'));
const CheckoutPage = React.lazy(() => import('@pages/CheckoutPage'));
const OrderSuccessPage = React.lazy(() => import('@pages/OrderSuccessPage'));
const LoginPage = React.lazy(() => import('@pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('@pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('@pages/ResetPasswordPage'));
const PaymentCallbackPage = React.lazy(() => import('@pages/PaymentCallbackPage'));
const AboutPage = React.lazy(() => import('@pages/AboutPage'));
const ContactPage = React.lazy(() => import('@pages/info/ContactPage'));
const ShippingPage = React.lazy(() => import('@pages/info/StaticPages').then(m => ({ default: m.ShippingPage })));
const ReturnsPage = React.lazy(() => import('@pages/info/StaticPages').then(m => ({ default: m.ReturnsPage })));
const FAQPage = React.lazy(() => import('@pages/info/StaticPages').then(m => ({ default: m.FAQPage })));
const TermsPage = React.lazy(() => import('@pages/info/StaticPages').then(m => ({ default: m.TermsPage })));
const PrivacyPage = React.lazy(() => import('@pages/info/StaticPages').then(m => ({ default: m.PrivacyPage })));

const ProfilePage = React.lazy(() => import('@pages/ProfilePage'));
const WishlistPage = React.lazy(() => import('@pages/WishlistPage'));
const AdminDashboard = React.lazy(() => import('@pages/admin/AdminDashboard'));

const AdminProducts = React.lazy(() => import('@pages/admin/AdminProducts'));
const AdminCategories = React.lazy(() => import('@pages/admin/AdminCategories'));
const AdminOrders = React.lazy(() => import('@pages/admin/AdminOrders'));
const AdminOrderDetailPage = React.lazy(() => import('@pages/admin/AdminOrderDetailPage'));
const AdminUsers = React.lazy(() => import('@pages/admin/AdminUsers'));
const AdminCoupons = React.lazy(() => import('@pages/admin/AdminCoupons'));
const AdminMedia = React.lazy(() => import('@pages/admin/AdminMedia'));

const AddressesPage = React.lazy(() => import('@pages/profile/AddressesPage'));
const ChangePasswordPage = React.lazy(() => import('@pages/profile/ChangePasswordPage'));
const OrdersPage = React.lazy(() => import('@pages/profile/OrdersPage'));
const OrderDetailPage = React.lazy(() => import('@pages/profile/OrderDetailPage'));

// Fallback loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-light-50">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-dark-950 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black uppercase tracking-widest text-dark-950">LOADING...</p>
    </div>
  </div>
);

/**
 * Public Layout Component
 * Header + Footer + Main Content
 */
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Public Routes wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Info Pages */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Quick Links Redirects */}
          <Route path="/new-arrivals" element={<Navigate to="/products?sort=createdAt,desc" replace />} />
          <Route path="/sale" element={<Navigate to="/products?isSale=true" replace />} />
          
          {/* Protected Routes (Require Login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<PaymentCallbackPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/addresses" element={<AddressesPage />} />
            <Route path="/profile/password" element={<ChangePasswordPage />} />
            <Route path="/profile/orders" element={<OrdersPage />} />
            <Route path="/profile/orders/:id" element={<OrderDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          <Route path="*" element={
            <div className="container-street py-20 text-center">
              <h1 className="text-9xl font-display font-black text-dark-950 mb-4">404</h1>
              <p className="text-gray-600 text-xl font-bold uppercase tracking-wide mb-8">Page not found</p>
              <a href="/" className="btn-street">Go Home</a>
            </div>
          } />
        </Route>

        {/* Admin Routes - Standalone (Protected by AdminRoute) */}
        {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/media" element={<AdminMedia />} />
        </Route>
      </Routes>
      </Suspense>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#111827',
            border: '1px solid #f3f4f6',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontWeight: '600',
            fontSize: '14px',
            padding: '16px 20px',
            fontFamily: 'inherit'
          },
          success: {
            iconTheme: {
              primary: '#ff5c00', // sneaker-orange
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#ffffff',
            },
          },
        }}
      />
      </Router>
    </HelmetProvider>
  );
}

export default App;

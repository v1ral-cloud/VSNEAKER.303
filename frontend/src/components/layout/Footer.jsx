import { Link } from 'react-router-dom';
import { 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin 
} from 'react-icons/fi';

/**
 * Footer Component - VSneakers Premium Style
 * Dark footer with orange accents — English
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
  };

  const quickLinks = [
    { to: '/products',                       label: 'All Sneakers' },
    { to: '/categories',                     label: 'Collections' },
    { to: '/products?sort=createdAt,desc',   label: 'New Drops' },
    { to: '/products?featured=true',         label: 'Best Sellers' },
    { to: '/products?sale=true',             label: 'SALE 🔥', accent: true },
  ];

  const serviceLinks = [
    { to: '/about',       label: 'About VSneakers' },
    { to: '/contact',     label: 'Contact Us' },
    { to: '/shipping',    label: 'Shipping Info' },
    { to: '/returns',     label: '30-Day Returns' },
    { to: '/faq',         label: 'FAQ' },
    { to: '/size-guide',  label: 'Size Guide' },
  ];

  return (
    <footer className="bg-dark-950 mt-24">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-sneaker-orange via-sneaker-gold to-sneaker-orange" />

      <div className="container-street py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div className="space-y-5">
            <div>
              <img src="/LOGOV.png" alt="VSneakers" className="h-9 object-contain mb-3 brightness-0 invert" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Vietnam's #1 destination for authentic sneakers.
              500+ styles from Nike, Jordan, Adidas and more.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-sneaker-orange/30 text-sneaker-orange rounded">
                ✓ 100% Authentic
              </span>
              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-gray-600 text-gray-400 rounded">
                ✓ 30-Day Returns
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {[
                { href: 'https://facebook.com',  icon: FiFacebook,  label: 'Facebook' },
                { href: 'https://instagram.com', icon: FiInstagram, label: 'Instagram' },
                { href: 'https://twitter.com',   icon: FiTwitter,   label: 'Twitter' },
                { href: 'https://youtube.com',   icon: FiYoutube,   label: 'YouTube' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-gray-700 text-gray-400 
                           hover:bg-sneaker-orange hover:border-sneaker-orange hover:text-white 
                           transition-all flex items-center justify-center"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5">Shop</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label, accent }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`text-sm transition-colors hover:text-sneaker-orange ${
                      accent ? 'text-sneaker-orange font-bold' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5">Support</h3>
            <ul className="space-y-3">
              {serviceLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-sneaker-orange transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5">Contact</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3 text-gray-400 text-sm">
                <FiMapPin className="flex-shrink-0 mt-0.5 text-sneaker-orange" size={15} />
                <span>123 Sneaker Street, District 1, Ho Chi Minh City</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <FiPhone className="flex-shrink-0 text-sneaker-orange" size={15} />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <FiMail className="flex-shrink-0 text-sneaker-orange" size={15} />
                <span>hello@vsneakers.vn</span>
              </div>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <label className="text-xs text-gray-500 uppercase tracking-wider block font-bold">
                Get New Drop Alerts
              </label>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-dark-800 border border-gray-700 
                           text-white placeholder-gray-600 text-sm focus:outline-none 
                           focus:border-sneaker-orange transition-all rounded-l-lg"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-sneaker-orange text-white font-bold rounded-r-lg 
                           hover:bg-sneaker-dark transition-colors text-sm whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} VSneakers. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/terms"   className="text-gray-500 hover:text-sneaker-orange transition-colors text-sm">Terms of Service</Link>
              <Link to="/privacy" className="text-gray-500 hover:text-sneaker-orange transition-colors text-sm">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

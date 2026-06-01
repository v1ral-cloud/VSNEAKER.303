import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';
import SEOHelmet from '@components/common/SEOHelmet';
import WebPageSchema from '@components/seo/WebPageSchema';
import HeroBanner from '@components/home/HeroBanner';
import CategoriesSection from '@components/home/CategoriesSection';
import FeaturedProducts from '@components/home/FeaturedProducts';
import PromoBannerGSAP from '@components/home/PromoBannerGSAP';
import NewArrivals from '@components/home/NewArrivals';

/**
 * HomePage Component - GSAP Enhanced
 * Trang chủ với smooth scrolling và scroll-triggered animations
 */
const HomePage = () => {
  const mainRef = useRef(null);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    // Refresh ScrollTrigger after all components mount
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <SEOHelmet 
        title="VSneakers - Giày Sneaker Chính Hãng, Nike, Jordan, Adidas Tại Việt Nam"
        description="VSneakers - Shop giày sneaker chính hãng tại Việt Nam. Hơn 500+ mẫu từ Nike, Jordan, Adidas, Yeezy, New Balance. Giao hàng toàn quốc, đổi trả 30 ngày, giá tốt nhất."
        keywords="sneaker việt nam, giày sneaker, nike air max, jordan 1, adidas, vsneakers, giày chính hãng, mua giày online, new balance, yeezy"
        image="/logo.png"
        url="/"
        type="website"
      />
      
      <WebPageSchema 
        name="VSneakers - Giày Sneaker Chính Hãng Tại Việt Nam"
        description="VSneakers - Shop giày sneaker chính hãng tại Việt Nam. Hơn 500+ mẫu Nike, Jordan, Adidas."
        url="/"
      />
      
      <div ref={mainRef} className="min-h-screen">
        <h1 className="sr-only">VSneakers - Giày Sneaker Chính Hãng Nike, Jordan, Adidas Tại Việt Nam</h1>
        {/* Hero Banner - Full height with parallax */}
        <HeroBanner />

      {/* Categories Section - Scroll-triggered stagger */}
      <CategoriesSection />

      {/* Featured Products - Horizontal scroll gallery */}
      <FeaturedProducts />

      {/* Promo Banner - Full-screen takeover effect */}
      <PromoBannerGSAP />

      {/* New Arrivals - 3D perspective reveal */}
      <NewArrivals />

        {/* Footer spacer for ScrollTrigger */}
        <div className="h-1" />
      </div>
    </>
  );
};

export default HomePage;

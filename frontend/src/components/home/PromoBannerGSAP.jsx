import { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';

/**
 * PromoBannerGSAP Component - VSneakers (English)
 * Full-width promo section with scroll-triggered animations
 */
const PromoBannerGSAP = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef([]);
  const ctaRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        backgroundPositionY: '40%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.fromTo(
        tagRef.current,
        { opacity: 0, y: 30, scale: 0.8 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
        }
      );

      const title = titleRef.current;
      if (title) {
        const words = title.textContent.split(' ');
        title.innerHTML = words
          .map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block">${word}</span></span>`)
          .join(' ');
        const innerSpans = title.querySelectorAll('span > span');
        gsap.fromTo(innerSpans,
          { y: '110%', rotateZ: 8 },
          {
            y: '0%', rotateZ: 0, duration: 0.8, stagger: 0.06, ease: 'power4.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', toggleActions: 'play none none reverse' },
          }
        );
      }

      const statEls = statsRef.current.filter(Boolean);
      gsap.fromTo(statEls,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 55%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 50%', toggleActions: 'play none none reverse' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '500+',  label: 'Sneaker Styles' },
    { value: '20+',   label: 'Brands' },
    { value: '50K+',  label: 'Happy Customers' },
    { value: '100%',  label: 'Authentic' },
  ];

  return (
    <section ref={sectionRef} className="relative py-28 md:py-36 overflow-hidden bg-dark-950">
      {/* Animated dot bg */}
      <div
        ref={bgRef}
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #FF6B00 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #FF6B00 0%, transparent 70%)' }}
      />

      {/* Corner accents */}
      <div className="absolute top-8 left-8  w-14 h-14 border-l-2 border-t-2 border-sneaker-orange/30" />
      <div className="absolute bottom-8 right-8 w-14 h-14 border-r-2 border-b-2 border-sneaker-orange/30" />

      <div className="container-street relative z-10 text-center">
        {/* Tag */}
        <div ref={tagRef} className="mb-6">
          <span className="inline-flex items-center gap-2 px-5 py-2 border border-sneaker-orange/40
                         text-sneaker-orange text-sm font-bold uppercase tracking-widest rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-sneaker-orange animate-pulse" />
            Why choose VSneakers?
          </span>
        </div>

        {/* Title */}
        <h2
          ref={titleRef}
          className="text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase
                     text-white leading-tight mb-12 max-w-4xl mx-auto"
        >
          Authentic Sneakers,{' '}
          <span className="text-sneaker-orange">Best Prices</span>
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-14 max-w-3xl mx-auto">
          {stats.map(({ value, label }, i) => (
            <div key={label} ref={(el) => (statsRef.current[i] = el)} className="group relative">
              <div className="border border-gray-800 group-hover:border-sneaker-orange/50
                            p-6 transition-all duration-300 rounded group-hover:bg-sneaker-orange/5">
                <div className="text-4xl md:text-5xl font-black text-white mb-1
                               group-hover:text-sneaker-orange transition-colors duration-300">
                  {value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-sneaker-orange text-white
                     font-black uppercase tracking-wider
                     hover:bg-sneaker-dark transition-all duration-300 hover:scale-[1.03]
                     shadow-orange-soft hover:shadow-orange-glow"
          >
            <span>Shop Now</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-10 py-4 border border-gray-700 text-gray-300
                     font-bold uppercase tracking-wider
                     hover:border-sneaker-orange hover:text-sneaker-orange transition-all duration-300"
          >
            Learn More
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-gray-600">
          {['✓ Free Shipping', '✓ 30-Day Returns', '✓ Secure Checkout', '✓ 100% Authentic'].map((badge) => (
            <span key={badge} className="text-sm font-medium">{badge}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBannerGSAP;

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';
import heroSneaker from '../../assets/images/hero-sneaker.jpg';

/**
 * HeroBanner Component - VSneakers Premium
 * Clean white hero with floating sneaker - fixed layout
 */
const HeroBanner = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const taglineRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const decorRef = useRef(null);

  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const { default: axios } = await import('axios');
        const response = await axios.get('/api/v1/banners/active');
        if (response.data?.success && response.data?.data?.imageUrl) {
          setBannerUrl(response.data.data.imageUrl);
        }
      } catch (err) {
        // Use default hero image
      }
    };
    fetchBanner();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([taglineRef.current, titleRef.current, descRef.current, ctaRef.current, statsRef.current], {
        opacity: 0,
        y: 40,
      });
      gsap.set(imageRef.current, { opacity: 0, x: 80, scale: 0.88 });
      gsap.set(decorRef.current?.children || [], { opacity: 0, scale: 0 });

      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(taglineRef.current,  { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
        .to(titleRef.current,    { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.2')
        .to(descRef.current,     { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.5')
        .to(ctaRef.current,      { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3')
        .to(statsRef.current,    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .to(imageRef.current,    { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power4.out' }, '-=0.9')
        .to(decorRef.current?.children || [], {
          opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(2)',
        }, '-=0.6');

      // Floating animation on image
      gsap.to(imageRef.current, {
        y: -20,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Scroll indicator bounce
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Parallax on scroll
      gsap.to(contentRef.current, {
        y: '12%',
        opacity: 0.7,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '500+', label: 'Styles' },
    { value: '20+', label: 'Brands' },
    { value: '100%', label: 'Authentic' },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] overflow-hidden bg-white flex items-center"
    >
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4d4d4 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Orange gradient blob - right side */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 65%)',
          transform: 'translate(20%, -20%)',
        }}
      />

      {/* Decorative dots */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[8%]  w-2.5 h-2.5 rounded-full bg-sneaker-orange opacity-50" />
        <div className="absolute top-2/5 left-[5%]  w-1.5 h-1.5 rounded-full bg-sneaker-gold   opacity-70" />
        <div className="absolute bottom-1/3 left-[10%] w-4 h-4 rounded-full border-2 border-sneaker-orange opacity-30" />
        <div className="absolute top-1/4 right-[5%]  w-2 h-2   rounded-full bg-sneaker-orange opacity-40" />
        <div className="absolute bottom-1/3 right-[4%]  w-3 h-3   rounded-full border border-sneaker-gold opacity-50" />
      </div>

      {/* Main content */}
      <div ref={contentRef} className="container-street relative z-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">

          {/* ── Left: Text ── */}
          <div className="space-y-6 max-w-xl">

            {/* Tagline badge */}
            <div ref={taglineRef}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-sneaker-light text-sneaker-orange
                             rounded-full text-sm font-bold uppercase tracking-wider border border-sneaker-orange/20">
                <span className="w-2 h-2 rounded-full bg-sneaker-orange animate-pulse" />
                VSneakers — Premium Collection
              </span>
            </div>

            {/* Main title */}
            <h1
              ref={titleRef}
              className="text-[clamp(3.5rem,8vw,7rem)] font-display font-black leading-[0.88] tracking-tight"
            >
              <span className="block text-dark-950">STEP</span>
              <span className="block text-dark-950">INTO YOUR</span>
              <span className="block text-sneaker-orange">STYLE.</span>
            </h1>

            {/* Description */}
            <p ref={descRef} className="text-base md:text-lg text-gray-500 font-medium leading-relaxed max-w-md">
              Discover our curated collection of authentic sneakers from Nike, Jordan, Adidas
              and 20+ world-leading brands.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-dark-950 text-white
                         font-bold uppercase tracking-wider
                         hover:bg-sneaker-orange transition-all duration-300 hover:scale-[1.03]"
                style={{ boxShadow: '4px 4px 0px rgba(10,10,10,0.8)' }}
              >
                <span>Shop Now</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                to="/categories"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-dark-950 text-dark-950
                         font-bold uppercase tracking-wider
                         hover:bg-dark-950 hover:text-white transition-all duration-300"
              >
                Explore Collections
              </Link>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex items-center gap-8 pt-1">
              {stats.map(({ value, label }, i) => (
                <div key={label} className="flex flex-col items-start">
                  <span className="text-2xl font-black text-dark-950 leading-none">{value}</span>
                  <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Sneaker Image ── */}
          <div
            ref={imageRef}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Large soft circle bg */}
            <div
              className="absolute rounded-full"
              style={{
                width: 'min(480px, 90vw)',
                height: 'min(480px, 90vw)',
                background: 'radial-gradient(circle, #FFF4EC 40%, rgba(255,244,236,0) 80%)',
              }}
            />

            {/* Dashed ring */}
            <div
              className="absolute rounded-full border-2 border-dashed border-sneaker-orange/15"
              style={{ width: 'min(510px, 94vw)', height: 'min(510px, 94vw)' }}
            />

            {/* Sneaker image – no rectangular box */}
            <div
              className="relative z-10"
              style={{ width: 'min(420px, 80vw)', height: 'min(420px, 80vw)' }}
            >
              <img
                src={bannerUrl || heroSneaker}
                alt="Premium Sneaker"
                className="w-full h-full object-contain"
                style={{
                  filter: 'drop-shadow(0px 24px 40px rgba(255, 107, 0, 0.22)) drop-shadow(0px 8px 16px rgba(0,0,0,0.12))',
                }}
              />
            </div>

            {/* Badge: New Drop — top-right, safe from clipping */}
            <div
              className="absolute top-4 right-4 bg-dark-950 text-white
                         text-xs font-black uppercase tracking-wider
                         px-4 py-2 rounded-full shadow-lg z-20"
              style={{ animation: 'float 2.8s ease-in-out infinite' }}
            >
              ⚡ New Drop
            </div>

            {/* Badge: Free Shipping — bottom-left, safe from clipping */}
            <div
              className="absolute bottom-6 left-2 lg:left-0 bg-white border-2 border-sneaker-orange
                         text-dark-950 text-xs font-bold px-4 py-2 rounded-full shadow-orange-soft z-20
                         whitespace-nowrap"
            >
              🚚 Free Shipping
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-gray-400"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Float keyframe injected locally */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;

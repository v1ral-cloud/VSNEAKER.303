import { useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';
import { FiArrowRight, FiTarget, FiBox, FiUsers } from 'react-icons/fi';
import SEOHelmet from '@components/common/SEOHelmet';
import WebPageSchema from '@components/seo/WebPageSchema';
import whyChooseUsImage from '@assets/images/why-choose-sneaker.jpg';
import logoAbout from '@assets/images/vsneakers-logo.png';
import aboutImage from '@assets/images/about-sneaker.jpg';

/**
 * AboutPage Component - GSAP Enhanced
 * Parallax scrolling, scroll-triggered animations, and smooth transitions
 */
const AboutPage = () => {
  const pageRef = useRef(null);
  
  // Hero refs
  const heroRef = useRef(null);
  const heroLogoRef = useRef(null);
  const heroTextRef = useRef(null);
  
  // Mission refs
  const missionRef = useRef(null);
  const missionTitleRef = useRef(null);
  const missionTextRefs = useRef([]);
  const missionImageRef = useRef(null);
  
  // Values refs
  const valuesRef = useRef(null);
  const valuesTitleRef = useRef(null);
  const valuesCardsRef = useRef([]);
  
  // Why Choose Us refs
  const whyRef = useRef(null);
  const whyImageRef = useRef(null);
  const whyContentRef = useRef(null);
  
  // CTA refs
  const ctaRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // ============ HERO SECTION ============
      // Logo entrance animation
      gsap.fromTo(
        heroLogoRef.current,
        { opacity: 0, scale: 0.5, rotateY: -90 },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.2,
          ease: 'back.out(1.7)',
          delay: 0.3,
        }
      );

      // Hero text animation
      gsap.fromTo(
        heroTextRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.8,
        }
      );

      // Parallax effect on hero
      gsap.to(heroRef.current, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // ============ MISSION SECTION ============
      // Title reveal with clip-path
      gsap.fromTo(
        missionTitleRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: missionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Text paragraphs stagger
      const missionTexts = missionTextRefs.current.filter(Boolean);
      gsap.fromTo(
        missionTexts,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: missionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image reveal (no rotation - let CSS handle hover rotation)
      gsap.fromTo(
        missionImageRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: missionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image parallax on scroll
      gsap.to(missionImageRef.current.querySelector('img'), {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: missionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // ============ VALUES SECTION ============
      // Title animation
      gsap.fromTo(
        valuesTitleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards 3D stagger reveal
      const valuesCards = valuesCardsRef.current.filter(Boolean);
      gsap.fromTo(
        valuesCards,
        {
          opacity: 0,
          y: 100,
          rotateX: -30,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // ============ WHY CHOOSE US SECTION ============
      // Image reveal from left (no rotation - let CSS handle hover)
      gsap.fromTo(
        whyImageRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: whyRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image parallax
      gsap.to(whyImageRef.current.querySelector('img'), {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: whyRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Content reveal from right
      gsap.fromTo(
        whyContentRef.current.children,
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: whyRef.current,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // ============ CTA SECTION ============
      // Title split animation
      const ctaTitle = ctaRef.current.querySelector('h2');
      const words = ctaTitle.textContent.split(' ');
      ctaTitle.innerHTML = words
        .map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block">${word}</span></span>`)
        .join(' ');

      const ctaSpans = ctaTitle.querySelectorAll('span > span');
      gsap.fromTo(
        ctaSpans,
        { y: '120%', rotateZ: 10 },
        {
          y: '0%',
          rotateZ: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Button reveal
      const ctaButton = ctaRef.current.querySelector('a');
      gsap.fromTo(
        ctaButton,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

    }, pageRef);

    // Refresh ScrollTrigger after mount
    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEOHelmet 
        title="Về VSneakers - Cửa hàng Sneaker Chính Hãng Hàng Đầu Việt Nam"
        description="VSneakers - Điểm đến hàng đầu cho giày sneaker chính hãng tại Việt Nam. Chúng tôi mang đến hơn 500+ mẫu sneaker từ Nike, Jordan, Adidas và các thương hiệu hàng đầu thế giới."
        keywords="về vsneakers, sneaker chính hãng việt nam, cửa hàng giày, sneaker store, nike vietnam, jordan việt nam, giới thiệu vsneakers"
        image={logoAbout}
        url="/about"
        type="website"
      />
      
      <WebPageSchema 
        name="Về VSneakers - Cửa hàng Sneaker Chính Hãng Việt Nam"
        description="VSneakers - Điểm đến hàng đầu cho giày sneaker chính hãng tại Việt Nam."
        url="/about"
      />
      
      <div ref={pageRef} className="min-h-screen bg-light-50 overflow-hidden">
        {/* Hero Section - Pure Black Background */}
      <div
        ref={heroRef}
        className="relative text-light-50 py-32 md:py-40 px-4 overflow-hidden"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-lines opacity-10" />
        
        {/* Noise texture */}
        <div className="absolute inset-0 bg-noise opacity-5" />

        <div className="container-street text-center relative z-10">
          {/* Animated Logo */}
          <div
            ref={heroLogoRef}
            className="mb-8 flex justify-center"
            style={{ perspective: '1000px' }}
          >
            <img
              src={logoAbout}
              alt="WE ARE D4K"
              className="h-36 md:h-52 object-contain"
            />
          </div>
          
          {/* Subtitle */}
          <p
            ref={heroTextRef}
            className="text-xl md:text-2xl font-bold uppercase tracking-[0.2em] text-gray-400 max-w-3xl mx-auto"
          >
            Where Every Sneaker Tells a Story
          </p>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-light-50/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Decorative corners - subtle white */}
        <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-light-50/10" />
        <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-light-50/10" />
      </div>

      {/* Mission Section */}
      <div ref={missionRef} className="container-street py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2
                ref={missionTitleRef}
                className="text-5xl md:text-6xl font-display font-black uppercase tracking-tight leading-none"
              >
                THE<br />
                <span className="text-sneaker-orange">MISSION</span>
              </h2>
              <div className="h-2 w-24 bg-sneaker-orange mt-6" />
            </div>
            
            <p
              ref={(el) => (missionTextRefs.current[0] = el)}
              className="text-lg text-gray-700 font-medium leading-relaxed"
            >
              VSneakers wasn't born in a boardroom. It started with a passion for sneakers.
              We believe a pair of shoes is more than fashion—it's a lifestyle,
              a way of expressing who you are.
            </p>
            <p
              ref={(el) => (missionTextRefs.current[1] = el)}
              className="text-lg text-gray-700 font-medium leading-relaxed"
            >
              Our mission is simple: deliver authentic, high-quality sneakers
              at the best prices for sneaker lovers across Vietnam. We bridge global
              sneaker culture with the Vietnamese community.
            </p>
          </div>
          
          {/* Image with frame - GSAP wrapper */}
          <div ref={missionImageRef}>
            {/* CSS hover rotation wrapper */}
            <div className="group relative bg-light-50 
                         rotate-2 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <img
                src={aboutImage}
                alt="Streetwear Culture"
                className="w-full h-[450px] object-cover object-top
                         grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-4 right-4 bg-dark-950 text-white px-6 py-2 font-black uppercase text-lg
                            shadow-[4px_4px_0px_0px_rgba(255,107,0,1)]">
                Since 2024
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div
        ref={valuesRef}
        className="bg-light-100 py-24 md:py-32 border-y-4 border-dark-950 overflow-hidden"
        style={{ perspective: '1500px' }}
      >
        <div className="container-street">
          {/* Section header */}
          <div ref={valuesTitleRef} className="text-center mb-20">
            <span className="text-sneaker-orange font-bold text-sm uppercase tracking-[0.3em] mb-4 block">
              Core Values
            </span>
            <h2 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tight mb-6">
              Core Values
            </h2>
            <div className="h-1 w-32 bg-sneaker-orange mx-auto" />
          </div>

          {/* Values cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FiTarget,
                title: 'Authenticity',
                desc: 'We guarantee 100% authentic products. Every sneaker comes with original tags, box and certificate of authenticity.',
                num: '01',
              },
              {
                icon: FiBox,
                title: 'Quality',
                desc: 'Every sneaker is carefully inspected before reaching you. We ensure a perfect product experience.',
                num: '02',
              },
              {
                icon: FiUsers,
                title: 'Community',
                desc: "We're more than a store—we're a community. Connecting thousands of sneakerheads across Vietnam.",
                num: '03',
              },
            ].map((value, index) => (
              <div
                key={index}
                ref={(el) => (valuesCardsRef.current[index] = el)}
                className="group relative bg-light-50 border-2 border-dark-950 p-8
                         hover:-translate-y-2 hover:-translate-x-1 
                         hover:shadow-[10px_10px_0px_0px_rgba(20,20,20,1)] 
                         transition-all duration-300"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Number watermark */}
                <div className="absolute top-2 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-8xl font-black text-dark-950 leading-none">{value.num}</span>
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-dark-950 text-white flex items-center justify-center mb-6
                                group-hover:bg-sneaker-orange group-hover:rotate-6 transition-all duration-300">
                    <value.icon className="text-3xl" />
                  </div>

                  <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{value.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed group-hover:text-dark-950 transition-colors">
                    {value.desc}
                  </p>
                </div>

                {/* Corner accent on hover */}
                <div className="absolute bottom-0 right-0 w-0 h-0 
                              border-r-[40px] border-r-sneaker-orange 
                              border-t-[40px] border-t-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div ref={whyRef} className="container-street py-24 md:py-32 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Image with parallax - GSAP wrapper */}
          <div ref={whyImageRef}>
            {/* CSS hover rotation wrapper */}
            <div className="group relative bg-light-50
                         -rotate-2 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <img
                src={whyChooseUsImage}
                alt="Why Choose Us"
                className="w-full h-[500px] object-cover object-center
                         grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-4 left-4 bg-dark-950 text-white px-6 py-2 font-black uppercase text-lg
                            shadow-[-4px_4px_0px_0px_rgba(255,107,0,1)]">
                VSneakers Promise
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div ref={whyContentRef} className="space-y-8">
            <div>
              <h2 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tight leading-none">
                WHY<br />
                <span className="text-sneaker-orange">CHOOSE US?</span>
              </h2>
              <div className="h-2 w-24 bg-sneaker-orange mt-6" />
            </div>

            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              Every sneaker at VSneakers is 100% authentic with full original tags, box and authentication certificate.
              We source directly from brands and authorized global distributors.
            </p>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              Free returns within 30 days if you're not satisfied. We stand behind
              absolute customer satisfaction—that's the VSneakers promise.
            </p>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              Nationwide delivery in 1-3 business days. Order before 12pm for same-day delivery in Ho Chi Minh City and Hanoi.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        ref={ctaRef}
        className="bg-dark-950 text-light-50 py-24 md:py-32 text-center relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 grid-lines opacity-10" />
        <div className="absolute top-10 left-10 text-[15rem] font-black text-light-50/5 leading-none">D4K</div>
        
        <div className="container-street relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase mb-10 leading-tight">
            READY TO FIND YOUR NEXT PAIR?
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-4 bg-white text-dark-950 px-12 py-5
                     font-black uppercase tracking-wider text-xl 
                     hover:bg-sneaker-orange hover:text-white
                     hover:scale-105 hover:shadow-[0_0_40px_rgba(255,107,0,0.5)]
                     transition-all duration-300"
          >
            <span>SHOP ALL SNEAKERS</span>
            <FiArrowRight className="text-2xl" />
          </Link>
        </div>
      </div>
      </div>
    </>
  );
};

export default AboutPage;

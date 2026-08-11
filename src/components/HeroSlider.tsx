import React, { useState, useEffect, useRef } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { SportSVG } from './SportSVG';

interface SlideData {
  tagline: string;
  title: string;
  description: string;
  btn1Text: string;
  btn1Href: string;
  btn2Text: string;
  btn2Href: string;
  bgType: "image" | "svg";
  bgUrl?: string;
  svgType?: string;
  svgColorStart?: string;
  svgColorEnd?: string;
}

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides: SlideData[] = [
    {
      tagline: "Nurturing Grassroots Talent",
      title: "Shaping Rural Champions of Tomorrow",
      description: "RLBSA Laxmipur, Siwan, Bihar identifies and elevates talented youth, offering free professional sports training, boarding, nutritious meals, and high-quality education.",
      btn1Text: "Explore Sports",
      btn1Href: "#/programs/all",
      btn2Text: "Our Story",
      btn2Href: "#/about/story",
      bgType: "image",
      bgUrl: "/images/hero1.jpeg"
    },
    {
      tagline: "Rani Laxmibai Sports Academy",
      title: "Empowering Rural Youth Through Sports",
      description: "Experience dedicated development in Football, Handball, Rugby, and Athletics, backed by life skills training, English speaking, and personality development workshops.",
      btn1Text: "Meet Our Coaches",
      btn1Href: "#/academy/coaches",
      btn2Text: "Register Interest",
      btn2Href: "#/events/registration",
      bgType: "image",
      bgUrl: "/images/hero2.jpg"
    }
  ];

  const timerRef = useRef<any>(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const handlePrev = () => {
    stopTimer();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startTimer();
  };

  const handleNext = () => {
    stopTimer();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    startTimer();
  };

  return (
    <section className="relative h-[calc(100vh-80px)] min-h-[500px] bg-primary overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full flex items-center transition-opacity duration-800 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          style={
            slide.bgType === 'image'
              ? { backgroundImage: `url('${slide.bgUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : undefined
          }
        >
          {/* Background SVG renderer */}
          {slide.bgType === 'svg' && (
            <div className="absolute w-full h-full z-0">
              <SportSVG
                sportType={slide.svgType || 'swimming'}
                colorStart={slide.svgColorStart}
                colorEnd={slide.svgColorEnd}
              />
            </div>
          )}

          {/* Dark Overlay gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/80 via-black/45 to-black/75 z-10"></div>

          <div className="max-w-[1240px] mx-auto px-5 w-full relative z-20">
            <div className="max-w-[650px] text-white">
              <span className="text-accent text-[13px] font-bold tracking-[0.15em] uppercase mb-3 inline-block">
                {slide.tagline}
              </span>
              <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-5">
                {slide.title}
              </h1>
              <p className="text-[15px] md:text-[17px] leading-relaxed mb-8 text-white/90 font-light">
                {slide.description}
              </p>
              <div className="flex gap-4 flex-wrap">
                <a href={slide.btn1Href} className="bg-accent text-primary text-[14px] font-bold py-3.5 px-7 hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300">
                  {slide.btn1Text}
                </a>
                <a href={slide.btn2Href} className="border-2 border-white/60 text-white text-[14px] font-bold py-3.5 px-7 hover:bg-white hover:text-primary transition-all duration-300">
                  {slide.btn2Text}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Manual Controls */}
      <button
        className="absolute top-1/2 -translate-y-1/2 left-5 md:left-8 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-accent hover:text-primary flex items-center justify-center text-white text-xl z-20 cursor-pointer backdrop-blur-sm transition-all duration-200"
        onClick={handlePrev}
        aria-label="Previous Slide"
      >
        <CaretLeft size={20} weight="bold" />
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-5 md:right-8 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-accent hover:text-primary flex items-center justify-center text-white text-xl z-20 cursor-pointer backdrop-blur-sm transition-all duration-200"
        onClick={handleNext}
        aria-label="Next Slide"
      >
        <CaretRight size={20} weight="bold" />
      </button>
    </section>
  );
};

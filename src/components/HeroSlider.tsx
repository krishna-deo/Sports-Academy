import React, { useState, useEffect, useRef } from 'react';
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
      tagline: "RLBSA Foundation",
      title: "Shaping Rural Champions of Tomorrow",
      description: "RLBSA Laxmipur, Siwan, Bihar identifies and elevates talented youth, offering free professional sports training, boarding, nutritious meals, and high-quality education.",
      btn1Text: "",
      btn1Href: "",
      btn2Text: "",
      btn2Href: "",
      bgType: "image",
      bgUrl: "/images/hero1.jpeg"
    },
    {
      tagline: "RLBSA Foundation",
      title: "Empowering Rural Youth Through Sports",
      description: "Experience dedicated development in Football, Handball, Rugby, and Athletics, backed by life skills training, English speaking, and personality development workshops.",
      btn1Text: "",
      btn1Href: "",
      btn2Text: "",
      btn2Href: "",
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



  return (
    <section className="relative h-[430px] sm:h-[460px] md:h-[calc(100vh-80px)] md:min-h-[500px] bg-primary overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full flex items-end pb-10 md:pb-16 transition-opacity duration-800 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
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
            <div className="max-w-[850px] text-left text-white">
              <span className="text-accent text-[13px] md:text-[14px] font-black tracking-[0.2em] uppercase mb-1.5 inline-block">
                {slide.tagline}
              </span>
              <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-2">
                {slide.title}
              </h1>
              <p className="text-[14px] md:text-[16px] leading-relaxed text-white/90 font-light max-w-[620px] line-clamp-2 md:line-clamp-none">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

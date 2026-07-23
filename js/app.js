// Ranilaxmibai Sports Academy SPA Controller & Routing Engine
import {
  programsData,
  sportsList,
  coachesList,
  successStories,
  certificationsList,
  faqsList,
  galleryItems,
  eventsList,
  blogPosts
} from './data.js';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRouter();
});

// ----------------------------------------------------
// NAVIGATION HANDLING (Desktop Hovers & Mobile Accordions)
// ----------------------------------------------------
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');

  // Mobile drawer toggle
  const toggleDrawer = (open) => {
    mobileDrawer.classList.toggle('open', open);
    drawerOverlay.classList.toggle('open', open);
  };

  mobileToggle.addEventListener('click', () => toggleDrawer(true));
  drawerClose.addEventListener('click', () => toggleDrawer(false));
  drawerOverlay.addEventListener('click', () => toggleDrawer(false));

  // Mobile Drawer Menu Accordions
  const accordions = document.querySelectorAll('.mobile-accordion-toggle');
  accordions.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const submenu = toggle.nextElementSibling;
      const caret = toggle.querySelector('i');

      // Close other open submenus
      document.querySelectorAll('.mobile-submenu').forEach(sub => {
        if (sub !== submenu && sub.classList.contains('open')) {
          sub.classList.remove('open');
          sub.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
        }
      });

      // Toggle current
      const isOpen = submenu.classList.contains('open');
      submenu.classList.toggle('open', !isOpen);
      caret.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
    });
  });

  // Close drawer when any anchor link is clicked
  const drawerLinks = document.querySelectorAll('.mobile-drawer a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });
}

// ----------------------------------------------------
// HASH ROUTER
// ----------------------------------------------------
function initRouter() {
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
}

function router() {
  const hash = window.location.hash || '#/';
  const app = document.getElementById('app');

  // Update header links active states
  updateNavActiveState(hash);

  // Clear any active timers
  if (window.heroSliderInterval) {
    clearInterval(window.heroSliderInterval);
  }

  // View Dispatcher
  if (hash === '#/' || hash === '#/home') {
    renderHome(app);
  } else if (hash.startsWith('#/about/')) {
    const sub = hash.replace('#/about/', '');
    renderAbout(app, sub);
  } else if (hash.startsWith('#/programs/')) {
    const sub = hash.replace('#/programs/', '');
    renderPrograms(app, sub);
  } else if (hash.startsWith('#/academy/')) {
    const sub = hash.replace('#/academy/', '');
    renderAcademy(app, sub);
  } else if (hash.startsWith('#/gallery/')) {
    const sub = hash.replace('#/gallery/', '');
    renderGallery(app, sub);
  } else if (hash.startsWith('#/events/')) {
    const sub = hash.replace('#/events/', '');
    renderEvents(app, sub);
  } else if (hash.startsWith('#/blog/')) {
    const sub = hash.replace('#/blog/', '');
    renderBlog(app, sub);
  } else if (hash === '#/contact') {
    renderContact(app);
  } else {
    renderHome(app); // Fallback
  }

  // Scroll page instantly to top
  window.scrollTo({ top: 0 });
}

function updateNavActiveState(currentHash) {
  const links = document.querySelectorAll('.nav-link, .mobile-nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Check match based on hierarchy
    let isActive = false;
    if (href === '#/') {
      isActive = currentHash === '#/' || currentHash === '#/home';
    } else {
      // Find parent matching categories
      const prefix = href.split('/')[1]; // e.g. 'about', 'programs'
      if (prefix && currentHash.startsWith(`#/${prefix}`)) {
        isActive = true;
      } else {
        isActive = currentHash === href;
      }
    }

    link.classList.toggle('active', isActive);
  });
}

// ----------------------------------------------------
// DYNAMIC SVG PLACEHOLDER GENERATOR
// ----------------------------------------------------
function getSportSVG(sportType, colorStart = "#003C3C", colorEnd = "#E0BC66") {
  // Returns highly styled decorative SVGs matching sports academy branding
  return `
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; object-fit:cover;">
      <defs>
        <linearGradient id="grad-${sportType}" x1="0" y1="0" x2="400" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${colorStart}" />
          <stop offset="100%" stop-color="${colorEnd}" />
        </linearGradient>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        </pattern>
      </defs>
      <!-- Background gradient -->
      <rect width="400" height="250" fill="url(#grad-${sportType})" />
      <rect width="400" height="250" fill="url(#grid)" />
      <!-- Semi-translucent design accents -->
      <circle cx="350" cy="50" r="120" fill="rgba(255,255,255,0.05)" />
      <path d="M-50 200 L250 50 L450 250 Z" fill="rgba(255,255,255,0.03)" />
      <!-- Sport Badge Shape -->
      <g transform="translate(200, 125)">
        <circle cx="0" cy="0" r="55" fill="rgba(0, 0, 0, 0.2)" stroke="rgba(224, 188, 102, 0.4)" stroke-width="2" />
        <circle cx="0" cy="0" r="48" fill="rgba(0, 60, 60, 0.4)" />
        <!-- Sport Icon (Unicode emoji represented cleanly in SVG text) -->
        <text x="0" y="12" font-size="36" text-anchor="middle" font-family="Segoe UI Emoji, Arial" fill="#E0BC66">
          ${getSportEmoji(sportType)}
        </text>
      </g>
      <!-- Typography Label overlay -->
      <text x="20" y="225" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#E0BC66" letter-spacing="2">
        RANILAXMIBAI PERFORMANCE
      </text>
    </svg>
  `;
}

function getSportEmoji(type) {
  const emojis = {
    football: "⚽",
    basketball: "🏀",
    tennis: "🎾",
    swimming: "🏊",
    cricket: "🏏",
    badminton: "🏸",
    athletics: "🏃",
    tabletennis: "🏓",
    beginner: "🌱",
    advanced: "⚡",
    summer: "☀️",
    personal: "🎯",
    story: "🏛️",
    facilities: "🏟️",
    blog: "📰"
  };
  return emojis[type] || "🏅";
}

// ----------------------------------------------------
// VIEW RENDERING: 🏠 HOME
// ----------------------------------------------------
function renderHome(app) {
  app.innerHTML = `
    <div class="animate-fade-in">
      
      <!-- Hero Slider -->
      <section class="hero-slider">
        
        <!-- Slide 1 -->
        <div class="slide active" id="slide-1" style="background-image: url('images/hero1.png');">
          <div class="hero-overlay"></div>
          <div class="container" style="position:relative; z-index:3;">
            <div class="hero-content">
              <span class="hero-tagline">Nurturing Grassroots Talent</span>
              <h1>Shaping Competitive Champions of Tomorrow</h1>
              <p>State-of-the-art sports coaching infrastructure and customized training curriculums designed to help young athletes reach state and national glory.</p>
              <div class="hero-btn-group">
                <a href="#/programs/all" class="btn btn-accent">Explore Programs</a>
                <a href="#/about/story" class="btn btn-secondary" style="color:#FFF; border-color:#FFF;">Our Story</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 2 -->
        <div class="slide" id="slide-2" style="background-image: url('images/hero2.png');">
          <div class="hero-overlay"></div>
          <div class="container" style="position:relative; z-index:3;">
            <div class="hero-content">
              <span class="hero-tagline">Ranilaxmibai Football Club</span>
              <h1>Train Like a Professional Athlete</h1>
              <p>Experience elite coaching with UEFA-certified football coaches, high-speed camera video performance feedback, and structured agility schedules.</p>
              <div class="hero-btn-group">
                <a href="#/academy/coaches" class="btn btn-accent">Meet Our Coaches</a>
                <a href="#/events/registration" class="btn btn-secondary" style="color:#FFF; border-color:#FFF;">Register Today</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 3 -->
        <div class="slide" id="slide-3">
          <div class="hero-overlay"></div>
          <div class="hero-img-placeholder" style="position:absolute; width:100%; height:100%; z-index:1;">
            ${getSportSVG('swimming', '#002B36', '#3B82F6')}
          </div>
          <div class="container" style="position:relative; z-index:3;">
            <div class="hero-content">
              <span class="hero-tagline">Olympic Standard Aquatics</span>
              <h1>Mastering Biomechanics and Recovery</h1>
              <p>Refine your stroke techniques in our advanced temperature-controlled swimming arena, supported by personal strength and fitness plans.</p>
              <div class="hero-btn-group">
                <a href="#/about/facilities" class="btn btn-accent">Tour Facilities</a>
                <a href="#/programs/personal" class="btn btn-secondary" style="color:#FFF; border-color:#FFF;">Personal Coaching</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Slider controls -->
        <button class="slider-control slider-prev" id="slider-prev-btn" aria-label="Previous Slide"><i class="ph ph-caret-left"></i></button>
        <button class="slider-control slider-next" id="slider-next-btn" aria-label="Next Slide"><i class="ph ph-caret-right"></i></button>
      </section>

      <!-- Stats section -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <h3 class="counter-num" data-target="50">0</h3>
              <p>Elite Certified Coaches</p>
            </div>
            <div class="stat-card">
              <h3 class="counter-num" data-target="1200">0</h3>
              <p>Active Students Enrolled</p>
            </div>
            <div class="stat-card">
              <h3 class="counter-num" data-target="8">0</h3>
              <p>Major Sports Facilities</p>
            </div>
            <div class="stat-card">
              <h3 class="counter-num" data-target="240">0</h3>
              <p>Tournament Medals Won</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Us features section -->
      <section class="section-padding">
        <div class="container">
          <div class="section-title-wrapper">
            <h2>The Ranilaxmibai Edge</h2>
            <p class="section-subtitle">We go beyond ordinary coaching centers. We build a high-performance ecosystem for long-term athletic success.</p>
          </div>
          <div class="features-grid">
            
            <div class="feature-card">
              <div class="feature-icon-wrapper"><i class="ph ph-medal"></i></div>
              <h3>Certified Curriculum</h3>
              <p>Structured progression pathways for multi-sport learners, beginner development, and competitive youth performance modules.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrapper"><i class="ph ph-barbell"></i></div>
              <h3>Modern Infrastructure</h3>
              <p>Access temperature-controlled pools, synthetic athletics track, indoor courts, and automated cricket nets.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrapper"><i class="ph ph-heartbeat"></i></div>
              <h3>Sports Science & Diet</h3>
              <p>Integrated biomechanical assessment, nutritional counsel, sports psychologists, and muscle rehab tracking.</p>
            </div>

          </div>
        </div>
      </section>

      <!-- Quick Programs Section -->
      <section class="section-padding bg-light">
        <div class="container">
          <div class="section-title-wrapper">
            <h2>Featured Training Programs</h2>
            <p class="section-subtitle">Select a path that fits the athlete's current level and competitive ambitions.</p>
          </div>
          <div class="features-grid">
            
            <div class="feature-card text-center" style="border-top: 4px solid var(--color-accent);">
              <div class="sport-icon-box">🌱</div>
              <h3>Beginner Program</h3>
              <p>For ages 5 to 12. Focuses on motor skills, hand-eye coordination, basics, and fun multi-sport exploration.</p>
              <a href="#/programs/beginner" class="btn btn-secondary" style="margin-top:20px; padding:8px 20px; font-size:0.85rem;">Learn Details</a>
            </div>

            <div class="feature-card text-center" style="border-top: 4px solid var(--color-primary);">
              <div class="sport-icon-box">⚡</div>
              <h3>Advanced Performance</h3>
              <p>For ages 12 to 18. Structured for tournament aspirants, tactical training, videography analysis, and strength development.</p>
              <a href="#/programs/advanced" class="btn btn-secondary" style="margin-top:20px; padding:8px 20px; font-size:0.85rem;">Learn Details</a>
            </div>

            <div class="feature-card text-center" style="border-top: 4px solid var(--color-accent);">
              <div class="sport-icon-box">🎯</div>
              <h3>Personal Mentorship</h3>
              <p>Dedicated 1-on-1 coaching sessions, customized performance metrics, and individual nutrition planners.</p>
              <a href="#/programs/personal" class="btn btn-secondary" style="margin-top:20px; padding:8px 20px; font-size:0.85rem;">Learn Details</a>
            </div>

          </div>
        </div>
      </section>

      <!-- Success Testimonials Carousel (Reliance Style) -->
      <section class="section-padding">
        <div class="container">
          <div class="section-title-wrapper">
            <h2>Success Stories</h2>
            <p class="section-subtitle">Real words from our athletes representing regional and national teams.</p>
          </div>
          
          <div class="testimonials-wrapper">
            ${successStories.map((story, idx) => `
              <div class="testimonial-slide ${idx === 0 ? 'active' : ''}" id="testimonial-${idx}">
                <p class="testimonial-quote">"${story.quote}"</p>
                <div class="testimonial-author">
                  <div class="testimonial-avatar">${story.name.charAt(0)}</div>
                  <span class="testimonial-name">${story.name}</span>
                  <span class="testimonial-role">${story.sport} &bull; ${story.achievement}</span>
                </div>
              </div>
            `).join('')}

            <div class="testimonial-dots">
              ${successStories.map((_, idx) => `
                <span class="dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>
              `).join('')}
            </div>
          </div>

        </div>
      </section>

    </div>
  `;

  // Start Slider Logic
  initHeroSlider();
  initStatsCounter();
  initTestimonialCarousel();
}

function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  };

  // Set automatic transition interval
  window.heroSliderInterval = setInterval(nextSlide, 5000);

  // Controls
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(window.heroSliderInterval);
      prevSlide();
      window.heroSliderInterval = setInterval(nextSlide, 5000);
    });

    nextBtn.addEventListener('click', () => {
      clearInterval(window.heroSliderInterval);
      nextSlide();
      window.heroSliderInterval = setInterval(nextSlide, 5000);
    });
  }
}

function initStatsCounter() {
  const counters = document.querySelectorAll('.counter-num');

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 1200; // Total count up milliseconds
    const increment = target / (duration / 15);

    let count = 0;
    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = Math.ceil(count) + "+";
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target + "+";
      }
    };
    updateCount();
  });
}

function initTestimonialCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = +dot.getAttribute('data-index');

      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      document.getElementById(`testimonial-${index}`).classList.add('active');
      dot.classList.add('active');
    });
  });
}

// ----------------------------------------------------
// VIEW RENDERING: 👤 ABOUT US
// ----------------------------------------------------
function renderAbout(app, sub) {
  let contentHtml = '';

  if (sub === 'story') {
    contentHtml = `
      <div class="section-title-wrapper">
        <h2>Our Story</h2>
        <p class="section-subtitle">How we started as a small grassroots coaching academy and expanded into the region's elite sports school.</p>
      </div>
      
      <div class="timeline">
        
        <div class="timeline-item left-item">
          <div class="timeline-content">
            <div class="timeline-year">2012</div>
            <h3>Inception & Foundation</h3>
            <p>Ranilaxmibai Sports Academy was launched with a single sand pitch, a 25-meter pool, and 40 students with a goal to deliver high-quality grassroots sports coaching.</p>
          </div>
        </div>
        
        <div class="timeline-item right-item">
          <div class="timeline-content">
            <div class="timeline-year">2015</div>
            <h3>First Regional Championship</h3>
            <p>Our Under-14 Football team won the Gujarat State Youth League, prompting the board to expand our coaching formats and add table tennis and lawn tennis disciplines.</p>
          </div>
        </div>
        
        <div class="timeline-item left-item">
          <div class="timeline-content">
            <div class="timeline-year">2018</div>
            <h3>Olympic Complex Launch</h3>
            <p>Inauguration of our fully equipped indoor sports arena, temperature-controlled swimming pool, and biomechanical video-feedback performance systems.</p>
          </div>
        </div>
        
        <div class="timeline-item right-item">
          <div class="timeline-content">
            <div class="timeline-year">2022</div>
            <h3>SAI & ISO Accreditations</h3>
            <p>Ranilaxmibai was officially certified under ISO 9001 and selected as a regional partner of the Sports Authority of India (SAI), creating scholarship pipelines.</p>
          </div>
        </div>

        <div class="timeline-item left-item">
          <div class="timeline-content">
            <div class="timeline-year">2026</div>
            <h3>Scaling the Vision</h3>
            <p>Currently coaching 1200+ students. Launching our second advanced campus in Vadodara to empower athletes across the state.</p>
          </div>
        </div>

      </div>
    `;
  } else if (sub === 'vision-mission') {
    contentHtml = `
      <div class="section-title-wrapper">
        <h2>Vision & Mission</h2>
        <p class="section-subtitle">Our guiding philosophies that drive student development and leadership styles.</p>
      </div>
      
      <div class="vision-grid">
        <div class="vision-card">
          <h3><i class="ph ph-eye" style="color: var(--color-primary); font-size:1.75rem;"></i> Our Vision</h3>
          <p>To establish Ranilaxmibai Sports Academy as the gold standard of athletic development in India. We aim to inspire a healthy, active generation while discovering and elevating talented individuals to compete on global platforms.</p>
        </div>
        
        <div class="vision-card mission">
          <h3><i class="ph ph-target" style="color: var(--color-accent); font-size:1.75rem;"></i> Our Mission</h3>
          <p>To deliver modern athletic training programs, scientifically optimized schedules, and specialized dietary guidelines. We commit to cultivating critical life-skills like self-discipline, resilience, sportsmanship, and mental focus in young individuals.</p>
        </div>
      </div>

      <div class="section-padding text-center">
        <h3 style="margin-bottom:30px;">Our Core Values</h3>
        <div class="features-grid">
          <div class="feature-card">
            <h4>🏆 Excellence</h4>
            <p>Constantly pushing technical limits to refine stroke, positioning, speed, and endurance.</p>
          </div>
          <div class="feature-card">
            <h4>🤝 Integrity</h4>
            <p>Fair play, respect for opponents, and honesty under pressure are non-negotiable principles.</p>
          </div>
          <div class="feature-card">
            <h4>⚡ Dedication</h4>
            <p>Understanding that physical gains and gold medals are outputs of steady daily discipline.</p>
          </div>
        </div>
      </div>
    `;
  } else if (sub === 'facilities') {
    contentHtml = `
      <div class="section-title-wrapper">
        <h2>Our Facilities</h2>
        <p class="section-subtitle">World-class playing grounds and modern athletic labs engineered for safety and top performance.</p>
      </div>
      
      <div class="facilities-grid">
        <div class="facility-card">
          <div class="facility-img-placeholder">
            ${getSportSVG('football', '#004D4D', '#1A1A1A')}
            <span class="facility-img-overlay">FIFA Quality</span>
          </div>
          <div class="facility-info">
            <h3>Elite Synthetic Football Turf</h3>
            <p>Full-size pitch featuring shock-absorption turf technology to reduce knee stress, equipped with high-intensity night matches spotlights.</p>
          </div>
        </div>

        <div class="facility-card">
          <div class="facility-img-placeholder">
            ${getSportSVG('swimming', '#002B36', '#1E3A8A')}
            <span class="facility-img-overlay">25 &deg;C Heated</span>
          </div>
          <div class="facility-info">
            <h3>Olympic Swimming Arena</h3>
            <p>10-lane temperature-controlled pool with advanced underwater camera ports for video analysis and dedicated physical recovery steam room.</p>
          </div>
        </div>

        <div class="facility-card">
          <div class="facility-img-placeholder">
            ${getSportSVG('basketball', '#854D0E', '#1A1A1A')}
            <span class="facility-img-overlay">Indoor Wood</span>
          </div>
          <div class="facility-info">
            <h3>Indoor Multi-Sport Arena</h3>
            <p>Premium wooden flooring basketball and badminton courts designed with optimal bounce metrics, fully air-conditioned with 1,000 spectators seating.</p>
          </div>
        </div>

        <div class="facility-card">
          <div class="facility-img-placeholder">
            ${getSportSVG('cricket', '#003C3C', '#854D0E')}
            <span class="facility-img-overlay">Auto nets</span>
          </div>
          <div class="facility-info">
            <h3>Cricket Lanes & Bowling Sims</h3>
            <p>Four turf and synthetic cricket pitches equipped with automated bowling machines and speed cameras tracking bowling rotations.</p>
          </div>
        </div>

        <div class="facility-card">
          <div class="facility-img-placeholder">
            ${getSportSVG('tennis', '#EA580C', '#1A1A1A')}
            <span class="facility-img-overlay">Clay Courts</span>
          </div>
          <div class="facility-info">
            <h3>Hard & Clay Tennis Courts</h3>
            <p>6 international-standard courts mapping tournament dimensions, featuring specialized high-grip surfaces and automatic ball launchers.</p>
          </div>
        </div>

        <div class="facility-card">
          <div class="facility-img-placeholder">
            ${getSportSVG('athletics', '#111827', '#005A5A')}
            <span class="facility-img-overlay">ISO Certified</span>
          </div>
          <div class="facility-info">
            <h3>Strength & Bio-Performance Lab</h3>
            <p>Modern conditioning gym containing high-twitch muscle builders, dynamic run track grids, and medical body fat mapping machinery.</p>
          </div>
        </div>
      </div>
    `;
  } else if (sub === 'achievements') {
    contentHtml = `
      <div class="section-title-wrapper">
        <h2>Academy Achievements</h2>
        <p class="section-subtitle">Our record speaks for itself. Decades of hard work mapped in sports metrics.</p>
      </div>
      
      <div class="achievements-grid">
        <div class="achievement-card">
          <div class="achievement-badge">🏆</div>
          <div class="achievement-number">240+</div>
          <p>Tournament Medals</p>
        </div>
        <div class="achievement-card">
          <div class="achievement-badge">🇮🇳</div>
          <div class="achievement-number">15+</div>
          <p>National Selections</p>
        </div>
        <div class="achievement-card">
          <div class="achievement-badge">🏅</div>
          <div class="achievement-number">120+</div>
          <p>State-level Golds</p>
        </div>
        <div class="achievement-card">
          <div class="achievement-badge">📜</div>
          <div class="achievement-number">4+</div>
          <p>Affiliations</p>
        </div>
      </div>

      <div class="section-padding bg-light" style="border-radius: var(--border-radius); margin-top: 50px; padding: 40px;">
        <h3 class="text-center" style="margin-bottom:20px;">Accolades & Milestones</h3>
        <ul style="list-style-type: square; padding-left: 20px; line-height: 2;">
          <li>Selected as the <strong>Best Youth Sports Academy</strong> in the Western Region Sports Meet (2024).</li>
          <li>Our swimming alumni represented the national squad at the Asian Junior Swimming Meet.</li>
          <li>Trained 3 junior players who got signed by national professional Football squads in ISL.</li>
          <li>Organized and hosted the annual Inter-Academy Tennis League with 350+ entries.</li>
        </ul>
      </div>
    `;
  }

  app.innerHTML = `
    <section class="section-padding container animate-fade-in">
      ${contentHtml}
    </section>
  `;
}

// ----------------------------------------------------
// VIEW RENDERING: 🏅 SPORTS PROGRAMS
// ----------------------------------------------------
function renderPrograms(app, sub) {
  if (sub === 'all') {
    app.innerHTML = `
      <section class="section-padding container animate-fade-in">
        <div class="section-title-wrapper">
          <h2>Sports Programs Catalog</h2>
          <p class="section-subtitle">We offer customized training schedules for multiple sports discipline levels.</p>
        </div>
        
        <!-- Interactive Category Filters -->
        <div class="filter-tabs">
          <button class="filter-btn active" data-category="all">All Sports</button>
          <button class="filter-btn" data-category="Team Sports">Team Sports</button>
          <button class="filter-btn" data-category="Racket Sports">Racket Sports</button>
          <button class="filter-btn" data-category="Individual Sports">Individual / Athletics</button>
          <button class="filter-btn" data-category="Aquatic Sports">Aquatics</button>
        </div>

        <div class="sports-grid" id="sports-grid-container">
          ${sportsList.map(sport => `
            <div class="sport-card" data-category="${sport.category}">
              <div class="sport-icon-box">${sport.icon}</div>
              <span class="sport-age-tag">${sport.age}</span>
              <h3>${sport.name}</h3>
              <p style="font-size:0.75rem; font-weight:700; color:var(--color-accent); text-transform:uppercase; margin-bottom:8px;">${sport.category}</p>
              <p>${sport.description}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    // Wire up filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sportsCards = document.querySelectorAll('.sport-card');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active tab
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-category');

        sportsCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (cat === 'all' || cardCat === cat) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 50);
          } else {
            card.style.opacity = '0';
            card.style.display = 'none';
          }
        });
      });
    });

  } else {
    // Show specific detail program
    const prog = programsData[sub];
    if (!prog) {
      renderHome(app);
      return;
    }

    app.innerHTML = `
      <section class="section-padding container animate-fade-in">
        <div class="program-detail-layout">
          
          <div class="program-main-info">
            <span class="hero-tagline" style="color:var(--color-accent);">${prog.subtitle}</span>
            <h2>${prog.title}</h2>
            <p style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 25px;">${prog.description}</p>
            
            <h3>What this Program Delivers</h3>
            <ul class="program-benefits-list">
              ${prog.benefits.map(b => `<li>${b}</li>`).join('')}
            </ul>

            <h3 style="margin-top: 30px;">Assessment & Progress</h3>
            <p>Every athlete enrolled in this module undergoes standard biomechanical and fitness assessment tests at the end of each cycle. Digital feedback dashboards are shared with parents along with specific technical drill suggestions.</p>
          </div>

          <div class="program-sidebar">
            <div class="facility-img-placeholder" style="height:150px; border-radius: var(--border-radius-sm); overflow:hidden; margin-bottom:20px;">
              ${getSportSVG(sub, '#E0BC66', '#002D2D')}
            </div>
            <h3>Batch Details</h3>
            
            <div class="sidebar-info-block">
              <span>Class Timings</span>
              <p>${prog.schedule}</p>
            </div>

            <div class="sidebar-info-block">
              <span>Program Fees</span>
              <p style="font-size:1.6rem; color:var(--color-accent); font-weight:800;">${prog.pricing}</p>
            </div>

            <div class="sidebar-info-block">
              <span>Ratio</span>
              <p>Certified Head Coach with Max 10 Students</p>
            </div>

            <a href="#/events/registration?program=${sub}" class="btn btn-accent" style="width: 100%; margin-top:20px;">BOOK A SEAT NOW</a>
          </div>

        </div>
      </section>
    `;
  }
}

// ----------------------------------------------------
// VIEW RENDERING: 🏫 ACADEMY
// ----------------------------------------------------
function renderAcademy(app, sub) {
  let contentHtml = '';

  if (sub === 'coaches') {
    contentHtml = `
      <div class="section-title-wrapper">
        <h2>Our Coaching Roster</h2>
        <p class="section-subtitle">Learn from international certified coaches, former athletes, and physical instructors.</p>
      </div>
      
      <div class="coaches-grid">
        ${coachesList.map(coach => `
          <div class="coach-card">
            <div class="coach-avatar-wrapper">
              <span class="coach-experience">${coach.experience}</span>
              <span style="font-size:4rem;">${coach.avatar}</span>
            </div>
            <div class="coach-details">
              <h3>${coach.name}</h3>
              <p class="coach-role">${coach.role}</p>
              <p class="coach-spec">${coach.specialization}</p>
              <p>${coach.bio}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (sub === 'success-stories') {
    contentHtml = `
      <div class="section-title-wrapper">
        <h2>Success Stories & Alumni</h2>
        <p class="section-subtitle">See how our sports coaching methodology transformed young prospects into professional athletes.</p>
      </div>
      
      <div class="testimonials-wrapper" style="max-width:900px; display:flex; flex-direction:column; gap:40px;">
        ${successStories.map(story => `
          <div class="feature-card" style="display:flex; gap:25px; align-items:center; border-left:5px solid var(--color-accent); text-align:left; flex-direction:row; flex-wrap:wrap;">
            <div class="testimonial-avatar" style="width:70px; height:70px; font-size:2rem;">${story.name.charAt(0)}</div>
            <div style="flex:1; min-width:250px;">
              <h3 style="margin-bottom:6px;">${story.name}</h3>
              <p style="font-size:0.75rem; font-weight:700; color:var(--color-primary); text-transform:uppercase; margin-bottom:12px;">${story.sport} &bull; ${story.achievement}</p>
              <p style="font-style:italic; font-size:1rem; color:var(--color-text);">"${story.quote}"</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (sub === 'certifications') {
    contentHtml = `
      <div class="section-title-wrapper">
        <h2>Affiliations & Certifications</h2>
        <p class="section-subtitle">We align our methods and safety guidelines with top athletic regulatory authorities.</p>
      </div>
      
      <div class="certifications-list">
        ${certificationsList.map(cert => `
          <div class="cert-card">
            <div class="cert-icon">${cert.badge}</div>
            <div class="cert-details">
              <h3>${cert.title}</h3>
              <p class="cert-authority">${cert.authority}</p>
              <p>${cert.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (sub === 'faqs') {
    contentHtml = `
      <div class="section-title-wrapper">
        <h2>Academy FAQs</h2>
        <p class="section-subtitle">Find fast answers regarding program timings, certifications, batches, and safety methods.</p>
      </div>
      
      <div class="faq-accordion">
        ${faqsList.map((faq, idx) => `
          <div class="faq-item" id="faq-${idx}">
            <button class="faq-header" data-index="${idx}">
              <span>${faq.question}</span>
              <i class="ph ph-caret-down"></i>
            </button>
            <div class="faq-content">
              <div class="faq-body">
                <p>${faq.answer}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  app.innerHTML = `
    <section class="section-padding container animate-fade-in">
      ${contentHtml}
    </section>
  `;

  if (sub === 'faqs') {
    initFaqAccordion();
  }
}

function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const idx = header.getAttribute('data-index');
      const faqItem = document.getElementById(`faq-${idx}`);
      const content = faqItem.querySelector('.faq-content');

      // Close other active accordions
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-content').style.maxHeight = '0';
        }
      });

      const isActive = faqItem.classList.contains('active');
      faqItem.classList.toggle('active', !isActive);

      if (!isActive) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = "0";
      }
    });
  });
}

// ----------------------------------------------------
// VIEW RENDERING: 🖼️ GALLERY
// ----------------------------------------------------
function renderGallery(app, activeTag) {
  // Mapping filter tabs
  const categories = {
    photos: "Photos Only",
    videos: "Videos Only",
    tournament: "Tournament Highlights",
    events: "Academy Events",
    "student-achievements": "Student Achievements",
    tour: "Facilities Tour",
    media: "Media Coverage"
  };

  // Filter list
  const filteredItems = galleryItems.filter(item => {
    if (activeTag === 'photos') return item.mediaType === 'photo';
    if (activeTag === 'videos') return item.mediaType === 'video';
    return item.category === activeTag;
  });

  app.innerHTML = `
    <section class="section-padding container animate-fade-in">
      <div class="section-title-wrapper">
        <h2>Academy Media Gallery</h2>
        <p class="section-subtitle">Visual highlights of tournament wins, event launches, and daily training drills.</p>
      </div>

      <!-- Category Filter Tabs -->
      <div class="filter-tabs">
        ${Object.entries(categories).map(([slug, name]) => `
          <a href="#/gallery/${slug}" class="filter-btn ${activeTag === slug ? 'active' : ''}">${name}</a>
        `).join('')}
      </div>

      <!-- Gallery Grid -->
      <div class="gallery-grid">
        ${filteredItems.map(item => `
          <div class="gallery-card" data-id="${item.id}">
            <div class="gallery-card-img" style="width:100%; height:100%; position:absolute;">
              ${getSportSVG(item.src.includes('football') ? 'football' : (item.src.includes('basketball') ? 'basketball' : (item.src.includes('swim') ? 'swimming' : (item.src.includes('tennis') ? 'tennis' : 'beginner'))), '#003C3C', '#E0BC66')}
            </div>
            
            ${item.mediaType === 'video' ? `
              <div class="video-play-indicator">
                <i class="ph ph-play-fill"></i>
              </div>
            ` : ''}
            
            <div class="gallery-card-overlay">
              <span class="gallery-tag">${item.mediaType}</span>
              <h4>${item.title}</h4>
            </div>
          </div>
        `).join('')}
      </div>

      ${filteredItems.length === 0 ? `
        <div style="text-align:center; padding: 40px; color:var(--color-text-light);">
          <p>No gallery files found in this category.</p>
        </div>
      ` : ''}

      <!-- Lightbox Modal -->
      <div class="lightbox" id="gallery-lightbox">
        <div class="lightbox-content">
          <button class="lightbox-close" id="lightbox-close-btn">&times;</button>
          <div id="lightbox-media-container" style="display:flex; justify-content:center; align-items:center;"></div>
          <h4 class="lightbox-title" id="lightbox-title-text"></h4>
        </div>
      </div>

    </section>
  `;

  // Wire Lightbox triggers
  initLightbox(filteredItems);
}

function initLightbox(items) {
  const cards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('gallery-lightbox');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const mediaContainer = document.getElementById('lightbox-media-container');
  const titleText = document.getElementById('lightbox-title-text');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = +card.getAttribute('data-id');
      const item = items.find(i => i.id === id);
      if (!item) return;

      mediaContainer.innerHTML = '';

      if (item.mediaType === 'video') {
        // Video Mockup Player
        mediaContainer.innerHTML = `
          <div style="width:600px; max-width:100%; aspect-ratio:16/9; background:#000; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#FFF; padding:20px; text-align:center;">
            <i class="ph ph-video-camera" style="font-size:3rem; color:var(--color-accent); margin-bottom:15px;"></i>
            <h3>Playing High-Definition Video Clip</h3>
            <p style="font-size:0.8rem; color:#888; margin-top:8px;">Biomechanical flow analysis simulator is active.</p>
            <div style="width:80%; height:4px; background:#222; border-radius:2px; margin-top:20px; overflow:hidden; position:relative;">
              <div style="position:absolute; width:45%; height:100%; background:var(--color-accent); animation: progressLoop 3s infinite linear;"></div>
            </div>
          </div>
          <style>
            @keyframes progressLoop { 0% { left: -45%; } 100% { left: 100%; } }
          </style>
        `;
      } else {
        // Image Mockup
        mediaContainer.innerHTML = `
          <div style="width:600px; max-width:100%; aspect-ratio:16/10; border-radius:8px; overflow:hidden; border:2px solid var(--color-accent);">
            ${getSportSVG(item.src.includes('football') ? 'football' : (item.src.includes('basketball') ? 'basketball' : (item.src.includes('swim') ? 'swimming' : 'tennis')), '#002222', '#005A5A')}
          </div>
        `;
      }

      titleText.innerText = item.title;
      lightbox.classList.add('open');
    });
  });

  const close = () => lightbox.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
}

// ----------------------------------------------------
// VIEW RENDERING: 📅 EVENTS
// ----------------------------------------------------
function renderEvents(app, sub) {
  if (sub === 'registration') {
    // Render ticket form
    app.innerHTML = `
      <section class="section-padding container animate-fade-in">
        <div class="section-title-wrapper">
          <h2>Event & Camp Registration</h2>
          <p class="section-subtitle">Confirm your slot for upcoming tournaments, workshops, or training cycles.</p>
        </div>
        
        <div id="form-render-box">
          <div class="registration-container">
            <form id="event-reg-form">
              
              <div class="form-group">
                <label for="reg-name">Athlete Full Name</label>
                <input type="text" id="reg-name" placeholder="E.g. Rohan Shah" required>
              </div>

              <div class="form-group">
                <label for="reg-age">Athlete Age</label>
                <input type="number" id="reg-age" placeholder="E.g. 14" min="5" max="25" required>
              </div>

              <div class="form-group">
                <label for="reg-email">Parent/Guardian Email</label>
                <input type="email" id="reg-email" placeholder="guardian@email.com" required>
              </div>

              <div class="form-group">
                <label for="reg-phone">Parent Phone Number</label>
                <input type="tel" id="reg-phone" placeholder="10 Digit Mobile Number" pattern="[0-9]{10}" required>
              </div>

              <div class="form-group">
                <label for="reg-event">Select Program / Event</label>
                <select id="reg-event" required>
                  <option value="" disabled selected>Choose from list...</option>
                  <optgroup label="Weekly Coaching Programs">
                    <option value="prog-beginner">Beginner Sports Program</option>
                    <option value="prog-advanced">Advanced Performance Program</option>
                    <option value="prog-personal">1-on-1 Personal Mentorship</option>
                  </optgroup>
                  <optgroup label="Upcoming Camps & Events">
                    ${eventsList.map(evt => `<option value="${evt.id}">${evt.title}</option>`).join('')}
                  </optgroup>
                </select>
              </div>

              <div class="form-group">
                <label for="reg-notes">Special Medical/Coaching Instructions</label>
                <textarea id="reg-notes" rows="3" placeholder="E.g. allergies, previous sports training, or health concerns..."></textarea>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">SUBMIT REGISTRATION</button>

            </form>
          </div>
        </div>
      </section>
    `;

    // Auto-select program if query parameter exists
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const progId = urlParams.get('program');
    if (progId) {
      const select = document.getElementById('reg-event');
      if (select) {
        select.value = `prog-${progId}`;
      }
    }

    initRegistrationForm();

  } else {
    // Show events list based on categories
    // categories: tournaments, camps, workshops, upcoming
    let filteredEvents = eventsList;
    let pageTitle = "Upcoming Sports Events";

    if (sub === 'tournaments') {
      filteredEvents = eventsList.filter(e => e.category === 'tournaments');
      pageTitle = "Ranilaxmibai Tournaments Schedule";
    } else if (sub === 'camps') {
      filteredEvents = eventsList.filter(e => e.category === 'summer-winter-camps');
      pageTitle = "Summer & Winter Camps";
    } else if (sub === 'workshops') {
      filteredEvents = eventsList.filter(e => e.category === 'workshops-clinics');
      pageTitle = "Specialized Workshops & Clinics";
    }

    app.innerHTML = `
      <section class="section-padding container animate-fade-in">
        <div class="section-title-wrapper">
          <h2>${pageTitle}</h2>
          <p class="section-subtitle">Participate in tournaments, get certified, and join clinics.</p>
        </div>

        <div class="events-list-wrapper">
          ${filteredEvents.map(evt => {
      const dateObj = new Date(evt.date);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('en-US', { month: 'short' });

      return `
              <div class="event-list-card">
                <div class="event-date-badge">
                  <span class="event-date-day">${day}</span>
                  <span class="event-date-month">${month}</span>
                </div>
                <div class="event-details">
                  <span class="gallery-tag" style="background-color: ${evt.status === 'open' ? 'var(--color-success)' : 'var(--color-primary)'}; color:#FFF; margin-bottom:8px;">
                    ${evt.status === 'open' ? 'REGISTRATION OPEN' : 'UPCOMING'}
                  </span>
                  <h3>${evt.title}</h3>
                  <div class="event-meta">
                    <span><i class="ph ph-clock"></i> ${evt.time}</span>
                    <span><i class="ph ph-map-pin"></i> ${evt.venue}</span>
                  </div>
                  <p>${evt.description}</p>
                </div>
                <div class="event-actions">
                  ${evt.status === 'open' ? `
                    <a href="#/events/registration" class="btn btn-primary">Register</a>
                  ` : `
                    <button class="btn btn-secondary" disabled style="opacity:0.6; cursor:not-allowed;">Closed</button>
                  `}
                </div>
              </div>
            `;
    }).join('')}

          ${filteredEvents.length === 0 ? `
            <div style="text-align:center; padding: 40px; color:var(--color-text-light);">
              <p>No active events matching this criteria at this time.</p>
            </div>
          ` : ''}
        </div>
      </section>
    `;
  }
}

function initRegistrationForm() {
  const form = document.getElementById('event-reg-form');
  const container = document.getElementById('form-render-box');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('reg-name').value;
      const age = document.getElementById('reg-age').value;
      const email = document.getElementById('reg-email').value;
      const phone = document.getElementById('reg-phone').value;
      const eventSel = document.getElementById('reg-event');
      const eventName = eventSel.options[eventSel.selectedIndex].text;

      const ticketNum = "RLB-" + Math.floor(100000 + Math.random() * 900000);

      // Dynamic Render Ticket receipt
      container.innerHTML = `
        <div class="registration-receipt animate-fade-in">
          <div class="receipt-header">
            <div class="receipt-logo">RANILAXMIBAI SPORTS ACADEMY</div>
            <span class="receipt-status"><i class="ph ph-check-circle"></i> Slot Confirmed</span>
            <p style="font-size:0.8rem; color:var(--color-text-light); margin-top:8px;">Booking Code: <strong>${ticketNum}</strong></p>
          </div>
          
          <div class="receipt-grid">
            <div class="receipt-item" style="grid-column: span 2;">
              <span>Selected Event / Program</span>
              <p>${eventName}</p>
            </div>
            <div class="receipt-item">
              <span>Athlete Name</span>
              <p>${name} (Age ${age})</p>
            </div>
            <div class="receipt-item">
              <span>Primary Phone</span>
              <p>${phone}</p>
            </div>
            <div class="receipt-item">
              <span>Guardian Email</span>
              <p>${email}</p>
            </div>
            <div class="receipt-item">
              <span>Gate Entry Venue</span>
              <p>Ranilaxmibai Main Complex, Vadodara</p>
            </div>
          </div>
          
          <div style="border-top:1px dashed var(--color-border); margin: 25px 0; padding-top:20px; text-align:center;">
            <!-- Simple SVG mockup of a QR Code barcode -->
            <svg width="120" height="120" style="margin: 0 auto; display:block;">
              <rect width="120" height="120" fill="#F4F6F6" />
              <!-- Outer frame -->
              <rect x="10" y="10" width="30" height="30" fill="var(--color-primary)" />
              <rect x="15" y="15" width="20" height="20" fill="#F4F6F6" />
              <rect x="18" y="18" width="14" height="14" fill="var(--color-primary)" />
              
              <rect x="80" y="10" width="30" height="30" fill="var(--color-primary)" />
              <rect x="85" y="15" width="20" height="20" fill="#F4F6F6" />
              <rect x="88" y="18" width="14" height="14" fill="var(--color-primary)" />

              <rect x="10" y="80" width="30" height="30" fill="var(--color-primary)" />
              <rect x="15" y="85" width="20" height="20" fill="#F4F6F6" />
              <rect x="18" y="88" width="14" height="14" fill="var(--color-primary)" />

              <!-- Scattered QR bits -->
              <rect x="50" y="20" width="10" height="10" fill="var(--color-primary)" />
              <rect x="65" y="10" width="10" height="20" fill="var(--color-primary)" />
              <rect x="50" y="45" width="20" height="10" fill="var(--color-primary)" />
              <rect x="80" y="50" width="15" height="15" fill="var(--color-primary)" />
              <rect x="15" y="55" width="20" height="10" fill="var(--color-primary)" />
              <rect x="45" y="70" width="30" height="15" fill="var(--color-primary)" />
              <rect x="85" y="85" width="25" height="25" fill="var(--color-primary)" />
              <rect x="90" y="90" width="15" height="15" fill="#F4F6F6" />
            </svg>
            <p style="font-size:0.75rem; color:var(--color-text-light); margin-top:8px;">Present this digital ticket at reception to complete fees structure and kit sizing.</p>
          </div>

          <div style="display:flex; gap:15px; justify-content:center;">
            <button class="btn btn-primary" onclick="window.print()">Print Ticket</button>
            <a href="#/events/upcoming" class="btn btn-secondary">Back to Events</a>
          </div>
        </div>
      `;
    });
  }
}

// ----------------------------------------------------
// VIEW RENDERING: 📝 BLOG
// ----------------------------------------------------
function renderBlog(app, category) {
  const categories = {
    latest: "Latest Articles",
    training: "Training Tips",
    fitness: "Fitness Tips",
    nutrition: "Nutrition & Diet",
    stories: "Success Stories",
    announcements: "Announcements"
  };

  // Map category tag inside records
  const categoryKeys = {
    training: "training-tips",
    fitness: "fitness-tips",
    nutrition: "nutrition-diet",
    stories: "success-stories",
    announcements: "announcements"
  };

  const dbTag = categoryKeys[category];
  const filteredPosts = dbTag ? blogPosts.filter(p => p.category === dbTag) : blogPosts;

  app.innerHTML = `
    <section class="section-padding container animate-fade-in">
      <div class="section-title-wrapper">
        <h2>Ranilaxmibai Sports Blog</h2>
        <p class="section-subtitle">Sports science analysis, workouts, diet planners, and corporate announcements.</p>
      </div>

      <!-- Categories filters -->
      <div class="filter-tabs">
        ${Object.entries(categories).map(([slug, name]) => `
          <a href="#/blog/${slug}" class="filter-btn ${category === slug ? 'active' : ''}">${name}</a>
        `).join('')}
      </div>

      <!-- Blog post cards grid -->
      <div class="blog-grid">
        ${filteredPosts.map(post => `
          <div class="blog-card">
            <div class="blog-img-box">
              ${getSportSVG('blog', '#003C3C', '#E0BC66')}
            </div>
            <div class="blog-card-body">
              <span class="blog-meta-tag">${post.category.replace('-', ' ')}</span>
              <h3>${post.title}</h3>
              <p>${post.excerpt}</p>
              
              <div class="blog-card-bottom">
                <span>By ${post.author}</span>
                <button class="btn btn-secondary read-blog-trigger" data-id="${post.id}" style="padding: 4px 10px; font-size:0.75rem;">Read More</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      ${filteredPosts.length === 0 ? `
        <div style="text-align:center; padding: 40px; color:var(--color-text-light);">
          <p>No blog posts found in this category.</p>
        </div>
      ` : ''}

      <!-- Detailed Article Modal -->
      <div class="blog-modal" id="blog-modal-overlay">
        <div class="blog-modal-container">
          <button class="blog-modal-close" id="blog-modal-close-btn"><i class="ph ph-x"></i></button>
          <div class="blog-modal-header">
            <span class="blog-meta-tag" id="blog-modal-tag" style="display:inline-block; margin-bottom:8px;"></span>
            <h2 id="blog-modal-title"></h2>
            <div class="blog-modal-meta" style="margin-top:10px;">
              <span id="blog-modal-author"></span>
              <span id="blog-modal-date"></span>
            </div>
          </div>
          <div class="blog-modal-body" id="blog-modal-body-text"></div>
        </div>
      </div>

    </section>
  `;

  initBlogModal();
}

function initBlogModal() {
  const triggers = document.querySelectorAll('.read-blog-trigger');
  const modal = document.getElementById('blog-modal-overlay');
  const closeBtn = document.getElementById('blog-modal-close-btn');

  const title = document.getElementById('blog-modal-title');
  const tag = document.getElementById('blog-modal-tag');
  const author = document.getElementById('blog-modal-author');
  const date = document.getElementById('blog-modal-date');
  const bodyText = document.getElementById('blog-modal-body-text');

  triggers.forEach(trig => {
    trig.addEventListener('click', () => {
      const id = trig.getAttribute('data-id');
      const post = blogPosts.find(p => p.id === id);
      if (!post) return;

      tag.innerText = post.category.replace('-', ' ').toUpperCase();
      title.innerText = post.title;
      author.innerHTML = `<i class="ph ph-user"></i> By ${post.author}`;
      date.innerHTML = `<i class="ph ph-calendar"></i> ${post.date}`;

      bodyText.innerHTML = `
        <p>${post.content}</p>
        <p>Ranilaxmibai Sports Academy encourages all enrolled students and parents to incorporate sports science principles into their daily habits. For personalized training or specific dietary mapping, consult our head coaches or book a session under the Personal Coaching Program.</p>
      `;

      modal.classList.add('open');
    });
  });

  const close = () => modal.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}

// ----------------------------------------------------
// VIEW RENDERING: 📞 CONTACT US
// ----------------------------------------------------
function renderContact(app) {
  app.innerHTML = `
    <section class="section-padding container animate-fade-in">
      <div class="section-title-wrapper">
        <h2>Contact Us</h2>
        <p class="section-subtitle">Reach out to our administration desk for admissions, scholarship programs, or tours.</p>
      </div>

      <div class="contact-layout">
        
        <!-- Info Column -->
        <div class="contact-info-col">
          
          <div class="contact-card-box">
            <div class="contact-card-icon"><i class="ph ph-map-pin"></i></div>
            <div class="contact-card-detail">
              <h3>Academy Address</h3>
              <p>Ranilaxmibai Sports Complex, Vasna-Bhayli Road, Vadodara, Gujarat - 390021</p>
            </div>
          </div>

          <div class="contact-card-box">
            <div class="contact-card-icon"><i class="ph ph-phone"></i></div>
            <div class="contact-card-detail">
              <h3>Phone Enquiries</h3>
              <p>+91 98765 43210 (Admissions)<br>+91 98765 43211 (Academy Office)</p>
            </div>
          </div>

          <div class="contact-card-box">
            <div class="contact-card-icon"><i class="ph ph-envelope"></i></div>
            <div class="contact-card-detail">
              <h3>Email Support</h3>
              <p>admissions@rlbsports.in &bull; contact@rlbsports.in</p>
            </div>
          </div>

          <!-- Interactive vector map overlaying placeholder -->
          <div class="map-mockup">
            <!-- Simulated street background -->
            <svg class="map-svg-bg" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="250" fill="#E2ECEC" />
              <!-- Roads -->
              <path d="M 0 50 L 400 50" stroke="#FFF" stroke-width="12" />
              <path d="M 0 180 L 400 180" stroke="#FFF" stroke-width="16" />
              <path d="M 120 0 L 120 250" stroke="#FFF" stroke-width="14" />
              <path d="M 300 0 L 300 250" stroke="#FFF" stroke-width="10" />
              <!-- Green Parks -->
              <rect x="10" y="70" width="90" height="90" rx="8" fill="#CDE5D8" />
              <rect x="320" y="80" width="60" height="80" rx="8" fill="#CDE5D8" />
              <!-- River outline -->
              <path d="M 0 240 Q 200 210 400 235" stroke="#BFD3E6" stroke-width="20" fill="none" />
            </svg>
            <div class="map-badge">
              <i class="ph ph-map-pin-fill" style="color:var(--color-accent); font-size:1.25rem;"></i>
              <span>RANILAXMIBAI SPORTS CAMPUS</span>
            </div>
          </div>

        </div>

        <!-- Form Column -->
        <div id="contact-form-container" style="background-color: var(--color-white); padding: 40px; border-radius: var(--border-radius); border: 1px solid var(--color-border); box-shadow: var(--shadow-md);">
          <h3 style="margin-bottom: 25px;">Send a Message</h3>
          <form id="academy-contact-form">
            
            <div class="form-group">
              <label for="contact-name">Your Full Name</label>
              <input type="text" id="contact-name" placeholder="E.g. Karan Patel" required>
            </div>

            <div class="form-group">
              <label for="contact-email">Email Address</label>
              <input type="email" id="contact-email" placeholder="karan@email.com" required>
            </div>

            <div class="form-group">
              <label for="contact-subject">Inquiry Subject</label>
              <select id="contact-subject" required>
                <option value="" disabled selected>Select concern...</option>
                <option value="admissions">Student Admissions & Timings</option>
                <option value="scholarships">Scholarships & Grants</option>
                <option value="rentals">Facility / Ground Rentals</option>
                <option value="careers">Coaching Careers</option>
              </select>
            </div>

            <div class="form-group">
              <label for="contact-msg">Message Content</label>
              <textarea id="contact-msg" rows="5" placeholder="Describe your request in detail..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%;">SEND MESSAGE</button>

          </form>
        </div>

      </div>
    </section>
  `;

  initContactForm();
}

function initContactForm() {
  const form = document.getElementById('academy-contact-form');
  const container = document.getElementById('contact-form-container');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<div class="spinner" style="width:20px; height:20px; border-width:2px; border-top-color:#FFF; display:inline-block; vertical-align:middle; margin-right:8px;"></div> Sending...`;

      // Simulate API call success in 1.2s
      setTimeout(() => {
        container.innerHTML = `
          <div class="animate-fade-in text-center" style="padding: 40px 20px;">
            <i class="ph ph-check-circle" style="font-size: 5rem; color: var(--color-success); margin-bottom: 20px; display:block;"></i>
            <h3 style="margin-bottom:10px;">Message Sent Successfully!</h3>
            <p style="color:var(--color-text-light); font-size:0.95rem; margin-bottom:25px;">Thank you for contacting Ranilaxmibai Sports Academy. Our administrative officer will check your inquiry details and get back to you at the email address provided within 24 hours.</p>
            <a href="#/" class="btn btn-primary">Return to Home</a>
          </div>
        `;
      }, 1200);
    });
  }
}

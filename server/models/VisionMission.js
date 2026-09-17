const mongoose = require('mongoose');

const VisionMissionSchema = new mongoose.Schema({
  missionPurpose: { type: String, default: 'Our Purpose' },
  missionTitle: { type: String, default: 'Our Mission' },
  missionDescription: { 
    type: String, 
    default: "RLBSA strives for excellence in sports development by providing access to quality training, guidance, and opportunities. Through our dedication, we aim to inspire young athletes, nurture their potential, and empower them to achieve greatness while transforming lives through sports." 
  },
  missionImage: { type: String, default: '/images/hero2.jpg' },
  missionBtnText: { type: String, default: 'Explore Outreach Program' },
  missionBtnLink: { type: String, default: '#/about/outreach-program' },

  visionFuture: { type: String, default: 'Our Future' },
  visionTitle: { type: String, default: 'Our Vision' },
  visionDescription: { 
    type: String, 
    default: "To envision a world transformed by the power of sports, creating positive change for youth athletes and communities. We strive to provide every aspiring athlete with opportunities to grow, achieve excellence, and contribute to healthier, stronger, and more inclusive communities." 
  },
  visionImage: { type: String, default: '/images/about_rlbsa.jpeg' },
  visionBtnText: { type: String, default: 'Our Operations' },
  visionBtnLink: { type: String, default: '#/about/what-we-do' },

  coreValues: [
    {
      icon: { type: String, default: '🏆' },
      title: { type: String, default: 'Excellence' },
      description: { type: String, default: 'Constantly pushing technical limits to refine stroke, positioning, speed, and endurance.' }
    },
    {
      icon: { type: String, default: '🤝' },
      title: { type: String, default: 'Integrity' },
      description: { type: String, default: 'Fair play, respect for opponents, and honesty under pressure are non-negotiable principles.' }
    },
    {
      icon: { type: String, default: '⚡' },
      title: { type: String, default: 'Dedication' },
      description: { type: String, default: 'Understanding that physical gains and gold medals are outputs of steady daily discipline.' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('VisionMission', VisionMissionSchema);

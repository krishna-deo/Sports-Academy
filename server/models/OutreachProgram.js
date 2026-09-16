const mongoose = require('mongoose');

const OutreachInitiativeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  tag: { type: String, default: '' },
  caption: { type: String, default: '' },
  desc: { type: String, default: '' },
  image: { type: String, default: '' }
});

const OutreachPillarSchema = new mongoose.Schema({
  id: { type: String, required: true },
  icon: { type: String, default: '🎯' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' }
});

const OutreachStatSchema = new mongoose.Schema({
  val: { type: String, default: '' },
  label: { type: String, default: '' }
});

const OutreachProgramSchema = new mongoose.Schema({
  header: {
    title: { type: String, default: 'Outreach Program' },
    subtitle: { type: String, default: 'Taking sports excellence, education, and healthcare guidance directly to underprivileged rural communities across Bihar.' }
  },
  impactStats: [OutreachStatSchema],
  initiatives: [OutreachInitiativeSchema],
  descriptionSection: {
    tagline: { type: String, default: 'Empowering Rural Communities' },
    heading: { type: String, default: 'Transforming Lives Beyond the Boundary Lines' },
    paragraphs: [{ type: String }]
  },
  pillars: [OutreachPillarSchema],
  cta: {
    tagline: { type: String, default: 'JOIN OUR MISSION' },
    heading: { type: String, default: 'Help Us Reach More Rural Athletes in Bihar' },
    description: { type: String, default: 'Partner with RLBSA to sponsor sports kits, fund village camps, or support residential scholarships for promising young athletes.' },
    buttonText: { type: String, default: 'Get In Touch' },
    buttonLink: { type: String, default: '#/contact' }
  }
}, { timestamps: true });

module.exports = mongoose.model('OutreachProgram', OutreachProgramSchema);

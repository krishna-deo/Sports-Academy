import React, { useState } from 'react';
import { Heart, CheckCircle, HandHeart, ShieldCheck } from '@phosphor-icons/react';

export const Donate: React.FC = () => {
  const [amount, setAmount] = useState<string>('1000');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    anonymous: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const donationTiers = [
    { value: '500', label: '₹500', impact: 'Supports basic nutrition & energy supplements for 1 student athlete for a month.' },
    { value: '1000', label: '₹1000', impact: 'Provides primary healthcare checkups & medical kits for 2 athletes.' },
    { value: '2500', label: '₹2500', impact: 'Funds training gear & standard sports equipment kit for a promising young athlete.' },
    { value: '5000', label: '₹5000', impact: 'Covers full sports education and coaching fees for an underprivileged student for one term.' }
  ];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const finalAmount = amount === 'custom' ? customAmount : amount;

  return (
    <section className="py-20 px-5 max-w-[1240px] mx-auto animate-fade-in text-left">
      <div className="text-center max-w-[750px] mx-auto mb-16">
        <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3.5 py-1.5 rounded-full inline-block mb-3.5">
          Support Our Foundation
        </span>
        <h2 className="text-3.5xl md:text-5xl font-extrabold text-primary mb-5 relative inline-block pb-4 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[80px] after:h-[4px] after:bg-accent">
          Empower Dreams & Enable Change
        </h2>
        <p className="text-text-light text-base md:text-lg leading-relaxed mt-2">
          Rani Laxmibai Foundation supports underprivileged talent across sports, education, and health. Your contributions build lives and create future champions.
        </p>
      </div>

      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Information & Impact Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                <HandHeart size={22} className="text-accent" /> Why Donate?
              </h3>
              <p className="text-text-body text-sm leading-relaxed">
                As a foundation dedicated to holistic empowerment, our programs cover:
              </p>
              <ul className="mt-4 flex flex-col gap-3 list-none p-0 text-sm text-text-body">
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Sports Training:</strong> Professional coaching and equipment for young girls.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Education Support:</strong> Scholarships, schooling assistance, and study kits.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Healthcare:</strong> Primary health checkups, nutrition supervision, and hygiene materials.</span>
                </li>
              </ul>
            </div>

            <div className="bg-soft-light p-6 rounded-2xl border border-border-gray">
              <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Our Transparency</h3>
              <p className="text-text-light text-xs leading-relaxed mb-4">
                100% of your donation directly reaches the academy beneficiaries. We publish verified audit logs periodically.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                <ShieldCheck size={18} />
                <span>Secure SSL Encrypted Transactions &bull; 80G Tax Exempt</span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl border border-border-gray shadow-xl text-left">
            <form onSubmit={handleDonate} className="flex flex-col gap-6">
              
              {/* Step 1: Select Amount */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-primary uppercase tracking-wider block">
                  Select Donation Amount (INR)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {donationTiers.map((tier) => (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => {
                        setAmount(tier.value);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                        amount === tier.value
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                          : 'border-border-gray text-text-body hover:bg-soft-light'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-1.5 items-center">
                  <button
                    type="button"
                    onClick={() => setAmount('custom')}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      amount === 'custom'
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                        : 'border-border-gray text-text-body hover:bg-soft-light'
                    }`}
                  >
                    Custom Amount
                  </button>
                  {amount === 'custom' && (
                    <div className="sm:col-span-3">
                      <input
                        required
                        type="number"
                        min="100"
                        placeholder="Enter custom amount (Min. ₹100)"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full py-2.5 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white font-bold transition-all"
                      />
                    </div>
                  )}
                </div>

                {amount !== 'custom' && (
                  <div className="mt-2.5 text-xs text-emerald-800 bg-emerald-50/50 border border-emerald-100/50 p-3 rounded-lg italic">
                    <strong>Impact:</strong> {donationTiers.find(t => t.value === amount)?.impact}
                  </div>
                )}
              </div>

              {/* Step 2: Cause Designation */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider">
                  Support Category / Cause
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'general', label: 'General Fund' },
                    { id: 'sports', label: 'Sports Kits' },
                    { id: 'education', label: 'Scholarships' },
                    { id: 'health', label: 'Nutrition' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        category === cat.id
                          ? 'bg-accent/15 border-accent text-primary'
                          : 'border-border-gray text-text-light hover:bg-soft-light'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Donor Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="donor-name" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="donor-name"
                    required={!formData.anonymous}
                    disabled={formData.anonymous}
                    placeholder={formData.anonymous ? 'Anonymous Donor' : 'E.g. Karan Patel'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white transition-all disabled:opacity-60 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="donor-email" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="donor-email"
                    required
                    placeholder="karan@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="donor-phone" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="donor-phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  />
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <input
                    type="checkbox"
                    id="donor-anon"
                    checked={formData.anonymous}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        anonymous: e.target.checked,
                        name: e.target.checked ? '' : formData.name
                      });
                    }}
                    className="w-4 h-4 text-primary focus:ring-primary border-border-gray rounded cursor-pointer"
                  />
                  <label htmlFor="donor-anon" className="text-xs font-bold text-text-body cursor-pointer select-none">
                    Make this donation anonymously
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold py-4 hover:bg-accent hover:text-primary transition-all rounded-xl cursor-pointer mt-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/10 border-none outline-none text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Heart size={18} weight="fill" className="text-accent" />
                    <span>DONATE INR {finalAmount ? `₹${finalAmount}` : ''} NOW</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      ) : (
        /* Thank You Confirmation Receipt */
        <div className="max-w-[600px] mx-auto bg-white p-10 rounded-2xl border border-border-gray shadow-2xl text-center py-12">
          <CheckCircle size={80} className="text-emerald-500 mx-auto mb-6" weight="fill" />
          <h3 className="text-2.5xl font-extrabold text-primary mb-3">Thank You for Your Support!</h3>
          <p className="text-text-light text-[15px] leading-relaxed mb-6">
            Your generous donation of <strong className="text-primary font-extrabold">₹{finalAmount}</strong> towards the <strong className="text-primary capitalize">{category} Fund</strong> was processed successfully. 
          </p>
          <div className="bg-soft-light border border-border-gray p-4 rounded-xl text-xs text-text-light text-left leading-relaxed mb-8 flex flex-col gap-1.5">
            <div><strong>Donor:</strong> {formData.anonymous ? 'Anonymous Donor' : formData.name}</div>
            <div><strong>Transaction Reference:</strong> RLB-DON-{Math.floor(100000 + Math.random() * 900000)}</div>
            <div><strong>Tax Exemption Receipt:</strong> Sent to {formData.email}</div>
          </div>
          <a
            href="#/"
            className="bg-primary text-white font-bold py-3.5 px-8 hover:bg-accent hover:text-primary transition-all rounded-xl inline-block text-sm"
          >
            Back to Homepage
          </a>
        </div>
      )}
    </section>
  );
};

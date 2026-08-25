import React, { useState } from 'react';
import { MapPin, Phone, Envelope, CheckCircle } from '@phosphor-icons/react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsSent(true);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to submit enquiry.");
      }
    } catch (err) {
      alert("Error contacting the backend server. Please make sure the server is running on port 5000.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-5 max-w-[1380px] mx-auto animate-fade-in">
      <div className="text-center max-w-[700px] mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
          Contact Us
        </h2>
        <p className="text-text-light text-base md:text-lg">
          Reach out to our administration desk for admissions, scholarship programs, or tours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Info Column */}
        <div className="flex flex-col gap-6 py-5 text-left">
          
          <div className="flex gap-5 items-center p-6 bg-soft-light border-l-4 border-l-accent rounded-xl">
            <div className="w-[50px] h-[50px] bg-primary text-white rounded-full flex items-center justify-center text-xl shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-primary mb-0.5">Academy Address</h3>
              <p className="text-text-light text-sm">
                Vill- Laxmipur, P.O- Seotapur, P.S- Mairwa, Siwan, 841239, Bihar
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-center p-6 bg-soft-light border-l-4 border-l-accent rounded-xl">
            <div className="w-[50px] h-[50px] bg-primary text-white rounded-full flex items-center justify-center text-xl shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-primary mb-0.5">Phone Enquiries</h3>
              <p className="text-text-light text-sm">
                +91 95239 37934 (Admissions &amp; Office)
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-center p-6 bg-soft-light border-l-4 border-l-accent rounded-xl">
            <div className="w-[50px] h-[50px] bg-primary text-white rounded-full flex items-center justify-center text-xl shrink-0">
              <Envelope size={22} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-primary mb-0.5">Email Support</h3>
              <p className="text-text-light text-sm">
                foundationrlbsa@gmail.com
              </p>
            </div>
          </div>

          {/* Live Google Map embed */}
          <div className="h-[280px] bg-[#E2ECEC] rounded-xl overflow-hidden relative border border-border-gray mt-2.5 shadow-sm">
            <iframe 
              src="https://maps.google.com/maps?q=Rani%20Laxmibai%20Sports%20Academy%20Laxmipur%20Mairwa%20Siwan%20Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rani Laxmibai Sports Academy Location"
            ></iframe>
          </div>

        </div>

        {/* Form Column */}
        <div className="bg-white p-8 md:p-10 rounded-xl border border-border-gray shadow-md text-left self-start">
          {!isSent ? (
            /* Send Message Form */
            <>
              <h3 className="text-xl font-bold text-primary mb-6">Send a Message</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    placeholder="E.g. Karan Patel"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    placeholder="karan@email.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-subject" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Inquiry Subject
                  </label>
                  <select
                    id="contact-subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  >
                    <option value="" disabled>Select concern...</option>
                    <option value="admissions">Student Admissions & Timings</option>
                    <option value="scholarships">Scholarships & Grants</option>
                    <option value="rentals">Facility / Ground Rentals</option>
                    <option value="careers">Coaching Careers</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-msg" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Message Content
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={5}
                    placeholder="Describe your request in detail..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white font-bold py-3.5 hover:bg-accent hover:text-primary transition-all rounded-md cursor-pointer mt-2 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    'SEND MESSAGE'
                  )}
                </button>

              </form>
            </>
          ) : (
            /* Sent Confirmation Receipt */
            <div className="text-center py-10 animate-fade-in">
              <CheckCircle size={80} className="text-emerald-500 mx-auto mb-5" weight="fill" />
              <h3 className="text-xl font-bold text-primary mb-3">Message Sent Successfully!</h3>
              <p className="text-text-light text-[15px] leading-relaxed mb-8">
                Thank you for contacting Ranilaxmibai Sports Academy. Our administrative officer will check your inquiry details and get back to you at the email address provided within 24 hours.
              </p>
              <a
                href="#/"
                className="bg-primary text-white font-bold py-3 px-6 hover:bg-accent hover:text-primary transition-all rounded-md inline-block text-sm"
              >
                Return to Home
              </a>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

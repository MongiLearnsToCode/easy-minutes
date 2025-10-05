import React from 'react';
import ActionButton from '../components/ActionButton';

const ContactPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-slate-800">Get in Touch</h1>
            <p className="mt-4 text-lg text-slate-500">We'd love to hear from you. Please fill out the form below.</p>
          </header>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" id="name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A65]" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" id="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A65]" placeholder="your.email@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <input type="text" id="subject" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A65]" placeholder="How can we help?" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea id="message" rows={6} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-[#FF8A65]" placeholder="Your message..."></textarea>
            </div>
            <div className="text-center">
              <ActionButton type="submit">Send Message</ActionButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

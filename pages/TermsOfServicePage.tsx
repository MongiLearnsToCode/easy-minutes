import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="prose prose-slate max-w-4xl mx-auto">
          <h1>Terms of Service for Easy Minutes</h1>
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <h2>1. Agreement to Terms</h2>
          <p>By using our Easy Minutes application (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.</p>

          <h2>2. The Service</h2>
          <p>Easy Minutes provides a platform for recording, transcribing, and summarizing meetings using artificial intelligence. The service is provided on an "as is" and "as available" basis. We reserve the right to modify or discontinue the service at any time without notice.</p>

          <h2>3. User Accounts</h2>
          <p>You may need to create an account to use some features of the Service. You are responsible for safeguarding your account and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>

          <h2>4. User Content</h2>
          <p>You retain ownership of all content you submit, post, or display on or through the Service (your "Content"), including notes, audio recordings, and generated summaries. By using the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute your Content in any and all media or distribution methods for the purpose of providing and improving the Service.</p>

          <h2>5. Prohibited Conduct</h2>
          <p>You agree not to misuse the Service or help anyone else to do so. For example, you must not even try to do any of the following in connection with the Service:</p>
          <ul>
            <li>Probe, scan, or test the vulnerability of any system or network.</li>
            <li>Breach or otherwise circumvent any security or authentication measures.</li>
            <li>Access, tamper with, or use non-public areas or parts of the Service.</li>
            <li>Submit or transmit any content that is unlawful, harmful, or infringes on the rights of others.</li>
            <li>Interfere with or disrupt any user, host, or network, for example by sending a virus, overloading, flooding, spamming, or mail-bombing any part of the Service.</li>
          </ul>

          <h2>6. Termination</h2>
          <p>We may suspend or terminate your access to the Service at any time, for any reason, including for violating these Terms. Upon termination, your right to use the Service will immediately cease.</p>
          
          <h2>7. Disclaimer of Warranties</h2>
          <p>The Service is provided "as is." We and our suppliers and licensors hereby disclaim all warranties of any kind, express or implied, including, without limitation, the warranties of merchantability, fitness for a particular purpose and non-infringement. We make no warranty that the Service will be error-free or that access thereto will be continuous or uninterrupted.</p>

          <h2>8. Limitation of Liability</h2>
          <p>In no event will we, or our suppliers or licensors, be liable with respect to any subject matter of this agreement under any contract, negligence, strict liability or other legal or equitable theory for: (i) any special, incidental or consequential damages; (ii) the cost of procurement for substitute products or services; (iii) for interruption of use or loss or corruption of data.</p>

          <h2>9. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>

          <h2>10. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us via the contact form on our contact page.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;

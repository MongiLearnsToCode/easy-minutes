import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="prose prose-slate max-w-4xl mx-auto">
          <h1>Privacy Policy for Easy Minutes</h1>
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <h2>1. Introduction</h2>
          <p>Welcome to Easy Minutes. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.</p>

          <h2>2. Collection of Your Information</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Application or when you choose to participate in various activities related to the Application, such as online chat and message boards.</li>
            <li><strong>Meeting Data:</strong> All notes, audio recordings, uploaded files, and generated summaries you create or upload to the service are considered your data. We process this data to provide the service but do not claim ownership of it.</li>
          </ul>

          <h2>3. Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Generate meeting summaries and other AI-powered features.</li>
            <li>Email you regarding your account or order.</li>
            <li>Increase the efficiency and operation of the Application.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
          </ul>

          <h2>4. Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
          <ul>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance. This includes our AI service providers (e.g., Google Gemini) who process your meeting data to generate summaries.</li>
          </ul>

          <h2>5. Security of Your Information</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
          
          <h2>6. Data Retention</h2>
          <p>We will only retain your personal information for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. Meeting data stored locally (e.g., via browser localStorage) is under your control.</p>

          <h2>7. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us via the contact form on our contact page.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

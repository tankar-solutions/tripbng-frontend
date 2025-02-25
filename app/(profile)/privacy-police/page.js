import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">We value the privacy of our customers and are committed to protecting their personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Personal Information:</strong> Name, contact number, email address, and physical address provided during registration or booking.</li>
        <li><strong>Transaction Information:</strong> Booking details and payment information related to transactions on our website.</li>
        <li><strong>Usage Data:</strong> Information about website usage, including pages visited, IP address, and device information.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To provide and personalize our services.</li>
        <li>To communicate with you regarding bookings, updates, and promotions.</li>
        <li>To process transactions and bookings efficiently.</li>
        <li>To improve our website and services based on user feedback.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="mb-4">We have implemented security measures, including firewalls and monitoring systems, to protect your data. Any suspicious activities or transactions are thoroughly investigated to maintain the integrity of our services.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Third-Party Entities</h2>
      <p className="mb-4">Our privacy policy applies only to information collected and processed by our company. It does not cover third-party websites or services beyond our control.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Legal Basis for Data Collection</h2>
      <p className="mb-4">We collect personal information to provide our services and fulfill legal obligations. This includes processing bookings, confirming reservations, and keeping you informed of transaction status.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Reviews and Feedback</h2>
      <p className="mb-4">We welcome your feedback and reviews. If you have any concerns or comments regarding our privacy policy or services, please contact us via email.</p>
    </div>
  );
};

export default PrivacyPolicy;

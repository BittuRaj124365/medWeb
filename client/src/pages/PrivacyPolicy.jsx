import React from 'react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Your privacy is critically important to us. At MedWeb, we have a few fundamental principles about how we protect and process your data.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last Updated: October 2026</p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-12">

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect information to provide better services to all our users. The information MedWeb collects, and how that information is used, depends on how you use our services.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4 mt-6">
              {[
                'Name and contact information',
                'Account credentials',
                'Transaction and purchase history',
                'Feedback left on medicines',
                'Device and usage information'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-gray-100" />

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How We Use Information</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the information we collect from all our services to provide, maintain, protect, and improve them, to develop new ones, and to protect MedWeb and our users.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-6">
              <h3 className="font-bold text-primary mb-2">We never sell your personal data.</h3>
              <p className="text-sm text-gray-600">
                We do not sell your personal information to third parties. We only share it with trusted partners who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of administrative persons who have special access rights to such systems, and are required to keep the information confidential. We use encryption (HTTPS) to protect sensitive information transmitted online.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have an account with us, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
            </p>
          </section>

          <div className="bg-gray-50 rounded-2xl p-8 text-center mt-12 border border-gray-100 mt-12">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Have further questions?</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Our support team is here to help you understand how your data is handled.</p>
            <a href="mailto:privacy@medweb.com" className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 rounded-xl font-medium shadow-sm bg-white hover:bg-gray-50 transition-colors">
              Contact Privacy Team
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

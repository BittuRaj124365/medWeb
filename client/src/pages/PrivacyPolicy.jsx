import React from 'react';
import { 
  Shield, Lock, FileText, CheckCircle2, 
  ArrowRight, ShieldCheck, Fingerprint, Globe, 
  Sparkles, Activity, Mail, Info, ChevronRight,
  Database, Eye, Scale, HeartHandshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 relative overflow-hidden animate-in fade-in duration-1000">
      
      {/* Background Ambient Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ── HEADER ── */}
        <div className="text-center mb-24 space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] animate-in slide-in-from-top-4 duration-700">
                <ShieldCheck className="w-4 h-4" /> Global Sovereignty Log
            </div>
            
            <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                    Privacy <br />
                    <span className="text-primary italic">Protocols.</span>
                </h1>
                <p className="text-xl text-gray-400 font-semibold max-w-2xl mx-auto leading-relaxed italic">
                    "Your clinical data is a sacred trust. At MedShop, we implement rigorous cryptographic and logistical safeguards to ensure absolute sanctity."
                </p>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 grayscale opacity-20">
                <Globe className="w-8 h-8" />
                <Activity className="w-8 h-8" />
                <Fingerprint className="w-8 h-8" />
            </div>

            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 inline-block px-6 py-2 rounded-full border border-gray-100">
                System Last Sync: March 2026
            </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="space-y-16">
          
          {/* Section 1: Data Acquisition */}
          <section className="bg-white rounded-[48px] border border-gray-100 shadow-premium p-10 md:p-16 space-y-10 group hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 text-primary/5 -z-10 rotate-12 group-hover:scale-125 transition-transform duration-1000"><Database className="w-48 h-48" /></div>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gray-50 rounded-[24px] text-gray-900 shadow-sm border border-gray-100 group-hover:bg-primary/5 transition-colors">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Intelligence <br /> Acquisition.</h2>
                    </div>
                    <p className="text-gray-500 font-semibold leading-relaxed italic text-lg">
                        We acquire clinical and logistical intelligence solely to optimize the pharmaceutical distribution network. All acquisition nodes are subject to rigorous encryption.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                    {[
                        'Biometric and Identity Metadata',
                        'Cryptographic Account Credentials',
                        'Transaction Discrepancy History',
                        'Asset Feedback Parameters',
                        'Neural Device & Usage Logs'
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-[28px] border border-transparent hover:border-primary/20 hover:bg-white transition-all group/item">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-gray-100 group-hover/item:rotate-12 transition-transform">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">{item}</span>
                        </div>
                    ))}
                </div>
          </section>

          {/* Section 2: Safe Haven Clause */}
          <section className="bg-gray-900 rounded-[54px] shadow-2xl p-10 md:p-16 space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 text-white/5 -z-10 rotate-12 group-hover:scale-110 transition-transform duration-1000"><ShieldCheck className="w-64 h-64" /></div>
                
                <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-[28px] flex items-center justify-center text-primary border border-white/5 shadow-xl backdrop-blur-xl">
                            <Lock className="w-7 h-7" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none text-glow">The Safe Haven <br /> <span className="text-primary italic">Sovereignty.</span></h2>
                    </div>
                    <p className="text-gray-400 font-semibold leading-relaxed italic text-lg max-w-2xl">
                        "Your privacy is an absolute sovereignty. We implement a non-negotiable zero-leak policy across our entire pharmaceutical chain."
                    </p>
                    
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 mt-10 group/box hover:bg-white/10 transition-all duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Ironclad Mandate</h3>
                        </div>
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">Zero Commercial Exploitation.</h4>
                        <p className="text-gray-400 text-sm font-semibold leading-relaxed italic">
                            MedShop will never, under any protocol, sell, lease, or commercially exploit your personal clinical identity to external third-party entities. All data exchange is confined to the secure operational network.
                        </p>
                    </div>
                </div>
          </section>

          {/* Grid Section: Rights & Security */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-10 space-y-8 hover:shadow-xl transition-all duration-500 group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/5 transition-colors"><Shield className="w-6 h-6 text-gray-900" /></div>
                        <h2 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter">Hardened Security</h2>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold leading-relaxed italic">
                        All clinical logs are archived behind a multi-layered cryptographic wall (AES-256). Access is restricted to Level 4 Administrative Cleared personnel only.
                    </p>
                </section>

                <section className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-10 space-y-8 hover:shadow-xl transition-all duration-500 group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/5 transition-colors"><Scale className="w-6 h-6 text-gray-900" /></div>
                        <h2 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter">Your Sovereignty</h2>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold leading-relaxed italic">
                        You maintain absolute digital autonomy. Request a full archive export or data purge at any interval via our secure command terminal.
                    </p>
                </section>
          </div>

          {/* Contact Footer Card */}
          <div className="bg-gray-50 rounded-[54px] p-12 lg:p-16 border border-gray-100 text-center space-y-8 relative overflow-hidden animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />
            <div className="space-y-4">
                <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Complex <br /> Inquiry?</h3>
                <p className="text-gray-400 font-semibold italic max-w-sm mx-auto">Our specialized legal and clinical data stewards are available for protocol clarification.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:privacy@medshop.com" className="px-12 py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[28px] shadow-2xl shadow-gray-200 hover:bg-black transition-all active:scale-95 flex items-center gap-3">
                   <Mail className="w-4 h-4 text-primary" /> Sync with Steward
                </a>
                <Link to="/about" className="px-12 py-5 bg-white border border-gray-100 text-[10px] font-black uppercase tracking-[0.3em] rounded-[28px] shadow-sm hover:bg-gray-100 transition-all flex items-center gap-2">
                    Our Mission <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
          </div>

        </div>

        {/* Global Footer Marks */}
        <div className="mt-24 pt-10 border-t border-gray-50 flex items-center justify-center gap-10 grayscale opacity-10">
            <Sparkles className="w-10 h-10" />
            <Globe className="w-10 h-10" />
            <ShieldCheck className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

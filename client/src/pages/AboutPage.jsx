import { 
  ShieldCheck, Heart, Users, Activity, Target, Award, 
  MapPin, Clock, Star, ArrowRight, ChevronRight, Stethoscope,
  Pill, History, Globe, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* ── PREMIUM GLOSS HERO ── */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-10 translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-[140px] -z-10 -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-white border border-gray-100 shadow-premium text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles className="w-3.5 h-3.5" /> Established 2011
              </div>
              <h1 className="text-6xl md:text-[7.5rem] font-black text-gray-900 tracking-tighter leading-[0.8] italic uppercase">
                Clinical <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-500 to-accent">Architects.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 font-semibold max-w-2xl mx-auto leading-relaxed">
                We bridge the gap between digital speed and pharmaceutical integrity. Redefining how India accesses verified medicine.
              </p>
           </div>
        </div>
      </section>

      {/* ── OUR STORY SECTION ── */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
                <div className="w-full lg:w-1/2 relative group">
                    <div className="absolute -inset-10 bg-primary/5 rounded-[80px] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative rounded-[70px] overflow-hidden shadow-premium border-[12px] border-white/50 backdrop-blur-sm">
                        <img 
                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000" 
                            className="w-full aspect-[4/5] object-cover hover:scale-110 transition-transform duration-1000"
                            alt="MedShop Foundation"
                        />
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute -right-8 top-1/4 bg-white p-8 rounded-[40px] shadow-2xl border border-gray-50 animate-float">
                        <History className="w-8 h-8 text-primary mb-3" />
                        <div className="text-2xl font-black text-gray-900 italic leading-none">15+</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Years Legacy</div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                             <div className="w-2 h-2 bg-primary rounded-full" /> The Narrative
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none italic">Integrity is our <br /> fundamental compound.</h2>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed">
                            Founded in the heart of Delhi, MedShop began with a singular clinical objective: to eliminate the ambiguity from medicine procurement. We realized that while pharmacies were everywhere, clarity was scarce.
                        </p>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed">
                            Today, we are more than just an inventory viewer. We are a verification terminal for thousands of patients, ensuring that every tablet, syrup, and injection is logged, tracked, and authenticated.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300">Operation Center</h4>
                            <p className="text-lg font-black text-gray-900 italic">Connaught Place, DL</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300">Global Sourcing</h4>
                            <p className="text-lg font-black text-gray-900 italic">Verified Channels</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ── CORE VALUES: THE GRID ── */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> Ethical Protocol
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-none italic uppercase">Our Operating System</h2>
                <p className="text-gray-500 font-semibold max-w-lg mx-auto leading-relaxed">The principles that synchronize our clinical daily operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { title: 'Transparency', icon: <Globe className="w-8 h-8" />, desc: 'Live inventory sync ensures what you see is exactly what is in our warehouse cabinets.', color: 'from-blue-500 to-cyan-500' },
                    { title: 'Veracity', icon: <ShieldCheck className="w-8 h-8" />, desc: 'Every pharmaceutical ID is cross-verified against manufacturer medical logs.', color: 'from-primary to-teal-500' },
                    { title: 'Humanity', icon: <Heart className="w-8 h-8" />, desc: 'Beyond procurement, we provide expert clinical guidance for patient wellness.', color: 'from-rose-500 to-pink-500' }
                ].map((val, i) => (
                    <div key={i} className="group relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${val.color} opacity-0 group-hover:opacity-100 rounded-[50px] blur-2xl transition-opacity duration-700 -z-10`} />
                        <div className="bg-white p-12 rounded-[54px] border border-gray-100 shadow-premium h-full space-y-8 group-hover:-translate-y-4 transition-transform duration-500">
                            <div className={`w-20 h-20 bg-gradient-to-br ${val.color} rounded-[28px] flex items-center justify-center text-white shadow-xl transform rotate-3 group-hover:rotate-12 transition-transform`}>
                                {val.icon}
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">{val.title}</h3>
                            <p className="text-gray-500 font-semibold leading-relaxed">{val.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ── THE GUIDING EXPERT ── */}
      <section className="py-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-[80px] p-2 border-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-20">
                <div className="absolute top-0 right-0 p-12 text-primary/5 -z-10">
                    <Stethoscope className="w-96 h-96" />
                </div>
                
                <div className="w-full lg:w-1/2 p-2 relative lg:-left-12">
                    <div className="relative rounded-[70px] overflow-hidden border-[12px] border-white shadow-2xl">
                        <img 
                            src="https://i.pravatar.cc/1000?u=pharmacist1" 
                            className="w-full aspect-square object-cover"
                            alt="Dr. Ananya Sharma"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent p-12 text-white">
                             <div className="text-3xl font-black italic tracking-tighter mb-1 uppercase">Dr. Ananya Sharma</div>
                             <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Chief Clinical Officer • MedShop</div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 p-12 lg:pr-24 space-y-10">
                    <div className="space-y-6">
                        <div className="p-4 bg-primary/10 w-fit rounded-3xl text-primary animate-pulse"><Award className="w-8 h-8" /></div>
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">A Clinical Vocation</h2>
                        <p className="text-gray-500 font-semibold text-xl leading-relaxed italic border-l-4 border-primary/20 pl-8">
                            "Medicine is not a commodity, it is a covenant. Every time we log a product, we are taking responsibility for a life. That is the MedShop standard."
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-px bg-gray-200" />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Board Certified Pharmacist</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-px bg-gray-200" />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Medical University of Delhi Excellence Alum</div>
                        </div>
                    </div>

                    <Link to="/medicines" className="btn-premium px-12 py-6 inline-flex items-center gap-4 active:scale-95">
                        Browse Our Standard <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-24 bg-gray-900 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight italic uppercase">Ready for <br /> Pharmaceutical Clarity?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/medicines" className="w-full sm:w-auto px-16 py-6 border-2 border-white rounded-[32px] font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-4">
                    Explore Inventory <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to="/" className="w-full sm:w-auto px-10 py-6 bg-white/5 border border-white/10 rounded-[32px] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                    Return Home
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;

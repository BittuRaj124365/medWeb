import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, ArrowRight, Activity, Pill, HeartPulse, ShieldCheck,
  Clock, MapPin, Phone, Mail, Star, Users, Award, TrendingUp, Package, Zap,
  CheckCircle2, ChevronRight, HelpCircle, BookOpen, Stethoscope, X, MessageCircle,
  Plus, Minus
} from 'lucide-react';
import apiClient from '../api/apiClient';
import MedicineCard from '../components/MedicineCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

// Leaflet map component
const StoreMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([28.6139, 77.2090], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: '',
        html: `<div style="width:40px;height:40px;background:linear-gradient(135deg,#0d9488,#059669);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 15px rgba(13,148,136,0.5);">
          <div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:white;font-size:14px;">+</div>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -44],
      });

      L.marker([28.6139, 77.2090], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;padding:4px 2px;">
            <strong style="color:#0d9488;font-size:15px;">MedShop</strong><br/>
            <span style="color:#555;">123 Health Street, New Delhi - 110001</span><br/>
            <span style="color:#059669;">⏰ Open: 8AM – 10PM</span>
          </div>
        `)
        .openPopup();

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={mapRef} className="w-full h-full rounded-3xl" style={{ minHeight: '400px' }} />
  );
};

const BlogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const blogs = [
    {
      id: 1,
      title: "Understanding Generic vs. Brand Name Medicines",
      author: "Dr. Sameer Verma",
      date: "March 15, 2026",
      content: "Generic medicines are identical to brand-name ones in dosage form, safety, strength, and quality. They provide a cost-effective alternative without compromising your health outcomes...",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      title: "How to Store Your Medications Properly",
      author: "Dr. Aisha Khan",
      date: "March 10, 2026",
      content: "Most medications should be stored in a cool, dry place away from direct sunlight. The bathroom is often the worst place due to moisture and heat fluctuations...",
      image: "https://images.unsplash.com/photo-1471864190281-ad5fe9bb072c?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      title: "5 Essential Supplements for Peak Immunity",
      author: "Dr. Robert Wilson",
      date: "March 05, 2026",
      content: "Vitamin C, Zinc, and Vitamin D play crucial roles in maintaining a robust immune system. However, it's vital to consult your physician before starting any new supplement regimen...",
      image: "https://images.unsplash.com/photo-1550572017-ed200f5e6343?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[40px] shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-2">Expert Health Blogs</h2>
          <p className="text-gray-500">Curated insights from our panel of medical professionals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog.id} className="group cursor-pointer">
              <div className="relative h-48 rounded-3xl overflow-hidden mb-5">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-primary tracking-wider">Education</div>
              </div>
              <p className="text-xs font-bold text-gray-400 mb-2">{blog.date} • {blog.author}</p>
              <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary transition-colors">{blog.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{blog.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-primary/5 rounded-[32px] border border-primary/10 text-center">
          <h5 className="font-bold text-gray-900 text-lg mb-2">Want to stay updated?</h5>
          <p className="text-gray-600 text-sm mb-6 font-medium">Get health tips and medicine alerts directly in your inbox.</p>
          <div className="max-w-md mx-auto flex gap-3">
            <input type="email" placeholder="Your email address" className="flex-1 px-6 py-3 rounded-2xl border border-gray-200 outline-none focus:border-primary transition-all" />
            <button className="px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-teal-700 transition-all">Join</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const faqs = [
  {
    q: "Are the medicines genuine?",
    a: "Yes, every medicine listed is verified for authenticity and sourced from licensed pharmaceutical distributors."
  },
  {
    q: "How often is the stock updated?",
    a: "Our inventory is updated in real-time. What you see is exactly what's available in our physical warehouse."
  },
  {
    q: "Do you deliver to my location?",
    a: "No, we do not provide delivery service."
  },
  {
    q: "Can I get a pharmacist consultation?",
    a: "Absolutely! Our chief pharmacist, Dr. Ananya Sharma, and her team are available for consultations during service hours."
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['medicines', { limit: 4 }],
    queryFn: async () => {
      const res = await apiClient.get('/medicines?limit=4');
      return res.data;
    }
  });

  const { data: topRatedData, isLoading: isLoadingTop } = useQuery({
    queryKey: ['medicines', { sort: '-rating.average', limit: 4 }],
    queryFn: async () => {
      // Use negative sorting to get highest rated first
      const res = await apiClient.get('/medicines?sort=-rating.average&limit=4');
      return res.data;
    }
  });

  const categories = [
    { name: 'Tablet', icon: <Pill className="w-6 h-6" />, color: 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100 hover:border-blue-200' },
    { name: 'Syrup', icon: <Activity className="w-6 h-6" />, color: 'bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100 hover:border-purple-200' },
    { name: 'Injection', icon: <HeartPulse className="w-6 h-6" />, color: 'bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100 hover:border-rose-200' },
    { name: 'Capsule', icon: <Pill className="w-6 h-6" />, color: 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100 hover:border-amber-200' },
    { name: 'Vitamins', icon: <Stethoscope className="w-6 h-6" />, color: 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-200' },
    { name: 'Others', icon: <Package className="w-6 h-6" />, color: 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100 hover:border-gray-200' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="bg-white">
      <BlogModal isOpen={isBlogOpen} onClose={() => setIsBlogOpen(false)} />

      {/* ── MINIMALISTIC SOFT HERO ── */}
      <section className="relative pt-24 pb-28 overflow-hidden bg-slate-50/50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-300/10 rounded-full blur-[160px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-[140px] -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">

            {/* Hero Text */}
            <div className="w-full lg:w-1/2 space-y-10 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                Trusted By Over 2,400+ Patients
              </div>

              <h1 className="text-6xl lg:text-[5.5rem] font-black text-slate-900 leading-[1] tracking-[-0.03em]">
                Health <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Better Choice.</span>
              </h1>

              <p className="text-lg text-slate-500 max-w-xl leading-relaxed font-medium">
                We simplify medical inventory access. Discover genuine medicines with real-time stock updates from your neighborhood pharmacy.
              </p>

              {/* Enhanced Search Box */}
              <form onSubmit={handleSearch} className="relative max-w-xl group pt-4">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 transition-colors group-focus-within:text-primary" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search generic or brand name..."
                    className="w-full pl-16 pr-36 py-6 bg-white border border-gray-100 rounded-[32px] text-lg shadow-2xl shadow-slate-200/40 outline-none focus:border-primary/30 transition-all placeholder:text-gray-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-3 bottom-3 px-10 bg-slate-900 text-white font-bold rounded-[24px] hover:bg-black shadow-xl shadow-slate-400/20 transition-all active:scale-95 flex items-center gap-2"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Hero Visual - Softer Tone */}
            <div className="w-full lg:w-1/2 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="relative group">
                <div className="absolute -inset-10 bg-teal-400/5 rounded-full blur-[100px] scale-150 -z-10 group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative rounded-[56px] overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                    alt="Clean healthcare set"
                    className="w-full aspect-[5/4] object-cover hover:scale-105 transition-transform duration-1000"
                  />
                </div>
                {/* Visual Badges */}
                <div className="absolute -left-8 top-12 bg-white/90 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl border border-gray-100 animate-float">
                  <Star className="w-8 h-8 text-amber-400 fill-amber-400 mb-2" />
                  <div className="text-2xl font-black text-gray-900 leading-none">4.9/5</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Rating</div>
                </div>
                <div className="absolute -right-6 bottom-10 bg-primary p-6 rounded-[32px] shadow-2xl border-4 border-white animate-float-delayed">
                  <div className="text-white">
                    <div className="text-2xl font-black leading-none">100%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">Authentic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESTORED CATEGORY BUTTONS ── */}
      <section className="py-20 border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Shop by Category</h3>
            <p className="text-slate-500 font-medium">Quickly filter medicines by their form and type.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/medicines?category=${cat.name}`)}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[36px] border transition-all hover:shadow-xl hover:-translate-y-2 group ${cat.color}`}
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <span className="font-bold tracking-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVENTORY GRID ── */}
      <section className="py-24 animate-in fade-in duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="space-y-3 prose">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight m-0">Recently Stocked</h2>
              <p className="text-slate-400 text-lg font-medium m-0">Live inventory from our warehouse cabinets.</p>
            </div>
            <Link to="/medicines" className="flex items-center gap-3 text-slate-900 font-black py-4 px-10 rounded-[28px] bg-slate-100 hover:bg-slate-200 transition-all group">
              Browse All <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {data?.medicines?.map(medicine => (
                <MedicineCard key={medicine._id} medicine={medicine} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TOP RATED GRID ── */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="space-y-3 prose">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight m-0 flex items-center gap-3">
                Top Rated <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
              </h2>
              <p className="text-slate-400 text-lg font-medium m-0">Customer favorites based on verified reviews.</p>
            </div>
          </div>

          {isLoadingTop ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {topRatedData?.medicines?.map(medicine => (
                <MedicineCard key={medicine._id} medicine={medicine} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PHARMACIST GUIDE & BLOGS ── */}
      <section className="py-28 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/10 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 space-y-8 relative z-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-primary text-xs font-black uppercase tracking-widest">
                Our Mission
              </div>
              <h2 className="text-5xl font-black leading-tight tracking-tight">Dedicated to Your <br /> Long-Term Wellness</h2>
              <p className="text-slate-400 text-xl leading-relaxed font-medium">
                Our licensed pharmacists don't just dispense pills — they provide clarity. We're here to help you understand every prescription and health choice.
              </p>
              <div className="flex gap-10 py-6 border-y border-white/5">
                <div>
                  <div className="text-4xl font-black text-primary">15+</div>
                  <div className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Years Exp.</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-teal-400">2k+</div>
                  <div className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Happy Patients</div>
                </div>
              </div>
              <button
                onClick={() => setIsBlogOpen(true)}
                className="px-12 py-5 bg-white text-slate-900 font-bold rounded-[28px] hover:shadow-2xl hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-98"
              >
                <BookOpen className="w-5 h-5" /> Read Expert Blogs
              </button>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
              <div className="relative max-w-sm w-full">
                <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-10 border border-white/10 text-center">
                  <div className="w-32 h-32 rounded-3xl mx-auto mb-8 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img src="https://i.pravatar.cc/150?u=doc1" alt="Pharmacist" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Dr. Ananya Sharma</h4>
                  <p className="text-primary font-black uppercase text-[10px] tracking-widest mb-6">Chief Pharmacist</p>
                  <p className="text-slate-400 text-sm leading-relaxed italic">"Access to medicines should be simple, verified, and informed. That's why we built MedShop."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UPDATED STORE INFO SECTION ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">

            <div className="space-y-12 py-6">
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Locate & Connect</h2>
                <p className="text-slate-500 text-xl font-medium leading-relaxed">Visit us in the heart of Delhi or reach out via our digital channels.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 space-y-4 hover:shadow-lg transition-all">
                  <div className="p-3 bg-white w-fit rounded-2xl shadow-sm text-primary"><MapPin className="h-6 w-6" /></div>
                  <h5 className="font-bold text-gray-900 text-lg">Main Store</h5>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">123 Health Street, Connaught Place, New Delhi – 110001</p>
                </div>
                <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 space-y-4 hover:shadow-lg transition-all">
                  <div className="p-3 bg-white w-fit rounded-2xl shadow-sm text-blue-500"><Phone className="h-6 w-6" /></div>
                  <h5 className="font-bold text-gray-900 text-lg">Call Us</h5>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">+91 98765 43210 <br /> +91 11 2345 6789</p>
                </div>
                {/* NEW GMAIL BOX */}
                <div className="p-8 rounded-[40px] bg-emerald-50 border border-emerald-100 space-y-4 hover:shadow-lg transition-all">
                  <div className="p-3 bg-white w-fit rounded-2xl shadow-sm text-emerald-600"><Mail className="h-6 w-6" /></div>
                  <h5 className="font-bold text-gray-900 text-lg">Gmail Express</h5>
                  <p className="text-emerald-700/70 text-sm leading-relaxed font-medium">contact@medshop.in <br /> support@medshop.in</p>
                  <a href="mailto:contact@medshop.in" className="inline-block text-xs font-black uppercase text-emerald-600 tracking-widest hover:underline mt-2">Send Mail Now</a>
                </div>
                <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 space-y-4 hover:shadow-lg transition-all">
                  <div className="p-3 bg-white w-fit rounded-2xl shadow-sm text-purple-600"><Clock className="h-6 w-6" /></div>
                  <h5 className="font-bold text-gray-900 text-lg">Service Hours</h5>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">Mon–Sat: 8:00 AM – 10:00 PM <br /> Sun: 9:00 AM – 8:00 PM</p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=28.6139,77.2090"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full py-6 bg-slate-900 text-white font-bold rounded-[32px] hover:bg-black transition-all shadow-2xl shadow-slate-400/20 active:scale-95 items-center justify-center gap-4"
              >
                <MapPin className="w-5 h-5" /> Get Directions on Mobile
              </a>
            </div>

            <div className="min-h-[500px] lg:min-h-full rounded-[64px] overflow-hidden border-8 border-slate-50 shadow-2xl relative z-0">
              <StoreMap />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ MINIMAL SECTION ── */}
      <section className="py-24 border-t border-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Quick Answers</h2>
            <p className="text-slate-400 font-medium">Frequently asked questions about our inventory.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className={`p-6 sm:p-8 rounded-[32px] transition-all duration-300 cursor-pointer group border ${openFaq === i ? 'bg-white border-indigo-100 shadow-xl shadow-indigo-500/5' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="flex items-center gap-4 font-bold text-slate-900 text-lg">
                    <div className={`w-2 h-2 rounded-full transition-colors ${openFaq === i ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                    {f.q}
                  </h4>
                  <div className={`p-2 rounded-full transition-colors ${openFaq === i ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                    {openFaq === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </div>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-40 mt-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-500 leading-relaxed font-medium pl-6 border-l-2 border-indigo-50">
                    {f.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

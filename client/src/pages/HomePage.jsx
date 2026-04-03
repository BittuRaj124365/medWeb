import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, ArrowRight, Activity, Pill, HeartPulse, ShieldCheck,
  Clock, MapPin, Phone, Mail, Star, Users, Award, TrendingUp, Package, Zap,
  CheckCircle2, ChevronRight, HelpCircle, BookOpen, Stethoscope, X, MessageCircle,
  Plus, Minus, Sparkles, ShieldAlert, Heart, Loader2
} from 'lucide-react';
import apiClient from '../api/apiClient';
import MedicineCard from '../components/MedicineCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

// Modern Iframe-based map
const StoreMap = () => (
  <iframe
    src="https://www.openstreetmap.org/export/embed.html?bbox=77.1890%2C28.6039%2C77.2290%2C28.6239&layer=mapnik&marker=28.6139%2C77.2090"
    className="w-full h-full rounded-[40px]"
    style={{ minHeight: '500px', border: 'none' }}
    title="MedShop Store Location — New Delhi"
    loading="lazy"
    allowFullScreen
  />
);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[48px] shadow-[0_0_100px_rgba(0,0,0,0.2)] p-8 md:p-16 animate-in zoom-in-95 duration-500 border border-white/20">
        <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300">
          <X className="w-6 h-6 text-gray-400" />
        </button>

        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Healthcare Insights
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">Expert Health Hub</h2>
          <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">Curated knowledge from our panel of board-certified medical professionals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map(blog => (
            <div key={blog.id} className="group cursor-pointer">
              <div className="relative h-60 rounded-[32px] overflow-hidden mb-6 shadow-xl group-hover:shadow-primary/20 transition-all duration-500">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-primary tracking-widest">Education</div>
              </div>
              <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">{blog.date} • {blog.author}</p>
              <h4 className="text-xl font-bold text-gray-900 mb-4 leading-[1.3] group-hover:text-primary transition-colors">{blog.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed font-medium">{blog.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-gray-50 rounded-[48px] border border-gray-100 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000" />
          <h5 className="font-black text-gray-900 text-2xl mb-3 relative z-10">Stay Informed & Healthy</h5>
          <p className="text-gray-500 text-sm mb-8 font-medium relative z-10 max-w-sm mx-auto">Get health tips and medicine availability alerts directly in your inbox.</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 relative z-10">
            <input type="email" placeholder="Enter your email" className="flex-1 px-8 py-4 rounded-2xl bg-white border border-gray-100 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium" />
            <button className="px-10 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-teal-700 shadow-xl shadow-primary/20 transition-all active:scale-95">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const faqs = [
  {
    q: "Are the medicines listed genuine?",
    a: "Every single medication in our inventory is 100% genuine, verified for authenticity, and sourced directly from licensed global pharmaceutical distributors and manufacturers."
  },
  {
    q: "How accurate is the stock availability?",
    a: "Our inventory system is synchronized in real-time. The 'In Stock' status you see on your screen perfectly reflects our physical warehouse cabinets at this very moment."
  },
  {
    q: "Do you offer door-step delivery?",
    a: "Currently, we operate as a real-time inventory viewer. Customers can check availability online and visit our physical store in Connaught Place for purchases."
  },
  {
    q: "Can I receive a pharmacist consultation?",
    a: "Absolutely. Our expert medical team, led by Dr. Anu Shah, is available for in-person consultations during all store operational hours to guide your health choices."
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
      const res = await apiClient.get('/medicines?sort=-rating.average&limit=4');
      return res.data;
    }
  });

  const { data: ratingStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['shopRatingStats'],
    queryFn: async () => (await apiClient.get('/medicines/shop-ratings')).data
  });

  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchInitialReviews = async () => {
      try {
        const res = await apiClient.get('/medicines/feedbacks/approved?page=1&limit=3');
        if (res.data?.feedbacks) {
          setReviews(res.data.feedbacks);
          setHasMoreReviews(res.data.hasMore);
        }
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    };
    fetchInitialReviews();
  }, []);

  const handleSeeMoreReviews = async () => {
    if (isLoadingMore || !hasMoreReviews) return;
    setIsLoadingMore(true);
    try {
      const nextPage = reviewPage + 1;
      const res = await apiClient.get(`/medicines/feedbacks/approved?page=${nextPage}&limit=3`);
      if (res.data?.feedbacks) {
        setReviews(prev => [...prev, ...res.data.feedbacks]);
        setReviewPage(nextPage);
        setHasMoreReviews(res.data.hasMore);
      } else {
        setHasMoreReviews(false);
      }
    } catch (err) {
      toast.error('Failed to load more reviews');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleHideReviews = () => {
    setReviews(prev => prev.slice(0, 3));
    setReviewPage(1);
    setHasMoreReviews(true);
  };

  const categories = [
    { name: 'Tablet', icon: <Pill className="w-8 h-8" />, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
    { name: 'Syrup', icon: <Activity className="w-8 h-8" />, color: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20' },
    { name: 'Injection', icon: <HeartPulse className="w-8 h-8" />, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
    { name: 'Capsule', icon: <Pill className="w-8 h-8 rotate-45" />, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
    { name: 'Vitamins', icon: <Stethoscope className="w-8 h-8" />, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
    { name: 'Others', icon: <Package className="w-8 h-8" />, color: 'from-slate-500 to-gray-600', shadow: 'shadow-slate-500/20' },
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

      {/* ── PREMIUM GLASS HERO ── */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[160px] -z-10 translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[140px] -z-10 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-[60px] animate-float" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Content Column */}
            <div className="w-full lg:w-[55%] space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-white border border-gray-100 shadow-premium text-primary text-xs font-black uppercase tracking-[0.2em] animate-in zoom-in duration-700">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
                  Verified Medical Inventory
                </div>

                <h1 className="text-6xl md:text-[6.5rem] font-black text-gray-900 leading-[0.9] tracking-[-0.04em]">
                  Health <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-500 to-accent">Better Choice.</span>
                </h1>

                <p className="text-xl text-gray-500 max-w-xl leading-relaxed font-semibold">
                  Access clinical-grade medical supplies with real-time availability. We bridge the gap between digital convenience and pharmaceutical integrity.
                </p>
              </div>

              {/* Large Search Box */}
              <form onSubmit={handleSearch} className="relative max-w-2xl group pt-2">
                <div className="absolute -inset-4 bg-primary/5 rounded-[48px] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by medicine or generic name..."
                    className="w-full pl-20 pr-44 py-8 bg-white border border-gray-100 rounded-[40px] text-xl shadow-premium outline-none focus:border-primary/20 transition-all font-bold placeholder:text-gray-200"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-4 bottom-4 px-12 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-[32px] hover:bg-primary shadow-2xl shadow-gray-400/20 transition-all active:scale-95 flex items-center gap-3"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-10 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900 uppercase">100% Genuine</div>
                    <div className="text-[10px] font-bold text-gray-400">Verified Sourcing</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900 uppercase">Real-Time</div>
                    <div className="text-[10px] font-bold text-gray-400">Stock Syncing</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Column */}
            <div className="w-full lg:w-[45%] relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 px-4">
              <div className="relative group">
                {/* Decorative Shapes */}
                <div className="absolute -inset-10 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-[80px] blur-[100px] -z-10 animate-pulse" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />

                {/* Image Frame */}
                <div className="relative rounded-[70px] overflow-hidden shadow-premium border-[12px] border-white/50 backdrop-blur-sm transform hover:scale-[1.02] transition-transform duration-700">
                  <img
                    src="https://digest.myhq.in/wp-content/uploads/2023/03/How-To-Start-Apollo-Pharmacy-Franchise-in-India.jpg"
                    alt="Healthcare Innovation"
                    className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Floating Insight Cards */}
                <div className="absolute -left-12 top-10 glass p-8 rounded-[30px] border border-white/40 shadow-2xl animate-float group-hover:translate-x-4 transition-transform duration-700">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=user${i}`} className="w-10 h-10 rounded-full border-4 border-white object-cover" />)}
                    </div>
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                      <Star className="w-2 h-2 fill-amber-300" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gray-900 leading-none">4.9 / 5</div>
                  <div className="text-[4px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">Overall Quality</div>
                </div>

                <div className="absolute -right-10 bottom-24 bg-primary p-8 rounded-[48px] shadow-2xl border-[10px] border-white/80 animate-float-delayed group-hover:-translate-x-4 transition-transform duration-700">
                  <div className="text-white">
                    <div className="text-2xl font-black leading-none mb-1">10k+</div>
                    <div className="text-[4px] font-black uppercase tracking-widest opacity-80">Products Listed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HIGH-IMPACT STATS BAR ── */}
      <section className="py-12 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-[50px] p-2 flex flex-col md:flex-row items-stretch border-white animate-in slide-in-from-bottom-12 duration-1000">
            {[
              { label: 'Licensed Stores', value: '24+', icon: <MapPin className="w-6 h-6" /> },
              { label: 'Happy Patients', value: '5K+', icon: <Heart className="w-6 h-6" /> },
              { label: 'Available Medicines', value: '18K+', icon: <Pill className="w-6 h-6" /> },
              { label: 'Verified Experts', value: '15+', icon: <ShieldAlert className="w-6 h-6" /> }
            ].map((stat, i) => (
              <div key={i} className={`flex-1 flex items-center justify-center gap-6 px-10 py-8 ${i < 3 ? 'md:border-r border-gray-100' : ''}`}>
                <div className="p-4 bg-gray-50 rounded-2xl text-primary transform group-hover:rotate-12 transition-transform">
                  {stat.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-gray-900 leading-none mb-1">{stat.value}</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODERN CATEGORIES GRID ── */}
      <section className="py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 px-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-accent text-[10px] font-black uppercase tracking-widest">
                <Package className="w-4 h-4" /> Comprehensive Catalog
              </div>
              <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">Shop by Category</h2>
              <p className="text-gray-500 font-medium max-w-lg leading-relaxed">Instantly filter your search by clinical category and therapeutic form.</p>
            </div>
            <Link to="/medicines" className="group flex items-center gap-3 px-8 py-4 bg-gray-50 hover:bg-primary hover:text-white rounded-3xl font-black text-xs uppercase tracking-widest border border-gray-100 transition-all duration-300 active:scale-95">
              View Full Directory <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 px-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/medicines?category=${cat.name}`)}
                className="group flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className={`w-full aspect-square bg-gradient-to-br ${cat.color} rounded-[48px] ${cat.shadow} flex items-center justify-center p-8 transition-all duration-500 group-hover:-translate-y-4 group-hover:rotate-6 shadow-2xl relative`}>
                  <div className="absolute inset-4 border-2 border-white/20 rounded-[36px]" />
                  <div className="text-white transform group-hover:scale-125 transition-transform duration-500 relative z-10">
                    {cat.icon}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="block font-black text-gray-900 text-lg group-hover:text-primary transition-colors">{cat.name}</span>
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Browse Form</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED INVENTORY ── */}
      <section className="py-28 bg-gray-50/50 relative">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 px-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                <Activity className="w-4 h-4" /> Live Updates
              </div>
              <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">Recently Stocked</h2>
              <p className="text-gray-500 font-medium max-w-lg leading-relaxed">Direct synchronization with our central warehouse terminal.</p>
            </div>
            <Link to="/medicines" className="group flex items-center gap-4 text-gray-900 px-10 py-5 bg-white shadow-premium hover:shadow-2xl rounded-[32px] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 border border-gray-100">
              Browse More <ArrowRight className="w-5 h-5 text-primary transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-4">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-4">
              {data?.medicines?.map((medicine, idx) => (
                <div key={medicine._id} className="animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                  <MedicineCard medicine={medicine} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TOP RATEDfavorites SECTION ── */}
      <section className="py-28 relative overflow-hidden bg-white border-y border-gray-50">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
              <Star className="w-4 h-4 fill-amber-500" /> Patient Choice
            </div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">Patient Favorites</h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">Our most requested and highly-rated medications verified by the community.</p>
          </div>

          {isLoadingTop ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-4">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-4">
              {topRatedData?.medicines?.map((medicine, idx) => (
                <div key={medicine._id} className="animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                  <MedicineCard medicine={medicine} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PATIENT FEEDBACK GRID ── */}
      {!isLoadingStats && ratingStats && (
        <section className="py-28 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-20 px-4">
              {/* Stats Summary Card */}
              <div className="w-full lg:w-1/3 space-y-10">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">Patient Reviews</h2>
                  <p className="text-gray-500 font-medium leading-relaxed">Real transparency from real patients. See why we are trusted across India.</p>
                </div>

                <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-premium text-center space-y-6">
                  <div className="text-7xl font-black text-gray-900 italic tracking-tighter">
                    {ratingStats.averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-8 h-8 ${star <= Math.round(ratingStats.averageRating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-100'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Based on {ratingStats.totalReviews} global reviews</p>

                  <div className="space-y-3 pt-6 border-t border-gray-50">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingStats.starCounts?.[star] || 0;
                      const percentage = ratingStats.totalReviews === 0 ? 0 : (count / ratingStats.totalReviews) * 100;
                      return (
                        <div key={star} className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <span className="w-6 flex items-center gap-1.5">{star} <Star className="w-3 h-3 fill-current" /></span>
                          <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="w-4 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="w-full lg:w-2/3 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {reviews.map((review, idx) => (
                    <div key={review._id} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-500 flex flex-col h-full animate-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 120}ms` }}>
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center font-black text-primary text-xl uppercase">
                            {review.userName ? review.userName.charAt(0) : 'A'}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 leading-none mb-1">{review.userName}</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{new Date(review.dateSubmitted).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 pt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-100'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-600 leading-[1.8] font-medium italic text-lg pr-4">"{review.message}"</p>
                      </div>
                      <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">
                          <Package className="w-3.5 h-3.5" /> {review.medicine?.name}
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>

                {reviews.length > 0 && (
                  <div className="flex flex-col items-center pt-6 gap-4">
                    {hasMoreReviews ? (
                      <button
                        onClick={handleSeeMoreReviews}
                        disabled={isLoadingMore}
                        className="px-12 py-5 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[32px] hover:bg-black shadow-2xl shadow-gray-400/30 transition-all flex items-center gap-4 active:scale-95"
                      >
                        {isLoadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : "Load More Reviews"}
                        {!isLoadingMore && <ArrowRight className="w-5 h-5" />}
                      </button>
                    ) : (
                      <div className="px-10 py-4 bg-white border border-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        All reviews loaded
                      </div>
                    )}
                    {reviewPage > 1 && (
                      <button
                        onClick={handleHideReviews}
                        className="px-12 py-3 bg-white text-gray-400 hover:text-gray-900 font-bold text-xs uppercase tracking-[0.2em] rounded-[32px] hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all active:scale-95 flex items-center gap-2"
                      >
                       <Minus className="w-4 h-4" /> Hide Reviews
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── MISSION & PHARMACIST SECTION ── */}
      <section className="py-32 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="w-full lg:w-1/2 space-y-10 px-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Integrity First
              </div>
              <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">Dedicated to Your Resilience</h2>
              <p className="text-gray-400 text-xl leading-relaxed font-semibold max-w-xl">
                We don't just provide pharmaceuticals — we provide certainty. Our goal is to ensure every patient has access to verified, clinical-grade medical intelligence.
              </p>

              <div className="grid grid-cols-2 gap-10 py-10 border-y border-white/5">
                <div className="space-y-2">
                  <div className="text-5xl font-black text-primary italic">15+</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Years Distinction</div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-black text-teal-400 italic">2.4k+</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Verified Patients</div>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <button
                  onClick={() => setIsBlogOpen(true)}
                  className="px-12 py-5 bg-white text-gray-900 font-black text-xs uppercase tracking-[0.2em] rounded-[28px] hover:bg-gray-50 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95"
                >
                  <BookOpen className="w-5 h-5 text-primary" /> Expert Insights
                </button>
                <Link to="/about" className="px-10 py-5 border border-white/10 hover:bg-white/5 backdrop-blur rounded-[28px] font-black text-xs text-white uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                  The MedShop Story
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2 px-4">
              <div className="relative max-w-md mx-auto group">
                <div className="absolute -inset-10 bg-primary/20 rounded-[80px] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="bg-white/5 backdrop-blur-2xl rounded-[60px] p-12 border border-white/10 text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-primary/20 rounded-full blur-[60px]" />
                  <div className="w-40 h-40 rounded-[40px] mx-auto mb-10 overflow-hidden shadow-2xl border-4 border-white transform transition-transform duration-700 group-hover:scale-110">
                    <img src="https://i.pravatar.cc/300?u=pharmacist1" alt="Chief Pharmacist" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-3xl font-black mb-1">Dr. Anu Shah</h4>
                  <p className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-8">Chief Clinical Pharmacist • A Psychiatrist</p>
                  <p className="text-gray-400 text-lg leading-relaxed font-semibold italic">
                    "Integrity in medicine is non-negotiable. Our digital platform is an extension of our clinical commitment to your health."
                  </p>
                  <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-4 text-white/40">
                    <div className="text-[10px] font-black uppercase tracking-widest">Regd. No: MH-24019</div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <div className="text-[10px] font-black uppercase tracking-widest">Medical Council verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOCATOR & CONTACT ── */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch px-4">

            <div className="space-y-16 py-4">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                  <MapPin className="w-4 h-4" /> Global Presence
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9]">Locate & Connect</h2>
                <p className="text-gray-500 text-xl font-semibold leading-relaxed max-w-md">Experience clinical care at our physical flagship location in Connaught Place.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: 'Flagship Store', detail: '123 Health Street, Connaught Place, New Delhi – 110001', icon: <MapPin className="h-6 w-6 text-primary" />, bg: 'bg-primary/5' },
                  { title: 'Priority Support', detail: '+91 xxxxxxxxx\n+91 xxxxxxxxxx', icon: <Phone className="h-6 w-6 text-accent" />, bg: 'bg-accent/5' },
                  { title: 'Clinical Inquiries', detail: 'care@medshop.in\nconsult@medshop.in', icon: <Mail className="h-6 w-6 text-emerald-500" />, bg: 'bg-emerald-50' },
                  { title: 'Health Hours', detail: 'Mon–Sat: 8 AM – 10 PM\nSun: 9 AM – 8 PM', icon: <Clock className="h-6 w-6 text-purple-500" />, bg: 'bg-purple-50' }
                ].map((item, i) => (
                  <div key={i} className={`p-8 rounded-[48px] ${item.bg} border border-gray-100 space-y-5 hover:shadow-premium transition-all duration-500 group cursor-default`}>
                    <div className="p-3 bg-white w-fit rounded-2xl shadow-sm transform group-hover:rotate-12 transition-transform">{item.icon}</div>
                    <h5 className="font-black text-gray-900 text-lg uppercase tracking-tight">{item.title}</h5>
                    <p className="text-gray-500 text-sm leading-relaxed font-bold whitespace-pre-line opacity-80">{item.detail}</p>
                  </div>
                ))}
              </div>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=28.6139,77.2090"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full py-6 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[32px] hover:bg-black shadow-2xl shadow-gray-400/20 active:scale-95 items-center justify-center gap-4 transition-all"
              >
                <MapPin className="w-5 h-5 text-primary" /> Start GPS Navigation
              </a>
            </div>

            <div className="min-h-[600px] lg:min-h-full rounded-[80px] overflow-hidden border-[16px] border-gray-50 shadow-premium relative group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              <StoreMap />
            </div>
          </div>
        </div>
      </section>

      {/* ── PREMIUM FAQ ACCORDION ── */}
      <section className="py-32 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              <HelpCircle className="w-4 h-4" /> Common Queries
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Patient Assistance</h2>
            <p className="text-gray-500 font-semibold max-w-md mx-auto leading-relaxed">Everything you need to know about navigating our medical inventory platform.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div
                key={i}
                className={`p-8 sm:p-10 rounded-[40px] transition-all duration-500 cursor-pointer group border ${openFaq === i ? 'bg-white border-primary shadow-premium' : 'bg-white/40 border-gray-100 hover:bg-white hover:border-gray-200'}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-6">
                  <h4 className="flex items-center gap-5 font-black text-gray-900 text-xl tracking-tight">
                    <span className={`text-[10px] font-black uppercase tracking-widest p-2 rounded-lg transition-colors ${openFaq === i ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'}`}>0{i + 1}</span>
                    {f.q}
                  </h4>
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${openFaq === i ? 'bg-primary text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                    {openFaq === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </div>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-60 mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-500 leading-relaxed font-semibold text-lg pl-14 border-l-4 border-primary/20">
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

import { Link } from 'react-router-dom';
import { Pill, Facebook, Twitter, Instagram, Linkedin, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white pt-24 pb-12 overflow-hidden">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Pill className="text-white h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl leading-none tracking-tighter text-gray-900">MedShop</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Healthcare</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Your trusted partner in healthcare. Providing genuine medicines and expert health advice to our community for over 15 years.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Facebook className="w-5 h-5" />, href: "#", color: "hover:bg-blue-600" },
                { icon: <Twitter className="w-5 h-5" />, href: "#", color: "hover:bg-sky-500" },
                { icon: <Instagram className="w-5 h-5" />, href: "#", color: "hover:bg-pink-600" },
                { icon: <Linkedin className="w-5 h-5" />, href: "#", color: "hover:bg-blue-700" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 ${social.color} hover:-translate-y-1 shadow-sm`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">Navigation</h4>
            <ul className="space-y-4">
              {[
                { label: 'Home', path: '/' },
                { label: 'Browse Medicines', path: '/medicines' },
                { label: 'About Us', path: '/about' },
                { label: 'Privacy Policy', path: '/privacy-policy' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-500 hover:text-primary text-sm font-bold transition-all hover:pl-2">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-primary/5 rounded-xl text-primary mt-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-gray-500 text-sm font-medium">123 Health Street, Connaught Place, New Delhi – 110001</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 bg-accent/5 rounded-xl text-accent">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-gray-500 text-sm font-bold">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-gray-500 text-sm font-medium underline">contact@medshop.in</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Action */}
          <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
            <h4 className="font-black text-gray-900 text-lg mb-4 relative z-10">Need Assistance?</h4>
            <p className="text-gray-600 text-xs mb-6 font-medium relative z-10">Our pharmacists are ready to help you with your health queries.</p>
            <button className="w-full py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-primary/20 active:scale-95 transition-all relative z-10">
              Call Support
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} MedShop Group. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              Back to top
              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/10 transition-colors">
                <ArrowUp className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

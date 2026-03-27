import { Link } from 'react-router-dom';
import { Home, Search, ChevronRight, Activity, Award, ShieldCheck, Microscope } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/medicines?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="min-h-screen bg-white overflow-hidden relative flex flex-col items-center justify-center p-6 lg:p-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] -z-10 -translate-x-1/2 translate-y-1/2" />
            
            {/* Main Content Card */}
            <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-1000 relative">
                
                {/* 404 Visualization */}
                <div className="relative inline-block">
                    <div className="absolute -inset-10 bg-primary/10 rounded-full blur-[80px] animate-pulse" />
                    <div className="flex items-center justify-center gap-8 relative">
                        <h1 className="text-[12rem] md:text-[18rem] font-black italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 group select-none">
                            404
                        </h1>
                        <div className="absolute -bottom-4 right-0 md:right-8 bg-primary p-6 rounded-[32px] shadow-2xl border-8 border-white animate-float translate-x-1/4">
                            <Microscope className="w-10 h-10 text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6 max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        Clinical Error Code
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight italic uppercase">
                        Lost in the <br /> <span className="text-primary">Clinical Archive?</span>
                    </h2>
                    <p className="text-gray-500 font-semibold text-lg leading-relaxed">
                        The pharmaceutical resource you're searching for appears to be missing from our live inventory. Let's redirect you back to civilization.
                    </p>
                </div>

                {/* Sub-Search Recovery */}
                <div className="max-w-md mx-auto space-y-6 pt-6">
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Recover Navigation</div>
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute -inset-2 bg-primary/5 rounded-[28px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 transition-colors group-focus-within:text-primary" />
                            <input 
                                type="text"
                                placeholder="Search inventory instead..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-36 py-5 bg-white border border-gray-100 rounded-[28px] text-sm font-bold shadow-premium outline-none focus:border-primary/20 transition-all placeholder:text-gray-200"
                            />
                            <button 
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 px-8 bg-gray-900 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
                            >
                                Recover
                            </button>
                        </div>
                    </form>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <Link to="/" className="w-full sm:w-auto px-12 py-6 bg-gray-900 text-white rounded-[32px] font-black text-[10px] uppercase tracking-[0.3em] shadow-premium hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95">
                        <Home className="w-5 h-5 text-primary" /> Emergency Return Home
                    </Link>
                    <Link to="/medicines" className="w-full sm:w-auto px-12 py-6 border-2 border-gray-100 rounded-[32px] font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-3 active:scale-95">
                        Explore Full Pharmacy <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Bottom Proof Icons */}
            <div className="absolute bottom-12 flex items-center gap-10 opacity-10 grayscale pointer-events-none">
                <Activity className="w-12 h-12" />
                <Award className="w-12 h-12" />
                <ShieldCheck className="w-12 h-12" />
            </div>
        </div>
    );
};

export default NotFoundPage;

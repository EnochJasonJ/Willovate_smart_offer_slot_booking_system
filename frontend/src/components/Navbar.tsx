import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tag, LogOut, Menu, X, User, ChevronRight } from 'lucide-react';
import { authService } from '../services/authService';

interface NavbarProps {
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin: propIsAdmin }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const user = authService.getCurrentUser();
  const isAdmin = propIsAdmin || user?.role === 'Admin';
  const isLoggedIn = !!user;

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 pt-6">
      <nav className="bg-white/40 backdrop-blur-2xl border border-white/40 rounded-full px-8 h-20 flex items-center justify-between shadow-[0_12px_40px_-12px_rgba(0,0,0,0.05)] sticky top-6 z-50 transition-all duration-500 hover:bg-white/60">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="bg-slate-900 p-2 rounded-full text-white transition-all duration-500 group-hover:bg-indigo-600 group-hover:scale-110">
              <Tag size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">
              SmartOffer
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          <Link to="/" className="text-slate-500 hover:text-slate-900 font-bold text-sm tracking-tight transition-all">Browse</Link>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-8">
              {isAdmin ? (
                <Link to="/admin/dashboard" className="text-slate-500 hover:text-slate-900 font-bold text-sm tracking-tight flex items-center space-x-2 transition-all">
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link to="/my-bookings" className="text-slate-500 hover:text-slate-900 font-bold text-sm tracking-tight flex items-center space-x-2 transition-all">
                  <span>My Bookings</span>
                </Link>
              )}
              
              <div className="flex items-center space-x-4 bg-slate-900/5 px-4 py-2 rounded-full border border-slate-900/5">
                <div className="bg-slate-900 p-1 rounded-full text-white">
                  <User size={14} />
                </div>
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{user.name.split(' ')[0]}</span>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/admin/login" className="text-slate-500 hover:text-slate-900 font-bold text-sm tracking-tight">Partner Login</Link>
              <Link to="/admin/login" className="px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-black tracking-[0.1em] hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200 flex items-center space-x-2 group/btn">
                <span>GET STARTED</span>
                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 text-slate-900 bg-slate-50 rounded-full focus:outline-none border border-slate-200/50"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-4 top-28 z-40 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] border border-slate-100 p-8 space-y-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <Link to="/" className="block text-slate-900 font-black text-3xl tracking-tighter">Browse</Link>
          
          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link to="/admin/dashboard" className="block text-slate-900 font-black text-3xl tracking-tighter">Dashboard</Link>
              ) : (
                <Link to="/my-bookings" className="block text-slate-900 font-black text-3xl tracking-tighter">My Bookings</Link>
              )}
              <button 
                onClick={handleLogout}
                className="block w-full text-left text-rose-600 font-black text-3xl tracking-tighter"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="block w-full bg-slate-900 text-white text-center py-6 rounded-[2rem] font-black text-xl tracking-tight">GET STARTED</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;

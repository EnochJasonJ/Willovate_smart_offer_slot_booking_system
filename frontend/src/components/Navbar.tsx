import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tag, LayoutDashboard, Calendar, LogOut, Menu, X, User } from 'lucide-react';
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
    <nav className="bg-white/30 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-2xl text-white shadow-2xl shadow-indigo-200 group-hover:rotate-12 transition-transform duration-500">
                <Tag size={26} />
              </div>
              <span className="text-3xl font-black tracking-tighter premium-text-gradient">
                SmartOffer
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-black tracking-wide text-sm uppercase transition-all">Browse Offers</Link>
            
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <Link to="/admin/dashboard" className="text-slate-600 hover:text-indigo-600 font-bold flex items-center space-x-2 transition-all">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <Link to="/my-bookings" className="text-slate-600 hover:text-indigo-600 font-bold flex items-center space-x-2 transition-all">
                    <Calendar size={20} />
                    <span>My Bookings</span>
                  </Link>
                )}
                
                <div className="h-8 w-px bg-slate-200/50"></div>
                
                <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 shadow-sm">
                    <div className="bg-indigo-100 p-1.5 rounded-xl text-indigo-600">
                        <User size={18} />
                    </div>
                    <span className="text-sm font-black text-slate-700">{user.name.split(' ')[0]}</span>
                </div>

                <button 
                  onClick={handleLogout}
                  className="bg-rose-50 text-rose-600 p-3 rounded-2xl hover:bg-rose-100 transition-all cursor-pointer border border-rose-100 shadow-sm"
                  title="Logout"
                >
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <>
                <Link to="/admin/login" className="text-indigo-600 font-black tracking-wide text-sm uppercase transition-all hover:text-purple-600">Partner Login</Link>
                <Link to="/admin/login" className="btn-vibrant">
                  GET STARTED
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-indigo-600 bg-indigo-50/50 backdrop-blur-lg rounded-2xl focus:outline-none border border-indigo-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-3xl border-b border-indigo-50 py-10 px-6 space-y-8 shadow-2xl animate-in slide-in-from-top duration-500">
          <Link to="/" className="block text-slate-800 font-black text-2xl tracking-tight">Browse Offers</Link>
          
          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link to="/admin/dashboard" className="block text-slate-800 font-black text-2xl tracking-tight">Dashboard</Link>
              ) : (
                <Link to="/my-bookings" className="block text-slate-800 font-black text-2xl tracking-tight">My Bookings</Link>
              )}
              <button 
                onClick={handleLogout}
                className="block w-full text-left text-rose-600 font-black text-2xl tracking-tight"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="block btn-vibrant text-center py-6 text-xl">GET STARTED</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

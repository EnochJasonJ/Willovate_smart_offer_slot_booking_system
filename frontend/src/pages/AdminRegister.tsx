import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Mail, Lock, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { authService } from '../services/authService';
import Layout from '../components/Layout';

const AdminRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setCustomerInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const registerMutation = useMutation({
    mutationFn: (data: any) => authService.register(data),
    onSuccess: () => {
      navigate('/admin/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="glass-card p-12 relative overflow-hidden">
          {/* Decorative Background Orbs */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl text-indigo-600 text-xs font-black uppercase tracking-widest mb-8">
                <Sparkles size={14} />
                <span>Partner Program</span>
            </div>
            
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-[2rem] mb-8 shadow-2xl shadow-indigo-200 transform hover:rotate-12 transition-transform duration-500">
              <Tag size={40} />
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">Start Growing</h1>
            <p className="text-slate-500 font-bold text-lg">Create your merchant account and reach thousands of customers.</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-5 rounded-[1.5rem] font-bold text-sm mb-10 border border-rose-100 flex items-center space-x-3 animate-in fade-in zoom-in duration-300">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition duration-500"></div>
                <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                    required
                    type="text"
                    className="w-full pl-14 pr-6 py-5 bg-white/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-300"
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setCustomerInfo({...formData, name: e.target.value})}
                    />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition duration-500"></div>
                <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                    required
                    type="email"
                    className="w-full pl-14 pr-6 py-5 bg-white/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-300"
                    placeholder="e.g. alex@business.com"
                    value={formData.email}
                    onChange={(e) => setCustomerInfo({...formData, email: e.target.value})}
                    />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                        required
                        type="password"
                        className="w-full pl-14 pr-6 py-5 bg-white/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-300"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setCustomerInfo({...formData, password: e.target.value})}
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Confirm</label>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                        required
                        type="password"
                        className="w-full pl-14 pr-6 py-5 bg-white/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-300"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setCustomerInfo({...formData, confirmPassword: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group/btn w-full btn-vibrant flex items-center justify-center space-x-3 py-6 !rounded-[2rem] disabled:opacity-50"
            >
              {registerMutation.isPending ? (
                <span className="animate-pulse">CREATING ACCOUNT...</span>
              ) : (
                <>
                  <span>CREATE MERCHANT ACCOUNT</span>
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center relative z-10 pt-12 border-t border-slate-100/50">
            <p className="text-slate-400 font-bold text-sm">
                Already have an account? <Link to="/admin/login" className="text-indigo-600 font-black hover:text-purple-600 transition-colors underline decoration-2 underline-offset-4">Sign In Instead</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminRegister;

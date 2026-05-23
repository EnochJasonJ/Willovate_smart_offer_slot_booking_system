import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Lock, Mail, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';
import Layout from '../components/Layout';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: (credentials: any) => authService.login(credentials),
    onSuccess: () => {
      navigate('/admin/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-20 px-4">
        <div className="glass-card p-12 relative overflow-hidden">
          {/* Decorative Background Orbs */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl text-indigo-600 text-xs font-black uppercase tracking-widest mb-8">
                <Sparkles size={14} />
                <span>Merchant Access</span>
            </div>
            
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-[2rem] mb-8 shadow-2xl shadow-indigo-200 transform hover:rotate-12 transition-transform duration-500">
              <Tag size={40} />
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">Welcome Back</h1>
            <p className="text-slate-500 font-bold text-lg">Enter your credentials to manage your experiences.</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-5 rounded-[1.5rem] font-bold text-sm mb-10 border border-rose-100 flex items-center space-x-3 animate-in fade-in zoom-in duration-300">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Identity</label>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition duration-500"></div>
                <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                    required
                    type="email"
                    className="w-full pl-14 pr-6 py-5 bg-white/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-300"
                    placeholder="e.g. alex@wellness.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
              </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center ml-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Security Key</label>
                    <a href="#" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-purple-600 transition-colors">Forgot Key?</a>
                </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition duration-500"></div>
                <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                    required
                    type="password"
                    className="w-full pl-14 pr-6 py-5 bg-white/50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-200 outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-300"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group/btn w-full btn-vibrant flex items-center justify-center space-x-3 py-6 !rounded-[2rem] disabled:opacity-50"
            >
              {loginMutation.isPending ? (
                <span className="animate-pulse">VERIFYING...</span>
              ) : (
                <>
                  <span>ACCESS DASHBOARD</span>
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center relative z-10 pt-12 border-t border-slate-100/50">
            <p className="text-slate-400 font-bold text-sm">
                New Partner? <Link to="/admin/register" className="text-indigo-600 font-black hover:text-purple-600 transition-colors underline decoration-2 underline-offset-4">Apply for Membership</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;

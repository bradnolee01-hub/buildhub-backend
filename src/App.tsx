/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  supabase, 
  signOut as logOut 
} from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { 
  Building2, 
  Package, 
  MessageSquare, 
  ClipboardList, 
  LayoutDashboard, 
  LogOut, 
  LogIn,
  CheckCircle2,
  Globe,
  UserCircle,
  Briefcase,
  Mail,
  Lock,
  ArrowLeft,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authView, setAuthView] = useState<'landing' | 'email-signup' | 'email-signin'>('landing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user || null;
      setUser(u);
      
      if (u) {
        try {
          const { data: profileDoc } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', u.id)
            .single();

          if (profileDoc) {
            setProfile(profileDoc);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    let API_URL = import.meta.env.VITE_API_URL || '';
    if (API_URL === 'undefined') API_URL = '';
    if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);

    const targetUrl = `${API_URL}/api/health`;
    console.log('Health check target:', targetUrl);

    fetch(targetUrl)
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setHealthStatus(data.status === 'ok' ? 'ok' : 'error');
      })
      .catch((err) => {
        console.error('Health check failed:', err);
        setHealthStatus('error');
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleEmailSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const companyName = formData.get('companyName') as string;
    const city = formData.get('city') as string;
    const country = formData.get('country') as string;
    const role = formData.get('role') as string;
    const website = formData.get('website') as string;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
            city: city,
            country: country,
            role: role,
            website: website,
          }
        }
      });

      if (error) throw error;
      
      const signupData = {
        id: data.user!.id,
        email: email,
        display_name: fullName,
        company_name: companyName,
        city: city,
        country: country,
        role: role,
        website: website,
        auth_method: 'email',
        created_at: new Date().toISOString()
      };

      // If email confirmation is off, we have a session and can insert immediately
      if (data.session) {
        const { error: dbError } = await supabase
          .from('profiles')
          .insert([signupData]);

        if (dbError) {
          console.error("Profile insertion error:", dbError);
          // We don't throw here because the user is already created in Auth
          // They might need to try updating their profile later
        }
        setProfile(signupData);
        setAuthView('landing'); // Will trigger the logged in view
      } else {
        // Email confirmation is likely ON
        setError("Success! Please check your email to confirm your account before logging in.");
        // We still try to insert, but it might fail if RLS requires session
        await supabase.from('profiles').insert([signupData]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold tracking-tight">BuildHub</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-medium">
              <span className={`w-2 h-2 rounded-full ${healthStatus === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
              Server: {healthStatus.toUpperCase()}
            </div>
            {user && profile ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold">{profile.display_name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{profile.role}</p>
                </div>
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="User" className="w-8 h-8 rounded-full border border-slate-700" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                    {(profile.display_name || 'U').charAt(0)}
                  </div>
                )}
                <button 
                  onClick={logOut}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : !user && (
              <div className="flex gap-2">
                 <button 
                  onClick={() => setAuthView('email-signin')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-all"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!user || !profile ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl w-full"
            >
              <AnimatePresence mode="wait">
                {authView === 'landing' && (
                  <motion.div
                    key="landing"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h1 className="text-5xl font-black mb-6 tracking-tight">
                      The Operating System for <br />
                      <span className="text-blue-500 underline decoration-blue-500/30">Construction Businesses</span>
                    </h1>
                    <p className="text-slate-400 text-lg mb-8">
                      BuildHub centralizes your projects, marketplace, and messaging into one secure platform.
                    </p>
                    
                    <div className="space-y-4 max-w-sm mx-auto">
                      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs mb-4 text-left">{error}</div>}
                      
                      <button 
                        onClick={() => setAuthView('email-signup')}
                        className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                      >
                        <Mail className="w-5 h-5" />
                        Sign Up with Email
                      </button>

                      <p className="text-slate-500 text-sm mt-4">
                        Already have an account? {' '}
                        <button 
                          onClick={() => setAuthView('email-signin')}
                          className="text-blue-500 hover:underline font-medium"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}

                {authView === 'email-signup' && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-md mx-auto text-left bg-slate-900 border border-slate-800 p-8 rounded-3xl"
                  >
                    <button onClick={() => setAuthView('landing')} className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <h2 className="text-3xl font-black mb-2">Create Account</h2>
                    <p className="text-slate-400 mb-6">Enter your details to create a BuildHub profile.</p>
                    
                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}

                    <form onSubmit={handleEmailSignup} className="space-y-4">
                       <input name="fullName" required placeholder="Full Name" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                       <input name="email" type="email" required placeholder="Email Address" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                       <input name="password" type="password" required placeholder="Password" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                       
                       <div className="grid grid-cols-1 gap-4">
                         <input name="companyName" required placeholder="Company Name" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                         <div className="grid grid-cols-2 gap-4">
                           <input name="city" required placeholder="City" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                           <input name="country" required placeholder="Country" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                         </div>
                       </div>

                       <select name="role" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                          <option value="client">Client / Developer</option>
                          <option value="contractor">Main Contractor</option>
                          <option value="supplier">Material Supplier</option>
                       </select>
                       <div className="space-y-1">
                         <input name="website" type="url" required placeholder="Website / LinkedIn / Facebook Profile" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                         <p className="text-[10px] text-slate-500 px-2">Provide your business website or profile URL for verification.</p>
                       </div>
                       <button disabled={submitting} type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center justify-center gap-2">
                         {submitting ? 'Creating...' : 'Register'}
                       </button>
                    </form>
                  </motion.div>
                )}

                {authView === 'email-signin' && (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="max-w-md mx-auto text-left bg-slate-900 border border-slate-800 p-8 rounded-3xl"
                  >
                    <button onClick={() => setAuthView('landing')} className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
                    <p className="text-slate-400 mb-6">Pick up where you left off.</p>
                    
                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}

                    <form onSubmit={handleEmailSignin} className="space-y-4">
                       <input name="email" type="email" required placeholder="Email Address" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                       <input name="password" type="password" required placeholder="Password" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                       <button disabled={submitting} type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center justify-center gap-2">
                         {submitting ? 'Signing in...' : 'Login'}
                       </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <aside className="space-y-2">
              <NavButton icon={<LayoutDashboard />} label="Dashboard" active />
              <NavButton icon={<Building2 />} label="Company Profile" />
              <NavButton icon={<Package />} label="Materials" />
              <NavButton icon={<ClipboardList />} label="Tenders" />
              <NavButton icon={<MessageSquare />} label="Messages" />
            </aside>

            {/* Dashboard Content */}
            <div className="md:col-span-3 space-y-8">
              <header className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Welcome, {profile.display_name}</h2>
                <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm">
                  <span className="px-2 py-0.5 bg-slate-800 rounded uppercase font-bold text-[10px] text-blue-400">
                    {profile?.role || 'User'}
                  </span>
                  {profile?.company_name && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {profile.company_name}
                    </div>
                  )}
                  {profile?.city && profile?.country && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Globe className="w-3.5 h-3.5" />
                      {profile.city}, {profile.country}
                    </div>
                  )}
                  {profile?.website && (
                    <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                      <LinkIcon className="w-3 h-3" /> {new URL(profile.website).hostname}
                    </a>
                  )}
                </div>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Active Projects" value="0" />
                <StatCard title="Total Leads" value="0" />
                <StatCard title="Invoices Pending" value="$0.00" />
              </div>

              {/* Status Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-400">
                  <CheckCircle2 className="w-5 h-5" />
                  BuildHub Account Security
                </h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Local email/password authentication via Supabase Auth.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Flexible identity verification: Website, LinkedIn, or Facebook profiles accepted.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Real-time profile synchronization and PostgreSQL persistence.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NavButton({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      {label}
    </button>
  );
}

function StatCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}


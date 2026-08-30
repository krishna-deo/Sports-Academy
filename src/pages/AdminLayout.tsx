import React, { useState, useEffect } from 'react';
import {
  Lock,
  User as UserIcon,
  House,
  GraduationCap,
  Users,
  Image as ImageIcon,
  Calendar,
  Trophy,
  Buildings,
  ChatText,
  Megaphone,
  FileText,
  EnvelopeOpen,
  Notebook,
  UserGear,
  Gear,
  SignOut,
  List,
  X,
  ArrowLeft,
  Key,
  ShieldCheck
} from '@phosphor-icons/react';
import { AdminViews } from './AdminViews';

export const AdminLayout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  
  // Forgot Password / Recovery States
  const [loginView, setLoginView] = useState<'login' | 'forgot' | 'reset'>('login');
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [recoveryToken, setRecoveryToken] = useState<string>('');
  const [newRecoveryPassword, setNewRecoveryPassword] = useState<string>('');
  const [confirmRecoveryPassword, setConfirmRecoveryPassword] = useState<string>('');
  const [recoveryMessage, setRecoveryMessage] = useState<string>('');
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Check login state on mount
  useEffect(() => {
    const token = localStorage.getItem('rlbsa_admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setLoginError('');
        localStorage.setItem('rlbsa_admin_token', data.token);
      } else {
        setLoginError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setLoginError('Unable to connect to the backend server. Please make sure the server is running on port 5000.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rlbsa_admin_token');
    setActiveTab('dashboard');
    window.location.hash = '#/';
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;
    setIsSendingCode(true);
    setRecoveryMessage('');
    setLoginError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setRecoveryMessage(data.message);
        setLoginView('reset');
      } else {
        setLoginError(data.error || 'Failed to request recovery code.');
      }
    } catch (err) {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryToken.trim() || !newRecoveryPassword.trim()) {
      alert("Verification code and new password are required.");
      return;
    }
    if (newRecoveryPassword !== confirmRecoveryPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (newRecoveryPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }
    setIsResetting(true);
    setLoginError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recoveryEmail.trim(),
          token: recoveryToken.trim(),
          newPassword: newRecoveryPassword
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert("Password reset successfully! You can now log in using your new password.");
        setLoginView('login');
        setRecoveryEmail('');
        setRecoveryToken('');
        setNewRecoveryPassword('');
        setConfirmRecoveryPassword('');
        setRecoveryMessage('');
      } else {
        setLoginError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  // Render Login view if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 font-main overflow-x-hidden">
        
        {/* Left Side Visual Pane (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-16 text-white relative overflow-hidden bg-primary select-none">
          {/* Hero background with dark overlay mask */}
          <img 
            src="/images/hero1.png" 
            alt="Academy athletes training" 
            className="absolute inset-0 w-full h-full object-cover z-0 object-center scale-105 filter brightness-90 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/95 via-primary/80 to-primary/45 z-10"></div>
          
          {/* Top Brand Block */}
          <div className="relative z-20 flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-accent leading-none">RANI LAXMIBAI</span>
              <span className="text-[9px] font-bold text-white/70 tracking-[0.25em] leading-none mt-1">SPORTS ACADEMY</span>
            </div>
          </div>

          {/* Central Welcome Block */}
          <div className="relative z-20 max-w-lg mt-auto mb-auto flex flex-col gap-5">
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full w-fit">
              Foundation Portal
            </span>
            <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
              Shaping Sports, Education & Health.
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Empowering underprivileged athletic talent across India through professional coaching, scholastic funding, and standard healthcare support.
            </p>
          </div>

          {/* Bottom Footer Credits */}
          <div className="relative z-20 flex justify-between text-[11px] text-white/50 font-semibold tracking-wider uppercase">
            <span>&copy; {new Date().getFullYear()} RLBSA Foundation</span>
            <span>Secure Admin Protocol</span>
          </div>
        </div>

        {/* Right Side Workspace Pane (Forms Container) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-center bg-white px-8 py-16 md:px-16 min-h-screen shadow-2xl relative z-20">
          <div className="w-full max-w-md mx-auto flex flex-col gap-6 text-left">
            
            {/* Logo Badge for Mobile */}
            <div className="lg:hidden flex flex-col mb-4">
              <span className="text-2xl font-extrabold tracking-tight text-primary leading-none">RANI LAXMIBAI</span>
              <span className="text-[10px] font-bold text-text-light tracking-[0.2em] leading-none mt-1">SPORTS ACADEMY</span>
            </div>

            {/* Form Headers */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 py-1.5 px-3 rounded-full w-fit">
                Dashboard Portal
              </span>
              <h1 className="text-2.5xl font-extrabold text-primary tracking-tight">
                {loginView === 'login' && "Welcome Back"}
                {loginView === 'forgot' && "Recover Account"}
                {loginView === 'reset' && "Reset Password"}
              </h1>
              <p className="text-text-light text-xs font-semibold leading-relaxed">
                {loginView === 'login' && "Sign in with your administrative account to manage operations"}
                {loginView === 'forgot' && "Enter your registered email address to request a reset code"}
                {loginView === 'reset' && "Enter the verification code and set your new account password"}
              </p>
            </div>

            {/* Form Views Render */}

            {/* 1. Login Form */}
            {loginView === 'login' && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
                {loginError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 py-3 px-4 rounded-xl text-xs font-semibold leading-relaxed">
                    {loginError}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-user" className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400"><UserIcon size={18} /></span>
                    <input
                      type="text"
                      id="login-user"
                      required
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full py-3.5 pl-11 pr-4 border border-border-gray rounded-xl bg-soft-light text-sm text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="login-pass" className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      Password
                    </label>
                    <button 
                      type="button"
                      onClick={() => {
                        setLoginView('forgot');
                        setLoginError('');
                      }}
                      className="text-[10px] font-bold text-accent hover:text-primary transition-all uppercase tracking-wider bg-transparent border-none cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400"><Lock size={18} /></span>
                    <input
                      type="password"
                      id="login-pass"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-3.5 pl-11 pr-4 border border-border-gray rounded-xl bg-soft-light text-sm text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-accent hover:text-primary text-white font-bold py-4 rounded-xl transition-all cursor-pointer shadow-lg mt-3 text-sm border-none outline-none"
                >
                  SIGN IN
                </button>

                <div className="mt-4 pt-4 border-t border-border-gray text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Default Credentials</span>
                  <code className="text-text-body text-xs bg-soft-light py-1 px-3.5 rounded border border-border-gray font-bold">admin / admin123</code>
                </div>
              </form>
            )}

            {/* 2. Forgot Password Request View */}
            {loginView === 'forgot' && (
              <form onSubmit={handleRequestCode} className="flex flex-col gap-4 mt-2">
                {loginError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 py-3 px-4 rounded-xl text-xs font-semibold leading-relaxed">
                    {loginError}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="recovery-email" className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400"><EnvelopeOpen size={18} /></span>
                    <input
                      type="email"
                      id="recovery-email"
                      required
                      placeholder="admin@sportsacademy.com"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full py-3.5 pl-11 pr-4 border border-border-gray rounded-xl bg-soft-light text-sm text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingCode}
                  className="w-full bg-primary hover:bg-accent hover:text-primary text-white font-bold py-4 rounded-xl transition-all cursor-pointer shadow-lg mt-3 text-sm border-none outline-none disabled:opacity-60"
                >
                  {isSendingCode ? 'SENDING CODE...' : 'REQUEST RESET CODE'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginView('login');
                    setLoginError('');
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-all bg-transparent border-none cursor-pointer mt-3"
                >
                  <ArrowLeft size={16} /> Back to Login
                </button>
              </form>
            )}

            {/* 3. Reset Password Code Verification View */}
            {loginView === 'reset' && (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4 mt-2">
                {loginError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 py-3 px-4 rounded-xl text-xs font-semibold leading-relaxed">
                    {loginError}
                  </div>
                )}

                {recoveryMessage && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 py-3 px-4 rounded-xl text-xs font-semibold leading-relaxed">
                    {recoveryMessage}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="recovery-token" className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400"><Key size={18} /></span>
                    <input
                      type="text"
                      id="recovery-token"
                      required
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={recoveryToken}
                      onChange={(e) => setRecoveryToken(e.target.value)}
                      className="w-full py-3 pl-11 pr-4 border border-border-gray rounded-xl bg-soft-light text-sm text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-bold tracking-widest text-center"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="recovery-pass" className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400"><Lock size={18} /></span>
                    <input
                      type="password"
                      id="recovery-pass"
                      required
                      placeholder="Min 6 characters"
                      value={newRecoveryPassword}
                      onChange={(e) => setNewRecoveryPassword(e.target.value)}
                      className="w-full py-3 pl-11 pr-4 border border-border-gray rounded-xl bg-soft-light text-sm text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="recovery-pass-confirm" className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400"><Lock size={18} /></span>
                    <input
                      type="password"
                      id="recovery-pass-confirm"
                      required
                      placeholder="Re-type new password"
                      value={confirmRecoveryPassword}
                      onChange={(e) => setConfirmRecoveryPassword(e.target.value)}
                      className="w-full py-3 pl-11 pr-4 border border-border-gray rounded-xl bg-soft-light text-sm text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-primary hover:bg-accent hover:text-primary text-white font-bold py-4 rounded-xl transition-all cursor-pointer shadow-lg mt-3 text-sm border-none outline-none disabled:opacity-60"
                >
                  {isResetting ? 'RESETTING PASSWORD...' : 'RESET PASSWORD'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginView('login');
                    setLoginError('');
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-all bg-transparent border-none cursor-pointer mt-2"
                >
                  <ArrowLeft size={16} /> Back to Login
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    );
  }

  // Sidebar Menu Items Definition
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <House size={20} /> },
    { id: 'students', label: 'Students', icon: <GraduationCap size={20} /> },
    { id: 'coaches', label: 'Coaches', icon: <Users size={20} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy size={20} /> },
    { id: 'facilities', label: 'Facilities', icon: <Buildings size={20} /> },
    { id: 'success-stories', label: 'Success Stories', icon: <ChatText size={20} /> },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone size={20} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={20} /> },
    { id: 'compliance', label: 'Compliance', icon: <ShieldCheck size={20} /> },
    { id: 'enquiries', label: 'Enquiries', icon: <EnvelopeOpen size={20} /> },
    { id: 'founders', label: 'Founders & Directors', icon: <Notebook size={20} /> },
    { id: 'users', label: 'Admin Users', icon: <UserGear size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Gear size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-soft-light font-main overflow-hidden text-slate-800">

      {/* Sidebar navigation */}
      <aside
        className={`bg-primary text-white flex flex-col transition-all duration-300 z-50 shrink-0 ${isSidebarOpen ? 'w-[260px]' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'
          }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-primary-light/30 flex items-center justify-between px-5">
          {isSidebarOpen ? (
            <div className="flex flex-col">
              <span className="text-md font-extrabold text-white tracking-wider leading-none">RLBSA ADMIN</span>
              <span className="text-[9px] font-bold text-accent tracking-[0.15em] leading-none mt-1">MANAGEMENT PANEL</span>
            </div>
          ) : (
            <span className="text-accent font-extrabold text-sm mx-auto">RL</span>
          )}
          <button
            className="md:hidden text-white bg-transparent border-none p-1 cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable menu links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 py-3 px-3.5 rounded-lg text-[13.5px] font-semibold text-white/70 hover:bg-primary-light hover:text-white transition-all cursor-pointer text-left border-none ${activeTab === item.id ? 'bg-primary-light text-accent font-bold border-l-4 border-l-accent pl-2.5' : ''
                }`}
            >
              <span className={activeTab === item.id ? 'text-accent' : 'text-white/50'}>
                {item.icon}
              </span>
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 py-3 px-3.5 rounded-lg text-[13.5px] font-semibold text-rose-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer text-left border-none"
          >
            <SignOut size={20} className="text-rose-400" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main dashboard viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Main Dashboard Header */}
        <header className="h-16 bg-white border-b border-border-gray flex items-center justify-between px-6 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="text-primary bg-none border-none p-1 cursor-pointer flex items-center"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Sidebar Menu"
            >
              <List size={22} />
            </button>
            <h2 className="text-lg font-bold text-primary capitalize">
              {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-xs font-bold text-primary">Admin Manager</span>
              <span className="text-[10px] text-text-light font-semibold uppercase tracking-wider">rlbsa_staff</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-inner">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Active Category Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-soft-light">
          <AdminViews activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

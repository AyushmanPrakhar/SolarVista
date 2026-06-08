import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const API_URL = import.meta.env.VITE_API_URL;

try {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccess('Login successful! Redirecting...');
      
      // Store user in context and localStorage
      login(data.user);

      setTimeout(() => navigate(from, { replace: true }), 1000);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      {/* Background Video Section - 100% Viewport */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/video/login-bg.mp4" type="video/mp4" />
        </video>
        {/* Navy Overlay - 75% opacity */}
        <div className="absolute inset-0 bg-[#0B132B]/75" />
      </div>

      {/* Brand Logo - Top Left */}
      <div className="absolute top-8 left-8 z-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-[#FACC15] p-2 rounded-xl shadow-lg shadow-yellow-500/20">
            <FaSun className="text-[#0B132B] text-2xl" />
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">SolarVista</span>
        </motion.div>
      </div>

      {/* Main Content - Centered Floating Card */}
      <div className="relative z-10 w-full max-w-[450px] px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          {/* Glassmorphism Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden">
            
            {/* Header Content */}
            <div className="mb-10 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-white text-3xl md:text-4xl font-bold mb-3"
              >
                Welcome <span className="text-[#FACC15]">Back</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-slate-300 text-sm md:text-base leading-relaxed"
              >
                Sign in to continue to SolarVista Intelligence Dashboard.
              </motion.p>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/20 border border-red-500/50 backdrop-blur-sm p-4 mb-6 rounded-xl"
                >
                  <p className="text-red-200 text-sm font-medium">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-500/20 border border-green-500/50 backdrop-blur-sm p-4 mb-6 rounded-xl"
                >
                  <p className="text-green-200 text-sm font-medium">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-200 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-slate-400 group-focus-within:text-[#FACC15] transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316]/50 transition-all"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-200 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-slate-400 group-focus-within:text-[#FACC15] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316]/50 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="text-slate-400 hover:text-white transition-colors" /> : <FaEye className="text-slate-400 hover:text-white transition-colors" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-white/5 border-white/20 text-[#F97316] focus:ring-[#F97316]/50 rounded cursor-pointer transition-all"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300 cursor-pointer">
                    Remember Me
                  </label>
                </div>
                <span className="text-sm font-medium text-[#FACC15] hover:text-[#EAB308] transition-colors cursor-pointer">
                  Forgot Password?
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#EA580C' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-xl shadow-orange-900/20 transition-all flex items-center justify-center gap-3 ${
                  isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-[#F97316]'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : 'Sign In'}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-300">
                Don't have an account?{' '}
                <Link to="/signup" className="font-bold text-[#FACC15] hover:text-[#EAB308] transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0B132B]/50 to-transparent pointer-events-none z-0" />
    </div>
  );
};

export default Login;

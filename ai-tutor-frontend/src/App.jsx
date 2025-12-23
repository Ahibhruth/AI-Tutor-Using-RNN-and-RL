import React, { useState } from 'react';
import { GraduationCap, LogOut, Sparkles, BookOpen, Brain, TrendingUp, Zap, Shield, Users, ArrowLeft } from 'lucide-react';

function App() {
  const [page, setPage] = useState('home');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const navigateTo = (pageName) => setPage(pageName);

  const handleLogin = (user) => {
    setUsername(user);
    localStorage.setItem('username', user);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('username');
    setPage('home');
  };

  return (
    <div className="min-h-screen">
      {page === 'home' && <Home onNavigate={navigateTo} />}
      {page === 'login' && <Login onNavigate={navigateTo} onLogin={handleLogin} />}
      {page === 'signup' && <Signup onNavigate={navigateTo} onLogin={handleLogin} />}
      {page === 'dashboard' && <Dashboard username={username} onLogout={handleLogout} />}
    </div>
  );
}

const Home = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AI Tutor</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('login')}
              className="px-5 py-2 text-white hover:text-blue-400 transition-colors font-medium"
            >
              Login
            </button>
            <button 
              onClick={() => onNavigate('signup')}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">Powered by Advanced AI</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
          Learn Smarter with
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI-Powered Tutoring
          </span>
        </h1>
        
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Experience personalized learning with cutting-edge AI technology. Master any subject with intelligent guidance, adaptive quizzes, and real-time progress tracking.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={() => onNavigate('signup')}
            className="w-64 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl text-lg font-bold transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/30"
          >
            Start Learning Free
          </button>
          <button 
            onClick={() => onNavigate('login')}
            className="w-64 px-8 py-4 bg-white/5 hover:bg-white/10 border-2 border-white/20 text-white rounded-2xl text-lg font-bold transition-all transform hover:scale-105"
          >
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-20">
          <div>
            <div className="text-4xl font-black text-purple-400 mb-2">98%</div>
            <div className="text-slate-400">Success Rate</div>
          </div>
          <div>
            <div className="text-4xl font-black text-pink-400 mb-2">24/7</div>
            <div className="text-slate-400">AI Support</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">
          Everything You Need to Excel
        </h2>
        <p className="text-slate-400 text-center mb-12 text-lg">
          Powerful features designed to accelerate your learning journey
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Brain className="w-8 h-8" />}
            title="AI Mentors"
            description="Get instant help from specialized AI tutors trained in every subject you need."
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard 
            icon={<BookOpen className="w-8 h-8" />}
            title="Smart Quizzes"
            description="Adaptive assessments that adjust difficulty based on your performance."
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard 
            icon={<TrendingUp className="w-8 h-8" />}
            title="Progress Analytics"
            description="Track your improvement with detailed insights and performance metrics."
            gradient="from-orange-500 to-red-500"
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8" />}
            title="Instant Feedback"
            description="Receive real-time corrections and explanations to learn from mistakes."
            gradient="from-green-500 to-emerald-500"
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8" />}
            title="Personalized Path"
            description="Custom learning roadmaps tailored to your goals and skill level."
            gradient="from-indigo-500 to-blue-500"
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8" />}
            title="Study Groups"
            description="Collaborate with peers and share knowledge in interactive sessions."
            gradient="from-pink-500 to-rose-500"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${gradient} mb-4 group-hover:scale-110 transition-transform`}>
      <div className="text-white">{icon}</div>
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const Login = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      onLogin(formData.username);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400">Sign in to continue your learning journey</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 mt-6"
            >
              Sign In
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <button onClick={() => onNavigate('signup')} className="text-blue-400 hover:text-blue-300 font-semibold hover:underline">
                Create one
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => onNavigate('home')} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center justify-center space-x-2 mx-auto">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Signup = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      onLogin(formData.username);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-2">Create Account</h2>
          <p className="text-slate-400">Start your AI-powered learning adventure</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 mt-6"
            >
              Create Account
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')} className="text-purple-400 hover:text-purple-300 font-semibold hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => onNavigate('home')} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center justify-center space-x-2 mx-auto">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ username, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-sm bg-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">AI Tutor</span>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-slate-400">Powered by AI</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-slate-400 text-sm">Welcome, </span>
              <span className="text-blue-400 font-semibold">{username}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all hover:scale-105 group"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-semibold text-sm">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-black text-white mb-4">
          Welcome back, <span className="text-blue-400">{username}</span>!
        </h1>
        <p className="text-xl text-slate-400 mb-12">Ready to continue your learning journey?</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            icon={<Brain className="w-8 h-8" />}
            title="AI Tutors"
            description="Chat with subject experts"
            gradient="from-blue-500 to-cyan-500"
          />
          <DashboardCard
            icon={<BookOpen className="w-8 h-8" />}
            title="My Courses"
            description="Continue learning"
            gradient="from-purple-500 to-pink-500"
          />
          <DashboardCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Progress"
            description="View your analytics"
            gradient="from-orange-500 to-red-500"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, description, gradient }) => (
  <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-4 group-hover:scale-110 transition-transform`}>
      <div className="text-white">{icon}</div>
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

export default App;
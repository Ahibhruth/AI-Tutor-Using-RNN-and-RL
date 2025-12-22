import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, GraduationCap, Sparkles } from "lucide-react";
import api from "../api/api";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/login", { username, password });
      if (res.data.success) {
        localStorage.setItem("username", username);
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') login();
  };

  return (
    <AuthLayout>
      <div className="glass rounded-2xl p-8 shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-75 animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            AI Tutor
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <p className="text-gray-400 text-sm">
              Adaptive learning with reinforcement learning
            </p>
          </div>
        </div>

        {/* Username Input */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 font-medium mb-2 block">Username</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 outline-none"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="text-sm text-gray-300 font-medium mb-2 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-12 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
  onClick={login}
  disabled={loading}
  className="
    w-full py-3.5 text-lg font-semibold
    bg-indigo-600
    hover:bg-indigo-500
    border border-indigo-400/40
    rounded-lg
    transition-all duration-200
    active:scale-[0.98]
    disabled:opacity-50 disabled:cursor-not-allowed
    shadow-md
  "
>
  {loading ? "Signing in..." : "Sign in"}
</button>


        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="py-2.5 glass border border-gray-700 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 font-medium text-sm">
            Google
          </button>
          <button className="py-2.5 glass border border-gray-700 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 font-medium text-sm">
            GitHub
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-sm text-gray-400 text-center">
          No account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
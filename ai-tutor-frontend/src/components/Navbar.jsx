import { useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("username");

  if (!user) return null;

  return (
    <nav className="h-16 glass sticky top-0 z-50 flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-75 animate-pulse-glow"></div>
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Tutor
          </span>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-gray-400">Powered by RL</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <span className="text-gray-400">Welcome, </span>
          <span className="text-indigo-400 font-semibold">{user}</span>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all duration-300 hover:scale-105 group"
        >
          <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
          <span className="text-red-400 group-hover:text-red-300 text-sm font-medium">
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}
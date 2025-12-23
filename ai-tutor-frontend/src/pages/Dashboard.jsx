// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Upload, FileText, Sparkles, Brain, TrendingUp, Clock, CheckCircle } from "lucide-react";
// import api from "../api/api";

// export default function Dashboard() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const navigate = useNavigate();

//   const upload = async () => {
//     if (!file) {
//       alert("Please select a file first!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const form = new FormData();
//       form.append("file", file);
//       form.append("quiz_type", "mcq");
//       form.append("num_questions", 10);

//       const res = await api.post("/api/upload", form);
//       if (res.data.success) navigate("/quiz");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setFile(e.dataTransfer.files[0]);
//     }
//   };

//   return (
//     <div className="min-h-screen p-8">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Header */}
//         <div className="text-center mb-12 animate-slide-up">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
//             Welcome to Your Learning Space
//           </h1>
//           <p className="text-gray-400 text-lg">
//             Upload your study materials and let AI create personalized quizzes
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid md:grid-cols-3 gap-6 mb-12">
//           <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-3 rounded-xl">
//                 <Brain className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-3xl font-bold text-indigo-400">0</span>
//             </div>
//             <h3 className="text-gray-300 font-semibold">Quizzes Taken</h3>
//             <p className="text-gray-500 text-sm mt-1">Start your first quiz</p>
//           </div>

//           <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
//                 <TrendingUp className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-3xl font-bold text-purple-400">0%</span>
//             </div>
//             <h3 className="text-gray-300 font-semibold">Average Score</h3>
//             <p className="text-gray-500 text-sm mt-1">Track your progress</p>
//           </div>

//           <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
//             <div className="flex items-center justify-between mb-4">
//               <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-3 rounded-xl">
//                 <Clock className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-3xl font-bold text-cyan-400">0h</span>
//             </div>
//             <h3 className="text-gray-300 font-semibold">Study Time</h3>
//             <p className="text-gray-500 text-sm mt-1">Time invested</p>
//           </div>
//         </div>

//         {/* Upload Section */}
//         <div className="glass rounded-2xl p-8 mb-8">
//           <div className="flex items-center space-x-3 mb-6">
//             <Sparkles className="w-6 h-6 text-yellow-400" />
//             <h2 className="text-2xl font-bold text-white">Generate Quiz</h2>
//           </div>

//           {/* Drag and Drop Area */}
//           <div
//             className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
//               dragActive
//                 ? "border-indigo-500 bg-indigo-500/10"
//                 : "border-gray-700 hover:border-gray-600"
//             }`}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//           >
//             <div className="flex flex-col items-center">
//               <div className="relative mb-6">
//                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse-glow"></div>
//                 <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-full">
//                   <Upload className="w-12 h-12 text-white" />
//                 </div>
//               </div>

//               {file ? (
//                 <div className="mb-4">
//                   <div className="flex items-center space-x-3 bg-green-500/10 border border-green-500/30 rounded-lg px-6 py-3">
//                     <FileText className="w-5 h-5 text-green-400" />
//                     <span className="text-green-400 font-medium">{file.name}</span>
//                     <CheckCircle className="w-5 h-5 text-green-400" />
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <h3 className="text-xl font-semibold text-white mb-2">
//                     Drop your study material here
//                   </h3>
//                   <p className="text-gray-400 mb-6">
//                     or click to browse files
//                   </p>
//                 </>
//               )}

//               <input
//                 type="file"
//                 onChange={(e) => setFile(e.target.files[0])}
//                 className="hidden"
//                 id="file-upload"
//                 accept=".pdf,.doc,.docx,.txt"
//               />
              
//               <label
//                 htmlFor="file-upload"
//                 className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-gray-700 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 font-medium"
//               >
//                 Browse Files
//               </label>

//               <p className="text-sm text-gray-500 mt-4">
//                 Supported formats: PDF, DOC, DOCX, TXT
//               </p>
//             </div>
//           </div>

//           {/* Quiz Settings */}
//           <div className="mt-8 grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="text-sm text-gray-300 font-medium mb-2 block">
//                 Quiz Type
//               </label>
//               <select className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 outline-none">
//                 <option value="mcq">Multiple Choice</option>
//                 <option value="tf">True/False</option>
//                 <option value="short">Short Answer</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-sm text-gray-300 font-medium mb-2 block">
//                 Number of Questions
//               </label>
//               <select className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 outline-none">
//                 <option value="5">5 Questions</option>
//                 <option value="10" selected>10 Questions</option>
//                 <option value="15">15 Questions</option>
//                 <option value="20">20 Questions</option>
//               </select>
//             </div>
//           </div>

//           {/* Generate Button */}
//           <button
//             onClick={upload}
//             disabled={!file || loading}
//             className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 btn-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                 </svg>
//                 <span>Generating Quiz...</span>
//               </>
//             ) : (
//               <>
//                 <Sparkles className="w-5 h-5" />
//                 <span>Generate Quiz with AI</span>
//               </>
//             )}
//           </button>
//         </div>

//         {/* How it Works */}
//         <div className="glass rounded-2xl p-8">
//           <h3 className="text-xl font-bold text-white mb-6">How It Works</h3>
//           <div className="grid md:grid-cols-3 gap-6">
//             <div className="flex flex-col items-center text-center">
//               <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-xl mb-4">
//                 <Upload className="w-6 h-6 text-white" />
//               </div>
//               <h4 className="font-semibold text-white mb-2">1. Upload Material</h4>
//               <p className="text-sm text-gray-400">
//                 Upload your study notes, textbooks, or any learning material
//               </p>
//             </div>

//             <div className="flex flex-col items-center text-center">
//               <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl mb-4">
//                 <Brain className="w-6 h-6 text-white" />
//               </div>
//               <h4 className="font-semibold text-white mb-2">2. AI Processing</h4>
//               <p className="text-sm text-gray-400">
//                 Our AI analyzes content and generates personalized questions
//               </p>
//             </div>

//             <div className="flex flex-col items-center text-center">
//               <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-4 rounded-xl mb-4">
//                 <TrendingUp className="w-6 h-6 text-white" />
//               </div>
//               <h4 className="font-semibold text-white mb-2">3. Learn & Improve</h4>
//               <p className="text-sm text-gray-400">
//                 Take quizzes and track your progress with adaptive learning
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
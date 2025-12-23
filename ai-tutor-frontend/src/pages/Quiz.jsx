// import { useEffect, useState } from "react";
// import { CheckCircle, Trophy, Brain, Zap, Target } from "lucide-react";
// import api from "../api/api";

// export default function Quiz() {
//   const [q, setQ] = useState(null);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [score, setScore] = useState(0);
//   const [questionNumber, setQuestionNumber] = useState(1);

//   const load = async () => {
//     const res = await api.get("/api/get_question");
//     setQ(res.data);
//     setSelectedAnswer(null);
//     setShowFeedback(false);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const submit = async (answer) => {
//     setSelectedAnswer(answer);
//     setShowFeedback(true);

//     const res = await api.post("/api/submit", { answer });

//     if (res.data.correct) {
//       setScore((s) => s + 1);
//     }

//     setTimeout(() => {
//       setQuestionNumber((n) => n + 1);
//       load();
//     }, 1800);
//   };

//   /* ---------------- LOADING ---------------- */
//   if (!q) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Brain className="w-14 h-14 text-indigo-500 mx-auto mb-4 animate-pulse" />
//           <h2 className="text-2xl font-semibold text-white mb-1">
//             Loading Quiz…
//           </h2>
//           <p className="text-gray-400">Preparing your questions</p>
//         </div>
//       </div>
//     );
//   }

//   /* ---------------- FINISHED ---------------- */
//   if (q.finished) {
//     const accuracy =
//       questionNumber > 1
//         ? Math.round((score / (questionNumber - 1)) * 100)
//         : 0;

//     return (
//       <div className="min-h-screen flex items-center justify-center p-8">
//         <div className="max-w-2xl w-full bg-[#111827] border border-gray-800 rounded-2xl p-10 text-center">
//           <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />

//           <h1 className="text-4xl font-bold text-white mb-2">
//             Quiz Complete
//           </h1>
//           <p className="text-gray-400 mb-8">
//             Well done on completing the quiz
//           </p>

//           <div className="grid grid-cols-3 gap-6 mb-10">
//             <Stat icon={<Target />} label="Questions" value={questionNumber - 1} />
//             <Stat icon={<CheckCircle />} label="Correct" value={score} />
//             <Stat icon={<Zap />} label="Accuracy" value={`${accuracy}%`} />
//           </div>

//           <button
//             onClick={() => (window.location.href = "/dashboard")}
//             className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /* ---------------- QUIZ ---------------- */
//   return (
//     <div className="min-h-screen p-8">
//       <div className="max-w-4xl mx-auto">

//         {/* Progress */}
//         <div className="mb-8">
//           <div className="flex justify-between text-sm text-gray-400 mb-2">
//             <span>Question {questionNumber}</span>
//             <span>Score: {score}</span>
//           </div>
//           <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-indigo-500 transition-all"
//               style={{ width: `${Math.min(questionNumber * 10, 100)}%` }}
//             />
//           </div>
//         </div>

//         {/* Question */}
//         <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 mb-8">
//           <div className="flex items-start gap-4 mb-8">
//             <div className="bg-indigo-600 p-3 rounded-xl">
//               <Brain className="w-6 h-6 text-white" />
//             </div>
//             <h2 className="text-2xl font-semibold text-white leading-relaxed">
//               {q.question}
//             </h2>
//           </div>

//           {/* OPTIONS */}
//           <div className="space-y-5">
//             {q.options?.map((opt, index) => {
//               const isSelected = selectedAnswer === opt;

//               return (
//                 <button
//                   key={opt}
//                   disabled={showFeedback}
//                   onClick={() => submit(opt)}
//                   className={`w-full text-left px-6 py-5 rounded-xl border-2 transition-all duration-200 active:scale-[0.99]
//                     ${
//                       isSelected && showFeedback
//                         ? "border-green-500 bg-green-500/15"
//                         : isSelected
//                         ? "border-indigo-500 bg-indigo-500/15"
//                         : "border-gray-600 bg-[#0b0f14] hover:border-indigo-400 hover:bg-indigo-500/10"
//                     }
//                   `}
//                 >
//                   <div className="flex items-center gap-5">
//                     <div
//                       className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold
//                         ${
//                           isSelected
//                             ? "bg-indigo-500 text-white"
//                             : "bg-gray-700 text-gray-200"
//                         }`}
//                     >
//                       {String.fromCharCode(65 + index)}
//                     </div>
//                     <span className="text-xl font-medium text-white">
//                       {opt}
//                     </span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Tip */}
//         <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
//           <div className="flex gap-3">
//             <Zap className="w-5 h-5 text-yellow-400 mt-1" />
//             <div>
//               <h3 className="font-semibold text-white mb-1">Pro Tip</h3>
//               <p className="text-sm text-gray-400">
//                 Read carefully and eliminate wrong options first.
//               </p>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ---------- Small Stat Component ---------- */
// function Stat({ icon, label, value }) {
//   return (
//     <div className="bg-[#0b0f14] border border-gray-700 rounded-xl p-6">
//       <div className="text-indigo-400 mx-auto mb-2">{icon}</div>
//       <div className="text-3xl font-bold text-white">{value}</div>
//       <div className="text-sm text-gray-400">{label}</div>
//     </div>
//   );
// }

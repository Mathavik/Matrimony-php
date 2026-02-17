import React, { useMemo } from "react";
import { Shield, Users, Lock, Crown } from "lucide-react";

const AdvantageCard: React.FC<{
  icon: React.ElementType;
  title: string;
  subtitle: string;
}> = ({ icon: Icon, title, subtitle }) => (
  <div
    className="relative flex flex-col items-center justify-center text-center
    rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/60
    p-8 shadow-md hover:shadow-xl transition-all duration-500 group overflow-hidden
    w-full h-full min-h-[220px]"
  >
    {/* Small subtle glow ring */}
    <div className="absolute inset-0 bg-gradient-to-br from-rose-300/10 to-purple-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

    {/* ICON CENTER */}
    <div className="relative flex items-center justify-center mb-5">
      <div
        className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500
        flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-105"
      >
        <Icon className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
      </div>
    </div>

    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-sm text-gray-600">{subtitle}</p>

    {/* bottom soft line */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] rounded-full bg-gradient-to-r from-rose-500 to-purple-500 group-hover:w-3/4 transition-all duration-700"></div>
  </div>
);

const MatrimonyAdvantage: React.FC = () => {
  const advantages = useMemo(
    () => [
      { icon: Shield, title: "Top Consultants", subtitle: "Will manage your profile." },
      { icon: Crown, title: "20+ Years", subtitle: "Decades of matchmaking expertise." },
      { icon: Users, title: "50000+ Matrimonys", subtitle: "Have trusted us to find their match." },
      { icon: Lock, title: "100% Privacy", subtitle: "Your profile is confidential and secure." },
    ],
    []
  );

  return (
    <section className="py-14 px-4 sm:px-8 lg:px-14 bg-gradient-to-b from-slate-50 via-rose-50/20 to-purple-50/30 overflow-hidden relative">
      <style>{`
        @keyframes fadeUp {
          0% {opacity:0; transform:translateY(30px);}
          100% {opacity:1; transform:translateY(0);}
        }
        .animate-fadeUp { animation: fadeUp 0.8s ease-out both; }
      `}</style>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {advantages.map((a, i) => (
          <div
            key={i}
            className="animate-fadeUp flex justify-center items-stretch"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <AdvantageCard icon={a.icon} title={a.title} subtitle={a.subtitle} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MatrimonyAdvantage;








// import React from "react";
// import { CheckCircle, Shield, Handshake, Heart } from "lucide-react";

// const StatCard: React.FC<{
//   icon: React.ElementType;
//   title: string;
//   subtitle: string;
// }> = ({ icon: Icon, title, subtitle }) => (
//   <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
//     <div className="flex items-center justify-center mb-3">
//       <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-teal-100 rounded-full">
//         <Icon className="w-6 h-6 text-teal-700" />
//       </div>
//     </div>
//     <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
//     <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
//   </div>
// );

// const MatrimonyStats: React.FC = () => {
//   const stats = [
//     {
//       icon: CheckCircle,
//       title: "100%",
//       subtitle: "Mobile-verified profiles",
//     },
//     {
//       icon: Handshake,
//       title: "4 Crore+",
//       subtitle: "Customers served",
//     },
//     {
//       icon: Shield,
//       title: "25 Years",
//       subtitle: "of successful matchmaking",
//     },
//     {
//       icon: Heart,
//       title: "Trusted",
//       subtitle: "By millions worldwide",
//     },
//   ];

//   return (
//     <section className="bg-white py-10 sm:py-14 px-4 sm:px-8">
//       <style>{`
//         @keyframes fadeUp {
//           0% {opacity: 0; transform: translateY(20px);}
//           100% {opacity: 1; transform: translateY(0);}
//         }
//         .animate-fadeUp {
//           animation: fadeUp 0.8s ease-out both;
//         }
//       `}</style>

//       <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-4 text-center sm:text-left">
//         {stats.map((item, index) => (
//           <React.Fragment key={index}>
//             <div
//               className="flex-1 animate-fadeUp"
//               style={{ animationDelay: `${index * 0.2}s` }}
//             >
//               <StatCard
//                 icon={item.icon}
//                 title={item.title}
//                 subtitle={item.subtitle}
//               />
//             </div>

//             {/* Divider */}
//             {index < stats.length - 1 && (
//               <div className="hidden sm:block w-[1px] h-16 bg-gray-200 mx-4"></div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default MatrimonyStats;

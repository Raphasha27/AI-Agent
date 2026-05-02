import React from 'react';

const VoicePartnerHero = () => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-slate-950">
      {/* Background Glows */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">
            🚀 Agency Partner Program
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
            The Technical Force Behind Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              AI Voice Agents
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            I partner with agency owners and funnel builders to handle the complex build side of AI Voice. 
            From call flows and CRM sync to high-conversion prompts—I'm your reliable backend engineer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <a 
              href="https://calendar.google.com" 
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/20"
            >
              Book a Strategy Call
            </a>
            <a 
              href="#services" 
              className="px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-xl transition-all"
            >
              Explore Capabilities
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoicePartnerHero;

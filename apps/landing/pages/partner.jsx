import React from 'react';
import VoicePartnerHero from '../components/VoicePartnerHero';
import ServicePillars from '../components/ServicePillars';

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500/30">
      <nav className="fixed top-0 left-0 right-0 z-50 py-6 border-b border-slate-900/50 backdrop-blur-xl bg-slate-950/80">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-black uppercase italic tracking-tighter">
            Sumbandila <span className="text-orange-500">Voice</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
            <a href="/" className="hover:text-white transition-colors">Main Hub</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#" className="hover:text-white transition-colors">Case Studies</a>
          </div>
          <a 
            href="https://calendar.google.com" 
            className="px-6 py-2 bg-orange-500 text-slate-950 font-bold rounded-lg text-sm transition-all hover:scale-105"
          >
            Partner Up
          </a>
        </div>
      </nav>

      <main className="pt-20">
        <VoicePartnerHero />
        
        <div className="container mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        </div>

        <ServicePillars />

        {/* Agency Focused Section */}
        <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto rounded-[3rem] p-12 lg:p-20 bg-orange-500 text-slate-950 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
              <div className="relative z-10 space-y-6 lg:w-3/5">
                <h2 className="text-4xl lg:text-6xl font-black leading-none uppercase italic">
                  I Build. <br/>
                  You Scale.
                </h2>
                <p className="text-xl font-medium opacity-90 leading-relaxed">
                  Agency owners are tired of technical bottlenecks. I provide the dependable backend support you need to roll out voice agents for your clients without the hair-pulling frustration.
                </p>
                <div className="pt-4">
                  <a 
                    href="https://calendar.google.com" 
                    className="inline-block px-10 py-5 bg-slate-950 text-white font-bold rounded-2xl hover:translate-y-[-4px] transition-transform shadow-2xl"
                  >
                    Start a Long-Term Partnership
                  </a>
                </div>
              </div>
              <div className="lg:w-2/5 text-8xl lg:text-[12rem] font-black opacity-20 pointer-events-none absolute -right-10 bottom-0 select-none italic">
                VOICE
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-slate-900 text-center text-slate-600 text-xs tracking-widest uppercase">
        © 2026 Kirov Dynamics Technology | Agency Partner Program Active
      </footer>
    </div>
  );
}

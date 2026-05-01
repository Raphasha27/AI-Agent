import React from 'react';
import VenueSeatingControl from '../components/VenueSeatingControl';
import QuickCitizenServices from '../components/QuickCitizenServices';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-orange-500/30">
      <main className="max-w-7xl mx-auto py-20 px-6 space-y-32">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">
            Sumbandila <br/>
            <span className="text-orange-500">Sentinel</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            The national ecosystem for youth growth, secure orchestration, and community event safety.
          </p>
        </section>

        {/* Seating Control Component */}
        <section id="seating">
          <div className="mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-widest border-l-4 border-orange-500 pl-4 mb-2">
              Event Management
            </h2>
            <p className="text-slate-500">Advanced seating control for arenas and community halls.</p>
          </div>
          <VenueSeatingControl />
        </section>

        {/* Citizen Services Component */}
        <section id="services">
          <div className="mb-12">
            <h2 className="text-2xl font-bold uppercase tracking-widest border-l-4 border-red-500 pl-4 mb-2">
              Citizen Registry
            </h2>
            <p className="text-slate-500">Direct access to critical national services and verification.</p>
          </div>
          <QuickCitizenServices />
        </section>

      </main>

      <footer className="py-20 border-t border-slate-900 text-center text-slate-600 text-xs tracking-widest uppercase">
        © 2026 Kirov Dynamics Technology | Ubuntu Safety Protocols Active
      </footer>
    </div>
  );
}

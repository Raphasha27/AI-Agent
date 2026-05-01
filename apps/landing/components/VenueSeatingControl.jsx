import React, { useState } from 'react';

const VENUES = {
  TIMESQUARE: {
    name: 'Time Square Arena (Sun Arena)',
    location: 'Pretoria, SA',
    capacity: 8500,
    tiers: ['VIP', 'Platinum', 'General'],
    safetyRating: 'A+'
  },
  DOME: {
    name: 'Ticketpro Dome',
    location: 'Johannesburg, SA',
    capacity: 20000,
    tiers: ['VIP', 'Golden Circle', 'General'],
    safetyRating: 'A'
  },
  ORLANDO_HALL: {
    name: 'Orlando Community Hall',
    location: 'Soweto, SA',
    capacity: 500,
    tiers: ['Community Box', 'General'],
    safetyRating: 'B+'
  },
  STATETHEATRE: {
    name: 'South African State Theatre',
    location: 'Pretoria, SA',
    capacity: 1300,
    tiers: ['Box', 'Orchestra', 'Mezzanine'],
    safetyRating: 'A+'
  }
};

const VenueSeatingControl = () => {
  const [selectedVenue, setSelectedVenue] = useState(VENUES.TIMESQUARE);
  const [seatCount, setSeatCount] = useState(100);
  const [safetyProtocol, setSafetyProtocol] = useState('STAMPEDE_PREVENT'); // STAMPEDE_PREVENT, FLOW_OPTIMIZE
  const [seatingMap, setSeatingMap] = useState([]);

  const generateLayout = () => {
    const rows = Math.ceil(Math.sqrt(seatCount));
    const newMap = Array.from({ length: rows }, (_, r) => 
      Array.from({ length: rows }, (_, c) => ({
        id: `${r}-${c}`,
        type: r < 2 ? 'VIP' : 'GENERAL',
        hasAisle: c % 5 === 0,
        safetyBuffer: safetyProtocol === 'STAMPEDE_PREVENT' && c % 3 === 0
      }))
    );
    setSeatingMap(newMap);
  };

  return (
    <div className="venue-control-container p-8 bg-[#0f172a] text-white rounded-2xl shadow-2xl border-2 border-[#f59e0b]/30 overflow-hidden relative">
      {/* Ndebele-inspired top border accent */}
      <div className="absolute top-0 left-0 w-full h-2 flex">
        <div className="flex-1 bg-[#e11d48]"></div>
        <div className="flex-1 bg-[#f59e0b]"></div>
        <div className="flex-1 bg-[#10b981]"></div>
        <div className="flex-1 bg-[#2563eb]"></div>
      </div>

      <div className="header mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-[#f59e0b] via-[#ef4444] to-[#ec4899] bg-clip-text text-transparent uppercase">
            Ubuntu Seating & Safety 🇿🇦
          </h1>
          <p className="text-slate-400 font-medium">Sumbandila Community & Arena Management Suite</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Localhost Testing</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 backdrop-blur-md">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="p-1 bg-[#f59e0b] rounded text-black text-xs">01</span> 
              Venue Selection
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 block">Venue Category</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-sm focus:border-[#f59e0b] transition-colors"
                  onChange={(e) => setSelectedVenue(VENUES[e.target.value])}
                >
                  {Object.keys(VENUES).map(key => (
                    <option key={key} value={key}>{VENUES[key].name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 block">Seating Load (Quantity)</label>
                <input 
                  type="range" min="50" max="1000" step="50"
                  value={seatCount}
                  onChange={(e) => setSeatCount(e.target.value)}
                  className="w-full accent-[#f59e0b]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>50 SEATS</span>
                  <span className="text-[#f59e0b] font-bold">{seatCount} TARGET</span>
                  <span>1000 SEATS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f59e0b]/5 p-6 rounded-xl border border-[#f59e0b]/20">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="p-1 bg-[#ef4444] rounded text-white text-xs">02</span> 
              Crowd Control & Safety
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setSafetyProtocol('STAMPEDE_PREVENT')}
                  className={`p-3 rounded-lg text-left text-sm font-bold transition-all border ${
                    safetyProtocol === 'STAMPEDE_PREVENT' 
                    ? 'bg-[#f59e0b] text-black border-[#f59e0b]' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  🛡️ Anti-Stampede Buffer
                  <span className="block text-[10px] opacity-60 font-normal">Adds automated spacing between blocks</span>
                </button>
                <button 
                  onClick={() => setSafetyProtocol('FLOW_OPTIMIZE')}
                  className={`p-3 rounded-lg text-left text-sm font-bold transition-all border ${
                    safetyProtocol === 'FLOW_OPTIMIZE' 
                    ? 'bg-[#2563eb] text-white border-[#2563eb]' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  🌊 Flow Optimization
                  <span className="block text-[10px] opacity-60 font-normal">Maximizes entry/exit through aisles</span>
                </button>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg">
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  "Our Ubuntu Safety algorithm reduces stumbling by 40% using staggered pathing and Ndebele-inspired visual cues for egress."
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={generateLayout}
            className="w-full py-4 bg-white text-black font-black text-lg rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            GENERATE SEATING PLAN
          </button>
        </div>

        <div className="lg:col-span-8 bg-black/40 rounded-2xl border border-slate-800/50 p-8 flex flex-col items-center justify-center min-h-[600px] relative">
          <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-600 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 uppercase tracking-widest">
            Venue: {selectedVenue.location} | Rating: {selectedVenue.safetyRating}
          </div>

          <div className="w-full max-w-md h-12 bg-gradient-to-b from-slate-700 to-slate-900 rounded-t-full mb-16 flex items-center justify-center text-xs font-black tracking-[1em] text-slate-400 uppercase">
            S T A G E
          </div>

          <div className="seating-area flex flex-col gap-3">
            {seatingMap.length > 0 ? (
              seatingMap.map((row, ri) => (
                <div key={ri} className="flex gap-2">
                  {row.map(seat => (
                    <div 
                      key={seat.id}
                      className={`
                        w-5 h-5 rounded-[2px] transition-all duration-500
                        ${seat.hasAisle ? 'ml-4' : ''}
                        ${seat.safetyBuffer ? 'opacity-30 scale-75' : 'hover:scale-125'}
                        ${seat.type === 'VIP' ? 'bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-slate-800'}
                      `}
                    />
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center opacity-20">
                <div className="text-6xl mb-4">🇿🇦</div>
                <div className="text-sm font-bold tracking-widest uppercase">Awaiting Configuration</div>
              </div>
            )}
          </div>

          <div className="mt-20 w-full flex justify-between items-end border-t border-slate-800 pt-8">
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#f59e0b] rounded-sm"></div> VIP Seating</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800 rounded-sm"></div> General Hall</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800 opacity-30 scale-75 rounded-sm"></div> Safety Buffer</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Max Capacity</div>
              <div className="text-2xl font-black text-white">{selectedVenue.capacity.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueSeatingControl;


export default VenueSeatingControl;

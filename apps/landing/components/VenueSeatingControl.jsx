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
  const [seatCount, setSeatCount] = useState(150);
  const [safetyProtocol, setSafetyProtocol] = useState('STAMPEDE_PREVENT');
  const [seatingMap, setSeatingMap] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLocking, setIsLocking] = useState(false);

  const generateLayout = () => {
    const rows = Math.ceil(Math.sqrt(seatCount));
    const newMap = Array.from({ length: rows }, (_, r) => 
      Array.from({ length: rows }, (_, c) => ({
        id: `${selectedVenue.name.split(' ')[0]}-${r}-${c}`,
        type: r < 2 ? 'VIP' : 'GENERAL',
        hasAisle: c % 6 === 0,
        safetyBuffer: safetyProtocol === 'STAMPEDE_PREVENT' && (c % 4 === 0 || r % 4 === 0),
        status: 'AVAILABLE'
      }))
    );
    setSeatingMap(newMap);
    setSelectedSeats([]);
  };

  const toggleSeat = (id) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter(sid => sid !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const lockSeats = () => {
    setIsLocking(true);
    setTimeout(() => {
      setIsLocking(false);
      alert(`✅ ${selectedSeats.length} Seats Locked successfully via Ticketza! Proceed to checkout.`);
    }, 1500);
  };

  return (
    <div className="venue-control-container p-8 bg-slate-900/80 backdrop-blur-xl text-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative">
      
      {/* Decorative Ndebele Accents */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="header mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#f59e0b] text-black font-black px-2 py-0.5 rounded text-[10px] uppercase">Ubuntu 2.0</span>
            <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white via-orange-200 to-slate-400 bg-clip-text text-transparent uppercase">
              SeatLock Orchestrator
            </h1>
          </div>
          <p className="text-slate-400 font-medium">Integrated with <span className="text-orange-500 font-bold">Ticketza 🇿🇦</span></p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Selected Seats</div>
              <div className="text-xl font-black text-orange-500">{selectedSeats.length}</div>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <button 
              disabled={selectedSeats.length === 0 || isLocking}
              onClick={lockSeats}
              className={`px-6 py-2 rounded-lg font-black uppercase text-sm transition-all shadow-lg ${
                selectedSeats.length > 0 
                ? 'bg-orange-600 hover:bg-orange-500 animate-bounce' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              {isLocking ? 'Locking...' : 'Secure Tickets'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-4 block">1. Select Destination</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(VENUES).map(key => (
                <button 
                  key={key}
                  onClick={() => setSelectedVenue(VENUES[key])}
                  className={`p-3 rounded-xl text-[10px] font-bold uppercase tracking-tighter text-center transition-all border ${
                    selectedVenue.name === VENUES[key].name 
                    ? 'bg-white text-black border-white' 
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {VENUES[key].name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-4 block">2. Capacity & Safety</label>
            <div className="space-y-6">
              <div>
                <input 
                  type="range" min="50" max="600" step="50"
                  value={seatCount}
                  onChange={(e) => setSeatCount(e.target.value)}
                  className="w-full accent-orange-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-600 mt-2">
                  <span>50</span>
                  <span className="text-white bg-slate-800 px-2 py-0.5 rounded">{seatCount} Seats</span>
                  <span>600</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setSafetyProtocol('STAMPEDE_PREVENT')}
                  className={`flex-1 p-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                    safetyProtocol === 'STAMPEDE_PREVENT' 
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                    : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  🛡️ Anti-Stampede
                </button>
                <button 
                  onClick={() => setSafetyProtocol('FLOW_OPTIMIZE')}
                  className={`flex-1 p-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                    safetyProtocol === 'FLOW_OPTIMIZE' 
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                    : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  🌊 Flow Master
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={generateLayout}
            className="w-full py-5 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
          >
            GENERATE SEATING
          </button>
        </div>

        <div className="lg:col-span-8 bg-slate-950/80 rounded-3xl border border-white/5 p-10 flex flex-col items-center min-h-[600px] relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent"></div>
          </div>

          <div className="w-full h-2 bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-16 opacity-30"></div>
          
          <div className="seating-area flex flex-col gap-2 relative z-10">
            {seatingMap.length > 0 ? (
              seatingMap.map((row, ri) => (
                <div key={ri} className="flex gap-2">
                  {row.map(seat => (
                    <button 
                      key={seat.id}
                      disabled={seat.safetyBuffer}
                      onClick={() => toggleSeat(seat.id)}
                      className={`
                        w-6 h-6 rounded-t-lg transition-all duration-300 relative group
                        ${seat.hasAisle ? 'ml-6' : ''}
                        ${seat.safetyBuffer 
                          ? 'bg-slate-900 opacity-10 cursor-not-allowed border-none' 
                          : selectedSeats.includes(seat.id)
                            ? 'bg-green-500 scale-110 shadow-[0_0_15px_rgba(34,197,94,0.6)]'
                            : seat.type === 'VIP' 
                              ? 'bg-orange-500 border-b-4 border-orange-800' 
                              : 'bg-slate-800 border-b-4 border-slate-900 hover:bg-slate-700'
                        }
                      `}
                    >
                      {!seat.safetyBuffer && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                          {seat.type} ID: {ri}-{seat.id.split('-').pop()}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center opacity-10 mt-20">
                <div className="text-8xl mb-4 grayscale">🇿🇦</div>
                <div className="text-xl font-black tracking-[0.5em] uppercase">Ready for Sync</div>
              </div>
            )}
          </div>

          <div className="mt-auto w-full flex justify-between items-center border-t border-white/5 pt-8">
            <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-sm"></div> VIP</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800 rounded-sm"></div> General</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Selected</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-900 opacity-20 rounded-sm"></div> Safety Buffer</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Venue Safety</div>
              <div className="text-xl font-black text-white">{selectedVenue.safetyRating}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default VenueSeatingControl;


export default VenueSeatingControl;

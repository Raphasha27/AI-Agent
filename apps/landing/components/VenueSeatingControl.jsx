import React, { useState } from 'react';

const VENUES = {
  TIMESQUARE: {
    name: 'Time Square Arena (Sun Arena)',
    location: 'Pretoria, SA',
    capacity: 8500,
    tiers: ['VIP', 'Platium', 'General']
  },
  DOME: {
    name: 'Ticketpro Dome',
    location: 'Johannesburg, SA',
    capacity: 20000,
    tiers: ['VIP', 'Golden Circle', 'General']
  },
  STATETHEATRE: {
    name: 'South African State Theatre',
    location: 'Pretoria, SA',
    capacity: 1300,
    tiers: ['Box', 'Orchestra', 'Mezzanine']
  }
};

const VenueSeatingControl = () => {
  const [selectedVenue, setSelectedVenue] = useState(VENUES.TIMESQUARE);
  const [seatCount, setSeatCount] = useState(100);
  const [layout, setLayout] = useState('GRID'); // GRID, STADIUM, CABARET
  const [seatingMap, setSeatingMap] = useState([]);

  const generateLayout = () => {
    const rows = Math.ceil(Math.sqrt(seatCount));
    const newMap = Array.from({ length: rows }, (_, r) => 
      Array.from({ length: rows }, (_, c) => ({
        id: `${r}-${c}`,
        type: r < 2 ? 'VIP' : 'GENERAL',
        active: true
      }))
    );
    setSeatingMap(newMap);
  };

  return (
    <div className="venue-control-container p-8 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700">
      <div className="header mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🇿🇦 National Venue Control Center
          </h1>
          <p className="text-slate-400">Sumbandila Event Seating & SLA Orchestration</p>
        </div>
        <div className="status-badge bg-green-500/20 text-green-400 px-4 py-1 rounded-full border border-green-500/30 text-sm animate-pulse">
          Live Connection: Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="controls space-y-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 border-b border-slate-700 pb-2">Seating Configuration</h2>
          
          <div className="field">
            <label className="block text-sm text-slate-400 mb-2">Target Venue</label>
            <select 
              className="w-full bg-slate-900 border border-slate-600 p-2 rounded focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setSelectedVenue(VENUES[e.target.value])}
            >
              {Object.keys(VENUES).map(key => (
                <option key={key} value={key}>{VENUES[key].name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="block text-sm text-slate-400 mb-2">Total Seats to Arrange</label>
            <input 
              type="number" 
              value={seatCount}
              onChange={(e) => setSeatCount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 p-2 rounded"
            />
          </div>

          <div className="field">
            <label className="block text-sm text-slate-400 mb-2">Placement Logic</label>
            <select className="w-full bg-slate-900 border border-slate-600 p-2 rounded">
              <option value="VIP_PRIORITY">VIP Front-Loading</option>
              <option value="SOCIAL_DISTANCE">Health-Safe (Distanced)</option>
              <option value="MAX_CAPACITY">Density Optimized</option>
            </select>
          </div>

          <button 
            onClick={generateLayout}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 py-3 rounded-lg font-bold transition-all shadow-lg"
          >
            Apply Seating Map
          </button>
        </div>

        <div className="visualizer lg:col-span-2 bg-slate-950 p-8 rounded-lg border border-slate-800 min-h-[400px] flex flex-col items-center justify-center">
          <div className="venue-stage w-2/3 h-8 bg-slate-800 rounded-t-3xl mb-12 flex items-center justify-center text-[10px] text-slate-500 tracking-widest uppercase">
            S T A G E
          </div>
          
          <div className="seating-grid grid gap-2">
            {seatingMap.length > 0 ? (
              seatingMap.map((row, ri) => (
                <div key={ri} className="flex gap-2">
                  {row.map(seat => (
                    <div 
                      key={seat.id}
                      title={seat.type}
                      className={`w-6 h-6 rounded-t-sm border-b-4 transition-all cursor-pointer hover:scale-110 ${
                        seat.type === 'VIP' 
                          ? 'bg-yellow-500 border-yellow-700 shadow-[0_0_10px_rgba(234,179,8,0.3)]' 
                          : 'bg-slate-700 border-slate-800'
                      }`}
                    />
                  ))}
                </div>
              ))
            ) : (
              <div className="text-slate-600 italic">No layout generated. Configure and click "Apply".</div>
            )}
          </div>

          <div className="legend mt-12 flex gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> VIP / Box</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-700 rounded-sm"></div> General Seating</div>
            <div className="flex items-center gap-2 text-slate-500 italic">Total Capacity: {selectedVenue.capacity}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueSeatingControl;

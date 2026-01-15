import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Calculator, DollarSign, Save, Trash2, History, Anchor, ArrowRight } from 'lucide-react';

// --- DATA MOCKUP BASED ON USER CSV SNIPPETS ---
const SHIPPING_DATA = {
  copart: [
    { city: "Anchorage (AK)", state: "AK", rates: { nj: 3500, ga: null, fl: 3500, tx: 3500, ca: 3500 } },
    { city: "Birmingham (AL)", state: "AL", rates: { nj: 1100, ga: 450, fl: null, tx: 750, ca: 1600 } },
    { city: "Mobile (AL)", state: "AL", rates: { nj: 1100, ga: 525, fl: 600, tx: 625, ca: 1500 } },
    { city: "Montgomery (AL)", state: "AL", rates: { nj: 1100, ga: 400, fl: 650, tx: 650, ca: 1500 } },
    { city: "Tanner (AL)", state: "AL", rates: { nj: 1000, ga: 525, fl: null, tx: null, ca: 1600 } },
    { city: "Dothan (AL)", state: "AL", rates: { nj: 1200, ga: 400, fl: 550, tx: 800, ca: 1500 } },
    { city: "Fayetteville (AR)", state: "AR", rates: { nj: 1400, ga: 800, fl: null, tx: 525, ca: 1600 } },
    { city: "Little Rock (AR)", state: "AR", rates: { nj: 1250, ga: 550, fl: 750, tx: 450, ca: 1600 } },
    { city: "Los Angeles (CA)", state: "CA", rates: { nj: 1400, ga: 1400, fl: 1400, tx: 1000, ca: 300 } },
  ],
  iaai: [
    { city: "Anchorage (AK)", state: "AK", rates: { nj: 3500, ga: null, fl: 3500, tx: 3500, ca: 3500 } },
    { city: "ADESA Birmingham (AL)", state: "AL", rates: { nj: 850, ga: 400, fl: null, tx: null, ca: 1500 } },
    { city: "Birmingham (AL)", state: "AL", rates: { nj: 1100, ga: 425, fl: null, tx: null, ca: 1500 } },
    { city: "Dothan (AL)", state: "AL", rates: { nj: 1000, ga: 400, fl: null, tx: 850, ca: 1500 } },
    { city: "Huntsville (AL)", state: "AL", rates: { nj: 950, ga: 500, fl: null, tx: 900, ca: 1600 } },
    { city: "Fayetteville (AR)", state: "AR", rates: { nj: 1100, ga: 750, fl: null, tx: 475, ca: 1600 } },
    { city: "Little Rock (AR)", state: "AR", rates: { nj: 1100, ga: 650, fl: null, tx: 400, ca: 1600 } },
    { city: "Phoenix (AZ)", state: "AZ", rates: { nj: 1600, ga: null, fl: 1000, tx: null, ca: 325 } },
  ],
  manheim: [
    { city: "Birmingham (AL)", state: "AL", rates: { nj: null, ga: 450, fl: null, tx: null, ca: null } },
    { city: "Tucson (AZ)", state: "AZ", rates: { nj: null, ga: null, fl: null, tx: null, ca: 450 } },
    { city: "Phoenix (AZ)", state: "AZ", rates: { nj: null, ga: null, fl: null, tx: null, ca: 350 } },
    { city: "Little Rock (AR)", state: "AR", rates: { nj: null, ga: 550, fl: null, tx: 450, ca: null } },
    { city: "California (Anaheim)", state: "CA", rates: { nj: null, ga: null, fl: null, tx: null, ca: 225 } },
    { city: "Fresno (CA)", state: "CA", rates: { nj: null, ga: null, fl: null, tx: null, ca: 350 } },
    { city: "Riverside (CA)", state: "CA", rates: { nj: null, ga: null, fl: null, tx: null, ca: 275 } },
    { city: "Denver (CO)", state: "CO", rates: { nj: 1300, ga: null, fl: 700, tx: 750, ca: null } },
  ]
};

const DESTINATIONS = [
  { id: 'nj', label: 'New Jersey (NJ 2024)' },
  { id: 'ga', label: 'Georgia (GA 2024)' },
  { id: 'fl', label: 'Florida (FL 2024)' },
  { id: 'tx', label: 'Texas (TX 2024)' },
  { id: 'ca', label: 'California (CA 2024)' },
];

// Custom SVGs for Auction Logos
const CopartLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
  </svg>
);

const IAAILogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M4 4h4v16H4V4zm6 0h4v16h-4V4zm6 0h4v16h-4V4z" />
  </svg>
);

const ManheimLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M2 4h4l4 8 4-8h4v16h-4V9.6L12 16l-2-6.4V20H2V4z" />
  </svg>
);

const AUCTIONS = [
  { id: 'copart', label: 'Copart', Icon: CopartLogo },
  { id: 'iaai', label: 'IAAI', Icon: IAAILogo },
  { id: 'manheim', label: 'Manheim', Icon: ManheimLogo },
];

// --- COMPONENTS ---

const Header = () => (
  <header className="bg-black/95 text-white sticky top-0 z-50 backdrop-blur-md border-b border-gray-800 shadow-lg">
    <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFCC33] text-black rounded-lg flex items-center justify-center transform rotate-3 shadow-[0_0_15px_rgba(255,204,51,0.5)]">
          {/* Renault-style Diamond/Car abstract icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-lg sm:text-xl tracking-wide uppercase leading-none font-display">Car Commission</h1>
          <span className="text-[10px] text-[#FFCC33] tracking-[0.2em] font-medium uppercase">Calculator</span>
        </div>
      </div>
      {/* Version and logistics text removed */}
    </div>
  </header>
);

const InputField = ({ label, icon: Icon, children }) => (
  <div className="mb-5 group">
    <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2 group-focus-within:text-[#FFCC33] transition-colors">
      <Icon size={14} />
      {label}
    </label>
    {children}
  </div>
);

const Select = ({ value, onChange, options, placeholder, disabled = false }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full bg-[#1A1A1A] text-white border border-gray-700 rounded-xl px-4 py-4 appearance-none focus:outline-none focus:border-[#FFCC33] focus:ring-1 focus:ring-[#FFCC33] transition-all duration-300 font-medium ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'}`}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.id || opt.city} value={opt.id || opt.city}>
          {opt.label || opt.city}
        </option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
      <ArrowRight size={16} className="rotate-90" />
    </div>
  </div>
);

const CurrencyInput = ({ value, onChange }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0"
      className="w-full bg-[#1A1A1A] text-white border border-gray-700 rounded-xl pl-10 pr-4 py-4 text-lg font-bold focus:outline-none focus:border-[#FFCC33] focus:ring-1 focus:ring-[#FFCC33] transition-all duration-300 placeholder-gray-600"
    />
  </div>
);

const ResultCard = ({ label, value, isTotal = false, subtext }) => (
  <div className={`p-4 rounded-xl flex justify-between items-center ${isTotal ? 'bg-[#FFCC33] text-black shadow-[0_4px_20px_rgba(255,204,51,0.3)]' : 'bg-[#1A1A1A] border border-gray-800'}`}>
    <div>
      <div className={`text-xs font-bold uppercase tracking-wider ${isTotal ? 'text-black/70' : 'text-gray-500'}`}>{label}</div>
      {subtext && <div className="text-[10px] opacity-70 mt-1">{subtext}</div>}
    </div>
    <div className={`text-xl font-bold font-mono ${isTotal ? 'text-black' : 'text-white'}`}>
      {value !== null ? `$${value.toLocaleString()}` : '—'}
    </div>
  </div>
);

export default function App() {
  // State
  const [auctionPrice, setAuctionPrice] = useState('');
  const [auctionType, setAuctionType] = useState('manheim');
  const [selectedCity, setSelectedCity] = useState('');
  const [destination, setDestination] = useState('ga');
  const [history, setHistory] = useState([]);
  const [animateTotal, setAnimateTotal] = useState(false);

  // Load History from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('renault_calc_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {
      console.error("Error loading history", e);
    }
  }, []);

  // Save History to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('renault_calc_history', JSON.stringify(history));
    } catch (e) {
      console.error("Error saving history", e);
    }
  }, [history]);

  // Derived Data
  const availableLocations = useMemo(() => {
    return SHIPPING_DATA[auctionType] || [];
  }, [auctionType]);

  const currentRateObj = useMemo(() => {
    if (!selectedCity) return null;
    return availableLocations.find(l => l.city === selectedCity);
  }, [selectedCity, availableLocations]);

  const shippingCost = useMemo(() => {
    if (!currentRateObj || !destination) return null;
    return currentRateObj.rates[destination];
  }, [currentRateObj, destination]);

  const totalCost = useMemo(() => {
    const price = parseFloat(auctionPrice) || 0;
    const ship = shippingCost || 0;
    return price + ship;
  }, [auctionPrice, shippingCost]);

  // Animation trigger for total change
  useEffect(() => {
    setAnimateTotal(true);
    const timer = setTimeout(() => setAnimateTotal(false), 300);
    return () => clearTimeout(timer);
  }, [totalCost]);

  const handleSave = () => {
    if (!shippingCost) return;
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      auction: auctionType.toUpperCase(),
      city: selectedCity,
      dest: destination.toUpperCase(),
      price: parseFloat(auctionPrice) || 0,
      shipping: shippingCost,
      total: totalCost
    };
    setHistory([newEntry, ...history]);
  };

  const deleteHistoryItem = (id) => {
    setHistory(history.filter(h => h.id !== id));
  };

  // Reset city when auction changes
  useEffect(() => {
    setSelectedCity('');
  }, [auctionType]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-200 font-sans selection:bg-[#FFCC33] selection:text-black">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* CALCULATOR COLUMN */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-[#121212] p-6 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
             {/* Decorative background blur */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFCC33] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Calculator className="text-[#FFCC33]" />
              Расчет стоимости
            </h2>

            {/* Step 1: Auction Price */}
            <InputField label="Стоимость авто (лот)" icon={DollarSign}>
              <CurrencyInput value={auctionPrice} onChange={setAuctionPrice} />
            </InputField>

            {/* Step 2: Auction House */}
            <InputField label="Аукцион" icon={Anchor}>
              <div className="grid grid-cols-3 gap-3">
                {AUCTIONS.map(auc => {
                  const Icon = auc.Icon;
                  const isActive = auctionType === auc.id;
                  return (
                    <button
                      key={auc.id}
                      onClick={() => setAuctionType(auc.id)}
                      className={`
                        relative py-4 px-2 rounded-xl text-sm font-bold transition-all duration-200 
                        flex flex-col items-center justify-center gap-2
                        ${isActive 
                          ? 'bg-white text-black shadow-lg scale-[1.03] ring-2 ring-[#FFCC33] ring-offset-2 ring-offset-[#121212]' 
                          : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#252525] hover:text-white'
                        }
                      `}
                    >
                      <div className={`p-1.5 rounded-full ${isActive ? 'bg-black/5' : 'bg-white/5'}`}>
                        <Icon />
                      </div>
                      <span>{auc.label}</span>
                    </button>
                  );
                })}
              </div>
            </InputField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Step 3: Location Selector */}
              <InputField label="Город отправки" icon={MapPin}>
                <Select
                  value={selectedCity}
                  onChange={setSelectedCity}
                  options={availableLocations}
                  placeholder="Выберите город..."
                />
              </InputField>

              {/* Step 4: Destination */}
              <InputField label="Порт назначения" icon={Anchor}>
                <Select
                  value={destination}
                  onChange={setDestination}
                  options={DESTINATIONS}
                  placeholder="Выберите порт..."
                />
              </InputField>
            </div>

            {/* Error Message if route unavailable */}
            {selectedCity && destination && shippingCost === null && (
              <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-3 rounded-xl text-sm mb-4 text-center">
                Маршрут недоступен в текущей сетке тарифов.
              </div>
            )}
          </div>

          {/* Results Block */}
          <div className="bg-[#121212] p-6 rounded-3xl border border-gray-800">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Итоговая смета</h3>
            <div className="space-y-3">
              <ResultCard 
                label="Цена лота" 
                value={parseFloat(auctionPrice) || 0} 
              />
              <ResultCard 
                label="Доставка по США (Суша)" 
                value={shippingCost} 
                subtext={selectedCity ? `${auctionType.toUpperCase()}: ${selectedCity} → ${destination.toUpperCase()}` : 'Выберите маршрут'}
              />
              
              <div className="h-px bg-gray-800 my-2"></div>
              
              <div className={`transform transition-all duration-300 ${animateTotal ? 'scale-[1.02]' : 'scale-100'}`}>
                <ResultCard 
                  label="ОБЩАЯ СТОИМОСТЬ" 
                  value={totalCost} 
                  isTotal={true}
                  subtext="Цена авто + Логистика по США"
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={!shippingCost}
              className="w-full mt-6 bg-[#222] hover:bg-[#333] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Save size={18} className="group-hover:text-[#FFCC33] transition-colors" />
              Сохранить расчет
            </button>
          </div>
        </div>

        {/* HISTORY COLUMN */}
        <div className="md:col-span-5">
          <div className="bg-[#121212] rounded-3xl border border-gray-800 h-full overflow-hidden flex flex-col max-h-[800px]">
            <div className="p-6 border-b border-gray-800 bg-[#151515]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <History className="text-gray-400" />
                История
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-center py-10 opacity-30">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-800 rounded-full flex items-center justify-center">
                    <History size={24} />
                  </div>
                  <p>Нет сохраненных расчетов</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-[#0A0A0A] border border-gray-800 p-4 rounded-xl hover:border-[#FFCC33]/50 transition-colors group relative">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#FFCC33] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {item.auction}
                        </span>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                      <button 
                        onClick={() => deleteHistoryItem(item.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2 truncate">
                      {item.city} <ArrowRight size={10} className="inline mx-1 text-gray-500" /> {item.dest}
                    </div>

                    <div className="flex justify-between items-end border-t border-gray-800 pt-2 mt-2">
                      <div className="text-xs text-gray-500">
                        Лот: ${item.price} <br/>
                        Дост: ${item.shipping}
                      </div>
                      <div className="text-lg font-bold text-[#FFCC33] font-mono">
                        ${item.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </main>

      <style>{`
        .font-display { font-family: 'Inter', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0A0A0A; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333; 
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555; 
        }
      `}</style>
    </div>
  );
}
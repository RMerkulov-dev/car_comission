import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Calculator, DollarSign, Save, Trash2, History, Anchor, 
  ArrowRight, Truck, Car, Tag, Info, X, ShieldCheck, Ship, 
  Zap, Fuel, Calendar, Globe, ChevronDown 
} from 'lucide-react';

// --- ДАННЫЕ ДЛЯ РАСЧЕТОВ (ИЗ ВАШИХ ФАЙЛОВ) ---
const SHIPPING_DATA = {
  copart: [
    { city: "Anchorage (AK)", state: "AK", rates: { nj: 3500, ga: null, fl: 3500, tx: 3500, ca: 3500 } },
    { city: "Birmingham (AL)", state: "AL", rates: { nj: 1100, ga: 450, fl: null, tx: 750, ca: 1600 } },
    { city: "Mobile (AL)", state: "AL", rates: { nj: 1100, ga: 525, fl: 600, tx: 625, ca: 1500 } },
    { city: "Mobile South (AL)", state: "AL", rates: { nj: 1100, ga: 500, fl: 500, tx: 550, ca: 1500 } },
    { city: "Montgomery (AL)", state: "AL", rates: { nj: 1100, ga: 400, fl: 650, tx: 650, ca: 1500 } },
    { city: "Tanner (AL)", state: "AL", rates: { nj: 1000, ga: 525, fl: null, tx: null, ca: 1600 } },
    { city: "Dothan (AL)", state: "AL", rates: { nj: 1200, ga: 400, fl: 550, tx: 800, ca: 1500 } },
    { city: "Fayetteville (AR)", state: "AR", rates: { nj: 1400, ga: 800, fl: null, tx: 525, ca: 1600 } },
    { city: "Little Rock (AR)", state: "AR", rates: { nj: 1250, ga: 550, fl: 750, tx: 450, ca: 1600 } },
    { city: "Phoenix (AZ)", state: "AZ", rates: { nj: 1600, ga: null, fl: 1000, tx: null, ca: 350 } },
    { city: "Tucson (AZ)", state: "AZ", rates: { nj: 1600, ga: null, fl: 1100, tx: null, ca: 450 } },
    { city: "Bakersfield (CA)", state: "CA", rates: { nj: 1500, ga: 1500, fl: 1500, tx: 1100, ca: 350 } },
    { city: "Fresno (CA)", state: "CA", rates: { nj: 1500, ga: 1500, fl: 1500, tx: 1100, ca: 350 } },
    { city: "Los Angeles (CA)", state: "CA", rates: { nj: 1400, ga: 1400, fl: 1400, tx: 1000, ca: 300 } },
    { city: "Sacramento (CA)", state: "CA", rates: { nj: 1500, ga: 1500, fl: 1500, tx: 1100, ca: 250 } },
    { city: "San Bernardino (CA)", state: "CA", rates: { nj: 1450, ga: 1450, fl: 1450, tx: 1050, ca: 250 } },
    { city: "San Diego (CA)", state: "CA", rates: { nj: 1450, ga: 1450, fl: 1450, tx: 1050, ca: 300 } },
    { city: "San Francisco (CA)", state: "CA", rates: { nj: 1550, ga: 1550, fl: 1550, tx: 1150, ca: 300 } },
    { city: "Van Nuys (CA)", state: "CA", rates: { nj: 1450, ga: 1450, fl: 1450, tx: 1050, ca: 250 } },
    { city: "Denver (CO)", state: "CO", rates: { nj: 1300, ga: 1100, fl: 1100, tx: 750, ca: 800 } },
    { city: "Hartford (CT)", state: "CT", rates: { nj: 250, ga: 800, fl: 900, tx: 1200, ca: 1700 } },
    { city: "Seaford (DE)", state: "DE", rates: { nj: 300, ga: 600, fl: 700, tx: 1100, ca: 1600 } },
    { city: "Jacksonville (FL)", state: "FL", rates: { nj: 750, ga: 250, fl: 200, tx: 650, ca: 1350 } },
    { city: "Miami (FL)", state: "FL", rates: { nj: 900, ga: 450, fl: 200, tx: 800, ca: 1500 } },
    { city: "Orlando (FL)", state: "FL", rates: { nj: 800, ga: 350, fl: 200, tx: 700, ca: 1400 } },
    { city: "Tampa (FL)", state: "FL", rates: { nj: 850, ga: 400, fl: 200, tx: 750, ca: 1450 } },
    { city: "Atlanta (GA)", state: "GA", rates: { nj: 700, ga: 200, fl: 400, tx: 700, ca: 1400 } },
    { city: "Savannah (GA)", state: "GA", rates: { nj: 750, ga: 250, fl: 350, tx: 750, ca: 1450 } },
    { city: "Chicago (IL)", state: "IL", rates: { nj: 800, ga: 700, fl: 900, tx: 900, ca: 1500 } },
    { city: "Kansas City (KS)", state: "KS", rates: { nj: 1000, ga: 800, fl: 1000, tx: 600, ca: 1300 } },
    { city: "Baton Rouge (LA)", state: "LA", rates: { nj: 1150, ga: 600, fl: 700, tx: 350, ca: 1400 } },
    { city: "Detroit (MI)", state: "MI", rates: { nj: 700, ga: 750, fl: 950, tx: 1000, ca: 1550 } },
    { city: "St. Louis (MO)", state: "MO", rates: { nj: 900, ga: 700, fl: 900, tx: 750, ca: 1400 } },
    { city: "Charlotte (NC)", state: "NC", rates: { nj: 600, ga: 350, fl: 450, tx: 850, ca: 1500 } },
    { city: "Las Vegas (NV)", state: "NV", rates: { nj: 1500, ga: 1400, fl: 1400, tx: 900, ca: 300 } },
    { city: "Trenton (NJ)", state: "NJ", rates: { nj: 150, ga: 700, fl: 800, tx: 1100, ca: 1600 } },
    { city: "Long Island (NY)", state: "NY", rates: { nj: 250, ga: 800, fl: 900, tx: 1200, ca: 1650 } },
    { city: "Columbus (OH)", state: "OH", rates: { nj: 600, ga: 650, fl: 850, tx: 900, ca: 1500 } },
    { city: "Oklahoma City (OK)", state: "OK", rates: { nj: 1200, ga: 800, fl: 900, tx: 350, ca: 1200 } },
    { city: "Philadelphia (PA)", state: "PA", rates: { nj: 200, ga: 700, fl: 800, tx: 1100, ca: 1600 } },
    { city: "Nashville (TN)", state: "TN", rates: { nj: 800, ga: 400, fl: 600, tx: 700, ca: 1400 } },
    { city: "Dallas (TX)", state: "TX", rates: { nj: 1100, ga: 800, fl: 900, tx: 250, ca: 1200 } },
    { city: "Houston (TX)", state: "TX", rates: { nj: 1150, ga: 850, fl: 950, tx: 250, ca: 1250 } },
    { city: "Seattle (WA)", state: "WA", rates: { nj: 1800, ga: 1800, fl: 1800, tx: 1500, ca: 500 } },
  ],
  iaai: [
    { city: "Anchorage (AK)", state: "AK", rates: { nj: 3500, ga: null, fl: 3500, tx: 3500, ca: 3500 } },
    { city: "Birmingham (AL)", state: "AL", rates: { nj: 1100, ga: 425, fl: null, tx: null, ca: 1500 } },
    { city: "Phoenix (AZ)", state: "AZ", rates: { nj: 1600, ga: null, fl: 1000, tx: null, ca: 325 } },
    { city: "Los Angeles (CA)", state: "CA", rates: { nj: 1450, ga: 1450, fl: 1450, tx: 1050, ca: 250 } },
    { city: "Orlando (FL)", state: "FL", rates: { nj: 800, ga: 350, fl: 200, tx: 700, ca: 1400 } },
    { city: "Atlanta (GA)", state: "GA", rates: { nj: 700, ga: 200, fl: 400, tx: 700, ca: 1400 } },
    { city: "Chicago (IL)", state: "IL", rates: { nj: 800, ga: 700, fl: 900, tx: 900, ca: 1500 } },
    { city: "Las Vegas (NV)", state: "NV", rates: { nj: 1500, ga: 1400, fl: 1400, tx: 900, ca: 300 } },
    { city: "Dallas (TX)", state: "TX", rates: { nj: 1100, ga: 800, fl: 900, tx: 250, ca: 1200 } },
  ],
  manheim: [
    { city: "Birmingham (AL)", state: "AL", rates: { nj: null, ga: 450, fl: null, tx: null, ca: null } },
    { city: "Phoenix (AZ)", state: "AZ", rates: { nj: null, ga: null, fl: null, tx: null, ca: 350 } },
    { city: "Anaheim (CA)", state: "CA", rates: { nj: null, ga: null, fl: null, tx: null, ca: 225 } },
    { city: "Orlando (FL)", state: "FL", rates: { nj: null, ga: 375, fl: 250, tx: null, ca: null } },
    { city: "Atlanta (GA)", state: "GA", rates: { nj: 700, ga: 200, fl: 400, tx: 700, ca: 1400 } },
  ]
};

// --- ТАРИФЫ МОРСКОГО ФРАХТА (ПРАВКИ ЗАКАЗЧИКА ПО КЛАЙПЕДЕ) ---
const OCEAN_FREIGHT_BASE = {
  nj: { klp: 750, od: 1250, poti: 1350 },
  ga: { klp: 850, od: 1350, poti: 1450 },
  fl: { klp: 800, od: 1300, poti: 1400 },
  tx: { klp: 950, od: 1450, poti: 1550 },
  ca: { klp: 1150, od: 1650, poti: 1750 }
};

const VEHICLE_TYPES = [
  { id: 'sedan', label: 'Седан', extra: 0, icon: Car },
  { id: 'suv', label: 'Кроссовер', extra: 150, icon: Car },
  { id: 'large-suv', label: 'Внедорожник / Минивэн', extra: 300, icon: Truck },
  { id: 'pickup', label: 'Пикап / Грузовик', extra: 500, icon: Truck },
  { id: 'moto', label: 'Мотоцикл', extra: -200, icon: Tag },
];

const EXIT_PORTS = [
  { id: 'nj', label: 'Порт Нью-Джерси (NJ)' },
  { id: 'ga', label: 'Порт Саванна (GA)' },
  { id: 'fl', label: 'Порт Майами (FL)' },
  { id: 'tx', label: 'Порт Хьюстон (TX)' },
  { id: 'ca', label: 'Порт Лос-Анджелес (CA)' },
];

const DEST_PORTS = [
  { id: 'klp', label: 'Клайпеда, Литва' },
  { id: 'od', label: 'Одесса, Украина' },
  { id: 'poti', label: 'Поти, Грузия' },
];

const FUEL_TYPES = [
  { id: 'petrol', label: 'Бензин' },
  { id: 'diesel', label: 'Дизель' },
  { id: 'electric', label: 'Электро' }
];

const CAR_MAKES = [
  "Acura", "Alfa Romeo", "Audi", "BMW", "Chevrolet", "Chrysler", "Dodge", "Ford", "GMC", "Honda", 
  "Hyundai", "Infiniti", "Jeep", "Kia", "Land Rover", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", 
  "Mitsubishi", "Nissan", "Porsche", "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo", "Другая"
];

const AUCTIONS = [
  { id: 'copart', label: 'Copart' },
  { id: 'iaai', label: 'IAAI' },
  { id: 'manheim', label: 'Manheim' },
];

// --- HELPER FUNCTIONS ---

const calculateAuctionFee = (price, auction) => {
  const p = parseFloat(price) || 0;
  if (p <= 0) return 0;
  
  if (auction === 'manheim') return Math.max(350, p * 0.05);
  
  if (p < 500) return 185;
  if (p < 1000) return 265;
  if (p < 1500) return 340;
  if (p < 2000) return 405;
  if (p < 2500) return 460;
  if (p < 3000) return 510;
  if (p < 3500) return 560;
  if (p < 4000) return 610;
  if (p < 4500) return 660;
  if (p < 5000) return 710;
  
  return 750 + (p * 0.045);
};

const calculateUkraineCustoms = (price, year, volumeCm3, fuelType) => {
  const p = parseFloat(price) || 0;
  const vol = parseFloat(volumeCm3) || 0;
  const currentYear = new Date().getFullYear();
  const vehicleAge = Math.max(1, Math.min(15, currentYear - parseInt(year || currentYear) - 1));

  if (p === 0) return { duty: 0, excise: 0, vat: 0, pension: 0, total: 0 };

  if (fuelType === 'electric') {
    const batteryCapacity = vol > 100 ? vol : 60; 
    const electricExcise = batteryCapacity * 1.1; 
    return { duty: 0, excise: electricExcise, vat: 0, pension: p * 0.03, total: electricExcise + (p * 0.03) };
  }

  const duty = p * 0.10;
  let baseRate = (fuelType === 'petrol') ? (vol <= 3000 ? 50 : 100) : (vol <= 3500 ? 75 : 150);
  const excise = baseRate * (vol / 1000) * vehicleAge * 1.1; 
  const vat = (p + duty + excise) * 0.20;

  let pensionRate = 0.03;
  if (p > 20000) pensionRate = 0.04;
  if (p > 40000) pensionRate = 0.05;
  const pension = p * pensionRate;

  return { duty, excise, vat, pension, total: duty + excise + vat + pension };
};

// --- COMPONENTS ---

const PriceItem = ({ label, value, highlight = false, subtext }) => (
  <div className="flex justify-between items-center py-1 group cursor-pointer hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors">
    <div>
      <div className="text-xs text-gray-400 font-medium">{label}</div>
      {subtext && <div className="text-[9px] text-gray-600 font-bold">{subtext}</div>}
    </div>
    <div className={`text-sm font-mono font-bold ${highlight ? 'text-red-500' : 'text-white'}`}>
      {value === null || value === undefined ? '—' : `$${Math.round(value).toLocaleString()}`}
    </div>
  </div>
);

const InputWrapper = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 px-1">
      {Icon && <Icon size={12} className="text-[#FFCC33]" />}
      {label}
    </label>
    {children}
  </div>
);

export default function App() {
  const [vehicleType, setVehicleType] = useState('sedan');
  const [auctionPrice, setAuctionPrice] = useState('');
  const [auctionType, setAuctionType] = useState('copart');
  const [carMake, setCarMake] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [exitPort, setExitPort] = useState('nj');
  const [destPort, setDestPort] = useState('klp');
  
  // Customs
  const [prodYear, setProdYear] = useState('2020');
  const [engineVolume, setEngineVolume] = useState('2000');
  const [fuelType, setFuelType] = useState('petrol');
  
  // Extra Fees
  const brokerFee = 450;
  const exportDocsFee = 150;
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);

  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  // Calculations
  const auctionFee = useMemo(() => calculateAuctionFee(auctionPrice, auctionType), [auctionPrice, auctionType]);
  const currentCityObj = useMemo(() => SHIPPING_DATA[auctionType]?.find(c => c.city === selectedCity), [selectedCity, auctionType]);
  const landCost = useMemo(() => (currentCityObj ? currentCityObj.rates[exitPort] : null), [currentCityObj, exitPort]);
  
  const vehicleExtra = useMemo(() => VEHICLE_TYPES.find(t => t.id === vehicleType)?.extra || 0, [vehicleType]);
  const baseOcean = useMemo(() => OCEAN_FREIGHT_BASE[exitPort]?.[destPort] || 0, [exitPort, destPort]);
  const oceanCost = useMemo(() => baseOcean + vehicleExtra, [baseOcean, vehicleExtra]);
  
  const insurance = useMemo(() => insuranceEnabled ? (parseFloat(auctionPrice) || 0) * 0.015 : 0, [auctionPrice, insuranceEnabled]);
  const customs = useMemo(() => calculateUkraineCustoms(auctionPrice, prodYear, engineVolume, fuelType), [auctionPrice, prodYear, engineVolume, fuelType]);
  
  const totalCost = useMemo(() => {
    const p = parseFloat(auctionPrice) || 0;
    return p + auctionFee + (landCost || 0) + oceanCost + customs.total + brokerFee + exportDocsFee + insurance;
  }, [auctionPrice, auctionFee, landCost, oceanCost, customs, insurance]);

  useEffect(() => {
    const saved = localStorage.getItem('w8_pro_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = () => {
    const entry = {
      id: Date.now(),
      name: saveName || carMake || 'Лот',
      total: totalCost,
      date: new Date().toLocaleDateString()
    };
    const newHistory = [entry, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('w8_pro_history', JSON.stringify(newHistory));
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-gray-200 font-sans selection:bg-[#FFCC33] selection:text-black">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50 border-b border-gray-800 py-4 px-6 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFCC33] text-black rounded-lg flex items-center justify-center transform rotate-3 shadow-[0_0_15px_rgba(255,204,51,0.5)] cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg sm:text-xl tracking-wide uppercase leading-none">Car Commission</h1>
            <span className="text-[10px] text-[#FFCC33] tracking-[0.2em] font-medium uppercase">Calculator</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: CAR */}
          <div className="bg-[#161616] rounded-[2rem] p-6 sm:p-8 border border-gray-800 shadow-xl space-y-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Car className="text-[#FFCC33]" size={20} />
              1. Автомобиль и параметры лота
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {VEHICLE_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setVehicleType(type.id)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 border transition-all cursor-pointer ${vehicleType === type.id ? 'bg-[#FFCC33] border-[#FFCC33] text-black shadow-lg shadow-[#FFCC33]/20' : 'bg-[#1F1F1F] border-gray-800 hover:border-gray-500'}`}
                >
                  <type.icon size={20} />
                  <span className="text-[10px] font-bold uppercase text-center leading-tight">{type.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputWrapper label="Марка" icon={Tag}>
                <select value={carMake} onChange={(e) => setCarMake(e.target.value)} className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-[#FFCC33] transition-colors">
                  <option value="">Выберите марку</option>
                  {CAR_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </InputWrapper>

              <InputWrapper label="Год" icon={Calendar}>
                <select value={prodYear} onChange={(e) => setProdYear(e.target.value)} className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-[#FFCC33] transition-colors">
                  {Array.from({ length: 30 }, (_, i) => 2024 - i).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </InputWrapper>

              <InputWrapper label="Объем (см3)" icon={Zap}>
                <input type="number" value={engineVolume} onChange={(e) => setEngineVolume(e.target.value)} placeholder="2000" className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-[#FFCC33] cursor-pointer" />
              </InputWrapper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Тип топлива" icon={Fuel}>
                <div className="flex gap-2 bg-[#1F1F1F] p-1 rounded-xl border border-gray-800">
                  {FUEL_TYPES.map(f => (
                    <button key={f.id} onClick={() => setFuelType(f.id)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${fuelType === f.id ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </InputWrapper>
              
              <InputWrapper label="Цена аукциона ($)" icon={DollarSign}>
                <input type="number" value={auctionPrice} onChange={(e) => setAuctionPrice(e.target.value)} placeholder="0" className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none font-bold text-white focus:border-[#FFCC33] cursor-pointer text-lg shadow-inner" />
              </InputWrapper>
            </div>
          </div>

          {/* STEP 2: LOGISTICS */}
          <div className="bg-[#161616] rounded-[2rem] p-6 sm:p-8 border border-gray-800 shadow-xl space-y-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Globe className="text-[#FFCC33]" size={20} />
              2. Логистика и Маршрут
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Аукцион" icon={Anchor}>
                <div className="flex gap-2 bg-[#1F1F1F] p-1 rounded-xl border border-gray-800">
                  {AUCTIONS.map(a => (
                    <button key={a.id} onClick={() => { setAuctionType(a.id); setSelectedCity(''); }} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${auctionType === a.id ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </InputWrapper>

              <InputWrapper label="Площадка (USA)" icon={MapPin}>
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-[#FFCC33]">
                  <option value="">Выберите город</option>
                  {SHIPPING_DATA[auctionType].map(l => <option key={l.city} value={l.city}>{l.city}</option>)}
                </select>
              </InputWrapper>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper label="Порт выхода (USA)" icon={Ship}>
                <select value={exitPort} onChange={(e) => setExitPort(e.target.value)} className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-[#FFCC33]">
                  {EXIT_PORTS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </InputWrapper>

              <InputWrapper label="Порт назначения" icon={Anchor}>
                <select value={destPort} onChange={(e) => setDestPort(e.target.value)} className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-[#FFCC33]">
                  {DEST_PORTS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </InputWrapper>
            </div>
            
            <div className="flex items-center gap-4 bg-[#1F1F1F] p-4 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex-1">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Страхование (1.5%)</div>
                <div className="text-[10px] text-gray-600 font-bold">Полное покрытие повреждений при доставке</div>
              </div>
              <button 
                onClick={() => setInsuranceEnabled(!insuranceEnabled)}
                className={`w-14 h-8 rounded-full transition-all relative cursor-pointer ${insuranceEnabled ? 'bg-[#FFCC33]' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${insuranceEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#161616] rounded-[2.5rem] border border-gray-800 sticky top-24 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 bg-[#1A1A1A]">
              <h3 className="font-bold flex items-center gap-2 text-white uppercase text-sm tracking-widest">
                <ShieldCheck size={18} className="text-[#FFCC33]" />
                Полная смета
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <PriceItem label="Стоимость авто" value={auctionPrice} />
                <PriceItem label="Аукционный сбор" value={auctionFee} subtext={`Аукцион: ${auctionType.toUpperCase()}`} />
              </div>

              <div className="h-px bg-gray-800/50" />

              <div className="space-y-1">
                <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Логистика (Logistics)</div>
                <PriceItem label="Доставка (USA Land)" value={landCost} highlight={landCost === null} />
                <PriceItem label="Фрахт (Ocean)" value={oceanCost} subtext={`Порт: ${destPort.toUpperCase()}`} />
                <PriceItem label="Страховка" value={insurance} />
              </div>

              <div className="h-px bg-gray-800/50" />

              <div className="space-y-1">
                <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Таможня (Customs UA)</div>
                <PriceItem label="Пошлина + Акциз + НДС" value={customs.total - customs.pension} />
                <PriceItem label="Пенсионный фонд" value={customs.pension} />
              </div>

              <div className="h-px bg-gray-800/50" />

              <div className="space-y-1">
                <PriceItem label="Брокер + Экспорт" value={brokerFee + exportDocsFee} subtext="Оформление и документация" />
              </div>

              <div className="pt-6 mt-6 border-t border-gray-800">
                <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">ИТОГО ПОД КЛЮЧ</div>
                <div className="text-5xl font-black text-[#FFCC33] font-mono leading-none tracking-tighter">
                  ${Math.round(totalCost).toLocaleString()}
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-6 bg-[#FFCC33] hover:bg-[#E6B82E] text-black font-black py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#FFCC33]/10 cursor-pointer uppercase text-xs tracking-[0.2em]"
              >
                Сохранить расчет
              </button>
            </div>
          </div>
          
          {/* History */}
          <div className="bg-[#161616] rounded-3xl border border-gray-800 p-6">
            <h3 className="font-bold text-[10px] text-gray-500 uppercase mb-4 flex items-center gap-2">
              <History size={14} /> История (History)
            </h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-xs text-gray-700 italic">История пуста</div>
              ) : (
                history.map(item => (
                  <div key={item.id} className="bg-[#1F1F1F] p-3 rounded-xl border border-gray-800 flex justify-between items-center group cursor-pointer hover:border-[#FFCC33]/40 transition-colors">
                    <div>
                      <div className="text-[9px] text-gray-500">{item.date}</div>
                      <div className="text-xs font-bold text-white">{item.name}</div>
                    </div>
                    <div className="text-[#FFCC33] font-mono font-bold text-sm">${Math.round(item.total).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* SAVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#161616] border border-gray-800 rounded-[2.5rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-center">Название</h3>
            <input 
              type="text" 
              placeholder="Напр. Tesla Model Y" 
              value={saveName} 
              onChange={(e) => setSaveName(e.target.value)} 
              className="w-full bg-[#1F1F1F] border border-gray-800 rounded-2xl px-6 py-4 outline-none text-white focus:border-[#FFCC33] cursor-pointer mb-6"
              autoFocus
            />
            <button 
              onClick={saveToHistory} 
              className="w-full bg-[#FFCC33] text-black font-black py-4 rounded-2xl hover:bg-[#E6B82E] transition-all cursor-pointer uppercase tracking-widest text-xs"
            >
              Подтвердить
            </button>
          </div>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0F0F0F; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #444; }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23555'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-position: right 1rem center; background-repeat: no-repeat; background-size: 1rem; padding-right: 2.5rem; }
      `}</style>
    </div>
  );
}
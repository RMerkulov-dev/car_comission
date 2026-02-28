import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Calculator, DollarSign, Save, Trash2, History, Anchor, 
  Truck, Car, Tag, Info, X, ShieldCheck, Ship, 
  Zap, Fuel, Calendar, Globe, Download, FileText, User
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

// --- ТАРИФЫ МОРСКОГО ФРАХТА ---
const OCEAN_FREIGHT_BASE = {
  nj: { klp: 575, od: 1250, poti: 1350 },
  ga: { klp: 675, od: 1350, poti: 1450 },
  fl: { klp: 800, od: 1300, poti: 1400 },
  tx: { klp: 750, od: 1450, poti: 1550 },
  ca: { klp: 1150, od: 1650, poti: 1750 }
};

const VEHICLE_TYPES = [
  { id: 'sedan', label: 'Седан', extra: 0, icon: Car },
  { id: 'suv', label: 'Кроссовер', extra: 150, icon: Car },
  { id: 'moto', label: 'Мотоцикл', extra: -200, icon: Tag },
];

const EXIT_PORTS = [
  { id: 'nj', label: 'Порт Нью-Джерси (NY/NJ)' },
  { id: 'ga', label: 'Порт Саванна (GA)' },
  { id: 'fl', label: 'Порт Майами (FL)' },
  { id: 'tx', label: 'Порт Хьюстон (TX)' },
  { id: 'ca', label: 'Порт Лос-Анджелес (CA)' },
];

const DEST_PORTS = [
  { id: 'klp', label: 'Клайпеда, Литва' },
  { id: 'od', label: 'Одесса, Украина', disabled: true },
  { id: 'poti', label: 'Поти, Грузия', disabled: true },
];

const FUEL_TYPES = [
  { id: 'petrol', label: 'Бензин' },
  { id: 'diesel', label: 'Дизель' },
  { id: 'electric', label: 'Электро' },
  { id: 'hybrid', label: 'Гибрид' }
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
  const EUR_TO_USD = 1.08; 
  const currentYear = new Date().getFullYear();
  let vehicleAge = currentYear - parseInt(year || currentYear) - 1;
  vehicleAge = Math.max(1, Math.min(15, vehicleAge)); 

  if (p === 0) return { duty: 0, excise: 0, vat: 0, total: 0 };

  if (fuelType === 'electric') {
    const batteryCapacity = vol < 200 && vol > 0 ? vol : 60; 
    const excise = batteryCapacity * 1 * EUR_TO_USD; 
    return { duty: 0, excise, vat: 0, total: excise };
  }

  const duty = p * 0.10;
  let excise = 0;

  if (fuelType === 'hybrid') {
    excise = 100 * EUR_TO_USD;
  } else {
    let baseRate = (fuelType === 'petrol') ? (vol <= 3000 ? 50 : 100) : (vol <= 3500 ? 75 : 150);
    excise = baseRate * (vol / 1000) * vehicleAge * EUR_TO_USD;
  }

  const vat = (p + duty + excise) * 0.20;
  return { duty, excise, vat, total: duty + excise + vat };
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
  const [selectedCity, setSelectedCity] = useState('');
  const [exitPort, setExitPort] = useState('nj');
  const [destPort, setDestPort] = useState('klp');
  
  // Customs
  const [prodYear, setProdYear] = useState('2020');
  const [engineVolume, setEngineVolume] = useState('2000');
  const [fuelType, setFuelType] = useState('petrol');
  
  // Additional dynamic fees
  const [extraFees, setExtraFees] = useState({
    forwarding: '',
    carrier: '',
    broker: '',
    dealer: ''
  });
  
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);

  const [history, setHistory] = useState([]);
  
  // Modal State ('save' | 'pdf' | null)
  const [modalMode, setModalMode] = useState(null);
  const [saveName, setSaveName] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Calculations
  const auctionFee = useMemo(() => calculateAuctionFee(auctionPrice, auctionType), [auctionPrice, auctionType]);
  const currentCityObj = useMemo(() => SHIPPING_DATA[auctionType]?.find(c => c.city === selectedCity), [selectedCity, auctionType]);
  const landCost = useMemo(() => (currentCityObj ? currentCityObj.rates[exitPort] : null), [currentCityObj, exitPort]);
  
  const vehicleExtra = useMemo(() => VEHICLE_TYPES.find(t => t.id === vehicleType)?.extra || 0, [vehicleType]);
  const baseOcean = useMemo(() => OCEAN_FREIGHT_BASE[exitPort]?.[destPort] || 0, [exitPort, destPort]);
  const oceanCost = useMemo(() => baseOcean + vehicleExtra, [baseOcean, vehicleExtra]);
  
  // Опасный груз
  const dangerousGoodsFee = useMemo(() => {
    return (fuelType === 'electric' || fuelType === 'hybrid') ? 175 : 0;
  }, [fuelType]);
  
  const insurance = useMemo(() => insuranceEnabled ? (parseFloat(auctionPrice) || 0) * 0.015 : 0, [auctionPrice, insuranceEnabled]);
  const customs = useMemo(() => calculateUkraineCustoms(auctionPrice, prodYear, engineVolume, fuelType), [auctionPrice, prodYear, engineVolume, fuelType]);
  
  // Parsed Extra Fees
  const fwd = parseFloat(extraFees.forwarding) || 0;
  const car = parseFloat(extraFees.carrier) || 0;
  const brk = parseFloat(extraFees.broker) || 0;
  const dlr = parseFloat(extraFees.dealer) || 0;

  const totalCost = useMemo(() => {
    const p = parseFloat(auctionPrice) || 0;
    return p + auctionFee + (landCost || 0) + oceanCost + dangerousGoodsFee + customs.total + fwd + car + brk + dlr + insurance;
  }, [auctionPrice, auctionFee, landCost, oceanCost, dangerousGoodsFee, customs, fwd, car, brk, dlr, insurance]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('w8_pro_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedFees = localStorage.getItem('w8_extra_fees');
    if (savedFees) {
      try { setExtraFees(JSON.parse(savedFees)); } catch(e) {}
    }
    
    // Перезаписываем тайтл и иконку вкладки в браузере
    document.title = "Car Commission Calculator";
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚗</text></svg>";
    } else {
       const newLink = document.createElement('link');
       newLink.rel = 'icon';
       newLink.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚗</text></svg>";
       document.head.appendChild(newLink);
    }
  }, []);

  const handleExtraFeeChange = (field, value) => {
    const newFees = { ...extraFees, [field]: value };
    setExtraFees(newFees);
    localStorage.setItem('w8_extra_fees', JSON.stringify(newFees));
  };

  // --- ЛОГИКА АВТОВЫБОРА САМОГО ДЕШЕВОГО ПОРТА ---
  const autoSelectCheapestPort = (city, destination, currentAuction) => {
    if (!city) return;
    const cityObj = SHIPPING_DATA[currentAuction]?.find(c => c.city === city);
    
    if (cityObj) {
      let minCost = Infinity;
      let bestPort = 'nj'; 
      
      Object.keys(OCEAN_FREIGHT_BASE).forEach(port => {
        const lCost = cityObj.rates[port];
        if (lCost !== null && lCost !== undefined) {
          const oCost = OCEAN_FREIGHT_BASE[port]?.[destination] || 0;
          const totalDeliveryCost = lCost + oCost;
          if (totalDeliveryCost < minCost) {
            minCost = totalDeliveryCost;
            bestPort = port;
          }
        }
      });
      if (minCost !== Infinity) setExitPort(bestPort);
    }
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    autoSelectCheapestPort(newCity, destPort, auctionType);
  };

  const handleDestPortChange = (e) => {
    const newDest = e.target.value;
    setDestPort(newDest);
    autoSelectCheapestPort(selectedCity, newDest, auctionType);
  };

  const saveToHistory = () => {
    const entry = {
      id: Date.now(),
      name: saveName || 'Лот',
      total: totalCost,
      date: new Date().toLocaleDateString()
    };
    const newHistory = [entry, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('w8_pro_history', JSON.stringify(newHistory));
    setModalMode(null);
    setSaveName('');
  };

  const generatePDF = async () => {
    setIsGeneratingPdf(true);
    try {
      if (!window.html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Находим шаблон инвойса
      const element = document.getElementById('pdf-invoice-template');
      
      const opt = {
        margin:       0.3, // Небольшие отступы, чтобы все влезло
        filename:     `${saveName || 'W8_Calculation'}.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      await window.html2pdf().set(opt).from(element).save();
      setModalMode(null);
      setSaveName('');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Ошибка при создании PDF документа. Попробуйте еще раз.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleModalSubmit = () => {
    if (modalMode === 'save') saveToHistory();
    if (modalMode === 'pdf') generatePDF();
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-[#0F0F0F] text-gray-200 font-sans selection:bg-[#FFCC33] selection:text-black">
      
      {/* СКРЫТЫЙ ШАБЛОН ДЛЯ PDF */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -10, pointerEvents: 'none' }}>
        <div id="pdf-invoice-template" style={{ width: '800px', backgroundColor: '#ffffff', color: '#000000', padding: '40px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#FFCC33', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#000' }}>Car Commission</h1>
                <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', letterSpacing: '2px' }}>Calculator</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#333' }}>Смета # {Date.now().toString().slice(-6)}</h2>
              <p style={{ fontSize: '14px', margin: 0, color: '#666' }}>Дата: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Parameters */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '15px', color: '#000' }}>Параметры лота</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '10px', fontSize: '14px', color: '#000' }}>
              <div><span style={{ color: '#666', marginRight: '8px' }}>Тип кузова:</span> <b>{VEHICLE_TYPES.find(t=>t.id===vehicleType)?.label}</b></div>
              <div><span style={{ color: '#666', marginRight: '8px' }}>Год выпуска:</span> <b>{prodYear}</b></div>
              <div><span style={{ color: '#666', marginRight: '8px' }}>Тип топлива:</span> <b>{FUEL_TYPES.find(t=>t.id===fuelType)?.label}</b></div>
              <div><span style={{ color: '#666', marginRight: '8px' }}>Объем / Емкость:</span> <b>{engineVolume} {fuelType === 'electric' ? 'кВт' : 'см3'}</b></div>
              <div><span style={{ color: '#666', marginRight: '8px' }}>Аукцион:</span> <b style={{ textTransform: 'uppercase' }}>{auctionType}</b></div>
              <div><span style={{ color: '#666', marginRight: '8px' }}>Локация (США):</span> <b>{selectedCity || 'Не указана'}</b></div>
              <div><span style={{ color: '#666', marginRight: '8px' }}>Маршрут:</span> <b style={{ textTransform: 'uppercase' }}>{exitPort} ➔ {destPort}</b></div>
              <div><span style={{ color: '#666', marginRight: '8px' }}>Название авто:</span> <b>{saveName || 'Без названия'}</b></div>
            </div>
          </div>

          {/* Table */}
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '15px', color: '#000' }}>Детализация стоимости</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                <th style={{ padding: '12px', borderBottom: '1px solid #d1d5db', textAlign: 'left', fontWeight: 'bold' }}>Статья расходов</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #d1d5db', textAlign: 'right', fontWeight: 'bold' }}>Сумма ($)</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Цена лота на аукционе</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>${Math.round(auctionPrice||0).toLocaleString()}</td></tr>
              <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Аукционный сбор ({auctionType.toUpperCase()})</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(auctionFee).toLocaleString()}</td></tr>
              <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Доставка по США (до порта {exitPort.toUpperCase()})</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(landCost||0).toLocaleString()}</td></tr>
              <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Морской фрахт (до {destPort.toUpperCase()})</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(oceanCost).toLocaleString()}</td></tr>
              
              {dangerousGoodsFee > 0 && (
                <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Надбавка за опасный груз (Батарея)</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(dangerousGoodsFee).toLocaleString()}</td></tr>
              )}
              {insurance > 0 && (
                <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Страхование груза (1.5%)</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(insurance).toLocaleString()}</td></tr>
              )}
              
              <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Таможенные платежи (Пошлина, Акциз, НДС)</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(customs.total).toLocaleString()}</td></tr>
              
              <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Экспедирование Клайпеда</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(fwd).toLocaleString()}</td></tr>
              <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Автовоз в Украину</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(car).toLocaleString()}</td></tr>
              <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Брокерские услуги</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(brk).toLocaleString()}</td></tr>
              <tr><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Комиссия дилера</td><td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(dlr).toLocaleString()}</td></tr>
            </tbody>
          </table>

          {/* Total Block */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <div style={{ backgroundColor: '#FFCC33', padding: '20px 30px', borderRadius: '12px', textAlign: 'right', color: '#000' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Итого под ключ</div>
              <div style={{ fontSize: '36px', fontWeight: '900', fontFamily: 'monospace', lineHeight: 1 }}>${Math.round(totalCost).toLocaleString()}</div>
            </div>
          </div>
          
          <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
            Документ сгенерирован автоматически системой Car Commission Calculator.
          </div>
        </div>
      </div>

      {/* ОСНОВНОЕ ПРИЛОЖЕНИЕ */}
      <div className="relative z-10 bg-[#0F0F0F] min-h-screen pb-10">
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

              <div className="grid grid-cols-3 gap-3">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label="Год" icon={Calendar}>
                  <select value={prodYear} onChange={(e) => setProdYear(e.target.value)} className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-[#FFCC33] transition-colors">
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </InputWrapper>

                <InputWrapper label="Объем (см3) / Емкость (кВт)" icon={Zap}>
                  <input type="number" value={engineVolume} onChange={(e) => setEngineVolume(e.target.value)} placeholder="2000" className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-[#FFCC33] cursor-pointer" />
                </InputWrapper>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label="Тип топлива" icon={Fuel}>
                  <div className="flex gap-2 bg-[#1F1F1F] p-1 rounded-xl border border-gray-800">
                    {FUEL_TYPES.map(f => (
                      <button key={f.id} onClick={() => setFuelType(f.id)} className={`flex-1 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${fuelType === f.id ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-gray-300'}`}>
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
                  <select value={selectedCity} onChange={handleCityChange} className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-[#FFCC33]">
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
                  <select value={destPort} onChange={handleDestPortChange} className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-[#FFCC33]">
                    {DEST_PORTS.map(d => <option key={d.id} value={d.id} disabled={d.disabled}>{d.label}</option>)}
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

            {/* STEP 3: ADDITIONAL FEES */}
            <div className="bg-[#161616] rounded-[2rem] p-6 sm:p-8 border border-gray-800 shadow-xl space-y-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Calculator className="text-[#FFCC33]" size={20} />
                3. Дополнительные расходы
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label="Экспедирование Клайпеда ($)" icon={Anchor}>
                  <input 
                    type="number" 
                    value={extraFees.forwarding} 
                    onChange={(e) => handleExtraFeeChange('forwarding', e.target.value)} 
                    placeholder="0" 
                    className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none font-bold text-white focus:border-[#FFCC33] cursor-pointer shadow-inner" 
                  />
                </InputWrapper>

                <InputWrapper label="Автовоз в Украину ($)" icon={Truck}>
                  <input 
                    type="number" 
                    value={extraFees.carrier} 
                    onChange={(e) => handleExtraFeeChange('carrier', e.target.value)} 
                    placeholder="0" 
                    className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none font-bold text-white focus:border-[#FFCC33] cursor-pointer shadow-inner" 
                  />
                </InputWrapper>
                
                <InputWrapper label="Брокер ($)" icon={FileText}>
                  <input 
                    type="number" 
                    value={extraFees.broker} 
                    onChange={(e) => handleExtraFeeChange('broker', e.target.value)} 
                    placeholder="0" 
                    className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none font-bold text-white focus:border-[#FFCC33] cursor-pointer shadow-inner" 
                  />
                </InputWrapper>
                
                <InputWrapper label="Диллер (Комиссия) ($)" icon={User}>
                  <input 
                    type="number" 
                    value={extraFees.dealer} 
                    onChange={(e) => handleExtraFeeChange('dealer', e.target.value)} 
                    placeholder="0" 
                    className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none font-bold text-white focus:border-[#FFCC33] cursor-pointer shadow-inner" 
                  />
                </InputWrapper>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#161616] rounded-[2.5rem] border border-gray-800 sticky top-24 shadow-2xl overflow-hidden flex flex-col">
              
              <div className="bg-[#161616] flex-1">
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
                    {dangerousGoodsFee > 0 && (
                      <PriceItem label="Опасный груз" value={dangerousGoodsFee} subtext="Батарея (Электро/Гибрид)" />
                    )}
                    <PriceItem label="Страховка" value={insurance} />
                  </div>

                  <div className="h-px bg-gray-800/50" />

                  <div className="space-y-1">
                    <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Таможня (Customs UA)</div>
                    <PriceItem label="Пошлина + Акциз + НДС" value={customs.total} />
                  </div>

                  <div className="h-px bg-gray-800/50" />

                  <div className="space-y-1">
                    <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Локальные расходы и услуги</div>
                    <PriceItem label="Экспедирование Клайпеда" value={fwd} />
                    <PriceItem label="Автовоз в Украину" value={car} />
                    <PriceItem label="Брокерские услуги" value={brk} />
                    <PriceItem label="Комиссия дилера" value={dlr} />
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-800">
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">ИТОГО ПОД КЛЮЧ</div>
                    <div className="text-5xl font-black text-[#FFCC33] font-mono leading-none tracking-tighter">
                      ${Math.round(totalCost).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="p-6 pt-0 flex gap-3">
                <button 
                  onClick={() => setModalMode('save')}
                  className="flex-1 bg-[#1F1F1F] hover:bg-[#333] text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 border border-gray-700 cursor-pointer uppercase text-[10px] tracking-[0.1em] flex flex-col items-center justify-center gap-1"
                >
                  <Save size={18} />
                  <span>В историю</span>
                </button>
                <button 
                  onClick={() => setModalMode('pdf')}
                  className="flex-[2] bg-[#FFCC33] hover:bg-[#E6B82E] text-black font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#FFCC33]/10 cursor-pointer uppercase text-[11px] tracking-[0.1em] flex flex-col items-center justify-center gap-1"
                >
                  <FileText size={18} />
                  <span>Скачать PDF</span>
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

        {/* MODAL */}
        {modalMode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer" onClick={() => setModalMode(null)} />
            <div className="bg-[#161616] border border-gray-800 rounded-[2.5rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-center">
                {modalMode === 'pdf' ? 'Имя файла для PDF' : 'Название лота'}
              </h3>
              <input 
                type="text" 
                placeholder="Напр. Tesla Model Y" 
                value={saveName} 
                onChange={(e) => setSaveName(e.target.value)} 
                className="w-full bg-[#1F1F1F] border border-gray-800 rounded-2xl px-6 py-4 outline-none text-white focus:border-[#FFCC33] cursor-pointer mb-6"
                autoFocus
              />
              <button 
                onClick={handleModalSubmit} 
                disabled={isGeneratingPdf}
                className={`w-full text-black font-black py-4 rounded-2xl transition-all cursor-pointer uppercase tracking-widest text-xs flex justify-center items-center gap-2
                  ${isGeneratingPdf ? 'bg-[#E6B82E] opacity-70 cursor-wait' : 'bg-[#FFCC33] hover:bg-[#E6B82E]'}`}
              >
                {isGeneratingPdf ? (
                  'Генерация документа...'
                ) : (
                  <>
                    {modalMode === 'pdf' ? <Download size={16} /> : <Save size={16} />}
                    {modalMode === 'pdf' ? 'Скачать документ' : 'Подтвердить'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0F0F0F; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #444; }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}
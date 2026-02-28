// Раскомментируйте эту строку в вашем локальном проекте:
import { SHIPPING_DATA } from './assets/shipping_data';

// Раскомментируйте эту строку в вашем локальном проекте и удалите INLINE SHIPPING DATA ниже:
// import { SHIPPING_DATA } from './assets/shipping_data';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MapPin, Calculator, DollarSign, Save, Trash2, History, Anchor, 
  Truck, Car, Tag, Info, X, ShieldCheck, Ship, 
  Zap, Fuel, Calendar, Globe, Download, FileText, User, Search, ChevronDown
} from 'lucide-react';

// --- INLINE SHIPPING DATA TO RESOLVE IMPORT ERROR IN PREVIEW ---
// УДАЛИТЕ ЭТОТ БЛОК В ВАШЕМ ЛОКАЛЬНОМ ПРОЕКТЕ, ЕСЛИ ИСПОЛЬЗУЕТЕ ИМПОРТ ВЫШЕ


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

const calculateCopartFee = (price) => {
  const p = parseFloat(price) || 0;
  if (p <= 0) return 0;
  
  // Secured Payment Methods (Buyer Fee)
  let buyerFee = 0;
  if (p < 100) buyerFee = 1;
  else if (p < 200) buyerFee = 25;
  else if (p < 300) buyerFee = 60;
  else if (p < 350) buyerFee = 85;
  else if (p < 400) buyerFee = 100;
  else if (p < 450) buyerFee = 125;
  else if (p < 500) buyerFee = 135;
  else if (p < 550) buyerFee = 145;
  else if (p < 600) buyerFee = 155;
  else if (p < 700) buyerFee = 170;
  else if (p < 800) buyerFee = 195;
  else if (p < 900) buyerFee = 215;
  else if (p < 1000) buyerFee = 230;
  else if (p < 1200) buyerFee = 250;
  else if (p < 1300) buyerFee = 270;
  else if (p < 1400) buyerFee = 285;
  else if (p < 1500) buyerFee = 300;
  else if (p < 1600) buyerFee = 315;
  else if (p < 1700) buyerFee = 330;
  else if (p < 1800) buyerFee = 350;
  else if (p < 2000) buyerFee = 370;
  else if (p < 2400) buyerFee = 390;
  else if (p < 2500) buyerFee = 425;
  else if (p < 3000) buyerFee = 460;
  else if (p < 3500) buyerFee = 505;
  else if (p < 4000) buyerFee = 555;
  else if (p < 4500) buyerFee = 600;
  else if (p < 5000) buyerFee = 625;
  else if (p < 5500) buyerFee = 650;
  else if (p < 6000) buyerFee = 675;
  else if (p < 6500) buyerFee = 700;
  else if (p < 7000) buyerFee = 720;
  else if (p < 7500) buyerFee = 755;
  else if (p < 8000) buyerFee = 775;
  else if (p < 8500) buyerFee = 800;
  else if (p < 10000) buyerFee = 820;
  else if (p < 11500) buyerFee = 850;
  else if (p < 12000) buyerFee = 860;
  else if (p < 12500) buyerFee = 875;
  else if (p < 15000) buyerFee = 890;
  else buyerFee = p * 0.06;

  // Virtual Bid Fee (Live Bid)
  let virtualFee = 0;
  if (p < 100) virtualFee = 0;
  else if (p < 500) virtualFee = 50;
  else if (p < 1000) virtualFee = 65;
  else if (p < 1500) virtualFee = 85;
  else if (p < 2000) virtualFee = 95;
  else if (p < 4000) virtualFee = 110;
  else if (p < 6000) virtualFee = 125;
  else if (p < 8000) virtualFee = 145;
  else virtualFee = 160;

  // Fixed Fees: Service (Gate), Environmental, Title Handling
  const gateFee = 95;
  const envFee = 15;
  const titleFee = 20;

  return buyerFee + virtualFee + gateFee + envFee + titleFee;
};

const calculateIAAIFee = (price) => {
  const p = parseFloat(price) || 0;
  if (p <= 0) return 0;

  // ИСПОЛЬЗУЕМ "HIGH VOLUME FEE" (совпадает с вашим скриншотом: 4300$ -> 600$)
  let buyerFee = 0;
  if (p < 100) buyerFee = 1;
  else if (p < 200) buyerFee = 25;
  else if (p < 300) buyerFee = 60;
  else if (p < 350) buyerFee = 85;
  else if (p < 400) buyerFee = 100;
  else if (p < 450) buyerFee = 125;
  else if (p < 500) buyerFee = 135;
  else if (p < 550) buyerFee = 145;
  else if (p < 600) buyerFee = 155;
  else if (p < 700) buyerFee = 170;
  else if (p < 800) buyerFee = 195;
  else if (p < 900) buyerFee = 215;
  else if (p < 1000) buyerFee = 230;
  else if (p < 1200) buyerFee = 250;
  else if (p < 1300) buyerFee = 270;
  else if (p < 1400) buyerFee = 285;
  else if (p < 1500) buyerFee = 300;
  else if (p < 1600) buyerFee = 315;
  else if (p < 1700) buyerFee = 330;
  else if (p < 1800) buyerFee = 350;
  else if (p < 2000) buyerFee = 370;
  else if (p < 2400) buyerFee = 390;
  else if (p < 2500) buyerFee = 425;
  else if (p < 3000) buyerFee = 460;
  else if (p < 3500) buyerFee = 505;
  else if (p < 4000) buyerFee = 555; // Nissan на скрине: $3800 -> $555
  else if (p < 4500) buyerFee = 600; // Tiguan на скрине: $4300 -> $600
  else if (p < 5000) buyerFee = 625;
  else if (p < 5500) buyerFee = 650;
  else if (p < 6000) buyerFee = 675;
  else if (p < 6500) buyerFee = 700;
  else if (p < 7000) buyerFee = 720;
  else if (p < 7500) buyerFee = 755;
  else if (p < 8000) buyerFee = 775;
  else if (p < 8500) buyerFee = 800;
  else if (p < 10000) buyerFee = 820;
  else if (p < 11500) buyerFee = 850;
  else if (p < 12000) buyerFee = 860;
  else if (p < 12500) buyerFee = 875;
  else if (p < 15000) buyerFee = 890;
  else buyerFee = p * 0.06;

  // Internet Bid Fee (Live Online Bid Fee)
  let virtualFee = 0;
  if (p < 100) virtualFee = 0;
  else if (p < 500) virtualFee = 50;
  else if (p < 1000) virtualFee = 65;
  else if (p < 1500) virtualFee = 85;
  else if (p < 2000) virtualFee = 95;
  else if (p < 4000) virtualFee = 110; // Nissan на скрине: $3800 -> $110
  else if (p < 6000) virtualFee = 125; // Tiguan на скрине: $4300 -> $125
  else if (p < 8000) virtualFee = 145;
  else virtualFee = 160;

  // Fixed Fees: Service, Environmental, Title Handling
  const serviceFee = 95;
  const envFee = 15;
  const titleFee = 20;

  // В общую сумму не включены Transaction Tax ($5), так как они варьируются от штата,
  // но основные сборы теперь 1 в 1 как на аукционе
  return buyerFee + virtualFee + serviceFee + envFee + titleFee;
};

const calculateAuctionFee = (price, auction) => {
  const p = parseFloat(price) || 0;
  if (p <= 0) return 0;
  
  if (auction === 'copart') return calculateCopartFee(p);
  if (auction === 'iaai') return calculateIAAIFee(p);
  if (auction === 'manheim') return Math.max(350, p * 0.05);
  
  return 750 + (p * 0.045); // fallback
};

// ОБНОВЛЕННАЯ ФУНКЦИЯ: Теперь таможенная стоимость = Цена покупки + Аукционный сбор + $1600
const calculateUkraineCustoms = (price, year, volumeCm3, fuelType, auctionFeeValue = 0) => {
  const p = parseFloat(price) || 0;
  const vol = parseFloat(volumeCm3) || 0;
  const fee = parseFloat(auctionFeeValue) || 0;
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

  // Таможенная стоимость = Цена покупки + Аукционный сбор + $1600
  const customsBase = p + fee + 1600;

  const duty = customsBase * 0.10;
  let excise = 0;

  if (fuelType === 'hybrid') {
    excise = 100 * EUR_TO_USD;
  } else {
    let baseRate = (fuelType === 'petrol') ? (vol <= 3000 ? 50 : 100) : (vol <= 3500 ? 75 : 150);
    excise = baseRate * (vol / 1000) * vehicleAge * EUR_TO_USD;
  }

  const vat = (customsBase + duty + excise) * 0.20;
  return { duty, excise, vat, total: duty + excise + vat };
};

// --- COMPONENTS ---

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 outline-none cursor-pointer focus-within:border-[#FFCC33] flex justify-between items-center text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-white" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#1F1F1F] border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          <div className="sticky top-0 bg-[#1F1F1F] p-2 border-b border-gray-800">
            <div className="flex items-center bg-[#161616] rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-500 mr-2" />
              <input
                type="text"
                className="bg-transparent border-none outline-none text-white w-full text-sm"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          <div className="p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Ничего не найдено</div>
            ) : (
              filteredOptions.map(opt => (
                <div
                  key={opt}
                  className={`px-4 py-3 text-sm rounded-lg cursor-pointer transition-colors ${value === opt ? 'bg-[#FFCC33]/20 text-[#FFCC33]' : 'text-white hover:bg-white/5'}`}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {opt}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Обновленный компонент PriceItem с поддержкой редактирования
const PriceItem = ({ label, value, highlight = false, subtext, editable = false, onValueChange }) => (
  <div className="flex justify-between items-center py-1 group rounded-lg px-2 -mx-2 transition-colors">
    <div>
      <div className="text-xs text-gray-400 font-medium">{label}</div>
      {subtext && <div className="text-[9px] text-gray-600 font-bold">{subtext}</div>}
    </div>
    <div className="flex items-center">
      {editable ? (
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
          <input
            type="number"
            value={value === null || value === undefined ? '' : Math.round(value)}
            onChange={(e) => onValueChange(e.target.value)}
            className="w-24 bg-[#1F1F1F] border border-gray-700 rounded-md py-1 pl-5 pr-2 text-sm font-mono font-bold text-right text-[#FFCC33] outline-none focus:border-[#FFCC33] transition-colors"
            placeholder="0"
          />
        </div>
      ) : (
        <div className={`text-sm font-mono font-bold ${highlight ? 'text-red-500' : 'text-white'}`}>
          {value === null || value === undefined ? '—' : `$${Math.round(value).toLocaleString()}`}
        </div>
      )}
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

  // Править данные (режим редактирования)
  const [editMode, setEditMode] = useState(false);
  const [overrides, setOverrides] = useState({});

  const sortedCities = useMemo(() => {
    const cities = SHIPPING_DATA[auctionType] || [];
    return [...cities].sort((a, b) => a.city.localeCompare(b.city));
  }, [auctionType]);

  // Базовые автоматические расчеты
  const autoAuctionFee = useMemo(() => calculateAuctionFee(auctionPrice, auctionType), [auctionPrice, auctionType]);
  const currentCityObj = useMemo(() => SHIPPING_DATA[auctionType]?.find(c => c.city === selectedCity), [selectedCity, auctionType]);
  const autoLandCost = useMemo(() => (currentCityObj ? currentCityObj.rates[exitPort] : null), [currentCityObj, exitPort]);
  
  const vehicleExtra = useMemo(() => VEHICLE_TYPES.find(t => t.id === vehicleType)?.extra || 0, [vehicleType]);
  const baseOcean = useMemo(() => OCEAN_FREIGHT_BASE[exitPort]?.[destPort] || 0, [exitPort, destPort]);
  const autoOceanCost = useMemo(() => baseOcean + vehicleExtra, [baseOcean, vehicleExtra]);
  
  const autoDangerousGoodsFee = useMemo(() => {
    return (fuelType === 'electric' || fuelType === 'hybrid') ? 175 : 0;
  }, [fuelType]);
  
  const autoInsurance = useMemo(() => insuranceEnabled ? (parseFloat(auctionPrice) || 0) * 0.015 : 0, [auctionPrice, insuranceEnabled]);
  const autoCustoms = useMemo(() => calculateUkraineCustoms(auctionPrice, prodYear, engineVolume, fuelType, autoAuctionFee), [auctionPrice, prodYear, engineVolume, fuelType, autoAuctionFee]);

  const parsedFwd = parseFloat(extraFees.forwarding) || 0;
  const parsedCar = parseFloat(extraFees.carrier) || 0;
  const parsedBrk = parseFloat(extraFees.broker) || 0;
  const parsedDlr = parseFloat(extraFees.dealer) || 0;

  // Эффективные значения с учетом возможных ручных переопределений
  const effAuctionPrice = overrides.auctionPrice !== undefined ? overrides.auctionPrice : (parseFloat(auctionPrice) || 0);
  const effAuctionFee = overrides.auctionFee !== undefined ? overrides.auctionFee : autoAuctionFee;
  const effLandCost = overrides.landCost !== undefined ? overrides.landCost : (autoLandCost || 0);
  const effOceanCost = overrides.oceanCost !== undefined ? overrides.oceanCost : autoOceanCost;
  const effDangerousGoodsFee = overrides.dangerousGoodsFee !== undefined ? overrides.dangerousGoodsFee : autoDangerousGoodsFee;
  const effInsurance = overrides.insurance !== undefined ? overrides.insurance : autoInsurance;
  const effCustomsTotal = overrides.customsTotal !== undefined ? overrides.customsTotal : autoCustoms.total;
  const effFwd = overrides.fwd !== undefined ? overrides.fwd : parsedFwd;
  const effCar = overrides.car !== undefined ? overrides.car : parsedCar;
  const effBrk = overrides.brk !== undefined ? overrides.brk : parsedBrk;
  const effDlr = overrides.dlr !== undefined ? overrides.dlr : parsedDlr;

  const effTotalCost = useMemo(() => {
    return effAuctionPrice + effAuctionFee + effLandCost + effOceanCost + effDangerousGoodsFee + effInsurance + effCustomsTotal + effFwd + effCar + effBrk + effDlr;
  }, [effAuctionPrice, effAuctionFee, effLandCost, effOceanCost, effDangerousGoodsFee, effInsurance, effCustomsTotal, effFwd, effCar, effBrk, effDlr]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('w8_pro_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedFees = localStorage.getItem('w8_extra_fees');
    if (savedFees) {
      try { setExtraFees(JSON.parse(savedFees)); } catch(e) {}
    }
    
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

  const handleOverrideChange = (key, val) => {
    setOverrides(prev => ({ ...prev, [key]: val === '' ? undefined : parseFloat(val) }));
  };

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

  const handleCityChange = (newCity) => {
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
      total: effTotalCost,
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
    
    window.scrollTo(0, 0);

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

      const element = document.getElementById('pdf-invoice-template');
      
      const opt = {
        margin:       0.2,
        filename:     `${saveName || 'W8_Calculation'}.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, scrollY: 0, scrollX: 0 },
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
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -100, pointerEvents: 'none' }}>
        <div id="pdf-invoice-template" style={{ width: '750px', backgroundColor: '#ffffff', color: '#000000', padding: '30px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '15px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '45px', height: '45px', backgroundColor: '#FFCC33', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, color: '#000' }}>Car Commission</h1>
                <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', letterSpacing: '2px' }}>Calculator</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#333' }}>Смета # {Date.now().toString().slice(-6)}</h2>
              <p style={{ fontSize: '13px', margin: 0, color: '#666' }}>Дата: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Parameters */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px', color: '#000' }}>Параметры лота</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '8px', fontSize: '13px', color: '#000' }}>
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
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px', color: '#000' }}>Детализация стоимости</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #d1d5db', textAlign: 'left', fontWeight: 'bold' }}>Статья расходов</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #d1d5db', textAlign: 'right', fontWeight: 'bold' }}>Сумма ($)</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Цена лота на аукционе</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontWeight: 'bold', fontFamily: 'monospace' }}>${Math.round(effAuctionPrice||0).toLocaleString()}</td></tr>
              <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Аукционный сбор ({auctionType.toUpperCase()})</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(effAuctionFee).toLocaleString()}</td></tr>
              <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Доставка по США (до порта {exitPort.toUpperCase()})</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(effLandCost||0).toLocaleString()}</td></tr>
              <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Морской фрахт (до {destPort.toUpperCase()})</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(effOceanCost).toLocaleString()}</td></tr>
              
              {effDangerousGoodsFee > 0 && (
                <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Надбавка за опасный груз (Батарея)</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(effDangerousGoodsFee).toLocaleString()}</td></tr>
              )}
              {effInsurance > 0 && (
                <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Страхование груза (1.5%)</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(effInsurance).toLocaleString()}</td></tr>
              )}
              
              <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Таможенные платежи (Пошлина, Акциз, НДС)</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(effCustomsTotal).toLocaleString()}</td></tr>
              
              {effFwd > 0 && <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Экспедирование Клайпеда</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(effFwd).toLocaleString()}</td></tr>}
              {effCar > 0 && <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Автовоз в Украину</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(effCar).toLocaleString()}</td></tr>}
              {effBrk > 0 && <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Брокерские услуги</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(effBrk).toLocaleString()}</td></tr>}
              {effDlr > 0 && <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Комиссия дилера</td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontFamily: 'monospace' }}>${Math.round(effDlr).toLocaleString()}</td></tr>}
            </tbody>
          </table>

          {/* Total Block */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
            <div style={{ backgroundColor: '#FFCC33', padding: '15px 25px', borderRadius: '12px', textAlign: 'right', color: '#000' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Итого под ключ</div>
              <div style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'monospace', lineHeight: 1 }}>${Math.round(effTotalCost).toLocaleString()}</div>
            </div>
          </div>
          
          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '11px', color: '#9ca3af' }}>
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
                  <SearchableSelect 
                    options={sortedCities.map(c => c.city)}
                    value={selectedCity}
                    onChange={handleCityChange}
                    placeholder="Выберите город"
                  />
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
                <div className="p-6 border-b border-gray-800 bg-[#1A1A1A] flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-2 text-white uppercase text-sm tracking-widest">
                    <ShieldCheck size={18} className="text-[#FFCC33]" />
                    Полная смета
                  </h3>
                  
                  {/* ПЕРЕКЛЮЧАТЕЛЬ: ПРАВИТЬ ДАННЫЕ */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Править Данные</span>
                    <button 
                      onClick={() => {
                        if (editMode) setOverrides({}); // Сбрасываем переопределения при выключении
                        setEditMode(!editMode);
                      }}
                      className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${editMode ? 'bg-[#FFCC33]' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all shadow-md ${editMode ? 'left-[22px]' : 'left-[2px]'}`} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <PriceItem 
                      label="Стоимость авто" 
                      value={effAuctionPrice} 
                      editable={editMode}
                      onValueChange={(val) => handleOverrideChange('auctionPrice', val)}
                    />
                    <PriceItem 
                      label="Аукционный сбор" 
                      value={effAuctionFee} 
                      subtext={`Аукцион: ${auctionType.toUpperCase()}`} 
                      editable={editMode}
                      onValueChange={(val) => handleOverrideChange('auctionFee', val)}
                    />
                  </div>

                  <div className="h-px bg-gray-800/50" />

                  <div className="space-y-1">
                    <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Логистика (Logistics)</div>
                    <PriceItem 
                      label="Доставка (USA Land)" 
                      value={effLandCost} 
                      highlight={effLandCost === null && !editMode} 
                      editable={editMode}
                      onValueChange={(val) => handleOverrideChange('landCost', val)}
                    />
                    <PriceItem 
                      label="Фрахт (Ocean)" 
                      value={effOceanCost} 
                      subtext={`Порт: ${destPort.toUpperCase()}`} 
                      editable={editMode}
                      onValueChange={(val) => handleOverrideChange('oceanCost', val)}
                    />
                    {(effDangerousGoodsFee > 0 || editMode) && (
                      <PriceItem 
                        label="Опасный груз" 
                        value={effDangerousGoodsFee} 
                        subtext="Батарея (Электро/Гибрид)" 
                        editable={editMode}
                        onValueChange={(val) => handleOverrideChange('dangerousGoodsFee', val)}
                      />
                    )}
                    {(effInsurance > 0 || editMode) && (
                      <PriceItem 
                        label="Страховка" 
                        value={effInsurance} 
                        editable={editMode}
                        onValueChange={(val) => handleOverrideChange('insurance', val)}
                      />
                    )}
                  </div>

                  <div className="h-px bg-gray-800/50" />

                  <div className="space-y-1">
                    <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Таможня (Customs UA)</div>
                    <PriceItem 
                      label="Пошлина + Акциз + НДС" 
                      value={effCustomsTotal} 
                      editable={editMode}
                      onValueChange={(val) => handleOverrideChange('customsTotal', val)}
                    />
                  </div>

                  <div className="h-px bg-gray-800/50" />

                  <div className="space-y-1">
                    <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Локальные расходы и услуги</div>
                    {(effFwd > 0 || editMode) && <PriceItem label="Экспедирование Клайпеда" value={effFwd} editable={editMode} onValueChange={(val) => handleOverrideChange('fwd', val)} />}
                    {(effCar > 0 || editMode) && <PriceItem label="Автовоз в Украину" value={effCar} editable={editMode} onValueChange={(val) => handleOverrideChange('car', val)} />}
                    {(effBrk > 0 || editMode) && <PriceItem label="Брокерские услуги" value={effBrk} editable={editMode} onValueChange={(val) => handleOverrideChange('brk', val)} />}
                    {(effDlr > 0 || editMode) && <PriceItem label="Комиссия дилера" value={effDlr} editable={editMode} onValueChange={(val) => handleOverrideChange('dlr', val)} />}
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-800">
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">ИТОГО ПОД КЛЮЧ</div>
                    <div className="text-5xl font-black text-[#FFCC33] font-mono leading-none tracking-tighter">
                      ${Math.round(effTotalCost).toLocaleString()}
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
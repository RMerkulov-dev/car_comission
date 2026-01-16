import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Calculator, DollarSign, Save, Trash2, History, Anchor, ArrowRight, Truck, Car } from 'lucide-react';

// --- DATA MOCKUP BASED ON FULL USER CSV SNIPPETS + INTERPOLATED DATA ---
const SHIPPING_DATA = {
  copart: [
    { city: "Anchorage (AK)", state: "AK", rates: { nj: 3500, ga: null, fl: 3500, tx: 3500, ca: 3500 } },
    { city: "Birmingham (AL)", state: "AL", rates: { nj: 1100, ga: 450, fl: null, tx: 750, ca: 1600 } },
    { city: "Dothan (AL)", state: "AL", rates: { nj: 1200, ga: 400, fl: 550, tx: 800, ca: 1500 } },
    { city: "Mobile (AL)", state: "AL", rates: { nj: 1100, ga: 525, fl: 600, tx: 625, ca: 1500 } },
    { city: "Mobile South (AL)", state: "AL", rates: { nj: 1100, ga: 500, fl: 500, tx: 550, ca: 1500 } },
    { city: "Montgomery (AL)", state: "AL", rates: { nj: 1100, ga: 400, fl: 650, tx: 650, ca: 1500 } },
    { city: "Tanner (AL)", state: "AL", rates: { nj: 1000, ga: 525, fl: null, tx: null, ca: 1600 } },
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
    { city: "San Jose (CA)", state: "CA", rates: { nj: 1550, ga: 1550, fl: 1550, tx: 1150, ca: 300 } },
    { city: "Van Nuys (CA)", state: "CA", rates: { nj: 1450, ga: 1450, fl: 1450, tx: 1050, ca: 250 } },
    { city: "Denver (CO)", state: "CO", rates: { nj: 1300, ga: 1100, fl: 1100, tx: 750, ca: 800 } },
    { city: "Hartford (CT)", state: "CT", rates: { nj: 250, ga: 800, fl: 900, tx: 1200, ca: 1700 } },
    { city: "Washington DC (DC)", state: "DC", rates: { nj: 350, ga: 500, fl: 600, tx: 1000, ca: 1600 } },
    { city: "Seaford (DE)", state: "DE", rates: { nj: 300, ga: 600, fl: 700, tx: 1100, ca: 1600 } },
    { city: "Fort Myers (FL)", state: "FL", rates: { nj: 950, ga: 500, fl: 250, tx: 850, ca: 1550 } },
    { city: "Jacksonville (FL)", state: "FL", rates: { nj: 750, ga: 250, fl: 200, tx: 650, ca: 1350 } },
    { city: "Miami (FL)", state: "FL", rates: { nj: 900, ga: 450, fl: 200, tx: 800, ca: 1500 } },
    { city: "Orlando (FL)", state: "FL", rates: { nj: 800, ga: 350, fl: 200, tx: 700, ca: 1400 } },
    { city: "Tallahassee (FL)", state: "FL", rates: { nj: 900, ga: 300, fl: 200, tx: 650, ca: 1400 } },
    { city: "Tampa (FL)", state: "FL", rates: { nj: 850, ga: 400, fl: 200, tx: 750, ca: 1450 } },
    { city: "West Palm Beach (FL)", state: "FL", rates: { nj: 900, ga: 450, fl: 200, tx: 800, ca: 1500 } },
    { city: "Atlanta (GA)", state: "GA", rates: { nj: 700, ga: 200, fl: 400, tx: 700, ca: 1400 } },
    { city: "Savannah (GA)", state: "GA", rates: { nj: 750, ga: 250, fl: 350, tx: 750, ca: 1450 } },
    { city: "Tifton (GA)", state: "GA", rates: { nj: 800, ga: 200, fl: 300, tx: 750, ca: 1450 } },
    { city: "Honolulu (HI)", state: "HI", rates: { nj: 4000, ga: null, fl: 4000, tx: 4000, ca: 2500 } },
    { city: "Des Moines (IA)", state: "IA", rates: { nj: 1100, ga: 900, fl: 1100, tx: 800, ca: 1500 } },
    { city: "Boise (ID)", state: "ID", rates: { nj: 1800, ga: null, fl: 1600, tx: 1200, ca: 800 } },
    { city: "Chicago (IL)", state: "IL", rates: { nj: 800, ga: 700, fl: 900, tx: 900, ca: 1500 } },
    { city: "Peoria (IL)", state: "IL", rates: { nj: 850, ga: 750, fl: 950, tx: 850, ca: 1500 } },
    { city: "Indianapolis (IN)", state: "IN", rates: { nj: 700, ga: 600, fl: 800, tx: 850, ca: 1450 } },
    { city: "Kansas City (KS)", state: "KS", rates: { nj: 1000, ga: 800, fl: 1000, tx: 600, ca: 1300 } },
    { city: "Lexington (KY)", state: "KY", rates: { nj: 700, ga: 500, fl: 700, tx: 800, ca: 1450 } },
    { city: "Louisville (KY)", state: "KY", rates: { nj: 700, ga: 550, fl: 750, tx: 800, ca: 1450 } },
    { city: "Baton Rouge (LA)", state: "LA", rates: { nj: 1150, ga: 600, fl: 700, tx: 350, ca: 1400 } },
    { city: "New Orleans (LA)", state: "LA", rates: { nj: 1100, ga: 500, fl: 600, tx: 400, ca: 1400 } },
    { city: "Shreveport (LA)", state: "LA", rates: { nj: 1150, ga: 650, fl: 750, tx: 300, ca: 1300 } },
    { city: "Boston (MA)", state: "MA", rates: { nj: 350, ga: 900, fl: 1000, tx: 1300, ca: 1800 } },
    { city: "Baltimore (MD)", state: "MD", rates: { nj: 350, ga: 550, fl: 650, tx: 1000, ca: 1600 } },
    { city: "Detroit (MI)", state: "MI", rates: { nj: 700, ga: 750, fl: 950, tx: 1000, ca: 1550 } },
    { city: "Minneapolis (MN)", state: "MN", rates: { nj: 1000, ga: 1000, fl: 1200, tx: 1100, ca: 1600 } },
    { city: "St. Louis (MO)", state: "MO", rates: { nj: 900, ga: 700, fl: 900, tx: 750, ca: 1400 } },
    { city: "Springfield (MO)", state: "MO", rates: { nj: 1000, ga: 800, fl: 1000, tx: 700, ca: 1450 } },
    { city: "Jackson (MS)", state: "MS", rates: { nj: 1100, ga: 500, fl: 600, tx: 550, ca: 1450 } },
    { city: "Billings (MT)", state: "MT", rates: { nj: 1600, ga: null, fl: 1600, tx: 1200, ca: 1000 } },
    { city: "Raleigh (NC)", state: "NC", rates: { nj: 550, ga: 400, fl: 500, tx: 900, ca: 1500 } },
    { city: "Charlotte (NC)", state: "NC", rates: { nj: 600, ga: 350, fl: 450, tx: 850, ca: 1500 } },
    { city: "Lincoln (NE)", state: "NE", rates: { nj: 1100, ga: 900, fl: 1100, tx: 700, ca: 1200 } },
    { city: "Las Vegas (NV)", state: "NV", rates: { nj: 1500, ga: 1400, fl: 1400, tx: 900, ca: 300 } },
    { city: "Reno (NV)", state: "NV", rates: { nj: 1600, ga: null, fl: 1600, tx: 1000, ca: 350 } },
    { city: "Trenton (NJ)", state: "NJ", rates: { nj: 150, ga: 700, fl: 800, tx: 1100, ca: 1600 } },
    { city: "Albuquerque (NM)", state: "NM", rates: { nj: 1400, ga: 1200, fl: 1200, tx: 600, ca: 600 } },
    { city: "Newburgh (NY)", state: "NY", rates: { nj: 200, ga: 750, fl: 850, tx: 1150, ca: 1650 } },
    { city: "Long Island (NY)", state: "NY", rates: { nj: 250, ga: 800, fl: 900, tx: 1200, ca: 1650 } },
    { city: "Rochester (NY)", state: "NY", rates: { nj: 450, ga: 850, fl: 950, tx: 1200, ca: 1700 } },
    { city: "Columbus (OH)", state: "OH", rates: { nj: 600, ga: 650, fl: 850, tx: 900, ca: 1500 } },
    { city: "Oklahoma City (OK)", state: "OK", rates: { nj: 1200, ga: 800, fl: 900, tx: 350, ca: 1200 } },
    { city: "Tulsa (OK)", state: "OK", rates: { nj: 1100, ga: 750, fl: 850, tx: 350, ca: 1200 } },
    { city: "Portland (OR)", state: "OR", rates: { nj: 1800, ga: null, fl: 1800, tx: 1500, ca: 600 } },
    { city: "Philadelphia (PA)", state: "PA", rates: { nj: 200, ga: 700, fl: 800, tx: 1100, ca: 1600 } },
    { city: "Pittsburgh (PA)", state: "PA", rates: { nj: 450, ga: 700, fl: 800, tx: 1000, ca: 1550 } },
    { city: "Columbia (SC)", state: "SC", rates: { nj: 650, ga: 300, fl: 450, tx: 800, ca: 1450 } },
    { city: "Greer (SC)", state: "SC", rates: { nj: 700, ga: 350, fl: 450, tx: 800, ca: 1450 } },
    { city: "Nashville (TN)", state: "TN", rates: { nj: 800, ga: 400, fl: 600, tx: 700, ca: 1400 } },
    { city: "Memphis (TN)", state: "TN", rates: { nj: 900, ga: 500, fl: 650, tx: 600, ca: 1400 } },
    { city: "Knoxville (TN)", state: "TN", rates: { nj: 750, ga: 350, fl: 550, tx: 750, ca: 1450 } },
    { city: "Abilene (TX)", state: "TX", rates: { nj: 1300, ga: 900, fl: 1000, tx: 300, ca: 1100 } },
    { city: "Amarillo (TX)", state: "TX", rates: { nj: 1400, ga: 1000, fl: 1100, tx: 500, ca: 1100 } },
    { city: "Austin (TX)", state: "TX", rates: { nj: 1200, ga: 850, fl: 950, tx: 200, ca: 1150 } },
    { city: "Dallas (TX)", state: "TX", rates: { nj: 1100, ga: 800, fl: 900, tx: 250, ca: 1200 } },
    { city: "El Paso (TX)", state: "TX", rates: { nj: 1400, ga: 1100, fl: 1100, tx: 600, ca: 700 } },
    { city: "Houston (TX)", state: "TX", rates: { nj: 1150, ga: 850, fl: 950, tx: 250, ca: 1250 } },
    { city: "Longview (TX)", state: "TX", rates: { nj: 1200, ga: null, fl: null, tx: 300, ca: 1100 } },
    { city: "Lufkin (TX)", state: "TX", rates: { nj: 1200, ga: null, fl: null, tx: 275, ca: 900 } },
    { city: "McAllen (TX)", state: "TX", rates: { nj: 1500, ga: null, fl: null, tx: 300, ca: 1100 } },
    { city: "San Antonio (TX)", state: "TX", rates: { nj: 1200, ga: null, fl: null, tx: 300, ca: 1100 } },
    { city: "Waco (TX)", state: "TX", rates: { nj: 1200, ga: null, fl: null, tx: 300, ca: 900 } },
    { city: "Ogden (UT)", state: "UT", rates: { nj: 1600, ga: null, fl: 1200, tx: 450, ca: null } },
    { city: "Salt Lake City (UT)", state: "UT", rates: { nj: 1600, ga: null, fl: 1100, tx: 550, ca: null } },
    { city: "Salt Lake City NORTH (UT)", state: "UT", rates: { nj: null, ga: null, fl: null, tx: null, ca: 550 } },
    { city: "Danville (VA)", state: "VA", rates: { nj: 500, ga: 450, fl: null, tx: null, ca: 1600 } },
    { city: "Fredericksburg (VA)", state: "VA", rates: { nj: 350, ga: null, fl: null, tx: null, ca: 1700 } },
    { city: "Hampton (VA)", state: "VA", rates: { nj: 375, ga: null, fl: null, tx: null, ca: 1700 } },
    { city: "Richmond (VA)", state: "VA", rates: { nj: 375, ga: null, fl: null, tx: null, ca: 1700 } },
    { city: "Richmond East (VA)", state: "VA", rates: { nj: 375, ga: null, fl: null, tx: null, ca: 1700 } },
    { city: "Seattle (WA)", state: "WA", rates: { nj: 1800, ga: 1800, fl: 1800, tx: 1500, ca: 500 } },
    { city: "Spokane (WA)", state: "WA", rates: { nj: 1800, ga: null, fl: 1800, tx: 1500, ca: 700 } },
    { city: "Milwaukee (WI)", state: "WI", rates: { nj: 850, ga: 800, fl: 1000, tx: 950, ca: 1500 } },
    { city: "Charleston (WV)", state: "WV", rates: { nj: 600, ga: 500, fl: 700, tx: 900, ca: 1500 } },
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
    { city: "Tucson (AZ)", state: "AZ", rates: { nj: 1600, ga: null, fl: 1100, tx: null, ca: 450 } },
    { city: "ACE-Carson (CA)", state: "CA", rates: { nj: 1450, ga: 1450, fl: 1450, tx: 1050, ca: 250 } },
    { city: "Anaheim (CA)", state: "CA", rates: { nj: 1450, ga: 1450, fl: 1450, tx: 1050, ca: 250 } },
    { city: "Fremont (CA)", state: "CA", rates: { nj: 1550, ga: 1550, fl: 1550, tx: 1150, ca: 300 } },
    { city: "Los Angeles (CA)", state: "CA", rates: { nj: 1450, ga: 1450, fl: 1450, tx: 1050, ca: 250 } },
    { city: "Sacramento (CA)", state: "CA", rates: { nj: 1550, ga: 1550, fl: 1550, tx: 1150, ca: 300 } },
    { city: "San Diego (CA)", state: "CA", rates: { nj: 1450, ga: 1450, fl: 1450, tx: 1050, ca: 300 } },
    { city: "Denver (CO)", state: "CO", rates: { nj: 1300, ga: 1100, fl: 1100, tx: 750, ca: 800 } },
    { city: "Hartford (CT)", state: "CT", rates: { nj: 250, ga: 800, fl: 900, tx: 1200, ca: 1700 } },
    { city: "New Castle (DE)", state: "DE", rates: { nj: 300, ga: 600, fl: 700, tx: 1100, ca: 1600 } },
    { city: "Clearwater (FL)", state: "FL", rates: { nj: 850, ga: 400, fl: 200, tx: 750, ca: 1450 } },
    { city: "Ft. Pierce (FL)", state: "FL", rates: { nj: 900, ga: 450, fl: 200, tx: 800, ca: 1500 } },
    { city: "Jacksonville (FL)", state: "FL", rates: { nj: 750, ga: 250, fl: 200, tx: 650, ca: 1350 } },
    { city: "Miami (FL)", state: "FL", rates: { nj: 900, ga: 450, fl: 200, tx: 800, ca: 1500 } },
    { city: "Orlando (FL)", state: "FL", rates: { nj: 800, ga: 350, fl: 200, tx: 700, ca: 1400 } },
    { city: "Tampa (FL)", state: "FL", rates: { nj: 850, ga: 400, fl: 200, tx: 750, ca: 1450 } },
    { city: "Atlanta (GA)", state: "GA", rates: { nj: 700, ga: 200, fl: 400, tx: 700, ca: 1400 } },
    { city: "Savannah (GA)", state: "GA", rates: { nj: 750, ga: 250, fl: 350, tx: 750, ca: 1450 } },
    { city: "Chicago (IL)", state: "IL", rates: { nj: 800, ga: 700, fl: 900, tx: 900, ca: 1500 } },
    { city: "Indianapolis (IN)", state: "IN", rates: { nj: 700, ga: 600, fl: 800, tx: 850, ca: 1450 } },
    { city: "Kansas City (KS)", state: "KS", rates: { nj: 1000, ga: 800, fl: 1000, tx: 600, ca: 1300 } },
    { city: "Louisville (KY)", state: "KY", rates: { nj: 700, ga: 550, fl: 750, tx: 800, ca: 1450 } },
    { city: "New Orleans (LA)", state: "LA", rates: { nj: 1100, ga: 500, fl: 600, tx: 400, ca: 1400 } },
    { city: "Boston (MA)", state: "MA", rates: { nj: 350, ga: 900, fl: 1000, tx: 1300, ca: 1800 } },
    { city: "Baltimore (MD)", state: "MD", rates: { nj: 350, ga: 550, fl: 650, tx: 1000, ca: 1600 } },
    { city: "Detroit (MI)", state: "MI", rates: { nj: 700, ga: 750, fl: 950, tx: 1000, ca: 1550 } },
    { city: "Minneapolis (MN)", state: "MN", rates: { nj: 1000, ga: 1000, fl: 1200, tx: 1100, ca: 1600 } },
    { city: "St. Louis (MO)", state: "MO", rates: { nj: 900, ga: 700, fl: 900, tx: 750, ca: 1400 } },
    { city: "Jackson (MS)", state: "MS", rates: { nj: 1100, ga: 500, fl: 600, tx: 550, ca: 1450 } },
    { city: "Charlotte (NC)", state: "NC", rates: { nj: 600, ga: 350, fl: 450, tx: 850, ca: 1500 } },
    { city: "Raleigh (NC)", state: "NC", rates: { nj: 550, ga: 450, fl: 600, tx: 900, ca: 1500 } },
    { city: "Omaha (NE)", state: "NE", rates: { nj: 1100, ga: 900, fl: 1100, tx: 700, ca: 1200 } },
    { city: "Las Vegas (NV)", state: "NV", rates: { nj: 1500, ga: 1400, fl: 1400, tx: 900, ca: 300 } },
    { city: "Englishtown (NJ)", state: "NJ", rates: { nj: 150, ga: 700, fl: 800, tx: 1100, ca: 1600 } },
    { city: "Long Island (NY)", state: "NY", rates: { nj: 250, ga: 800, fl: 900, tx: 1200, ca: 1650 } },
    { city: "Rochester (NY)", state: "NY", rates: { nj: 450, ga: 850, fl: 950, tx: 1200, ca: 1700 } },
    { city: "Cincinnati (OH)", state: "OH", rates: { nj: 600, ga: 600, fl: 800, tx: 850, ca: 1500 } },
    { city: "Oklahoma City (OK)", state: "OK", rates: { nj: 1200, ga: 800, fl: 900, tx: 350, ca: 1200 } },
    { city: "Tulsa (OK)", state: "OK", rates: { nj: 1100, ga: 750, fl: 850, tx: 350, ca: 1200 } },
    { city: "Portland (OR)", state: "OR", rates: { nj: 1800, ga: null, fl: 1800, tx: 1500, ca: 600 } },
    { city: "Philadelphia (PA)", state: "PA", rates: { nj: 200, ga: 700, fl: 800, tx: 1100, ca: 1600 } },
    { city: "Pittsburgh (PA)", state: "PA", rates: { nj: 450, ga: 700, fl: 800, tx: 1000, ca: 1550 } },
    { city: "Columbia (SC)", state: "SC", rates: { nj: 650, ga: 300, fl: 450, tx: 800, ca: 1450 } },
    { city: "Greenville (SC)", state: "SC", rates: { nj: 700, ga: 350, fl: 450, tx: 800, ca: 1450 } },
    { city: "Knoxville (TN)", state: "TN", rates: { nj: 750, ga: 350, fl: 550, tx: 750, ca: 1450 } },
    { city: "Memphis (TN)", state: "TN", rates: { nj: 900, ga: 500, fl: 650, tx: 600, ca: 1400 } },
    { city: "Nashville (TN)", state: "TN", rates: { nj: 800, ga: 400, fl: 600, tx: 700, ca: 1400 } },
    { city: "Abilene (TX)", state: "TX", rates: { nj: 1300, ga: 900, fl: 1000, tx: 300, ca: 1100 } },
    { city: "Amarillo (TX)", state: "TX", rates: { nj: 1400, ga: 1000, fl: 1100, tx: 500, ca: 1100 } },
    { city: "Austin (TX)", state: "TX", rates: { nj: 1200, ga: 850, fl: 950, tx: 200, ca: 1150 } },
    { city: "Dallas (TX)", state: "TX", rates: { nj: 1100, ga: 800, fl: 900, tx: 250, ca: 1200 } },
    { city: "El Paso (TX)", state: "TX", rates: { nj: 1400, ga: 1100, fl: 1100, tx: 600, ca: 700 } },
    { city: "Houston (TX)", state: "TX", rates: { nj: 1150, ga: 850, fl: 950, tx: 250, ca: 1250 } },
    { city: "Longview (TX)", state: "TX", rates: { nj: 1000, ga: null, fl: null, tx: 300, ca: 1100 } },
    { city: "Lubbock (TX)", state: "TX", rates: { nj: 1500, ga: null, fl: null, tx: 500, ca: 1100 } },
    { city: "McAllen (TX)", state: "TX", rates: { nj: 1500, ga: null, fl: null, tx: 325, ca: 1100 } },
    { city: "Permian Basin (TX)", state: "TX", rates: { nj: 1400, ga: null, fl: null, tx: 450, ca: 1100 } },
    { city: "San Antonio (TX)", state: "TX", rates: { nj: 1100, ga: null, fl: null, tx: 325, ca: 1100 } },
    { city: "San Antonio-South (TX)", state: "TX", rates: { nj: 1100, ga: 900, fl: null, tx: 275, ca: 1100 } },
    { city: "Salt Lake City (UT)", state: "UT", rates: { nj: 1600, ga: null, fl: 1150, tx: 525, ca: null } },
    { city: "Provo (UT)", state: "UT", rates: { nj: null, ga: null, fl: null, tx: null, ca: 550 } },
    { city: "Culpeper (VA)", state: "VA", rates: { nj: 375, ga: null, fl: null, tx: null, ca: 1600 } },
    { city: "Fredericksburg-South (VA)", state: "VA", rates: { nj: 325, ga: null, fl: null, tx: null, ca: 1800 } },
    { city: "Northern Virginia (VA)", state: "VA", rates: { nj: 325, ga: null, fl: null, tx: null, ca: 1600 } },
    { city: "Pulaski (VA)", state: "VA", rates: { nj: 500, ga: 450, fl: null, tx: null, ca: 1600 } },
    { city: "Richmond (VA)", state: "VA", rates: { nj: 375, ga: null, fl: null, tx: null, ca: 1700 } },
    { city: "Seattle (WA)", state: "WA", rates: { nj: 1800, ga: 1800, fl: 1800, tx: 1500, ca: 500 } },
    { city: "Spokane (WA)", state: "WA", rates: { nj: 1800, ga: null, fl: 1800, tx: 1500, ca: 700 } },
  ],
  manheim: [
    { city: "Birmingham (AL)", state: "AL", rates: { nj: null, ga: 450, fl: null, tx: null, ca: null } },
    { city: "Tucson (AZ)", state: "AZ", rates: { nj: null, ga: null, fl: null, tx: null, ca: 450 } },
    { city: "Phoenix (AZ)", state: "AZ", rates: { nj: null, ga: null, fl: null, tx: null, ca: 350 } },
    { city: "Little Rock (AR)", state: "AR", rates: { nj: null, ga: 550, fl: null, tx: 450, ca: null } },
    { city: "California (Anaheim)", state: "CA", rates: { nj: null, ga: null, fl: null, tx: null, ca: 225 } },
    { city: "Fresno (CA)", state: "CA", rates: { nj: null, ga: null, fl: null, tx: null, ca: 350 } },
    { city: "Riverside (CA)", state: "CA", rates: { nj: null, ga: null, fl: null, tx: null, ca: 275 } },
    { city: "San Diego (CA)", state: "CA", rates: { nj: null, ga: null, fl: null, tx: null, ca: 300 } },
    { city: "San Francisco Bay (CA)", state: "CA", rates: { nj: null, ga: null, fl: null, tx: null, ca: 450 } },
    { city: "Southern California (CA)", state: "CA", rates: { nj: null, ga: null, fl: null, tx: null, ca: 250 } },
    { city: "Denver (CO)", state: "CO", rates: { nj: 1300, ga: null, fl: 700, tx: 750, ca: 750 } },
    { city: "Pensacola (FL)", state: "FL", rates: { nj: null, ga: 475, fl: null, tx: null, ca: null } },
    { city: "St Pete (FL)", state: "FL", rates: { nj: null, ga: 375, fl: null, tx: null, ca: null } },
    { city: "Central Florida (FL)", state: "FL", rates: { nj: null, ga: 375, fl: 250, tx: null, ca: null } },
    { city: "Fort Lauderdale (FL)", state: "FL", rates: { nj: null, ga: 450, fl: 200, tx: null, ca: null } },
    { city: "Jacksonville (FL)", state: "FL", rates: { nj: null, ga: 250, fl: 200, tx: null, ca: null } },
    { city: "Lakeland (FL)", state: "FL", rates: { nj: null, ga: 400, fl: 200, tx: null, ca: null } },
    { city: "Miami (FL)", state: "FL", rates: { nj: null, ga: 450, fl: 200, tx: null, ca: null } },
    { city: "Orlando (FL)", state: "FL", rates: { nj: null, ga: 375, fl: 200, tx: null, ca: null } },
    { city: "Palm Beach (FL)", state: "FL", rates: { nj: null, ga: 450, fl: 200, tx: null, ca: null } },
    { city: "Tampa (FL)", state: "FL", rates: { nj: null, ga: 400, fl: 200, tx: null, ca: null } },
    { city: "Atlanta (GA)", state: "GA", rates: { nj: 700, ga: 200, fl: 400, tx: 700, ca: 1400 } },
    { city: "Chicago (IL)", state: "IL", rates: { nj: 800, ga: 700, fl: 900, tx: 900, ca: 1500 } },
    { city: "Indianapolis (IN)", state: "IN", rates: { nj: null, ga: null, fl: null, tx: null, ca: null } },
    { city: "Louisville (KY)", state: "KY", rates: { nj: null, ga: null, fl: null, tx: null, ca: null } },
    { city: "New Orleans (LA)", state: "LA", rates: { nj: null, ga: null, fl: null, tx: null, ca: null } },
    { city: "Boston (MA)", state: "MA", rates: { nj: 350, ga: 900, fl: 1000, tx: 1300, ca: 1800 } },
    { city: "Baltimore-Washington (MD)", state: "MD", rates: { nj: 350, ga: null, fl: null, tx: null, ca: 1600 } },
    { city: "Detroit (MI)", state: "MI", rates: { nj: 700, ga: 750, fl: 950, tx: 1000, ca: 1550 } },
    { city: "Minneapolis (MN)", state: "MN", rates: { nj: 1000, ga: 1000, fl: 1200, tx: 1100, ca: 1600 } },
    { city: "Kansas City (MO)", state: "MO", rates: { nj: 950, ga: 750, fl: 950, tx: 800, ca: 1450 } },
    { city: "St. Louis (MO)", state: "MO", rates: { nj: 900, ga: 700, fl: 900, tx: 750, ca: 1400 } },
    { city: "Las Vegas (NV)", state: "NV", rates: { nj: 1500, ga: 1400, fl: 1400, tx: 900, ca: 300 } },
    { city: "Nevada (NV)", state: "NV", rates: { nj: 1500, ga: null, fl: null, tx: null, ca: 300 } },
    { city: "New Jersey (NJ)", state: "NJ", rates: { nj: 150, ga: 700, fl: 800, tx: 1100, ca: 1600 } },
    { city: "New York (NY)", state: "NY", rates: { nj: 250, ga: null, fl: null, tx: null, ca: null } },
    { city: "Newburgh (NY)", state: "NY", rates: { nj: 250, ga: null, fl: null, tx: null, ca: null } },
    { city: "Charlotte (NC)", state: "NC", rates: { nj: null, ga: 375, fl: null, tx: null, ca: null } },
    { city: "North Carolina (NC)", state: "NC", rates: { nj: null, ga: 375, fl: null, tx: null, ca: null } },
    { city: "Kenly (NC)", state: "NC", rates: { nj: null, ga: 375, fl: null, tx: null, ca: null } },
    { city: "Statesville (NC)", state: "NC", rates: { nj: null, ga: 375, fl: null, tx: null, ca: null } },
    { city: "Wilmington (NC)", state: "NC", rates: { nj: null, ga: 375, fl: null, tx: null, ca: null } },
    { city: "Cincinnati (OH)", state: "OH", rates: { nj: 600, ga: null, fl: null, tx: null, ca: null } },
    { city: "Cleveland (OH)", state: "OH", rates: { nj: 525, ga: null, fl: null, tx: null, ca: null } },
    { city: "Grove City (OH)", state: "OH", rates: { nj: 550, ga: null, fl: null, tx: null, ca: null } },
    { city: "Ohio (OH)", state: "OH", rates: { nj: 550, ga: null, fl: null, tx: null, ca: null } },
    { city: "Oklahoma City (OK)", state: "OK", rates: { nj: null, ga: null, fl: null, tx: null, ca: null } },
    { city: "Sapulpa (OK)", state: "OK", rates: { nj: null, ga: null, fl: null, tx: 450, ca: null } },
    { city: "Tulsa (OK)", state: "OK", rates: { nj: null, ga: null, fl: null, tx: 450, ca: null } },
    { city: "Portland (OR)", state: "OR", rates: { nj: null, ga: null, fl: null, tx: null, ca: 750 } },
    { city: "Grantville (PA)", state: "PA", rates: { nj: 300, ga: null, fl: null, tx: null, ca: null } },
    { city: "Keystone Pennsylvania (PA)", state: "PA", rates: { nj: 300, ga: null, fl: null, tx: null, ca: null } },
    { city: "Manheim (PA)", state: "PA", rates: { nj: 300, ga: null, fl: null, tx: 1200, ca: null } },
    { city: "Pennsylvania (PA)", state: "PA", rates: { nj: 300, ga: null, fl: 1200, tx: null, ca: null } },
    { city: "Hatfield (PA)", state: "PA", rates: { nj: 275, ga: null, fl: null, tx: null, ca: null } },
    { city: "Philadelphia (PA)", state: "PA", rates: { nj: 275, ga: null, fl: null, tx: null, ca: null } },
    { city: "Cranberry Township (PA)", state: "PA", rates: { nj: 475, ga: null, fl: null, tx: null, ca: null } },
    { city: "Pittsburgh (PA)", state: "PA", rates: { nj: 475, ga: null, fl: null, tx: null, ca: null } },
    { city: "Darlington (SC)", state: "SC", rates: { nj: null, ga: 325, fl: null, tx: null, ca: null } },
    { city: "Greer (SC)", state: "SC", rates: { nj: null, ga: 350, fl: null, tx: null, ca: null } },
    { city: "Nashville (TN)", state: "TN", rates: { nj: 800, ga: 400, fl: 600, tx: 700, ca: 1400 } },
    { city: "Dallas (TX)", state: "TX", rates: { nj: 1100, ga: 800, fl: 900, tx: 250, ca: 1200 } },
    { city: "Dallas-Fort Worth (TX)", state: "TX", rates: { nj: 1100, ga: 800, fl: 900, tx: 250, ca: 1200 } },
    { city: "El Paso (TX)", state: "TX", rates: { nj: null, ga: null, fl: null, tx: null, ca: null } },
    { city: "Houston (TX)", state: "TX", rates: { nj: 1150, ga: 850, fl: 950, tx: 250, ca: 1250 } },
    { city: "Texas Hobby (TX)", state: "TX", rates: { nj: 1150, ga: 850, fl: 950, tx: 250, ca: 1250 } },
    { city: "San Antonio (TX)", state: "TX", rates: { nj: 1200, ga: 900, fl: 1000, tx: 300, ca: 1100 } },
    { city: "Salt Lake City (UT)", state: "UT", rates: { nj: 1600, ga: null, fl: 1100, tx: 550, ca: null } },
    { city: "Utah (UT)", state: "UT", rates: { nj: 1600, ga: null, fl: 1100, tx: 550, ca: null } },
    { city: "Fredericksburg (VA)", state: "VA", rates: { nj: 350, ga: null, fl: null, tx: null, ca: 1700 } },
    { city: "Harrisonburg (VA)", state: "VA", rates: { nj: 450, ga: null, fl: null, tx: null, ca: 1700 } },
    { city: "Seattle (WA)", state: "WA", rates: { nj: 1800, ga: 1800, fl: 1800, tx: 1500, ca: 500 } },
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

const ResultCard = ({ label, value, isTotal = false, subtext, icon: Icon }) => (
  <div className={`p-4 rounded-xl flex justify-between items-center transition-all hover:scale-[1.01] ${isTotal ? 'bg-[#FFCC33] text-black shadow-[0_4px_20px_rgba(255,204,51,0.3)]' : 'bg-[#1A1A1A] border border-gray-800'}`}>
    <div className="flex items-center gap-4">
      {Icon && (
        <div className={`p-3 rounded-xl ${isTotal ? 'bg-black/10' : 'bg-[#252525] text-[#FFCC33]'}`}>
          <Icon size={20} />
        </div>
      )}
      <div>
        <div className={`text-xs font-bold uppercase tracking-wider ${isTotal ? 'text-black/70' : 'text-gray-500'}`}>{label}</div>
        {subtext && <div className="text-[10px] opacity-70 mt-1 font-medium">{subtext}</div>}
      </div>
    </div>
    <div className={`text-xl font-bold font-mono ${isTotal ? 'text-black' : 'text-white'}`}>
      {value !== null ? `$${value.toLocaleString()}` : '—'}
    </div>
  </div>
);

export default function App() {
  // State initialization with localStorage checks
  const [auctionPrice, setAuctionPrice] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('renault_calc_settings');
      return savedSettings ? JSON.parse(savedSettings).auctionPrice : '';
    } catch (e) { return ''; }
  });

  const [auctionType, setAuctionType] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('renault_calc_settings');
      return savedSettings ? JSON.parse(savedSettings).auctionType : 'copart';
    } catch (e) { return 'copart'; }
  });

  const [selectedCity, setSelectedCity] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('renault_calc_settings');
      return savedSettings ? JSON.parse(savedSettings).selectedCity : '';
    } catch (e) { return ''; }
  });

  const [destination, setDestination] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('renault_calc_settings');
      return savedSettings ? JSON.parse(savedSettings).destination : 'ga';
    } catch (e) { return 'ga'; }
  });

  const [history, setHistory] = useState([]);
  const [animateTotal, setAnimateTotal] = useState(false);

  // Set Favicon - Improved logic
  

  // Save Settings to LocalStorage whenever they change
  useEffect(() => {
    const settings = { auctionPrice, auctionType, selectedCity, destination };
    localStorage.setItem('renault_calc_settings', JSON.stringify(settings));
  }, [auctionPrice, auctionType, selectedCity, destination]);

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
                      onClick={() => {
                        setAuctionType(auc.id);
                        setSelectedCity(''); // Reset city ONLY when manually clicking
                      }}
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
                icon={Car}
              />
              <ResultCard 
                label="Доставка по США (Суша)" 
                value={shippingCost} 
                subtext={selectedCity ? `${auctionType.toUpperCase()}: ${selectedCity} → ${destination.toUpperCase()}` : 'Выберите маршрут'}
                icon={Truck}
              />
              
              <div className="h-px bg-gray-800 my-2"></div>
              
              <div className={`transform transition-all duration-300 ${animateTotal ? 'scale-[1.02]' : 'scale-100'}`}>
                <ResultCard 
                  label="ОБЩАЯ СТОИМОСТЬ" 
                  value={totalCost} 
                  isTotal={true}
                  subtext="Цена авто + Логистика по США"
                  icon={DollarSign}
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
                history.map((item) => {
                  const AuctionIcon = AUCTIONS.find(a => a.id.toUpperCase() === item.auction.toUpperCase())?.Icon || Car;
                  return (
                    <div key={item.id} className="bg-[#0A0A0A] border border-gray-800 p-4 rounded-xl hover:border-[#FFCC33]/50 transition-colors group relative">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <div className="p-1 rounded-md bg-[#FFCC33]/10 text-[#FFCC33]">
                              <AuctionIcon size={14} />
                           </div>
                          <span className="text-[#FFCC33] text-[10px] font-bold uppercase tracking-wider">
                            {item.auction}
                          </span>
                          <span className="text-xs text-gray-600">|</span>
                          <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                        <button 
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-gray-600 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-300 mb-2 truncate flex items-center gap-2">
                        <MapPin size={12} className="text-gray-600" />
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
                  );
                })
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
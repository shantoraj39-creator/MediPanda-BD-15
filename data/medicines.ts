
import { Medicine } from '../types';

// Comprehensive List of Medicines in Bangladesh with Real MRP and Manufacturing Companies
export const ALL_MEDICINES: Medicine[] = [
  // --- Fever & Pain ---
  { id: 'fp1', name: 'Napa Extra', genericName: 'Paracetamol 500mg + Caffeine 65mg', price: 40, type: 'Tablet (12s)', category: 'Fever & Pain', manufacturer: 'Beximco Pharma' },
  { id: 'fp2', name: 'Napa Extend', genericName: 'Paracetamol 665mg', price: 30, type: 'Tablet (10s)', category: 'Fever & Pain', manufacturer: 'Beximco Pharma' },
  { id: 'fp3', name: 'Ace', genericName: 'Paracetamol 500mg', price: 20, type: 'Tablet (10s)', category: 'Fever & Pain', manufacturer: 'Square Pharma' },
  { id: 'fp4', name: 'Ace Plus', genericName: 'Paracetamol 500mg + Caffeine 65mg', price: 40, type: 'Tablet (10s)', category: 'Fever & Pain', manufacturer: 'Square Pharma' },
  { id: 'fp5', name: 'Tufnil', genericName: 'Tolfenamic Acid', price: 150, type: 'Tablet (10s)', category: 'Fever & Pain', manufacturer: 'Eskayef (SK+F)' },
  { id: 'fp6', name: 'Clofenac 50', genericName: 'Diclofenac Sodium 50mg', price: 40, type: 'Tablet (10s)', category: 'Fever & Pain', manufacturer: 'Square Pharma' },
  { id: 'fp7', name: 'Rolac 10', genericName: 'Ketorolac Tromethamine', price: 100, type: 'Tablet (10s)', category: 'Fever & Pain', manufacturer: 'Renata Limited' },
  { id: 'fp8', name: 'Etorix 90', genericName: 'Etoricoxib 90mg', price: 120, type: 'Tablet (10s)', category: 'Fever & Pain', manufacturer: 'Incepta Pharma' },
  { id: 'fp9', name: 'Napa Syrup', genericName: 'Paracetamol', price: 35, type: 'Syrup', category: 'Fever & Pain', manufacturer: 'Beximco Pharma' },
  { id: 'fp10', name: 'Xeldrin', genericName: 'Caffeine + Paracetamol', price: 45, type: 'Tablet (10s)', category: 'Fever & Pain', manufacturer: 'ACME Laboratories' },
  { id: 'fp11', name: 'Visceralgin', genericName: 'Tiemonium Methylsulphate', price: 80, type: 'Tablet (10s)', category: 'Fever & Pain', manufacturer: 'Nuvista Pharma' },

  // --- Gastric & Ulcer ---
  { id: 'gs1', name: 'Sergel 20', genericName: 'Esomeprazole 20mg', price: 70, type: 'Capsule (10s)', category: 'Gastric', manufacturer: 'Healthcare Pharma' },
  { id: 'gs2', name: 'Maxpro 20', genericName: 'Esomeprazole 20mg', price: 70, type: 'Capsule (10s)', category: 'Gastric', manufacturer: 'Renata Limited' },
  { id: 'gs3', name: 'Seclo 20', genericName: 'Omeprazole 20mg', price: 60, type: 'Capsule (10s)', category: 'Gastric', manufacturer: 'Square Pharma' },
  { id: 'gs4', name: 'Pantonix 20', genericName: 'Pantoprazole 20mg', price: 70, type: 'Tablet (10s)', category: 'Gastric', manufacturer: 'Incepta Pharma' },
  { id: 'gs5', name: 'Finix 20', genericName: 'Rabeprazole 20mg', price: 80, type: 'Tablet (10s)', category: 'Gastric', manufacturer: 'Opsonin Pharma' },
  { id: 'gs6', name: 'Losectil 20', genericName: 'Omeprazole 20mg', price: 50, type: 'Capsule (10s)', category: 'Gastric', manufacturer: 'Eskayef (SK+F)' },
  { id: 'gs7', name: 'Esonix 20', genericName: 'Esomeprazole 20mg', price: 70, type: 'Capsule (10s)', category: 'Gastric', manufacturer: 'Incepta Pharma' },
  { id: 'gs8', name: 'Antacid Max', genericName: 'Aluminium Hydroxide + Magnesium', price: 200, type: 'Suspension (200ml)', category: 'Gastric', manufacturer: 'Beximco Pharma' },
  { id: 'gs9', name: 'Gavisol', genericName: 'Sodium Alginate', price: 250, type: 'Suspension (200ml)', category: 'Gastric', manufacturer: 'Square Pharma' },

  // --- Antibiotics ---
  { id: 'ab1', name: 'Zimax 500', genericName: 'Azithromycin 500mg', price: 350, type: 'Tablet (10s)', category: 'Antibiotic', manufacturer: 'Square Pharma' },
  { id: 'ab2', name: 'Azithrocin 500', genericName: 'Azithromycin 500mg', price: 350, type: 'Tablet (10s)', category: 'Antibiotic', manufacturer: 'Renata Limited' },
  { id: 'ab3', name: 'Cef-3', genericName: 'Cefixime 200mg', price: 400, type: 'Capsule (10s)', category: 'Antibiotic', manufacturer: 'Square Pharma' },
  { id: 'ab4', name: 'Moxaclav 625', genericName: 'Amoxicillin + Clavulanic Acid', price: 480, type: 'Tablet (10s)', category: 'Antibiotic', manufacturer: 'Square Pharma' },
  { id: 'ab5', name: 'Ciprocin 500', genericName: 'Ciprofloxacin 500mg', price: 120, type: 'Tablet (10s)', category: 'Antibiotic', manufacturer: 'Square Pharma' },
  { id: 'ab6', name: 'Flagyl 400', genericName: 'Metronidazole 400mg', price: 25, type: 'Tablet (10s)', category: 'Antibiotic', manufacturer: 'Sanofi Bangladesh' },
  { id: 'ab7', name: 'Levoking 500', genericName: 'Levofloxacin 500mg', price: 150, type: 'Tablet (10s)', category: 'Antibiotic', manufacturer: 'ACME Laboratories' },

  // --- Cold, Cough & Allergy ---
  { id: 'cc1', name: 'Fexo 120', genericName: 'Fexofenadine 120mg', price: 90, type: 'Tablet (10s)', category: 'Allergy', manufacturer: 'Square Pharma' },
  { id: 'cc2', name: 'Monas 10', genericName: 'Montelukast 10mg', price: 175, type: 'Tablet (10s)', category: 'Allergy', manufacturer: 'ACME Laboratories' },
  { id: 'cc3', name: 'Alatrol', genericName: 'Cetirizine 10mg', price: 30, type: 'Tablet (10s)', category: 'Allergy', manufacturer: 'Square Pharma' },
  { id: 'cc4', name: 'Deslor', genericName: 'Desloratadine 5mg', price: 40, type: 'Tablet (10s)', category: 'Allergy', manufacturer: 'Orion Pharma' },
  { id: 'cc5', name: 'Bilastin 20', genericName: 'Bilastine 20mg', price: 150, type: 'Tablet (10s)', category: 'Allergy', manufacturer: 'Incepta Pharma' },
  { id: 'cc6', name: 'Tusca', genericName: 'Dextromethorphan', price: 85, type: 'Syrup', category: 'Cold & Cough', manufacturer: 'Square Pharma' },
  { id: 'cc7', name: 'Adovas', genericName: 'Herbal Extracts', price: 65, type: 'Syrup', category: 'Cold & Cough', manufacturer: 'Square Pharma' },
  { id: 'cc8', name: 'Basak', genericName: 'Basak Leaf Extract', price: 65, type: 'Syrup', category: 'Cold & Cough', manufacturer: 'ACME Laboratories' },

  // --- Blood Pressure & Heart ---
  { id: 'bp1', name: 'Bizoran 5/20', genericName: 'Amlodipine + Olmesartan', price: 120, type: 'Tablet (10s)', category: 'Blood Pressure', manufacturer: 'Beximco Pharma' },
  { id: 'bp2', name: 'Osartil 50', genericName: 'Losartan Potassium 50mg', price: 80, type: 'Tablet (10s)', category: 'Blood Pressure', manufacturer: 'Incepta Pharma' },
  { id: 'bp3', name: 'Amlodipine 5', genericName: 'Amlodipine 5mg', price: 30, type: 'Tablet (10s)', category: 'Blood Pressure', manufacturer: 'Renata Limited' },
  { id: 'bp4', name: 'Angilock 50', genericName: 'Losartan Potassium', price: 60, type: 'Tablet (10s)', category: 'Blood Pressure', manufacturer: 'Square Pharma' },
  { id: 'bp5', name: 'Cardibis 5', genericName: 'Bisoprolol Fumarate', price: 70, type: 'Tablet (10s)', category: 'Blood Pressure', manufacturer: 'Square Pharma' },
  { id: 'bp6', name: 'Ecosprin 75', genericName: 'Aspirin 75mg', price: 10, type: 'Tablet (10s)', category: 'Heart', manufacturer: 'ACME Laboratories' },
  { id: 'bp7', name: 'Clopid 75', genericName: 'Clopidogrel 75mg', price: 120, type: 'Tablet (10s)', category: 'Heart', manufacturer: 'Drug International' },

  // --- Diabetes ---
  { id: 'db1', name: 'Comet 500', genericName: 'Metformin 500mg', price: 50, type: 'Tablet (10s)', category: 'Diabetes', manufacturer: 'Square Pharma' },
  { id: 'db2', name: 'GlucoZide 80', genericName: 'Gliclazide 80mg', price: 60, type: 'Tablet (10s)', category: 'Diabetes', manufacturer: 'Beximco Pharma' },
  { id: 'db3', name: 'Sekrin 1', genericName: 'Glimepiride 1mg', price: 30, type: 'Tablet (10s)', category: 'Diabetes', manufacturer: 'ACME Laboratories' },
  { id: 'db4', name: 'Linaglip 5', genericName: 'Linagliptin 5mg', price: 200, type: 'Tablet (10s)', category: 'Diabetes', manufacturer: 'Incepta Pharma' },
  { id: 'db5', name: 'Diatril 2', genericName: 'Glimepiride 2mg', price: 50, type: 'Tablet (10s)', category: 'Diabetes', manufacturer: 'Square Pharma' },

  // --- Vitamins & Supplements ---
  { id: 'vt1', name: 'Neuro-B', genericName: 'Vitamin B1+B6+B12', price: 80, type: 'Tablet (10s)', category: 'Vitamin', manufacturer: 'Square Pharma' },
  { id: 'vt2', name: 'Ceevit', genericName: 'Vitamin C 250mg', price: 20, type: 'Chewable (10s)', category: 'Vitamin', manufacturer: 'Square Pharma' },
  { id: 'vt3', name: 'Calbo-D', genericName: 'Calcium + Vit D', price: 70, type: 'Tablet (10s)', category: 'Vitamin', manufacturer: 'Square Pharma' },
  { id: 'vt4', name: 'Becosules', genericName: 'Vitamin B Complex', price: 60, type: 'Capsule (10s)', category: 'Vitamin', manufacturer: 'Pfizer (Local)' },
  { id: 'vt5', name: 'Aristovit B', genericName: 'Vitamin B Complex', price: 90, type: 'Syrup (100ml)', category: 'Vitamin', manufacturer: 'Aristopharma' },
  { id: 'vt6', name: 'E-Cap 400', genericName: 'Vitamin E 400IU', price: 90, type: 'Capsule (10s)', category: 'Vitamin', manufacturer: 'Drug International' },
  { id: 'vt7', name: 'Ipec Plus', genericName: 'Iron + Folic Acid', price: 60, type: 'Tablet (10s)', category: 'Vitamin', manufacturer: 'Square Pharma' },

  // --- Skin Care ---
  { id: 'sk1', name: 'Fungidal', genericName: 'Miconazole Nitrate', price: 45, type: 'Cream', category: 'Skin Care', manufacturer: 'Square Pharma' },
  { id: 'sk2', name: 'Betameson', genericName: 'Betamethasone', price: 30, type: 'Cream', category: 'Skin Care', manufacturer: 'Square Pharma' },
  { id: 'sk3', name: 'Nix', genericName: 'Permethrin', price: 70, type: 'Cream', category: 'Skin Care', manufacturer: 'Incepta Pharma' },
  { id: 'sk4', name: 'Pevison', genericName: 'Econazole + Triamcinolone', price: 50, type: 'Cream', category: 'Skin Care', manufacturer: 'Jayson Pharma' },

  // --- Eye & Ear ---
  { id: 'ee1', name: 'Ciprocin Eye Drop', genericName: 'Ciprofloxacin', price: 40, type: 'Drop', category: 'Eye Care', manufacturer: 'Square Pharma' },
  { id: 'ee2', name: 'Tears Naturale II', genericName: 'Artificial Tears', price: 180, type: 'Drop', category: 'Eye Care', manufacturer: 'Alcon/Novartis' },
  { id: 'ee3', name: 'Refresh Tears', genericName: 'Carboxymethylcellulose', price: 200, type: 'Drop', category: 'Eye Care', manufacturer: 'Allergan' },
  { id: 'ee4', name: 'Waxol', genericName: 'Paradichlorobenzene', price: 35, type: 'Drop', category: 'Ear Care', manufacturer: 'Square Pharma' },

  // --- First Aid & Others ---
  { id: 'fa1', name: 'Savlon Liquid', genericName: 'Antiseptic Liquid', price: 110, type: 'Liquid (112ml)', category: 'First Aid', manufacturer: 'ACI Limited' },
  { id: 'fa2', name: 'Savlon Cream', genericName: 'Antiseptic Cream', price: 50, type: 'Cream', category: 'First Aid', manufacturer: 'ACI Limited' },
  { id: 'fa3', name: 'Hexisol', genericName: 'Chlorhexidine Gluconate', price: 150, type: 'Liquid (250ml)', category: 'First Aid', manufacturer: 'ACI Limited' },
  { id: 'fa4', name: 'ORS', genericName: 'Oral Rehydration Salts', price: 6, type: 'Sachet', category: 'First Aid', manufacturer: 'SMC' },
  { id: 'fa5', name: 'Povidone', genericName: 'Povidone Iodine', price: 80, type: 'Solution', category: 'First Aid', manufacturer: 'Jayson Pharma' },
  { id: 'fa6', name: 'Thyrox 50', genericName: 'Levothyroxine 50mcg', price: 60, type: 'Tablet (100s)', category: 'Hormone', manufacturer: 'Beximco Pharma' },

  // --- Critical Care & Rare Medicines (High Value) ---
  { id: 'cc1', name: 'Osicent 80', genericName: 'Osimertinib', price: 6000, type: 'Tablet (30s)', category: 'Critical Care', manufacturer: 'Incepta Pharma' },
  { id: 'cc2', name: 'Herceptin', genericName: 'Trastuzumab', price: 52000, type: 'Injection', category: 'Critical Care', manufacturer: 'Roche Bangladesh' },
  { id: 'cc3', name: 'Mabthera', genericName: 'Rituximab', price: 75000, type: 'Injection', category: 'Critical Care', manufacturer: 'Roche Bangladesh' },
  { id: 'cc4', name: 'Meropenem 1g', genericName: 'Meropenem', price: 1000, type: 'Injection', category: 'Critical Care', manufacturer: 'Incepta Pharma' },
  { id: 'cc5', name: 'Human Albumin 20%', genericName: 'Human Albumin', price: 4500, type: 'Injection (100ml)', category: 'Critical Care', manufacturer: 'Incepta Pharma' },
  { id: 'cc6', name: 'Immunoglobulin 5g', genericName: 'IVIG', price: 28000, type: 'Injection', category: 'Critical Care', manufacturer: 'Beximco Pharma' },
  { id: 'cc7', name: 'Norditropin', genericName: 'Somatropin (Growth Hormone)', price: 12500, type: 'Injection', category: 'Critical Care', manufacturer: 'Novo Nordisk' },
  { id: 'cc8', name: 'Enoxaparin 40mg', genericName: 'Enoxaparin Sodium', price: 450, type: 'Injection', category: 'Critical Care', manufacturer: 'Incepta Pharma' },
  { id: 'cc9', name: 'Prograf 1mg', genericName: 'Tacrolimus', price: 2500, type: 'Capsule (50s)', category: 'Critical Care', manufacturer: 'Janssen' },
  { id: 'cc10', name: 'Avastin', genericName: 'Bevacizumab', price: 35000, type: 'Injection', category: 'Critical Care', manufacturer: 'Roche Bangladesh' },
];

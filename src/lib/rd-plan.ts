// Ground-truth R&D data — never import into client-only files without care.

export const VISION = {
  brand: "Soil Crest Naturals",
  tagline: "Whole food. Real science. Zero compromise.",
  mission:
    "To build India's most honest daily nutrition brand — where every ingredient earns its place, every claim is backed by evidence, and every format serves a real human habit.",
  philosophy: [
    "Six whole foods. No isolates. No synthetics. The matrix of a whole food cannot be replicated by an extract.",
    "One formula, eight expressions. The base never changes — only the delivery geometry.",
    "Transparency above marketing. Label everything. Explain everything. Earn trust once; keep it forever.",
  ],
  targetCustomer:
    "Urban Indian adults 25–45 who are health-aware but time-poor — people who want to eat better, not supplement harder.",
};

export type Ingredient = {
  name: string;
  botanicalName: string;
  form: string;
  percentBase: number;
  perServing: string;
  keyBioactives: string[];
  function: string;
  bioavailabilityNote: string;
  sourcing: string;
  qaFlag: string;
};

export const CORE_FORMULA: Ingredient[] = [
  {
    name: "Amla",
    botanicalName: "Phyllanthus emblica",
    form: "Spray-dried whole-fruit powder",
    percentBase: 30,
    perServing: "1.5 g",
    keyBioactives: ["Vitamin C ~400 mg equiv.", "Emblicanin A & B", "Gallic acid", "Tannins"],
    function: "Primary antioxidant · Immune modulation · Collagen synthesis",
    bioavailabilityNote:
      "Vitamin C from Amla is bound to tannins — slower release, superior stability vs. ascorbic acid.",
    sourcing: "Himachal Pradesh / Maharashtra (spray-dry co-processor preferred)",
    qaFlag: "Heavy metals per FSSAI Schedule I; moisture < 5%",
  },
  {
    name: "Beetroot",
    botanicalName: "Beta vulgaris",
    form: "Spray-dried juice powder",
    percentBase: 20,
    perServing: "1.0 g",
    keyBioactives: ["Betalains (betacyanin + betaxanthin)", "Nitrates ~250 mg equiv.", "Folate"],
    function: "Endurance · Vasodilation · Colour anchor for the blend",
    bioavailabilityNote:
      "Nitrate → Nitric Oxide conversion is gut-microbiome-dependent; whole-food matrix preserved.",
    sourcing: "Rajasthan / Punjab; spray-dry in-house or tolling",
    qaFlag: "Nitrate residues; Brix of fresh juice before spray-dry",
  },
  {
    name: "Carrot",
    botanicalName: "Daucus carota",
    form: "Spray-dried juice powder",
    percentBase: 15,
    perServing: "0.75 g",
    keyBioactives: ["β-Carotene ~6 mg equiv.", "α-Carotene", "Lutein", "Falcarinol"],
    function: "Vision · Skin health · Provitamin A activity",
    bioavailabilityNote:
      "Fat-soluble carotenoids — bioavailability increases when consumed with dietary fat. Whole-food matrix retains falcarinol.",
    sourcing: "Rajasthan; juice spray-dry preferred for dispersibility",
    qaFlag: "β-Carotene potency assay; oxidation stability (store < 25°C)",
  },
  {
    name: "Moringa",
    botanicalName: "Moringa oleifera",
    form: "Shade-dried leaf powder",
    percentBase: 15,
    perServing: "0.75 g",
    keyBioactives: [
      "Isothiocyanates (MIC)",
      "Quercetin",
      "Chlorogenic acid",
      "Iron ~2.8 mg equiv.",
      "Calcium ~80 mg equiv.",
    ],
    function: "Micronutrient density · Anti-inflammatory · Energy metabolism",
    bioavailabilityNote:
      "Shade-drying preserves MIC precursors destroyed by heat. Iron bioavailability modest — context of Amla's Vitamin C improves uptake.",
    sourcing: "Tamil Nadu / Andhra Pradesh; shade-dry, not spray-dry",
    qaFlag: "Microbial count critical (leaf surface); aflatoxin screening",
  },
  {
    name: "Ginger",
    botanicalName: "Zingiber officinale",
    form: "Spray-dried extract (5% gingerols)",
    percentBase: 10,
    perServing: "0.50 g",
    keyBioactives: ["[6]-Gingerol 25 mg equiv.", "[6]-Shogaol", "Zingerone", "Paradol"],
    function: "Digestion · Anti-nausea · Thermogenesis · Sensory anchor (warmth)",
    bioavailabilityNote:
      "Gingerol converts to shogaol on heating — spray-dry preserves gingerol form. Bioavailability high; lipid-soluble fractions absorb with food.",
    sourcing: "Kerala / Gujarat; standardised 5% extract preferred over raw powder",
    qaFlag: "Gingerol HPLC assay; pesticide residue (Organochlorine panel)",
  },
  {
    name: "Pomegranate",
    botanicalName: "Punica granatum",
    form: "Spray-dried whole-fruit powder (peel + aril)",
    percentBase: 10,
    perServing: "0.50 g",
    keyBioactives: ["Punicalagins A & B", "Ellagic acid", "Anthocyanins (C3G)", "Urolithin A precursor"],
    function: "Antioxidant · Gut-microbiome modulation · Defence against oxidative stress",
    bioavailabilityNote:
      "Punicalagins convert to Urolithin A by gut bacteria — individual variation high. Peel inclusion doubles polyphenol load vs. juice-only.",
    sourcing: "Maharashtra / Gujarat; peel-inclusive powder critical for potency",
    qaFlag: "ORAC assay; polyphenol content by Folin-Ciocalteu",
  },
];

export type FormatAdaptation = {
  formatId: number;
  formatName: string;
  phase: string;
  status: string;
  vision: string;
  targetHabit: string;
  formulaShift: string;
  ingredientRatios: { name: string; share: string; note: string }[];
  rdMilestones: { step: string; owner: string; deadline: string }[];
  packagingSpec: string;
  regulatory: string;
  investmentRange: string;
  revenueModel: string;
};

export const FORMAT_ADAPTATIONS: FormatAdaptation[] = [
  {
    formatId: 1,
    formatName: "Powder",
    phase: "Shipped",
    status: "Live",
    vision: "The flagship. Every other format is an expression of this core.",
    targetHabit: "Morning ritual — blended into water, milk, or smoothie.",
    formulaShift: "None. Full base formula, full serving.",
    ingredientRatios: [
      { name: "Amla",        share: "30%", note: "Unchanged from base" },
      { name: "Beetroot",    share: "20%", note: "Unchanged from base" },
      { name: "Carrot",      share: "15%", note: "Unchanged from base" },
      { name: "Moringa",     share: "15%", note: "Unchanged from base" },
      { name: "Ginger",      share: "10%", note: "Unchanged from base" },
      { name: "Pomegranate", share: "10%", note: "Unchanged from base" },
    ],
    rdMilestones: [
      { step: "Ongoing stability monitoring", owner: "Quality", deadline: "Continuous" },
      { step: "Packaging refresh evaluation", owner: "Sourcing", deadline: "Q3 2025" },
    ],
    packagingSpec: "250g stand-up pouch (MOPP/PE laminate) + 5g single-serve stick packs (VFFS).",
    regulatory: "Proprietary Food (Schedule I, FSSAI). Filed.",
    investmentRange: "—",
    revenueModel: "Direct-to-consumer. Website + WhatsApp orders. ₹499/250g target.",
  },
  {
    formatId: 2,
    formatName: "Sachets",
    phase: "Phase 1",
    status: "0–3 months",
    vision: "Portability without compromise. Same formula, single-serve convenience.",
    targetHabit: "Travel / gym bag / office drawer. Zero measuring.",
    formulaShift: "None. 5g of full base formula per sachet.",
    ingredientRatios: [
      { name: "Amla",        share: "30%", note: "Unchanged" },
      { name: "Beetroot",    share: "20%", note: "Unchanged" },
      { name: "Carrot",      share: "15%", note: "Unchanged" },
      { name: "Moringa",     share: "15%", note: "Unchanged" },
      { name: "Ginger",      share: "10%", note: "Unchanged" },
      { name: "Pomegranate", share: "10%", note: "Unchanged" },
    ],
    rdMilestones: [
      { step: "Source VFFS co-packer (moisture-barrier film)", owner: "Sourcing", deadline: "Month 1" },
      { step: "Confirm 5g fill weight + seal integrity", owner: "Quality", deadline: "Month 1" },
      { step: "Microbial + stability at 40°C / 75% RH", owner: "Quality", deadline: "Month 2" },
      { step: "FSSAI Proprietary Food label update", owner: "Compliance", deadline: "Month 2" },
      { step: "First production run + dispatch", owner: "Operations", deadline: "Month 3" },
    ],
    packagingSpec: "Foil-laminate sachet (BOPP/ALU/PE). 5g fill. Tear-notch. Moisture-barrier critical.",
    regulatory: "Same FSSAI Proprietary Food category as powder. Label amendment needed.",
    investmentRange: "₹1–2L",
    revenueModel: "Box of 30 sachets at ₹599. Trial pack (7-day) at ₹149.",
  },
  {
    formatId: 3,
    formatName: "Wellness Spice",
    phase: "Phase 1",
    status: "0–3 months",
    vision: "Enter the kitchen. Nutrition embedded into daily cooking, not added on top.",
    targetHabit: "Sprinkled into dal, sabzi, raita, salad dressing. Daily cooking habit.",
    formulaShift: "Savory-forward. Fruit ingredients reduced. Moringa + Ginger dominant.",
    ingredientRatios: [
      { name: "Moringa",     share: "35%", note: "Dominant — earthy, savoury anchor" },
      { name: "Ginger",      share: "25%", note: "Warmth and depth in cooking context" },
      { name: "Amla",        share: "15%", note: "Reduced — tartness functional in cooking" },
      { name: "Beetroot",    share: "10%", note: "Reduced — colour contribution only" },
      { name: "Carrot",      share: "10%", note: "Reduced — sweetness modulation" },
      { name: "Pomegranate", share: "5%",  note: "Trace — astringency accent" },
    ],
    rdMilestones: [
      { step: "Finalise savory ratio via taste panel", owner: "Formulation", deadline: "Month 1" },
      { step: "Source glass jar + aluminium lid + anti-caking agent", owner: "Sourcing", deadline: "Month 1" },
      { step: "Cooking integration test (10 households)", owner: "Formulation", deadline: "Month 2" },
      { step: "Ambient stability at 38°C / 65% RH (Indian summer)", owner: "Quality", deadline: "Month 2" },
      { step: "Launch with recipe guide", owner: "Marketing", deadline: "Month 3" },
    ],
    packagingSpec: "180g glass jar (wide-mouth), aluminium lid. Food-grade silica anti-caking. Illustrated botanical label.",
    regulatory: "Proprietary Food / Spice blend. No health claims. FSSAI existing license likely covers.",
    investmentRange: "₹1–2L",
    revenueModel: "180g jar at ₹449. Kitchen gift set (2-jar) at ₹799.",
  },
  {
    formatId: 4,
    formatName: "Functional Seasoning",
    phase: "Phase 1",
    status: "0–3 months",
    vision: "Replace the salt shaker. Nutrition at every meal, zero effort.",
    targetHabit: "Table-top use — sprinkle on eggs, toast, salads, chaats.",
    formulaShift: "Colour and tartness forward. Beetroot + Amla lead. Ginger at trace only.",
    ingredientRatios: [
      { name: "Beetroot",    share: "30%", note: "Colour and tartness — visual signal of freshness" },
      { name: "Amla",        share: "30%", note: "Tartness — salt-alternative mouth-feel" },
      { name: "Carrot",      share: "20%", note: "Sweetness balance" },
      { name: "Moringa",     share: "10%", note: "Nutrient density, neutral in this ratio" },
      { name: "Pomegranate", share: "7%",  note: "Astringency and depth" },
      { name: "Ginger",      share: "3%",  note: "Trace — warmth without heat dominance" },
    ],
    rdMilestones: [
      { step: "Source shaker-cap container + aperture sizing", owner: "Sourcing", deadline: "Month 1" },
      { step: "Flow-through test (no clumping at shaker aperture)", owner: "Quality", deadline: "Month 1" },
      { step: "Consumer taste test — salt-substitute use case", owner: "Formulation", deadline: "Month 2" },
      { step: "Shelf-life stability", owner: "Quality", deadline: "Month 2" },
      { step: "Launch", owner: "Operations", deadline: "Month 3" },
    ],
    packagingSpec: "120g shaker container (PET or glass). Shaker lid (aperture < 3mm to control pour). Moisture-barrier inner seal.",
    regulatory: "Proprietary Food / seasoning. No health claims. Existing license.",
    investmentRange: "₹1–2L",
    revenueModel: "120g shaker at ₹349. Combo with Wellness Spice at ₹699.",
  },
  {
    formatId: 5,
    formatName: "Nutrition Shots",
    phase: "Phase 2",
    status: "3–6 months",
    vision: "The premium ritual. Pre-workout or morning reset in 60ml.",
    targetHabit: "Morning shot ritual or pre-workout. Convenience + premium signal.",
    formulaShift: "Split formula: juiceable ingredients cold-pressed; powder ingredients infused separately.",
    ingredientRatios: [
      { name: "Beetroot",    share: "40%", note: "Cold-press line — juices cleanly, high nitrate" },
      { name: "Carrot",      share: "25%", note: "Cold-press line — high carotenoid yield" },
      { name: "Pomegranate", share: "20%", note: "Cold-press line — high antioxidant in liquid" },
      { name: "Ginger",      share: "10%", note: "Cold-press line — juices cleanly" },
      { name: "Amla",        share: "3%",  note: "Infused/extract — does not juice cleanly at scale" },
      { name: "Moringa",     share: "2%",  note: "Infused/extract — leaf fiber blocks juicing" },
    ],
    rdMilestones: [
      { step: "Identify co-packer: juicing + bottling + HPP/thermal in one facility", owner: "Sourcing", deadline: "Month 1–2" },
      { step: "Shelf-life baseline (7d refrigerated vs. HPP 45–90d)", owner: "Quality", deadline: "Month 2–3" },
      { step: "Bottle format, foil seal, label compliance", owner: "Compliance", deadline: "Month 3" },
      { step: "FSSAI medium-complexity filing for beverage category", owner: "Compliance", deadline: "Month 3–4" },
      { step: "Pilot production (500 units)", owner: "Operations", deadline: "Month 5" },
      { step: "D2C launch", owner: "Marketing", deadline: "Month 6" },
    ],
    packagingSpec: "60ml glass shot bottle (amber or clear). Foil-tamper seal. HPP or pasteurised. Cold-chain or ambient depending on process.",
    regulatory: "FSSAI Beverages category (medium complexity). Fresh juice vs. HPP determines sub-category.",
    investmentRange: "₹2–5L",
    revenueModel: "Pack of 6 shots at ₹699. Subscription (30 shots/month) at ₹2,499.",
  },
  {
    formatId: 6,
    formatName: "Tablets",
    phase: "Phase 3",
    status: "6–9 months",
    vision: "The everyday carry. For people who want nutrition as simple as a pill.",
    targetHabit: "Morning routine with water. 4–6 tablets = 1 full serving.",
    formulaShift: "All 6 ingredients compressed at reduced per-tablet dose. Multi-tablet serving.",
    ingredientRatios: [
      { name: "Amla",        share: "30%", note: "Unchanged ratio — per tablet dose ~300mg" },
      { name: "Beetroot",    share: "20%", note: "Per tablet ~200mg" },
      { name: "Carrot",      share: "15%", note: "Per tablet ~150mg" },
      { name: "Moringa",     share: "15%", note: "Per tablet ~150mg" },
      { name: "Ginger",      share: "10%", note: "Per tablet ~100mg" },
      { name: "Pomegranate", share: "10%", note: "Per tablet ~100mg" },
    ],
    rdMilestones: [
      { step: "Shortlist Nutraceutical CMOs — India (10+ capability check)", owner: "Sourcing", deadline: "Month 1–2" },
      { step: "Tablet compression ratio + disintegration time validation", owner: "Quality", deadline: "Month 3–4" },
      { step: "FSSAI Health Supplement / Nutraceutical license application", owner: "Compliance", deadline: "Month 4" },
      { step: "Claims review with licensed regulatory consultant", owner: "Compliance", deadline: "Month 4–5" },
      { step: "Accelerated stability + dissolution testing", owner: "Quality", deadline: "Month 5–6" },
      { step: "Pilot batch + stability clearance", owner: "Quality", deadline: "Month 7" },
      { step: "Launch", owner: "Operations", deadline: "Month 9" },
    ],
    packagingSpec: "Blister pack (Alu/PVC), 15 tablets/strip × 6 strips = 90 tablets = 15 servings. Secondary carton.",
    regulatory: "FSSAI Nutraceutical / Health Supplement (separate license from Powder). Dosage caps apply per Schedule.",
    investmentRange: "₹7–18L",
    revenueModel: "90-tablet box (15 servings) at ₹799. Subscription at ₹699/month.",
  },
  {
    formatId: 7,
    formatName: "Gummies",
    phase: "Phase 3",
    status: "Demand-gated",
    vision: "Impulse-friendly, gifting format. Widest retail reach but highest MOQ risk.",
    targetHabit: "Snack-time habit. Parents buying for children. Gifting segment.",
    formulaShift: "Reduced to 3 extract-form ingredients. Whole-food fiber incompatible with gelatin matrix.",
    ingredientRatios: [
      { name: "Amla extract",        share: "45%", note: "Standardised for Vitamin C — key health claim driver" },
      { name: "Beetroot extract",    share: "30%", note: "Betalain colour — natural gummy colour without dye" },
      { name: "Pomegranate extract", share: "25%", note: "Antioxidant and flavour depth" },
      { name: "Moringa",             share: "—",   note: "Excluded — leaf fiber disrupts gel structure" },
      { name: "Carrot",              share: "—",   note: "Excluded at scale — juice oxidises in gelatin" },
      { name: "Ginger",              share: "—",   note: "Excluded — pungency unacceptable in gummy format" },
    ],
    rdMilestones: [
      { step: "Validate consumer demand via 500-unit pre-order waitlist", owner: "Marketing", deadline: "Before committing" },
      { step: "Identify gummy CMO — MOQ 50k–100k units/SKU", owner: "Sourcing", deadline: "Month 1" },
      { step: "Humidity / weeping stability for Indian climate", owner: "Quality", deadline: "Month 2–3" },
      { step: "FSSAI Nutraceutical license for gummy format", owner: "Compliance", deadline: "Month 3" },
      { step: "Claims and dosage compliance review", owner: "Compliance", deadline: "Month 3" },
    ],
    packagingSpec: "Dark glass/PET jar (30-count, 60g). Silica desiccant mandatory. Foil-sealed.",
    regulatory: "FSSAI Nutraceutical. Humidity challenge is key risk — India summer testing mandatory.",
    investmentRange: "₹10–18L (MOQ-driven)",
    revenueModel: "30-gummy jar (30 days) at ₹599. D2C + modern trade.",
  },
  {
    formatId: 8,
    formatName: "Cubes",
    phase: "Shelved",
    status: "On hold",
    vision: "Dissolvable cube — the most elegant delivery of the formula. Blocked on binder.",
    targetHabit: "Drop in a glass of water, watch it dissolve. Highest ritual satisfaction.",
    formulaShift: "Blocked. Requires a clean-label binder that does not compromise flavour or brand positioning.",
    ingredientRatios: [
      { name: "All 6 base ingredients", share: "TBD", note: "Full formula ratio intended once binder is resolved" },
    ],
    rdMilestones: [
      { step: "Monitor ingredient innovation for clean-label binders (tapioca, konjac, pea protein matrix)", owner: "Formulation", deadline: "Ongoing" },
      { step: "Revisit when a viable binder candidate is identified", owner: "Formulation", deadline: "When available" },
    ],
    packagingSpec: "Concept: individual foil-wrapped cubes, box of 30. No current spec.",
    regulatory: "TBD — likely same as Tablets (Nutraceutical) once format is viable.",
    investmentRange: "TBD",
    revenueModel: "TBD",
  },
];

export const REGULATORY_MAP = [
  {
    category: "Proprietary Food",
    fssaiSchedule: "Schedule I, FSS Act 2006",
    formats: ["Powder", "Sachets", "Wellness Spice", "Functional Seasoning"],
    complexity: "Low",
    approxTime: "30–90 days",
    keyRequirements: [
      "Nutritional information panel on label",
      "No disease-cure health claims",
      "Ingredient % disclosure optional but recommended",
    ],
  },
  {
    category: "Beverages (Juice / HPP)",
    fssaiSchedule: "FSS (Food Product Standards) 2011",
    formats: ["Nutrition Shots"],
    complexity: "Medium",
    approxTime: "60–120 days",
    keyRequirements: [
      "Juice content % declaration",
      "Pasteurisation / HPP process validation",
      "Shelf-life claim backed by stability data",
    ],
  },
  {
    category: "Nutraceutical / Health Supplement",
    fssaiSchedule: "FSS (Health Supplements, Nutraceuticals) Regulations 2022",
    formats: ["Tablets", "Gummies", "Cubes (future)"],
    complexity: "High",
    approxTime: "6–18 months",
    keyRequirements: [
      "Product-specific license (separate from Proprietary Food)",
      "Dosage upper limits per Schedule (e.g. Vitamin C max 1000mg)",
      "Health claims from approved list only",
      "Mandatory regulatory consultant for filing",
    ],
  },
];

export const INVESTMENT_SUMMARY = [
  { phase: "Phase 1 — Sachets + Wellness Spice + Seasoning", range: "₹3–6L",  timeline: "0–3 months" },
  { phase: "Phase 2 — Nutrition Shots",                       range: "₹2–5L",  timeline: "3–6 months" },
  { phase: "Phase 3 — Tablets",                               range: "₹7–18L", timeline: "6–9 months" },
  { phase: "Phase 3 — Gummies (demand-gated)",                range: "₹10–18L",timeline: "When demand validated" },
  { phase: "Total committed (Phases 1–3 excl. Gummies)",      range: "₹12–29L",timeline: "9 months" },
];

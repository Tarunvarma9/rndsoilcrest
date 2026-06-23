export type Format = {
  id: number;
  name: string;
  phase: string;
  status: string;
  summary: string;
  formulaNote: string;
  rdSteps: string[];
  timeline: string;
  estimatedCost: string;
};

export const FORMATS: Format[] = [
  {
    id: 1,
    name: "Powder",
    phase: "—",
    status: "Shipped",
    summary: "Core SKU. Whole-food blend of 6 ingredients in powder form.",
    formulaNote: "Full 6-ingredient ratio unchanged. Baseline for all other formats.",
    rdSteps: ["Ongoing quality & stability monitoring", "Packaging refresh as needed"],
    timeline: "Live",
    estimatedCost: "—",
  },
  {
    id: 2,
    name: "Sachets",
    phase: "Phase 1",
    status: "Now",
    summary: "Single-serve sachets. Same formula as powder, VFFS-packed.",
    formulaNote:
      "Full 6-ingredient ratio unchanged. Needs moisture-barrier film and VFFS line.",
    rdSteps: [
      "Source VFFS co-packer with moisture-barrier film capability",
      "Confirm per-sachet dosage (5g target)",
      "Microbial + stability testing at 40°C/75% RH",
      "FSSAI Proprietary Food filing",
    ],
    timeline: "0–3 months",
    estimatedCost: "₹1–2L",
  },
  {
    id: 3,
    name: "Wellness Spice",
    phase: "Phase 1",
    status: "Now",
    summary: "Glass jar format positioned as a premium everyday cooking spice.",
    formulaNote:
      "Moringa and Ginger dominate. Fruit components (Amla, Beetroot, Pomegranate) reduced to trace. Anti-caking agent required.",
    rdSteps: [
      "Finalise savory-forward ratio",
      "Source glass jars + food-grade anti-caking solution (silica or rice flour)",
      "Taste panel — cooking integration tests",
      "Stability at ambient Indian temperature (35–42°C summer)",
    ],
    timeline: "0–3 months",
    estimatedCost: "₹1–2L",
  },
  {
    id: 4,
    name: "Functional Seasoning",
    phase: "Phase 1",
    status: "Now",
    summary: "Shaker cap format for table-top use. Savory positioning.",
    formulaNote:
      "Beetroot and Amla lead for colour and tartness. Moringa/Ginger at trace. Shaker cap aperture sizing critical.",
    rdSteps: [
      "Source shaker cap + suitable container",
      "Validate flow-through of blend (no clumping)",
      "Consumer taste test for salt-substitute use-case",
      "Shelf-life stability",
    ],
    timeline: "0–3 months",
    estimatedCost: "₹1–2L",
  },
  {
    id: 5,
    name: "Nutrition Shots",
    phase: "Phase 2",
    status: "3–6 months",
    summary: "Cold-pressed or infused liquid shots. Premium ritual format.",
    formulaNote:
      "Split formula: Cold-press line = Beetroot, Carrot, Pomegranate, Ginger. Infused line = Amla, Moringa (won't juice cleanly). Requires HPP or thermal pasteurisation.",
    rdSteps: [
      "Identify co-packer with juicing + bottling + HPP/thermal together",
      "Determine shelf-life baseline (7–21 days refrigerated vs. HPP'd 45–90 days)",
      "Bottle format, sealing, label compliance",
      "FSSAI medium-complexity filing",
    ],
    timeline: "3–6 months",
    estimatedCost: "₹2–5L",
  },
  {
    id: 6,
    name: "Tablets",
    phase: "Phase 3",
    status: "6–9 months",
    summary: "Compressed whole-food tablets. Convenience format for daily use.",
    formulaNote:
      "All 6 ingredients compressed at reduced per-tablet dosage. 4–6 tablets = 1 serving. Requires CMO with tablet compression capability.",
    rdSteps: [
      "Shortlist Nutraceutical CMOs (India)",
      "Validate tablet compression ratio and disintegration time",
      "FSSAI Health Supplement / Nutraceutical license (separate category)",
      "Claims review with regulatory consultant",
      "Accelerated stability + dissolution testing",
    ],
    timeline: "6–9 months",
    estimatedCost: "₹7–18L",
  },
  {
    id: 7,
    name: "Gummies",
    phase: "Phase 3",
    status: "Demand-gated",
    summary:
      "Chewable gummy format. Best impulse-retail format but gated on pre-order demand.",
    formulaNote:
      "Reduced to 3 concentrated extracts: Amla (Vitamin C), Beetroot (betalain), Pomegranate (antioxidant). Whole-food fiber won't gel. Indian climate humidity stability is a key challenge.",
    rdSteps: [
      "Validate consumer demand via pre-orders before committing",
      "Identify gummy CMO — MOQ typically 50k–100k units/SKU",
      "Humidity/weeping stability testing for Indian climate",
      "FSSAI Nutraceutical license",
      "Claims and dosage compliance review",
    ],
    timeline: "Demand-gated",
    estimatedCost: "₹10–18L (MOQ-driven)",
  },
  {
    id: 8,
    name: "Cubes",
    phase: "Shelved",
    status: "On hold",
    summary: "Dissolvable cube format. Blocked on clean-label binder.",
    formulaNote:
      "Concept requires a clean-label binder that doesn't compromise flavour or positioning. No viable solution found yet.",
    rdSteps: [
      "Monitor ingredient innovation for clean-label binder solutions",
      "Revisit when a viable binder candidate is identified",
    ],
    timeline: "Indefinite",
    estimatedCost: "TBD",
  },
];

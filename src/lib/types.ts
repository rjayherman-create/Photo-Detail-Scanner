export type ScanMode = "silver" | "golf" | "tools";

export type ScanSource = "facebook" | "craigslist" | "estate_sale" | "storage_locker";

export type BusinessContext = "thrift_shop" | "pawn_shop";

export type ItemSetting = "single_item" | "multiple_items";

export type PhotoAnalysis = {
  scanMode: ScanMode;
  title: string;
  summary: string;
  confidence: "high" | "medium" | "low";
  visibleInventory: InventoryItem[];
  markingsDetected: Marking[];
  valueEstimate: ValueEstimate;
  risks: string[];
  questionsForSeller: string[];
  buyRecommendation: BuyRecommendation;
  resalePlan: string[];
  listingTitleSuggestions: string[];
  disclaimer: string;
};

export type InventoryItem = {
  itemName: string;
  category: string;
  visibleDetails: string[];
  condition: "excellent" | "good" | "fair" | "poor" | "unknown";
  confidence: "high" | "medium" | "low";
  estimatedResaleLow: number | null;
  estimatedResaleHigh: number | null;
  notes: string;
};

export type Marking = {
  visibleText: string;
  likelyMeaning: string;
  confidence: "high" | "medium" | "low";
  importance: string;
};

export type ValueEstimate = {
  likelyRetailResaleLow: number | null;
  likelyRetailResaleHigh: number | null;
  likelyQuickSaleLow: number | null;
  likelyQuickSaleHigh: number | null;
  meltValueLow: number | null;
  meltValueHigh: number | null;
  replacementPiecePotential: "high" | "medium" | "low" | "unknown";
  valueNotes: string[];
};

export type BuyRecommendation = {
  decision: "buy" | "maybe" | "pass" | "need_more_photos";
  maxOfferLow: number | null;
  maxOfferHigh: number | null;
  reasoning: string;
};

export type ScanHistoryEntry = {
  id: string;
  createdAt: string;
  mode: ScanMode;
  title: string;
  recommendation?: string;
  analysisSnapshot?: PhotoAnalysis;
  estimate?: {
    likelyRetailResaleLow?: number | null;
    likelyRetailResaleHigh?: number | null;
  };
};

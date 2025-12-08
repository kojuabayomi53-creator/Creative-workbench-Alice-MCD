export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  MODULE_A = 'MODULE_A', // Create Digital Advert
  MODULE_B = 'MODULE_B', // Create Digital Assets
  MODULE_C = 'MODULE_C', // Idea Generation
  MODULE_D = 'MODULE_D', // Analytics
}

export interface MarketingRequest {
  name: string;
  department: string;
  location: string;
  type: string;
  description: string;
  businessReason: string;
  impactLevel: number; // 1-100
}

export interface GeneratedIdea {
  title: string;
  pitch: string;
  visuals: string;
  groundingUrls?: string[];
}

export interface AssetVersion {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  videoUrl?: string;
  audioUrl?: string;
  format: 'image' | 'video' | 'audio';
  stats: {
    predictedCtr: string;
    impressions: string;
  }
}

export interface AppState {
  currentView: ViewType;
  prefillData?: Partial<MarketingRequest>;
}

// Props for shared components needing guideline status
export interface CreateAdvertProps {
  initialData?: Partial<MarketingRequest>;
  guidelinesActive: boolean;
}

export interface CreateAssetsProps {
  guidelinesActive: boolean;
}

// Window interface for Veo API Key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}
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
}

export interface AssetVersion {
  id: string;
  title: string;
  imageUrl: string;
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


export enum ResourceType {
  GOVERNMENT = 'Government Scheme',
  NGO = 'NGO / Charity',
  COMMUNITY = 'Community Center'
}

export interface ResourceLocation {
  id: string;
  name: string;
  type: ResourceType;
  address: string;
  city: string;
  region: string; 
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: string;
  eligibility: string[];
  requirements: string[];
  contactPhone?: string;
  verifiedAt: string;
  offersDelivery: boolean; // Flag to indicate if the service supports volunteer delivery
}

export type SearchMode = 'city' | 'pincode' | 'map';

export interface SearchFilters {
  city: string;
  pincode: string;
  region: string;
  type?: ResourceType;
}

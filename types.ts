export interface Coin {
  id: string;
  title: string;
  country: string;
  year: string;
  description: string;
  image: string; // Base64 string
  dateAdded: number;
  estimatedValue?: string;
  composition?: string;
}

export interface CoinAnalysisResult {
  title: string;
  country: string;
  year: string;
  description: string;
  estimatedValue?: string;
  composition?: string;
}

export type ProductKey = 'sheer' | 'blackout' | 'duo' | 'roller';

export interface Product {
  key: ProductKey;
  name: string;
  ratePerSqM: number; // AED per m² (market baseline)
  blurb: string;
}

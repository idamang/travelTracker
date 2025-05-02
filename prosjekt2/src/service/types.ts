export interface Country {
  id: number;
  country_name: string;
  cca3: string;
  population?: number;
  official_language?: string;
  currency?: string;
  continent?: string;
  image_url?: string;
  average_rating?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  address?: string;
  travel_days?: number;
  num_travels?: number;
  num_countries_visited?: number;
  country?: Country;
}

export interface Travel {
  id: number;
  start_date: string;
  end_date: string;
  image_url?: string;
  description?: string;
  country: Country;
}

export interface Rating {
  user_id: number;
  country_id: number;
  rating_value: number;
  timestamp: string;
  user?: User;
  country?: Country;
}

export interface Comment {
  id: number;
  user_id: number;
  country_id: number;
  text: string;
  created_at: Date;
  user?: User;
  country?: Country;
  editable?: boolean;
}

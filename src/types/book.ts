export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  condition: string;
  image_url?: string;
  user_id: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}
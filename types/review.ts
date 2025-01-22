export type Review = {
  id: number;
  park_id: number;
  user_id: number;
  author: string;
  rating: number;
  content: string;
  is_public: boolean;
  created_at: string;
};

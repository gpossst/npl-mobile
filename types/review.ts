export type Review = {
  id: number;
  park_id: number;
  user_id: number;
  rating: number;
  comment: string;
  public: boolean;
  created_at: string;
};

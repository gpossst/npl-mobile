import { AppState } from "react-native";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { NationalPark } from "../types/national_park";

const supabaseUrl = "https://jsdhqwsotkisigofwxht.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzZGhxd3NvdGtpc2lnb2Z3eGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MzA5ODUsImV4cCI6MjA1MjIwNjk4NX0.rjUKP5jLlGNcNc6N7_voh-pzIhyo51WaYVGv0EsxdbU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export const getUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  return data?.user?.id;
};

export const addReview = async (
  parkId: number,
  rating: number,
  content: string,
  isPublic: boolean
) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("User error:", userError);
      return null;
    }

    // Start a Supabase transaction
    const { data: reviewData, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        park_id: parkId,
        author: userData.user?.user_metadata?.display_name,
        rating,
        content,
        is_public: isPublic,
      })
      .select();

    if (reviewError) {
      console.error("Insert error:", reviewError);
      return null;
    }
  } catch (error) {
    console.error("Error in addReview:", error);
    return null;
  }
};

export const getReviews = async (
  parkId: number,
  page: number = 1,
  pageSize: number = 10
) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("park_id", parkId)
    .eq("is_public", true)
    .range(start, end)
    .order("created_at", { ascending: false });

  const { data: privateData, error: privateError } = await supabase
    .from("reviews")
    .select("*")
    .eq("park_id", parkId)
    .eq("is_public", false)
    .eq("user_id", await getUserId())
    .range(start, end)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (privateError) throw privateError;

  return [...(data || []), ...(privateData || [])];
};

export const getReviewStats = async () => {
  const { data, error } = await supabase.rpc("get_review_stats");

  if (error) {
    console.error("Error getting review stats:", error);
    return {
      count: 0,
      average: 0,
    };
  }

  console.log("Review stats:", data);

  return {
    count: data[0].rating_count || 0,
    average: data[0].average_rating || 0,
  };
};

interface ReviewStats {
  park_id: number;
  average_rating: number;
  rating_count: number;
}

export const getParkData = async () => {
  let parkData: NationalPark[] = [];
  try {
    // Get both park data and review stats concurrently
    const [
      { data: parks, error: parksError },
      { data: stats, error: statsError },
    ] = await Promise.all([
      supabase.from("national_parks").select("*"),
      supabase.rpc("get_review_stats"),
    ]);

    if (parksError) throw parksError;
    if (statsError) throw statsError;

    // Create a map of park_id to review stats for easier lookup
    const reviewStatsMap = new Map(
      stats.map((stat: ReviewStats) => [
        stat.park_id,
        {
          average_rating: stat.average_rating,
          rating_count: stat.rating_count,
        },
      ])
    );

    // Merge park data with review stats
    parkData = parks.map((park) => ({
      ...park,
      // @ts-ignore
      review_average: reviewStatsMap.get(park.id)?.average_rating || 0,
      // @ts-ignore
      review_count: reviewStatsMap.get(park.id)?.rating_count || 0,
    }));

    console.log("Park data:", parkData);
    return parkData as NationalPark[];
  } catch (error) {
    console.error("Error getting park data:", error);
    return [];
  }
};

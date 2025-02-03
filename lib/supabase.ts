import { AppState } from "react-native";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { NationalPark } from "../types/national_park";
import { UserStats } from "../types/user_stats";

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
    const [
      { data: parks, error: parksError },
      { data: stats, error: statsError },
    ] = await Promise.all([
      supabase.from("national_parks").select("*"),
      supabase.rpc("get_review_stats"),
    ]);

    if (parksError) throw parksError;
    if (statsError) throw statsError;

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

    return parkData as NationalPark[];
  } catch (error) {
    console.error("Error getting park data:", error);
    return [];
  }
};

export const getUserStats = async ({ userId }: { userId: string }) => {
  const { data: reviewData, error: reviewError } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId);
  const { data: listData, error: listError } = await supabase
    .from("list_items")
    .select("*")
    .eq("user_id", userId);

  if (reviewError) throw reviewError;
  if (listError) throw listError;

  return {
    review_count: reviewData.length,
    list_count: listData.length,
  } as UserStats;
};

export const updateDisplayName = async (displayName: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const { error } = await supabase.auth.updateUser({
    data: {
      ...userData.user?.user_metadata,
      display_name: displayName,
    },
  });

  await supabase
    .from("reviews")
    .update({
      author: displayName,
    })
    .eq("user_id", userData.user?.id);

  if (error) throw error;
};

export const updateEmail = async (email: string) => {
  const { error } = await supabase.auth.updateUser({ email });
  if (error) throw error;
};

export const updatePassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://example.com/update-password",
  });

  if (error) throw error;

  return data;
};

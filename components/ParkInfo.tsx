import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";
import { NationalPark } from "../types/national_park";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getReviews } from "../lib/supabase";
import { Review } from "../types/review";
import ReviewItem from "./ReviewItem";
interface ParkInfoProps {
  park: NationalPark;
}

export default function ParkInfo({ park }: ParkInfoProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [park.id]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewData = await getReviews(park.id, page);
      setReviews(reviewData);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewAuthor}>{item.author}</Text>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={16} color="green" />
          <Text style={styles.reviewRating}>{item.rating}</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>{item.content}</Text>
      <Text style={styles.reviewDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.infoContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.parkName}>{park.name}</Text>
          <Text style={styles.parkLocation}>{park.state}</Text>
        </View>
        <View style={styles.reviewContainer}>
          <Text style={styles.ratingText}>
            <AntDesign name="star" size={24} color="green" />{" "}
            {park.review_average.toFixed(1)}
          </Text>
          <Text style={styles.reviewCount}>({park.review_count} reviews)</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Established</Text>
          <Text style={styles.statValue}>{park.established}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Annual Visitors</Text>
          <Text style={styles.statValue}>
            {park.yearly_visitors.toLocaleString()}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Area</Text>
          <Text style={styles.statValue}>
            {park.area.toLocaleString()} acres
          </Text>
        </View>
      </View>

      <View style={styles.reviewsSection}>
        <Text style={styles.reviewsTitle}>Reviews</Text>
        {loading ? (
          <Text>Loading reviews...</Text>
        ) : (
          <ScrollView style={styles.reviewsContainer}>
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  nameContainer: {
    flex: 1,
    marginRight: 16,
  },
  parkName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  parkLocation: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  reviewContainer: {
    alignItems: "flex-end",
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
  },
  reviewsSection: {
    marginTop: 20,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  reviewItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewRating: {
    marginLeft: 4,
    fontSize: 16,
    color: "green",
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
  },
  reviewsContainer: {
    minHeight: 200,
    flex: 1,
    paddingBottom: 40,
  },
});

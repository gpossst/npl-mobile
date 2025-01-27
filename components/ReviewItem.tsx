import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { Review } from "../types/review";
import { AntDesign } from "@expo/vector-icons";

export default function ReviewItem({ review }: { review: Review }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;
  const shouldShowReadMore = review.content.length > maxLength;

  return (
    <View style={styles.reviewContainer}>
      <View style={styles.ratingContainer}>
        <View style={styles.reviewerContainer}>
          <Text style={styles.reviewerName}>
            {review.author || "Anonymous"}
          </Text>
          <Text style={styles.reviewDate}>
            {new Date(review.created_at).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.ratingText}>
          <AntDesign name="star" size={20} color="green" />{" "}
          {Math.round(review.rating)}
        </Text>
      </View>
      <View>
        <Text style={styles.reviewText}>
          {isExpanded
            ? review.content
            : review.content.slice(0, maxLength) +
              (shouldShowReadMore ? "..." : "")}
        </Text>
        {shouldShowReadMore && (
          <Pressable onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.readMoreButton}>
              {isExpanded ? "Show Less" : "Read More"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  reviewerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
  },
  reviewText: {
    fontSize: 14,
  },
  reviewContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  readMoreButton: {
    color: "#007AFF",
    marginTop: 5,
    fontWeight: "600",
  },
});

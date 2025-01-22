import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Review } from "../types/review";
import StarRating from "./StarRating";
import { addReview } from "../lib/supabase";
import { NationalPark } from "../types/national_park";

export default function ReviewModal({
  park,
  reviews,
  setIsReviewModalVisible,
}: {
  park: NationalPark;
  reviews: Review[];
  setIsReviewModalVisible: (value: boolean) => void;
}) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [errorText, setErrorText] = useState("");

  const handleSubmit = () => {
    if (rating < 1 || rating > 5) {
      setErrorText("Please select a rating between 1 and 5");
      return;
    }
    if (!review.trim()) {
      setReview("");
      return;
    }
    addReview(park.id, rating, review, isPublic);
    setIsReviewModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.parkName}>Write a Review</Text>
          <Text style={styles.parkLocation}>Share your experience</Text>
        </View>
        <View>
          <StarRating rating={rating} setRating={setRating} />
          <TouchableOpacity
            style={[
              styles.privacyButton,
              isPublic ? styles.publicButton : styles.privateButton,
            ]}
            onPress={() => setIsPublic(!isPublic)}
          >
            <Text style={styles.privacyButtonText}>
              {isPublic ? "Public" : "Private"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.reviewContainer}>
        <TextInput
          style={styles.reviewInput}
          multiline
          placeholder="Write your review here..."
          value={review}
          onChangeText={setReview}
          textAlignVertical="top"
        />

        <View>
          <Text>{errorText}</Text>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  privacyButton: {
    borderRadius: 8,
    padding: 4,
    alignItems: "center",
    marginVertical: 8,
  },
  publicButton: {
    backgroundColor: "green",
  },
  privateButton: {
    backgroundColor: "#666",
  },
  privacyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  reviewContainer: {
    flex: 1,
    marginTop: 8,
    position: "relative",
  },
  reviewInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 50,
  },
  submitButton: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "green",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

import { StyleSheet, TouchableOpacity, View, Animated } from "react-native";
import React, { useRef, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Review } from "../types/review";
import { NationalPark } from "../types/national_park";

export default function ReviewButton({
  park,
  reviews,
  size,
  isReviewModalVisible,
  setIsReviewModalVisible,
}: {
  park: NationalPark;
  reviews: Review[];
  size?: number;
  isReviewModalVisible: boolean;
  setIsReviewModalVisible: (value: boolean) => void;
}) {
  const reviewed = reviews.some((review) => review.park_id === park.id);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: isReviewModalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isReviewModalVisible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handlePress = () => {
    if (isReviewModalVisible) {
      setIsReviewModalVisible(false);
    } else if (!reviewed) {
      setIsReviewModalVisible(true);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: "green",
          padding: size || 8,
          borderRadius: 8,
        }}
        onPress={handlePress}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <AntDesign
            name={isReviewModalVisible ? "close" : reviewed ? "star" : "staro"}
            size={24}
            color="white"
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});

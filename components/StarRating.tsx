import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import React, { useRef, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function StarRating({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (rating: number) => void;
}) {
  const starScale = useRef(new Animated.Value(1)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const { locationX } = event.nativeEvent;
        const starWidth = 28; // 24px icon + 4px margin
        const starIndex = Math.floor(locationX / starWidth);
        const newRating = Math.max(1, Math.min(5, starIndex + 1));
        if (newRating !== rating) {
          setRating(newRating);
        }
      },
    })
  ).current;

  useEffect(() => {
    starScale.stopAnimation(); // Stop any ongoing animation
    Animated.sequence([
      Animated.timing(starScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(starScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [rating]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Animated.View
            style={{ transform: [{ scale: star === rating ? starScale : 1 }] }}
          >
            <AntDesign
              name={star <= rating ? "star" : "staro"}
              size={24}
              color="green"
            />
          </Animated.View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

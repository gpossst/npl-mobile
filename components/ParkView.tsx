import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { NationalPark } from "../types/national_park";
import { Image } from "expo-image";
import AddToListBtn from "./AddToListBtn";
import ParkInfo from "./ParkInfo";
import ReviewModal from "./ReviewModal";
import { Review } from "../types/review";
import ReviewButton from "./ReviewButton";
import { ListItem } from "../types/list_item";

export default function ParkView({
  park,
  setSelectedPark,
  reviews,
  user_list,
  fetchListItems,
}: {
  park: NationalPark;
  setSelectedPark: (park: NationalPark | null) => void;
  reviews: Review[];
  user_list: ListItem[];
  fetchListItems: () => void;
}) {
  const windowHeight = Dimensions.get("window").height;
  const defaultHeight = windowHeight * 0.8;
  const [containerHeight, setContainerHeight] = useState(defaultHeight);

  const minHeight = windowHeight * 0.2;
  const maxHeight = windowHeight * 0.8;
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  const dragY = useRef(new Animated.Value(0)).current;
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const imageHeight = useRef(new Animated.Value(250)).current;

  const snapToHeight = (currentHeight: number) => {
    let snapPoints;
    if (isReviewModalVisible) {
      snapPoints = [windowHeight * 0.7];
    } else {
      snapPoints = [windowHeight * 0.2, windowHeight * 0.5, windowHeight * 0.8];
    }

    const closest = snapPoints.reduce((prev, curr) => {
      return Math.abs(curr - currentHeight) < Math.abs(prev - currentHeight)
        ? curr
        : prev;
    });

    Animated.spring(dragY, {
      toValue: defaultHeight - closest,
      useNativeDriver: false,
      bounciness: 8,
    }).start();

    setContainerHeight(closest);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragY.setOffset((dragY as any)._value);
        dragY.setValue(0);
      },
      onPanResponderMove: Animated.event([null, { dy: dragY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        dragY.flattenOffset();
        const newHeight = defaultHeight - (dragY as any)._value;
        snapToHeight(newHeight);
      },
    })
  ).current;

  const animatedHeight = dragY.interpolate({
    inputRange: [-maxHeight + defaultHeight, -minHeight + defaultHeight],
    outputRange: [maxHeight, minHeight],
    extrapolate: "clamp",
  });

  const handleClose = () => {
    setSelectedPark(null);
  };

  useEffect(() => {
    Animated.spring(imageHeight, {
      toValue: isReviewModalVisible ? 187.5 : 250,
      useNativeDriver: false,
      bounciness: 4,
    }).start();
  }, [isReviewModalVisible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: animatedHeight,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.handleContainer} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Animated.View style={{ height: imageHeight }}>
            <Image
              source={`https://${park.image}`}
              style={styles.image}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
          </Animated.View>
          <View style={styles.buttonContainer}>
            <ReviewButton
              park={park}
              reviews={reviews}
              size={8}
              isReviewModalVisible={isReviewModalVisible}
              setIsReviewModalVisible={setIsReviewModalVisible}
            />
            <AddToListBtn
              park={park}
              user_list={user_list}
              fetchListItems={fetchListItems}
            />
          </View>
        </View>
        {isReviewModalVisible ? (
          <ReviewModal
            park={park}
            reviews={reviews}
            setIsReviewModalVisible={setIsReviewModalVisible}
          />
        ) : (
          <ParkInfo park={park} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handleContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#c0c0c0",
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 24,
    lineHeight: 24,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: -10,
    right: 10,
    zIndex: 2,
    flexDirection: "row",
    gap: 10,
  },
});

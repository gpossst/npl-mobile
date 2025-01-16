import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { NationalPark } from "../types/national_park";
import { Region } from "react-native-maps";
import ListPark from "./ListPark";
import { ListItem } from "../types/list_item";

type SortOption = "distance" | "name" | "visitors" | "review_average";

export default function List({
  parks,
  setSelectedPark,
  currentRegion,
  user_list,
  fetchListItems,
}: {
  parks: NationalPark[];
  setSelectedPark: (park: NationalPark) => void;
  currentRegion: Region;
  user_list: ListItem[];
  fetchListItems: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const windowHeight = Dimensions.get("window").height;
  const defaultHeight = windowHeight * 0.3;
  const [containerHeight, setContainerHeight] = useState(defaultHeight);
  const minHeight = windowHeight * 0.2;
  const maxHeight = windowHeight * 0.93;

  // Create an animated value for tracking drag
  const dragY = useRef(new Animated.Value(0)).current;

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
        // Calculate and set the final height
        const newHeight = defaultHeight - (dragY as any)._value;
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          setContainerHeight(newHeight);
        }
      },
    })
  ).current;

  const distanceFromCenter = (park: NationalPark) => {
    const d_ew =
      (park.longitude - currentRegion.longitude) *
      Math.cos(currentRegion.latitude);
    const d_ns = park.latitude - currentRegion.latitude;
    return Math.sqrt(d_ew * d_ew + d_ns * d_ns);
  };

  // Create animated style for the container
  const animatedHeight = dragY.interpolate({
    inputRange: [-maxHeight + defaultHeight, -minHeight + defaultHeight],
    outputRange: [maxHeight, minHeight],
    extrapolate: "clamp",
  });

  const sortParks = (parks: NationalPark[]) => {
    switch (sortBy) {
      case "name":
        return [...parks].sort((a, b) => a.name.localeCompare(b.name));
      case "visitors":
        return [...parks].sort((a, b) => b.yearly_visitors - a.yearly_visitors);
      case "review_average":
        return [...parks].sort((a, b) => b.review_average - a.review_average);
      case "distance":
      default:
        return [...parks].sort(
          (a, b) => distanceFromCenter(a) - distanceFromCenter(b)
        );
    }
  };

  const filterParks = (parks: NationalPark[]) => {
    return parks.filter((park) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        park.name.toLowerCase().includes(searchLower) ||
        park.state.toLowerCase().includes(searchLower) ||
        park.established.toLowerCase().includes(searchLower) ||
        park.review_average.toString().includes(searchLower)
      );
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: animatedHeight,
        },
      ]}
    >
      <View style={styles.handleContainer} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>
      <View style={styles.controls}>
        <View style={styles.filterRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search parks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === "distance" && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy("distance")}
            >
              <Text>Distance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === "visitors" && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy("visitors")}
            >
              <Text>Visitors</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === "visitors" && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy("visitors")}
            >
              <Text>Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {sortParks(filterParks(parks)).map((park) => (
          <ListPark
            key={park.id}
            park={park}
            setSelectedPark={setSelectedPark}
            user_list={user_list}
            fetchListItems={fetchListItems}
          />
        ))}
      </ScrollView>
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
  },
  handleContainer: {
    width: "100%",
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
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
  parkItem: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 15,
    width: "100%",
  },
  controls: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sortButtons: {
    flexDirection: "row",
  },
  sortButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  sortButtonActive: {
    backgroundColor: "#e0e0e0",
  },
  parkDetails: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

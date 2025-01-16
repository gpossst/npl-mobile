import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NationalPark } from "../types/national_park";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ListItem } from "../types/list_item";
import AddToListBtn from "./AddToListBtn";

export default function ListPark({
  park,
  setSelectedPark,
  user_list,
  fetchListItems,
}: {
  park: NationalPark;
  setSelectedPark: (park: NationalPark) => void;
  user_list: ListItem[];
  fetchListItems: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedPark(park);
      }}
      style={styles.container}
    >
      <View style={styles.leftContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{park.name}</Text>
          <Text style={styles.stateText}>{park.state}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={16} color="green" />
          <Text>{park.review_average}</Text>
        </View>
      </View>
      <AddToListBtn
        park={park}
        user_list={user_list}
        fetchListItems={fetchListItems}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leftContainer: {
    gap: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "column",
    gap: 8,
  },
  stateText: {
    color: "#666",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

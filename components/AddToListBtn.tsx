import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { NationalPark } from "../types/national_park";
import { ListItem } from "../types/list_item";
import Entypo from "@expo/vector-icons/Entypo";
import { supabase, getUserId } from "../lib/supabase";

export default function AddToListBtn({
  park,
  user_list,
  size = 8,
  fetchListItems,
}: {
  park: NationalPark;
  user_list: ListItem[];
  size?: number;
  fetchListItems: () => void;
}) {
  const [isInList, setIsInList] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsInList(user_list.some((item) => item.park_id === park.id));
  }, [user_list, park]);

  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: isInList ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isInList]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handlePress = async () => {
    setIsInList(!isInList);

    try {
      if (!isInList) {
        await supabase.from("list_items").insert({
          park_id: park.id,
          user_id: await getUserId(),
        });
      } else {
        await supabase
          .from("list_items")
          .delete()
          .eq("park_id", park.id)
          .eq("user_id", await getUserId());
      }
      fetchListItems();
    } catch (error) {
      setIsInList(!isInList);
      console.error("Error updating list:", error);
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "green",
        padding: size,
        borderRadius: 8,
      }}
      onPress={handlePress}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Entypo name={isInList ? "minus" : "plus"} size={24} color="white" />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

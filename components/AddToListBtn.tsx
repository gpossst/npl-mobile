import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    setIsInList(user_list.some((item) => item.park_id === park.id));
  }, [user_list, park]);

  const handlePress = async () => {
    if (isInList) {
      await supabase
        .from("list_items")
        .delete()
        .eq("park_id", park.id)
        .eq("user_id", await getUserId());
    } else {
      await supabase.from("list_items").insert({
        park_id: park.id,
        user_id: await getUserId(),
      });
    }
    fetchListItems();
    console.log(user_list);
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
      <Entypo name={isInList ? "minus" : "plus"} size={24} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

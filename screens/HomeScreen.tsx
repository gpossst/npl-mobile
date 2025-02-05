import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { supabase, getUserId, getParkData } from "../lib/supabase";
import { NationalPark } from "../types/national_park";
import { Review } from "../types/review";
import { ListItem } from "../types/list_item";
import { Region } from "react-native-maps";
import MapBG from "../components/MapBG";
import SettingsBtn from "../components/SettingsBtn";
import List from "../components/List";
import ParkView from "../components/ParkView";
import Loading from "../components/Loading";
export default function HomeScreen({ navigation }: { navigation: any }) {
  const [parks, setParks] = useState<NationalPark[]>([]);
  const [selectedPark, setSelectedPark] = useState<NationalPark | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [currentRegion, setCurrentRegion] = useState<Region>({
    latitude: 39.8283,
    longitude: -98.5795,
    latitudeDelta: 50,
    longitudeDelta: 50,
  });

  const fetchMarkers = async () => {
    const data = await getParkData();
    setParks(data);
  };

  const fetchReviews = async () => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.error("Supabase error:", error);
    } else {
      setReviews(data as Review[]);
    }
  };

  const fetchListItems = async () => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("list_items")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.error("Supabase error:", error);
    } else {
      setListItems(data as ListItem[]);
    }
  };

  useEffect(() => {
    fetchMarkers();
    fetchReviews();
    fetchListItems();
    setLoading(false);
  }, []);

  const onMarkerSelected = (park: NationalPark) => {
    setSelectedPark(park);
  };

  if (parks.length === 0 || loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {selectedPark ? (
        <ParkView
          park={selectedPark}
          reviews={reviews}
          user_list={listItems}
          setSelectedPark={setSelectedPark}
          fetchListItems={fetchListItems}
        />
      ) : (
        <List
          parks={parks}
          setSelectedPark={setSelectedPark}
          currentRegion={currentRegion}
          user_list={listItems}
          fetchListItems={fetchListItems}
        />
      )}
      <MapBG
        parks={parks}
        onMarkerSelected={onMarkerSelected}
        currentRegion={currentRegion}
        setCurrentRegion={setCurrentRegion}
      />
      <SettingsBtn navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignSelf: "stretch",
  },
});

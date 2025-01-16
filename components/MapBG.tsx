import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";
import { NationalPark } from "../types/national_park";

export default function MapBG({
  parks,
  onMarkerSelected,
  currentRegion,
  setCurrentRegion,
}: {
  parks: NationalPark[];
  onMarkerSelected: (marker: NationalPark) => void;
  currentRegion: Region;
  setCurrentRegion: (region: Region) => void;
}) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currentRegion}
        onRegionChangeComplete={(region) => {
          setCurrentRegion(region);
        }}
      >
        {parks.map((park) => {
          const lat = Number(park.latitude);
          const lng = Number(park.longitude);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Invalid coordinates for park: ${park.name}`);
            return null;
          }

          return (
            <Marker
              key={park.id}
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}
              pinColor="green"
              onPress={() => onMarkerSelected(park)}
            >
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text>{park.name}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  callout: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
  },
});

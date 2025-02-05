import { StyleSheet, Text, Linking, View } from "react-native";
import { Image } from "expo-image";
import React from "react";

const Loading = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/horseshoe-bend.jpg")}
        style={styles.backgroundImage}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <Image
        source={require("../assets/aa-light.png")}
        style={styles.image}
        cachePolicy="memory-disk"
        contentFit="contain"
        priority="high"
      />
      <Text style={styles.attribution}>
        Photo by{" "}
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL(
              "https://unsplash.com/@danesduet?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            )
          }
        >
          Daniel Olah
        </Text>{" "}
        on{" "}
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL(
              "https://unsplash.com/photos/grey-rock-formation-under-gloomy-sky-PWlnNdkPaYs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            )
          }
        >
          Unsplash
        </Text>
      </Text>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    zIndex: 1,
  },
  attribution: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    zIndex: 1,
  },
  link: {
    color: "green",
    textDecorationLine: "underline",
  },
});

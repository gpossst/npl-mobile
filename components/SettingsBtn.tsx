import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function SettingsBtn({ navigation }: { navigation: any }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Settings")}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        <MaterialCommunityIcons
          name={isPressed ? "cog" : "cog-outline"}
          size={24}
          color="black"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    margin: 0,
    padding: 0,
  },
});

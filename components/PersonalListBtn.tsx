import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

type PersonalListBtnProps = {
  onToggle: () => void;
  isEnabled: boolean;
};

export default function PersonalListBtn({
  onToggle,
  isEnabled,
}: PersonalListBtnProps) {
  const [localEnabled, setLocalEnabled] = useState(isEnabled);

  useEffect(() => {
    setLocalEnabled(isEnabled);
  }, [isEnabled]);

  const handleToggle = () => {
    setLocalEnabled(!localEnabled);
    onToggle();
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.option, !localEnabled && styles.optionActive]}
          onPress={handleToggle}
        >
          <Text
            style={[
              styles.optionText,
              !localEnabled && styles.optionTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, localEnabled && styles.optionActive]}
          onPress={handleToggle}
        >
          <Text
            style={[styles.optionText, localEnabled && styles.optionTextActive]}
          >
            Wishlist
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 4,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  optionActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 14,
    color: "#666",
  },
  optionTextActive: {
    color: "green",
    fontWeight: "600",
  },
});

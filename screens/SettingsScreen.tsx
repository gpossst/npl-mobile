import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button } from "@rneui/themed";
import { supabase, getUserStats, updateDisplayName } from "../lib/supabase";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { UserStats } from "../types/user_stats";

export default function SettingsScreen({ navigation }: { navigation: any }) {
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<"display_name" | "email" | null>(
    null
  );
  const [editValue, setEditValue] = useState("");

  const signOut = () => {
    supabase.auth.signOut();
  };

  const handleEdit = async () => {
    if (!editField || !user) return;

    try {
      if (editField === "display_name") {
        await updateDisplayName(editValue);
      } else if (editField === "email") {
        await supabase.auth.updateUser({
          email: editValue,
        });
      }
      setIsEditModalVisible(false);
      setEditField(null);
      setEditValue("");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Separate effect for fetching user stats when user changes
  useEffect(() => {
    if (user?.id) {
      getUserStats({ userId: user.id }).then((stats) => {
        setUserStats(stats);
      });
    }
  }, [user]); // Dependencies array includes user

  // Separate effect for auth
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependencies array as this should only run once

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoRow}>
          <Text style={styles.userInfoText}>Display Name:</Text>
          <View style={styles.valueContainer}>
            <Text>{user?.user_metadata?.display_name || "N/A"}</Text>
            <TouchableOpacity
              onPress={() => {
                setEditField("display_name");
                setEditValue(user?.user_metadata?.display_name || "");
                setIsEditModalVisible(true);
              }}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="green" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.userInfoRow}>
          <Text style={styles.userInfoText}>Email:</Text>
          <View style={styles.valueContainer}>
            <Text>{user?.email || "N/A"}</Text>
            <TouchableOpacity
              onPress={() => {
                setEditField("email");
                setEditValue(user?.email || "");
                setIsEditModalVisible(true);
              }}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="green" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.userInfoRow}>
          <Text style={styles.userStatsText}>Parks Visited:</Text>
          <Text>{userStats?.review_count}</Text>
        </View>
        <View style={styles.userInfoRow}>
          <Text style={styles.userStatsText}>Wishlist Size:</Text>
          <Text>{userStats?.list_count}</Text>
        </View>
      </View>

      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {editField === "display_name" ? "Display Name" : "Email"}
            </Text>
            <TextInput
              style={styles.input}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter new ${
                editField === "display_name" ? "display name" : "email"
              }`}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleEdit}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.signOutButtonContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 100,
    top: 60,
    left: 20,
  },
  backButton: {
    backgroundColor: "green",
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userStatsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  signOutButtonContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  signOutButton: {
    backgroundColor: "#d13d3d",
    padding: 10,
    width: "90%",
    borderRadius: 5,
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 50,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "green",
  },
  cancelButton: {
    backgroundColor: "#d13d3d",
  },
});

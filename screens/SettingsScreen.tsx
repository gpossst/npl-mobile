import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Button } from "@rneui/themed";
import { supabase } from "../lib/supabase";

export default function SettingsScreen() {
  const [userId, setUserId] = useState<string | null>(null);

  const signOut = () => {
    supabase.auth.signOut();
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      {userId && <Text>User ID: {userId}</Text>}
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

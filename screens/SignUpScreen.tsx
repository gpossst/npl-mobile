import React, { useState } from "react";
import { Alert, View, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";

export default function SignUpScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      setLoading(false);
      return;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.goBack()}>Back</Button>
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Display Name"
          leftIcon={{ type: "font-awesome", name: "user" }}
          onChangeText={(text) => setDisplayName(text)}
          value={displayName}
          placeholder="Your display name"
          autoCapitalize={"words"}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          label="Confirm Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="Confirm password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  inputContainer: {
    paddingVertical: 4,
    alignSelf: "stretch",
    marginTop: 20,
  },
  buttonContainer: {
    paddingVertical: 4,
    alignSelf: "stretch",
    marginTop: 20,
  },
});

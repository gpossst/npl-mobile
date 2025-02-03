import React, { useState } from "react";
import {
  Alert,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Image as ExpoImage } from "expo-image";

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
      Alert.alert(
        "Please check your inbox for email verification! It will be sent from team@garrett.one."
      );
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <ExpoImage
        source={require("../assets/valley-landscape.jpg")}
        style={styles.backgroundImage}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Display Name"
              onChangeText={(text) => setDisplayName(text)}
              value={displayName}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
              onPress={() => signUpWithEmail()}
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonClear}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonTextClear}>
                Already have an account? Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0)",
    justifyContent: "center",
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    paddingVertical: 4,
    alignSelf: "stretch",
    marginTop: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 13,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonContainer: {
    paddingVertical: 4,
    alignSelf: "stretch",
    marginTop: 20,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    paddingVertical: 13,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonClear: {
    alignItems: "center",
  },
  buttonTextClear: {
    color: "white",
  },
});

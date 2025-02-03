import React, { useState } from "react";
import {
  Alert,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Linking,
} from "react-native";
import { supabase, updatePassword } from "../lib/supabase";

export default function SignInScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/valley-landscape.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
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
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.forgotPasswordButton]}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.clearButtonText}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.signInButton,
                loading && styles.buttonDisabled,
              ]}
              disabled={loading}
              onPress={() => signInWithEmail()}
            >
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.attribution}>
          Photo by{" "}
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL(
                "https://unsplash.com/@anik3t?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              )
            }
          >
            Aniket Deole
          </Text>{" "}
          on{" "}
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL(
                "https://unsplash.com/photos/photo-of-valley-M6XC789HLe8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              )
            }
          >
            Unsplash
          </Text>
        </Text>
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
    backgroundColor: "rgba(255, 255, 255, 0)", // semi-transparent white overlay
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  signInButton: {
    flex: 1,
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
  header: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
  },
  signUpButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  signUpButtonText: {
    color: "green",
    fontWeight: "bold",
  },
  forgotPasswordButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  clearButtonText: {
    color: "green",
    fontWeight: "600", // making text slightly bolder for better visibility
  },
  attribution: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    textAlign: "center",
    color: "#666",
    fontSize: 12,
  },
  link: {
    color: "green",
    textDecorationLine: "underline",
  },
});

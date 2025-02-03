import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import HomeScreen from "./screens/HomeScreen";
import { Image as ExpoImage } from "expo-image";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Preload the background image
    ExpoImage.prefetch(require("./assets/valley-landscape.jpg"));
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {session ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import AuthContextProvider, { AuthContext } from "@/context/AuthContextProvider";

function initializeApp() {
  GoogleSignin.configure({
    webClientId: "",
  });
}

function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { firebaseAuthUser, user, isAppReady } = useContext(AuthContext);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    /*
    firebaseAuthUser null -> login screen
    firebaseAuthUser ok, user not found -> account-setup screen
    firebaseAuthUser ok, user unapproved or inactive -> unavailable screen
    firebaseAuthUser ok, user ok -> protected screens
    */

    if (firebaseAuthUser === null) {
      console.log("No firebase auth user, redirecting to login.");
      router.replace("/auth/login");
      return;
    }

    if (user !== null && user.exists === false) {
      console.log("ok firebase auth user but no mongo user, redirecting to setup.");
      router.replace("/auth/account-setup");
      return;
    }

    if (user !== null && (!(user.isApproved && user.isActive) || user.type !== "driver")) {
      console.log("ok firebase auth user but not-ok mongo user, redirecting to unavailable.");
      router.replace("/auth/unavailable");
      return;
    }

    console.log(user);

    if (segments[0] !== "(protected)") {
      // user is ok, but for some reason trying to access auth routes
      console.log("ok firebase auth user and ok mongo user but trying to access an auth route, redirecting to home.");

      router.replace("/(protected)/home");
      return;
    }
  }, [segments, firebaseAuthUser, user, isAppReady]);

  return (
    <View style={{ flex: 1 }}>
      {!isAppReady && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            backgroundColor: "white",
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <Stack>
        <Stack.Screen
          name="auth/unavailable/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth/login/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth/account-setup/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(protected)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayoutWithContext() {
  return (
    <AuthContextProvider>
      <RootLayout />
    </AuthContextProvider>
  );
}

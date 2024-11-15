import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import AuthContextProvider, { AuthContext, AUTH_STATES } from "@/context/AuthContextProvider";

function initializeApp() {
  GoogleSignin.configure({
    webClientId: "899499972697-52dkm4ht1u5e27094b66s46upb1cgdtg.apps.googleusercontent.com",
  });
}

function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { combinedAuthState } = useContext(AuthContext);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    console.log("");
    console.log("----------------------------------------------------------------------------------");
    console.log(`--------> Checking for redirects - ${new Date().toISOString()}`);
    console.log(combinedAuthState);
    console.log(segments);

    if (combinedAuthState.authState === null) {
      // still loading
      console.log("---> No redirect (loading)");
      return;
    }

    if (combinedAuthState.authState === AUTH_STATES.UNAUTHENTICATED) {
      console.log("---> Redirect to /auth/login");
      router.replace("/auth/login");
      return;
    }

    if (combinedAuthState.authState === AUTH_STATES.NO_APP_USER) {
      console.log("---> Redirect to /auth/account-setup");
      router.replace("/auth/account-setup");
      return;
    }

    if (
      combinedAuthState.authState === AUTH_STATES.UNAPPROVED_APP_USER ||
      combinedAuthState.authState === AUTH_STATES.DEACTIVATED_APP_USER ||
      combinedAuthState.authState === AUTH_STATES.WRONG_APP
    ) {
      console.log("---> Redirect to /auth/unavailable");
      router.replace("/auth/unavailable");
      return;
    }

    if (segments[0] !== "(protected)") {
      console.log("---> Redirect to /(protected)/profile");
      router.replace("/(protected)/profile");
      return;
    }

    console.log("---> No redirect");
  }, [combinedAuthState, segments]);

  return (
    <View style={{ flex: 1 }}>
      {!combinedAuthState.authState === null && (
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

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="auth/unavailable/index" />

        <Stack.Screen name="auth/login/index" />
        <Stack.Screen name="auth/account-setup/index" />
        <Stack.Screen name="(protected)" />
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

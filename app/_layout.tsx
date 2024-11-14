import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import AuthContextProvider, { AuthContext } from "@/context/AuthContextProvider";

function initializeApp() {
  GoogleSignin.configure({
    webClientId: "899499972697-52dkm4ht1u5e27094b66s46upb1cgdtg.apps.googleusercontent.com",
  });
}

function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { firebaseAuthUser, user, isAppReady, isFetchingUser } = useContext(AuthContext);

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

    console.log("Update");
    console.log(segments);
    console.log(firebaseAuthUser);
    console.log(isFetchingUser);
    console.log(user);
    console.log(isAppReady);
    console.log("-------------------------");

    if (firebaseAuthUser === null) {
      console.log("---> router redirect to /auth/login - reason: no firebase auth user");
      router.replace("/auth/login");
      return;
    }

    if (user === null && isFetchingUser) {
      return;
    }

    if (user !== null && user.exists === false) {
      console.log("---> router redirect to /auth/account-setup - reason: ok firebase auth user but no mongo user");
      router.replace("/auth/account-setup");
      return;
    }

    if (user !== null && (user.type !== "driver" || !user.isApproved || !user.isActive)) {
      console.log("---> router redirect to /auth/unavailable - reason: ok firebase auth user but bad mongo user");
      router.replace("/auth/unavailable");
      return;
    }

    if (segments[0] !== "(protected)") {
      console.log(
        "---> router redirect to /(protected)/home - reason: ok firebase auth user and ok mongo user, but trying to access auth route"
      );
      router.replace("/(protected)/home");
      return;
    }
  }, [segments, firebaseAuthUser, user, isAppReady, isFetchingUser]);

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

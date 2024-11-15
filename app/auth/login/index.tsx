import { useState, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import auth from "@react-native-firebase/auth";
import { AuthContext } from "@/context/AuthContextProvider";

export default function Login() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const { authErrors } = useContext(AuthContext);

  const handleSignInWithGoogleButtonClick = async () => {
    setIsSigningIn(true);

    try {
      await GoogleSignin.signOut();

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult.data.idToken;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const firebaseAuthUserCredential = auth().signInWithCredential(googleCredential);

      console.log("Sign In With Google successful.");

      // return firebaseAuthUserCredential
    } catch (error) {
      console.log("Sign In With Google failed.");
      console.log(error);
      setIsSigningIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title1}>Urban Commute</Text>
      <Text style={styles.title2}>Driver's App</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handleSignInWithGoogleButtonClick} disabled={isSigningIn}>
        <FontAwesome6 name="google" size={26} color="white" />
        <Text style={styles.buttonText}>Sign In With Google</Text>

        {isSigningIn && <ActivityIndicator size={26} color="#ffffff" />}
      </TouchableOpacity>

      <Text>{authErrors}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 200,
    paddingLeft: 20,
    paddingRight: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title1: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  title2: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 50,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#1B9CFC",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    marginLeft: 10,
    marginRight: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

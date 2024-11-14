import { View, Text, Button } from "react-native";
import React from "react";

export default function Login() {
  const handleSignInWithGoogleButtonClick = async () => {
    console.log("foo you");
  };

  return (
    <View>
      <Text>foo you</Text>
      <Button title="Sign in With Google" onPress={handleSignInWithGoogleButtonClick} />
    </View>
  );
}

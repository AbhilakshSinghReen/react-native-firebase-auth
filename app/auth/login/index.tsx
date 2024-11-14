import { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Page() {
  const [ok, setOk] = useState(null);

  async function onGoogleButtonPress() {
    console.log("ok 6");
    await GoogleSignin.signOut();

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const signInResult = await GoogleSignin.signIn();
    setOk(signInResult);
    console.log("stage1 ok");

    // Try the new style of google-sign in result, from v13+ of that module
    let idToken = signInResult.data.idToken;
    // if (!idToken) {
    //   // if you are using older versions of google-signin, try old style result
    //   idToken = signInResult.idToken;
    // }
    // if (!idToken) {
    //   throw new Error("No ID token found");
    // }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // // Sign-in the user with the credential
    const userCred = auth().signInWithCredential(googleCredential);
    console.log("stage2 ok");
    // console.log(userCred)
    // return userCred;
  }

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const handleSignInWithGoogleButtonClick = async () => {
    console.log("foo you too");

    try {
      await onGoogleButtonPress();
      console.log("Google Signin successful");
    } catch (error) {
      console.log("Google signin failed");
      console.log(error);
    }
  };

  function onAuthStateChanged(user) {
    // console.log("User updated");
    // console.log(user);

    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  if (!user) {
    return (
      <View>
        <Text>Home page</Text>
        <Button title="Sign In With Google" onPress={handleSignInWithGoogleButtonClick} />
        <Button title="Print Foo" onPress={() => console.log("Foo")} />
        <Button title="Print User" onPress={() => console.log(user)} />
        <Button title="Print ok" onPress={() => console.log(ok)} />
      </View>
    );
  }

  return (
    <View>
      <Text>Home page</Text>
      <Text>You are logged in</Text>
      <Text>{user.email}</Text>
      <Text>{user.accessToken}</Text>
      {/* <Button title="Sign In With Google" onPress={handleSignInWithGoogleButtonClick} /> */}
      <Button title="Print User" onPress={() => console.log(user)} />
      <Button title="Print ok" onPress={() => console.log(ok)} />
      <Button title="Print access token" onPress={async () => console.log(await user.getAccessToken())} />
      <Button title="Print id token" onPress={async () => console.log(await user.getIdToken())} />
      <Button title="Print current user" onPress={async () => console.log(auth().currentUser)} />
      <Button
        title="Print current user id token"
        onPress={async () => console.log(await auth().currentUser.getIdToken())}
      />
    </View>
  );
}

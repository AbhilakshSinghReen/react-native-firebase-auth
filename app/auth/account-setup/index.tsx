import { useState, useContext } from "react";
import { View, ActivityIndicator, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import SignOutButton from "@/components/SignOutButton";
import apiClient from "@/api/apiClient";
import { AuthContext } from "@/context/AuthContextProvider";

export default function AccountSetup() {
  const { firebaseAuthUser, updateUserFromContextFirebaseAuthUser } = useContext(AuthContext);

  const [isCreating, setIsCreating] = useState(false);
  const [fullName, setFullName] = useState("");
  // const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const email = firebaseAuthUser.email;

  const handleContinueButtonClick = async () => {
    setIsCreating(true);

    const address = {
      line1: line1,
      line2: line2,
      city: city,
      state: state,
      zipCode: zipcode,
    };

    const createUserResponse = await apiClient.createUser("driver", fullName, email, phoneNumber, address);
    if (!createUserResponse.success) {
      console.log(createUserResponse.error);
      setIsCreating(false);
      return;
    }

    updateUserFromContextFirebaseAuthUser();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title1}>Urban Commute Driver</Text>
      <Text style={styles.title}>Account Setup</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />

      <TextInput
        style={styles.inputDisabled}
        placeholder="Email"
        value={email}
        // onChangeText={setEmail}
        editable={false}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.subTitle}>Address</Text>

      <TextInput style={styles.input} placeholder="Line 1" value={line1} onChangeText={setLine1} />

      <TextInput style={styles.input} placeholder="Line 2" value={line2} onChangeText={setLine2} />

      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />

      <TextInput style={styles.input} placeholder="State" value={state} onChangeText={setState} />

      <TextInput
        style={styles.input}
        placeholder="Zipcode"
        value={zipcode}
        onChangeText={setZipcode}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleContinueButtonClick} disabled={isCreating}>
        <Text style={styles.buttonText}>Continue</Text>

        {isCreating && <ActivityIndicator size={26} color="#ffffff" />}
      </TouchableOpacity>

      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginBottom: 25,
          marginTop: 25,
        }}
      />

      <SignOutButton label="Sign Into Another Account" backgroundColor="#F97F51" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title1: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  inputDisabled: {
    borderWidth: 1,
    backgroundColor: "#ccc",
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
    marginRight: 10,
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
});

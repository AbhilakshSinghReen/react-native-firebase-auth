import { useState, useContext } from "react";
import { View, ActivityIndicator, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import SignOutButton from "@/components/SignOutButton";
import apiClient from "@/api/apiClient";
import { AuthContext } from "@/context/AuthContextProvider";

export default function AccountSetup() {
  const { user } = useContext(AuthContext);

  if (user === null) {
    return (
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
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title1}>Urban Commute Driver</Text>
      <Text style={styles.title}>{user.fullName}</Text>

      {/* <TextInput
        style={styles.inputDisabled}
        placeholder="Email"
        value={email}
        // onChangeText={setEmail}
        editable={false}
        keyboardType="email-address"
      /> */}

      {/* <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      /> */}

      {/* <Text style={styles.subTitle}>Address</Text>

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
      /> */}

      {/* <TouchableOpacity style={styles.primaryButton} onPress={handleContinueButtonClick} disabled={isCreating}>
        <Text style={styles.buttonText}>Continue</Text>

        {isCreating && <ActivityIndicator size={26} color="#ffffff" />}
      </TouchableOpacity> */}

      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginBottom: 25,
          marginTop: 25,
        }}
      />

      <SignOutButton label="Sign Out" backgroundColor="#FD7272" />
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

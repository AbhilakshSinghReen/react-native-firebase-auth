import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";

export default function SignOutButton({ label, backgroundColor }) {
  const router = useRouter();

  const handleSignOutButtonClick = async () => {
    const signOutResult = await auth().signOut();
    router.push("/auth/login");
  };

  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: backgroundColor,
      }}
      onPress={handleSignOutButtonClick}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

import { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { AuthContext } from "@/context/AuthContextProvider";
import SignOutButton from "@/components/SignOutButton";

const defaultError = {
  title: "Unavailable",
  message: "The application is currently unavailable. Please check back again in a few minutes.",
  allowRefresh: true,
};

function getErrorFromUser(user) {
  if (user === null) {
    return defaultError;
  }

  if (!user.isApproved) {
    return {
      title: "Pending Approval",
      message: "Your account has not been approved by an Administrator yet. Please check back again in a few minutes.",
      allowRefresh: true,
    };
  }

  if (!user.isActive) {
    return {
      title: "Account Deactivated",
      message: "Your account has been deactivated. Please contact an Administrator for more details.",
      allowRefresh: true,
    };
  }

  if (user.type !== "driver") {
    return {
      title: "Oops! Wrong App.",
      message: `You seem to have downloaded the Urban Commute Driver's Application. But, you're a customer, you must download the "Urban Commute" app. Here's a link to install the correct app:`,
      link: "put-a-link-here",
      allowRefresh: false,
    };
  }

  return defaultError;
}

export default function Unavailable() {
  const { user, updateUserFromContextFirebaseAuthUser } = useContext(AuthContext);

  const [error, setError] = useState(getErrorFromUser(user));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshButtonClick = async () => {
    setIsRefreshing(true);

    try {
      await updateUserFromContextFirebaseAuthUser();
    } catch (error) {
      console.log(error);
      // should do something here
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user === null) {
      return;
    }

    setError(getErrorFromUser(user));
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.titleAndRefreshContainer}>
        <Text style={styles.errorTitle}>{error.title}</Text>

        {error.allowRefresh && (
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshButtonClick} disabled={isRefreshing}>
            {isRefreshing ? (
              <ActivityIndicator size={26} color="black" />
            ) : (
              <FontAwesome name="refresh" size={26} color="black" />
            )}
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.errorMessage}>{error.message}</Text>

      {error.link && <Text style={styles.errorLink}>{error.link}</Text>}

      <View style={styles.borderView} />

      <View
        style={{
          width: "90%",
        }}
      >
        <SignOutButton label="Sign Into Another Account" backgroundColor="#F97F51" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    // paddingLeft: 20,
    // paddingRight: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titleAndRefreshContainer: {
    width: "90%",
    display: "flex",
    // flex: 1,
    // flexDirection: "column",
    flexDirection: "row",
    justifyContent: "space-between",
    // justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: "green",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomColor: "red",
    borderBottomWidth: 5,
  },
  refreshButton: {
    backgroundColor: "#25CCF7",
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  errorMessage: {
    width: "90%",
    fontSize: 18,
  },
  errorLink: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#0000FF",
  },
  borderView: {
    width: "90%",
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 25,
    marginTop: 25,
  },
});

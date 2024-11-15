import { createContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

import apiClient from "@/api/apiClient";

const AUTH_STATES = Object.freeze({
  UNAUTHENTICATED: Symbol("UNAUTHENTICATED"),
  NO_APP_USER: Symbol("NO_APP_USER"),
  UNAPPROVED_APP_USER: Symbol("UNAPPROVED_APP_USER"),
  DEACTIVATED_APP_USER: Symbol("DEACTIVATED_APP_USER"),
  WRONG_APP: Symbol("WRONG_APP"),
  OK_APP_USER: Symbol("OK_APP_USER"),
});

const defaultAuthState = {
  authState: null,
  firebaseAuthUser: null,
  appUser: null,
  getAppUserErrorCode: null,
};

function getAuthState(firebaseAuthUser, appUser, getAppUserErrorCode) {
  if (firebaseAuthUser === null) {
    return AUTH_STATES.UNAUTHENTICATED;
  }

  if (appUser === null) {
    if (getAppUserErrorCode === "user_not_found") {
      return AUTH_STATES.NO_APP_USER;
    }

    if (getAppUserErrorCode === "user_pending_approval") {
      return AUTH_STATES.UNAPPROVED_APP_USER;
    }

    if (getAppUserErrorCode === "user_deactivated") {
      return AUTH_STATES.DEACTIVATED_APP_USER;
    }

    return AUTH_STATES.UNAUTHENTICATED;
  }

  if (appUser.type !== "driver") {
    return AUTH_STATES.WRONG_APP;
  }

  return AUTH_STATES.OK_APP_USER;
}

const AuthContext = createContext(null);

function AuthContextProvider({ children }) {
  const [combinedAuthState, setCombinedAuthState] = useState(defaultAuthState);
  const [authErrors, setAuthErrors] = useState("foo the error");

  const onFirebaseAuthStateChanged = async (firebaseAuthUser) => {
    console.log("Firebase Auth State Changed");

    if (firebaseAuthUser === null) {
      console.log("firebaseAuthUser is null");

      setCombinedAuthState({
        authState: AUTH_STATES.UNAUTHENTICATED,
        firebaseAuthUser: null,
        appUser: null,
      });
      return;
    }

    let appUser = null;
    let getAppUserErrorCode = null;

    const getAppUserResponse = await apiClient.getAuthenticatedUser();

    if (getAppUserResponse.success) {
      appUser = getAppUserResponse.result.user;
    } else {
      console.log("Error while getting authenticated user:");
      console.log(getAppUserResponse.error);

      getAppUserErrorCode = getAppUserResponse.error.code;
      setAuthErrors(getAppUserResponse.error.message);
    }

    console.log("Updating auth state:");
    console.log(firebaseAuthUser);
    console.log(appUser);
    console.log(getAppUserErrorCode);
    console.log("");
    console.log("");

    const updatedAuthState = getAuthState(firebaseAuthUser, appUser, getAppUserErrorCode);

    setCombinedAuthState({
      authState: updatedAuthState,
      firebaseAuthUser: firebaseAuthUser,
      appUser: appUser,
      getAppUserErrorCode: getAppUserErrorCode,
    });
  };

  useEffect(() => {
    const firebaseAuthListenerUnsubscribe = auth().onAuthStateChanged(onFirebaseAuthStateChanged);
    console.log("firebase auth listener set up");

    return () => {
      firebaseAuthListenerUnsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        combinedAuthState: combinedAuthState,
        authErrors: authErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
export { AuthContext, AUTH_STATES };

import { createContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

import apiClient from "@/api/apiClient";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [isAppReady, setIsAppReady] = useState(false);
  const [firebaseAuthUser, setFirebaseAuthUser] = useState(null);
  const [user, setUser] = useState(null);

  const onFirebaseAuthStateChanged = async (authUser) => {
    console.log("Firebase Auth User updated:");
    console.log(authUser);

    if (authUser === null) {
      setFirebaseAuthUser(authUser);
      setUser(null);
      setIsAppReady(true);
      return;
    }

    const getAuthenticatedUserResponse = await apiClient.getAuthenticatedUser();
    // const getAuthenticatedUserResponse = {
    //   success: false,
    //   error: "foo",
    // };
    if (!getAuthenticatedUserResponse.success) {
      console.log("Error while getting authenticated user:");
      console.log(getAuthenticatedUserResponse.error);

      if (getAuthenticatedUserResponse.error.code === "user_not_found") {
        setUser({
          exists: false,
        });
      } else {
        setUser(null);
      }

      setFirebaseAuthUser(authUser);
      setIsAppReady(true);
      return;
    }

    console.log("User updated:");
    console.log(getAuthenticatedUserResponse.result.user);

    setFirebaseAuthUser(authUser);
    setUser(getAuthenticatedUserResponse.result.user);
    console.log("setting isAppReady");
    setIsAppReady(true);
  };

  useEffect(() => {
    let firebaseAuthListenerUnsubscribe = null;

    try {
      firebaseAuthListenerUnsubscribe = auth().onAuthStateChanged(onFirebaseAuthStateChanged);
      console.log("auth listener set up");
    } catch (error) {
      console.log("Error in setting up firebase auth listener");
      console.log(error);
    }

    return () => {
      if (firebaseAuthListenerUnsubscribe !== null) {
        firebaseAuthListenerUnsubscribe();
      }

      console.log("auth listener removed");
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAppReady: isAppReady,
        firebaseAuthUser: firebaseAuthUser,
        setFirebaseAuthUser: setFirebaseAuthUser,
        user: user,
        setUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
export { AuthContext };

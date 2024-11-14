import { createContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

import apiClient from "@/api/apiClient";

const AuthContext = createContext();
const notFoundUser = {
  exists: false,
};

function AuthContextProvider({ children }) {
  const [isAppReady, setIsAppReady] = useState(false);
  const [firebaseAuthUser, setFirebaseAuthUser] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [user, setUser] = useState(null);

  const updateUserFromFirebaseAuthUser = async (authUser) => {
    setIsFetchingUser(true);

    if (authUser === null) {
      setUser(null);
      setIsFetchingUser(false);
      return;
    }

    const getAuthenticatedUserResponse = await apiClient.getAuthenticatedUser();
    if (!getAuthenticatedUserResponse.success) {
      console.log("Error while getting authenticated user:");
      console.log(getAuthenticatedUserResponse.error);

      setUser(getAuthenticatedUserResponse.error.code === "user_not_found" ? notFoundUser : null);
      setIsFetchingUser(false);
      return;
    }

    console.log("User updated:");
    console.log(getAuthenticatedUserResponse.result.user);

    setUser({
      ...getAuthenticatedUserResponse.result.user,
      exists: true,
    });
    setIsFetchingUser(false);
  };

  const updateUserFromContextFirebaseAuthUser = async () => {
    updateUserFromFirebaseAuthUser(firebaseAuthUser);
  };

  const onFirebaseAuthStateChanged = async (authUser) => {
    console.log("Firebase Auth User updated:");
    console.log(authUser);

    setFirebaseAuthUser(authUser);
    await updateUserFromFirebaseAuthUser(authUser);
    setIsAppReady(true);
  };

  useEffect(() => {
    const firebaseAuthListenerUnsubscribe = auth().onAuthStateChanged(onFirebaseAuthStateChanged);

    return () => {
      firebaseAuthListenerUnsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAppReady: isAppReady,
        firebaseAuthUser: firebaseAuthUser,
        user: user,
        setUser: setUser,
        updateUserFromContextFirebaseAuthUser: updateUserFromContextFirebaseAuthUser,
        isFetchingUser: isFetchingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
export { AuthContext };

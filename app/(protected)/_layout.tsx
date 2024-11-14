import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";

export default function ProtectedLayout() {
  return (
    <Tabs initialRouteName="home/index">
      <Tabs.Screen
        name="home/index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="home" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Octicons name="person" size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}

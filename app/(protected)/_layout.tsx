import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";

export default function ProtectedLayout() {
  return (
    <Tabs initialRouteName="home/index">
      <Tabs.Screen
        name="home/index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ride/index"
        options={{
          headerShown: false,
          title: "Ride",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="rickshaw" size={26} color={color} />,
        }}
      />

      
      <Tabs.Screen
        name="history/index"
        options={{
          headerShown: false,
          title: "History",
          tabBarIcon: ({ color }) => <MaterialIcons name="history" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color }) => <Octicons name="person" size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}

import { Tabs } from "expo-router";
import React from "react";
import Icon from "~/components/icon";
import { Cable, EqualSquare, Magnet } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Kabelfinder",
          tabBarIcon: (props) => <Icon icon={Cable} {...props} />,
        }}
      />
      <Tabs.Screen
        name="magnet-finder"
        options={{
          title: "Magnetfinder",
          tabBarIcon: (props) => <Icon icon={Magnet} {...props} />,
        }}
      />
      <Tabs.Screen
        name="spirit-level"
        options={{
          title: "Wasserwaage",
          tabBarIcon: (props) => <Icon icon={EqualSquare} {...props} />,
        }}
      />
    </Tabs>
  );
}

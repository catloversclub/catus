import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";

import { Image } from "expo-image";
import { useColorScheme, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/icons/house.svg")}
              style={{ width: 20, height: 20, tintColor: color }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/icons/explore.svg")}
              style={{ width: 20, height: 20, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color }) => (
            <View className="h-11 w-20 bg-yellow-300 rounded-full items-center justify-center">
              <Image
                source={require("@/assets/icons/camera.svg")}
                style={{ width: 20, height: 20, tintColor: color }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/icons/bell.svg")}
              style={{ width: 16, height: 20, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "My",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/icons/person.svg")}
              style={{ width: 20, height: 20, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

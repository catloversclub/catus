import { Tabs, router } from "expo-router";
import React from "react";
import * as ImagePicker from "expo-image-picker";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";

import { Image } from "expo-image";
import { useColorScheme, View, Alert, TouchableOpacity } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const handleCameraPress = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("권한 필요", "사진 라이브러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      // 선택한 이미지로 게시글 작성 화면으로 이동
      // 배열을 JSON 문자열로 직렬화해서 전달
      router.push({
        pathname: "/post/create-post",
        params: {
          imageUris: JSON.stringify(result.assets.map((asset) => asset.uri)),
        },
      });
    }
  };

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
      {/* 카메라 버튼 - 탭 화면이 아닌 이미지 선택 버튼으로만 사용 */}
      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: ({ color }) => (
            <View className="h-11 w-20 bg-yellow-300 rounded-full items-center justify-center">
              <Image
                source={require("@/assets/icons/camera.svg")}
                style={{ width: 20, height: 20, tintColor: color }}
              />
            </View>
          ),
          tabBarButton: ({ children, style }) => (
            <TouchableOpacity onPress={handleCameraPress} style={style}>
              {children}
            </TouchableOpacity>
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

import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export default function PostLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor:
            colorScheme === "dark"
              ? DarkTheme.colors.card
              : DefaultTheme.colors.card,
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Image
              source={require("@/assets/icons/arrow-left.svg")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="[id]" />
      <Stack.Screen name="create-post" />
    </Stack>
  );
}

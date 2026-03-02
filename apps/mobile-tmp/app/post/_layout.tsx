import { Stack, router } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";

export default function PostLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor:
            colorScheme === "dark"
              ? DarkTheme.colors.card
              : DefaultTheme.colors.card,
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeftIcon width={24} height={24} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "김오묘의 게시물" }} />
      <Stack.Screen name="create-post" options={{ title: "새 게시물" }} />
    </Stack>
  );
}

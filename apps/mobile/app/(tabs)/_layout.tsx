import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "black" }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          // 나중에 여기에 tabBarIcon 등을 추가해서 아이콘을 넣을 수 있습니다.
        }}
      />
    </Tabs>
  );
}

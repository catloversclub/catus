import React from "react"
import { View, Text, TouchableOpacity, useColorScheme } from "react-native"
import { TabType } from "@/constants/type"
import { Image } from "expo-image"

const TABS: { label: string; value: TabType }[] = [
  { label: "팔로잉", value: "following" },
  { label: "추천", value: "recommended" },
]

interface TabButtonProps {
  label: string
  value: TabType
  isActive: boolean
  onPress: (value: TabType) => void
}

function TabButton({ label, value, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity className={"flex-1 rounded-lg py-3"} onPress={() => onPress(value)}>
      <Text
        className={`typo-title3 text-center ${isActive ? "text-semantic-text-success" : "text-gray-600"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

interface HeaderProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <View className="px-3 pb-3 pt-1">
      {/* 로고 */}
      <LogoText />

      {/* 탭 */}
      <View className="mt-2 flex-row gap-2">
        {TABS.map((tab) => (
          <TabButton
            key={tab.value}
            label={tab.label}
            value={tab.value}
            isActive={activeTab === tab.value}
            onPress={onTabChange}
          />
        ))}
      </View>
    </View>
  )
}

function LogoText() {
  let colorScheme = useColorScheme()
  return (
    <Image
      style={{ width: 82, height: 26 }}
      source={
        colorScheme === "dark"
          ? require("@/assets/images/logo/row-dark.png")
          : require("@/assets/images/logo/row-light.png")
      }
      contentFit="cover"
    />
  )
}

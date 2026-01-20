import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { TabType } from "@/constants/type";
import LogoIcon from "@/assets/logos/logo.svg";

const TABS: { label: string; value: TabType }[] = [
  { label: "팔로잉", value: "following" },
  { label: "추천", value: "recommended" },
];

interface TabButtonProps {
  label: string;
  value: TabType;
  isActive: boolean;
  onPress: (value: TabType) => void;
}

function TabButton({ label, value, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      className={"flex-1 py-3 rounded-lg"}
      onPress={() => onPress(value)}
    >
      <Text
        className={`text-center font-semibold ${isActive ? "text-light-textSuccess" : "text-gray-600"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface FeedHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function FeedHeader({ activeTab, onTabChange }: FeedHeaderProps) {
  return (
    <View className="bg-white px-3 pt-1 pb-3  border-gray-200">
      {/* 로고 */}
      <LogoIcon className="w-[82px] h-[26px]" />

      {/* 탭 */}
      <View className="flex-row gap-2 mt-2">
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
  );
}

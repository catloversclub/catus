import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import CatAvatarIcon from "@/assets/icons/default-avatar-cat.svg";
import PersonAvatarIcon from "@/assets/icons/default-avatar-person.svg";

interface AvatarProps {
  type?: "person" | "cat";
  size?: "large" | "medium" | "small";
  imageUrl?: string;
}

const sizeMap = {
  large: 106,
  medium: 56,
  small: 36,
};

const Avatar = ({
  type = "person",
  size = "medium",
  imageUrl,
}: AvatarProps) => {
  const dimension = sizeMap[size];

  const DefaultAvatar = type === "cat" ? CatAvatarIcon : PersonAvatarIcon;

  return (
    <View
      className="bg-light-backgroundSecondary dark:bg-dark-backgroundSecondary rounded-full border border-light-border dark:border-dark-border overflow-hidden items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: dimension, height: dimension }}
          contentFit="contain"
        />
      ) : (
        <DefaultAvatar className="h-10 w-10" />
      )}
    </View>
  );
};

export default Avatar;

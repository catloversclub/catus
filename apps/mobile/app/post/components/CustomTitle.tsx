import React from "react";
import { Text } from "react-native";

interface CustomTitleProps {
  children: React.ReactNode;
}

const CustomTitle = ({ children }: CustomTitleProps) => {
  return <Text className="text-body1">{children}</Text>;
};

export default CustomTitle;

import React from "react";
import { Text } from "react-native";

interface CustomDescriptionProps {
  children: React.ReactNode;
}

const CustomDescription = ({ children }: CustomDescriptionProps) => {
  return (
    <Text className="text-label1 text-light-textTertiary dark:text-dark-textTertiary">
      {children}
    </Text>
  );
};

export default CustomDescription;

import React from "react";
import { TextInput, Text } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

interface CustomTextInputProps {
  placeholder?: string;
  showCounter?: boolean;
  maxLength?: number;
}

const CustomTextInput = ({
  placeholder,
  showCounter = false,
  maxLength,
}: CustomTextInputProps) => {
  const [text, onChangeText] = React.useState("");

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-col gap-2">
        <TextInput
          editable
          multiline
          className="bg-light-backgroundSecondary dark:bg-dark-backgroundSecondary min-h-[150px] px-3 py-[10px] rounded-s-md"
          onChangeText={onChangeText}
          value={text}
          placeholder={placeholder}
        />
        {showCounter && (
          <Text className="text-label1 text-tertiary text-right">
            {text.length} / {maxLength ?? "무제한"}
          </Text>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default CustomTextInput;

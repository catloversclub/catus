import { ScrollView } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";

export default function MyScreen() {
  return (
    <ScrollView className="flex-1">
      <ThemedView className="p-5">
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          My
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

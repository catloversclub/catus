import { Href, Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingScreen() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="px-3 py-4">
        <SectionContainer>
          <SectionTitle>Account</SectionTitle>
          <SectionContent link={"./profile"}>Profile</SectionContent>
          <SectionContent link={"./notifications"}>
            Notification Settings
          </SectionContent>
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>Preferences</SectionTitle>
          <SectionContent link={"./appearance"}>Appearance</SectionContent>
          <SectionContent link={"./privacy"}>Privacy</SectionContent>
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>About</SectionTitle>
          <SectionContent link={"./terms"}>Terms of Service</SectionContent>
          <SectionContent link={"./privacy-policy"}>
            Privacy Policy
          </SectionContent>
        </SectionContainer>

        <View className="mt-8 px-3">
          {/* <Button
            variant="outline"
            onPress={() => {
              // 로그아웃 처리 로직 추가
              router.replace("/(auth)/login");
            }}
          >
            Log Out
          </Button> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SectionContainer = ({ children }: { children: React.ReactNode }) => {
  return <View className="flex-col gap-1.5">{children}</View>;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return <Text className="text-base text-gray-800">{children}</Text>;
};

interface SectionContentProps {
  children: React.ReactNode;
  link?: Href;
}

const SectionContent = ({ children, link }: SectionContentProps) => {
  return (
    <Link href={link ?? "./"} asChild>
      <Pressable className="flex-row items-center justify-between px-3 py-4 active:opacity-50">
        <Text className="text-base text-gray-800">{children}</Text>
      </Pressable>
    </Link>
  );
};

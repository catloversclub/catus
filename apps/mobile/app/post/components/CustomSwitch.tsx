import React, { useState } from "react";
import { Switch, View } from "react-native";
import colors from "@/styles/colors";

const CustomSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <View>
      <Switch
        trackColor={{
          false: colors.light.primaryDisabled,
          true: colors.light.primary,
        }}
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        ios_backgroundColor={colors.light.primaryDisabled}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default CustomSwitch;

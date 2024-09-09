import { Magnetometer } from "expo-sensors";
import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function Screen() {
  const [magnetometerValue, setMagnetometerValue] = React.useState<Number>(0);

  React.useEffect(() => {
    const listener = Magnetometer.addListener((e) =>
        setMagnetometerValue(e.x + e.y + e.z)
    );

    Magnetometer.setUpdateInterval(1);

    return () => listener.remove();
  }, []);

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Text className="text-muted-foreground">{magnetometerValue.toString()}</Text>
    </View>
  );
}

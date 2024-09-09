import { Magnetometer, type MagnetometerMeasurement } from "expo-sensors";
import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function Screen() {
  const [datas, setDatas] = React.useState<MagnetometerMeasurement[]>([]);

  React.useEffect(() => {
    const l = Magnetometer.addListener((e) =>
      setDatas((d) => [...d, e].slice(-5)),
    );

    Magnetometer.setUpdateInterval(1);

    () => l.remove();
  }, []);

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Text className="text-muted-foreground">{JSON.stringify(datas)}</Text>
    </View>
  );
}

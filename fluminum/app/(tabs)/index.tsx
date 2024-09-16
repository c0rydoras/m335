import { View } from "react-native";
import { Zap } from "lucide-react-native";
import Icon from "~/components/icon";
import { useCallback, useState } from "react";
import { Magnetometer, MagnetometerMeasurement } from "expo-sensors";
import { useFocusEffect } from "expo-router";

const foreground = "text-foreground fill-foreground";
const yellow = "text-yellow-400 fill-yellow-400";

const calculateAbsoluteMagnetometerValue = (data: MagnetometerMeasurement) =>
  Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);

export default function Screen() {
  const [absoluteMagnetometerValue, setAbsoluteMagnetometerValue] =
    useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      const listener = Magnetometer.addListener((data) => {
        setAbsoluteMagnetometerValue(calculateAbsoluteMagnetometerValue(data));
      });

      return () => {
        listener.remove();
      };
    }, []),
  );

  // NOTE: right now this doesn't actually find cables
  // TODO: this is temporary
  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Icon
        icon={Zap}
        size={200}
        className={absoluteMagnetometerValue > 200 ? yellow : foreground}
      />
    </View>
  );
}

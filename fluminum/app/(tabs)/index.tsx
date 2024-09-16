import { View } from "react-native";
import { Zap } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import Icon from "~/components/icon";
import { useCallback, useState } from "react";
import { Magnetometer, MagnetometerMeasurement } from "expo-sensors";
import { useFocusEffect } from "expo-router";
import { Badge } from "~/components/ui/badge";

const foreground = "text-foreground fill-foreground";
const yellow = "text-yellow fill-yellow";

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
    <View className="flex justify-center items-center gap-5 p-6 bg-secondary/3">
      <View className="h-[25%]">
        <Badge variant="destructive" className="rounded-md p-4">
          <Text className="text-2xl text-center">
            Es können nicht alle Stromführende Leitungen entdeckt werden!
          </Text>
        </Badge>
      </View>
      <View className="h-[75%]">
        <Icon
          icon={Zap}
          size={300}
          className={absoluteMagnetometerValue > 200 ? yellow : foreground}
        />
      </View>
    </View>
  );
}

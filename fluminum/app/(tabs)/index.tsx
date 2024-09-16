import { View } from "react-native";
import { Zap } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import Icon from "~/components/icon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Magnetometer, MagnetometerMeasurement } from "expo-sensors";
import { useFocusEffect } from "expo-router";
import { Badge } from "~/components/ui/badge";
import * as Haptics from "expo-haptics";
import { useAtomValue } from "jotai";
import { feedbackValueAtom } from "../settings";
import { Audio } from "expo-av";
import { type Sound } from "expo-av/build/Audio";

const foreground = "text-foreground fill-foreground";
const yellow = "text-yellow fill-yellow";

const calculateAbsoluteMagnetometerValue = (data: MagnetometerMeasurement) =>
  Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);

export default function Screen() {
  const [absoluteMagnetometerValue, setAbsoluteMagnetometerValue] =
    useState<number>(0);

  const feedbackValue = useAtomValue<string[]>(feedbackValueAtom);
  // const soundRef = useRef<Sound | null>(null);
  const [sound, setSound] = useState<Sound | null>(null);

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

  const foundCable = useMemo(
    () => absoluteMagnetometerValue > 200,
    [absoluteMagnetometerValue],
  );

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/geiger-sound.mp3"),
      );
      setSound(sound);
      await sound.setIsLoopingAsync(false);
      await sound.playAsync();
    };
    loadSound();

    () => {
      const unloadSound = async () => {
        await sound?.unloadAsync();
      };
      unloadSound();
    };
  }, []);

  useEffect(() => {
    sound?.playAsync();
    if (!foundCable) {
      return;
    }
    feedbackValue.includes("vibration") &&
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    feedbackValue.includes("audio") && sound?.playAsync();
  }, [foundCable]);

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
          className={foundCable ? yellow : foreground}
        />
        <Text>{sound?.toString()}</Text>
      </View>
    </View>
  );
}

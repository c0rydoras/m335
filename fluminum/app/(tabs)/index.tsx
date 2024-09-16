import { View } from "react-native";
import { Zap } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import Icon from "~/components/icon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Magnetometer, MagnetometerMeasurement } from "expo-sensors";
import { useFocusEffect } from "expo-router";
import { Badge } from "~/components/ui/badge";
import * as Haptics from "expo-haptics";
import { useAtomValue } from "jotai";
import { feedbackValueAtom } from "../settings";
import { Audio } from "expo-av";
import { type Sound } from "expo-av/build/Audio";
import {CameraView} from "expo-camera";
import * as React from "react";

const foreground = "text-foreground fill-foreground";
const yellow = "text-yellow fill-yellow";

const calculateAbsoluteMagnetometerValue = (data: MagnetometerMeasurement) =>
  Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);

export default function Screen() {
  const [absoluteMagnetometerValue, setAbsoluteMagnetometerValue] =
    useState<number>(0);

  const feedbackValue = useAtomValue<string[]>(feedbackValueAtom);
  // const soundRef = useRef<Sound | null>(null);

  const [isActive, setActive] = React.useState<boolean>(false)

  const [sound, setSound] = useState<Sound | null>(null);

  useFocusEffect(
    useCallback(() => {
      setActive(true)
      const listener = Magnetometer.addListener((data) => {
        setAbsoluteMagnetometerValue(calculateAbsoluteMagnetometerValue(data));
      });

      return () => {
        listener.remove();
        setActive(false)
      };
    }, []),
  );

 const foundCable = useMemo(
     ()=>absoluteMagnetometerValue > 200,
     [absoluteMagnetometerValue]
 )

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/geiger-sound.mp3"),
      );
      await sound.setIsLoopingAsync(true);
      setSound(sound);
    };
    loadSound();

    return () => {
      const unloadSound = async () => {
        await sound?.unloadAsync().catch(() => {});
      };
      unloadSound();
    };
  }, []);

  useEffect(() => {
    if (!foundCable||!isActive) {
      sound?.stopAsync().catch(() => {})
      return;
    }
    feedbackValue.includes("vibration") &&
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    feedbackValue.includes("audio") && sound?.playAsync().catch(() => {});
  }, [foundCable,isActive]);

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
      </View>
      {feedbackValue.includes("visual") && <CameraView enableTorch={foundCable&&isActive} />}
    </View>
  );
}

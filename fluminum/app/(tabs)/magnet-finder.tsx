import { Magnetometer } from "expo-sensors";
import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import { type Sound } from "expo-av/build/Audio";
import { CameraView } from "expo-camera";
import { useFocusEffect } from "expo-router";
import { cssInterop } from "nativewind";
import { useAtomValue } from "jotai";
import { feedbackAtom } from "../settings";

export function calcSoundRate(absoluteMagnetometerValue: number) {
  return 1 + (4 * absoluteMagnetometerValue) / 1000;
}

cssInterop(AnimatedCircularProgress, {
  className: {
    target: false,
    nativeStyleToProp: { backgroundColor: true },
  },
  tintClassName: {
    target: false,
    nativeStyleToProp: { backgroundColor: "tintColor" },
  },
});

export default function Screen() {
  const [magnetometerValue, setMagnetometerValue] = React.useState<number>(0);
  const [sound, setSound] = React.useState<Sound>();
  const [flashlightOn, setFlashlightOn] = React.useState(false);
  const { vibration, visual, audio } = useAtomValue(feedbackAtom);

  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/geiger-sound.mp3"),
    );
    setSound(sound);
    await sound.setIsLoopingAsync(true);
    await sound.playAsync();
  }

  useFocusEffect(
    React.useCallback(() => {
      if (sound === undefined) return;

      let time = 0;
      let oldSoundRate = 1;
      const listener = Magnetometer.addListener(async (measurement) => {
        const absoluteMagnetometerValue = Math.sqrt(
          measurement.x ** 2 + measurement.y ** 2 + measurement.z ** 2,
        );
        if (absoluteMagnetometerValue === 0) return;
        setMagnetometerValue(absoluteMagnetometerValue);
        if (Date.now() > time) {
          if (vibration) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
          setFlashlightOn((value) => !value);
          if (audio) {
            const newSoundRate = calcSoundRate(absoluteMagnetometerValue);
            let soundRateUpdateThreshold = Math.abs(
              newSoundRate - oldSoundRate,
            );
            if (soundRateUpdateThreshold < 0 || soundRateUpdateThreshold > 32) {
              soundRateUpdateThreshold = 1;
            }
            if (soundRateUpdateThreshold > 0.2) {
              sound.setRateAsync(newSoundRate, false);
              oldSoundRate = newSoundRate;
            }
          } else {
            sound.stopAsync().catch(() => {});
          }
          time = Date.now() + 20000 / absoluteMagnetometerValue;
        }
      });

      Magnetometer.setUpdateInterval(50);

      return () => {
        listener.remove();
        sound?.unloadAsync();
      };
    }, [sound]),
  );

  useFocusEffect(
    React.useCallback(() => {
      loadSound();
      return () => {
        setFlashlightOn(false);
      };
    }, []),
  );

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <AnimatedCircularProgress
        size={300}
        rotation={270}
        width={15}
        arcSweepAngle={180}
        fill={magnetometerValue / 10}
        className="bg-secondary"
        tintClassName="bg-yellow"
      />
      <Text className="text-primary text-6xl">{`${magnetometerValue.toFixed(2)}µT`}</Text>
      {visual && <CameraView enableTorch={flashlightOn} />}
    </View>
  );
}

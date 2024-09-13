import { Magnetometer } from "expo-sensors";
import * as React from "react";
import {View} from "react-native";
import { Text } from "~/components/ui/text";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import {Sound} from "expo-av/build/Audio";
import {CameraView} from "expo-camera";

export function calcSoundRate(absoluteMagnetometerValue:number) {
    return 1 + ((4*absoluteMagnetometerValue)/1000)
}

export default function Screen() {
  const [magnetometerValue, setMagnetometerValue] = React.useState<number>(0);
  const [sound, setSound] = React.useState<Sound>();
  const [flashlightOn, setFlashlightOn] = React.useState(false);

  async function loadSound() {
    const {sound} = await Audio.Sound.createAsync( require('../../assets/geiger-sound.mp3'));
    setSound(sound);
    await sound.setIsLoopingAsync(true);
    await sound.playAsync();
  }

  React.useEffect(() => {
    if (sound === undefined) return;

    let time = 0;
    let oldSoundRate = 1;
    const listener = Magnetometer.addListener(async (e) => {
        const absoluteMagnetometerValue = Number((Math.sqrt((e.x**2) + (e.y**2) + (e.z**2)).toFixed(2)));
        if (absoluteMagnetometerValue == 0) return;
        setMagnetometerValue(absoluteMagnetometerValue);
        if(Date.now() > time) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
            setFlashlightOn((value) => !value)

            const newSoundRate = calcSoundRate(absoluteMagnetometerValue)
            let soundRateUpdateThreshold = Math.abs((newSoundRate - oldSoundRate))
            if(soundRateUpdateThreshold < 0 || soundRateUpdateThreshold > 32) {
              soundRateUpdateThreshold = 1;
            }
            if(soundRateUpdateThreshold > 0.2) {
              sound.setRateAsync(newSoundRate, false);
              oldSoundRate = newSoundRate;
            }
            time = (Date.now() + (20000/absoluteMagnetometerValue))
        }
    });

    Magnetometer.setUpdateInterval(30);

    return () => {
      listener.remove();
      sound?.unloadAsync();
    };
  }, [sound]);

  React.useEffect(() => {
    loadSound();
  }, [])

  return (
        <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
          <AnimatedCircularProgress
              size={300}
              rotation={270}
              width={15}
              arcSweepAngle={180}
              fill={magnetometerValue/10}
              tintColor="#FFE500"
              backgroundColor="#3d5875" />
          <Text className="text-muted-foreground text-6xl">{`${magnetometerValue.toString()}µT`}</Text>
            <CameraView
                enableTorch={flashlightOn}
            />
        </View>
  );
}

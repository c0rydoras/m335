import { Magnetometer } from "expo-sensors";
import * as React from "react";
import {View} from "react-native";
import { Text } from "~/components/ui/text";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
export default function Screen() {
  const [magnetometerValue, setMagnetometerValue] = React.useState<number>(0);

  React.useEffect(() => {
    let time= 0;
    const listener = Magnetometer.addListener((e) => {
        const absoluteMagnetometerValue = Number((Math.sqrt((e.x*e.x) + (e.y*e.y) + (e.z*e.z)).toFixed(2)));
        setMagnetometerValue(absoluteMagnetometerValue);
        if(Date.now() > time) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
            time = (Date.now() + (15000/absoluteMagnetometerValue))
        }
    });

    Magnetometer.setUpdateInterval(30);

    return () => listener.remove();
  }, []);

  return (
        <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
          <AnimatedCircularProgress
              size={300}
              rotation={270}
              width={15}
              arcSweepAngle={180}
              fill={magnetometerValue/10}
              tintColor="#00e0ff"
              backgroundColor="#3d5875" />
          <Text className="text-muted-foreground">{magnetometerValue.toString()}</Text>
        </View>
  );
}

import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions } from "expo-camera";
type AngleUnit = "rad" | "deg" | "percent";

export default function Screen() {
  const [feedbackValue, setFeedbackValue] = useState<string[]>([]);
  const [angleUnit, setAngleUnit] = useState<AngleUnit>("deg");
  const [isLoading, setIsLoading] = useState(true);
  const [status, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem("feedbackValue", JSON.stringify(feedbackValue));
    }
  }, [feedbackValue, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem("angleUnit", angleUnit);
    }
  }, [angleUnit, isLoading]);

  useEffect(() => {
    AsyncStorage.getItem("feedbackValue").then((storedFeedbackValue) => {
      AsyncStorage.getItem("angleUnit").then((storedAngleUnit) => {
        storedFeedbackValue &&
          setFeedbackValue(JSON.parse(storedFeedbackValue));
        storedAngleUnit && setAngleUnit(storedAngleUnit as AngleUnit);
        setIsLoading(false);
      });
    });
  }, []);

  return (
    <View className="flex-1 items-center gap-5 p-6 bg-secondary/30">
      <Text>Winkel-Einheit</Text>
      <ToggleGroup
        onValueChange={(v) => {
          v && setAngleUnit(v as AngleUnit);
        }}
        value={angleUnit}
        type="single"
      >
        <ToggleGroupItem value="deg">
          <Text>Deg</Text>
        </ToggleGroupItem>
        <ToggleGroupItem value="rad">
          <Text>Rad</Text>
        </ToggleGroupItem>
        <ToggleGroupItem value="percent">
          <Text>Percent</Text>
        </ToggleGroupItem>
      </ToggleGroup>

      <Text>Feedback-Arten</Text>
      <ToggleGroup
        onValueChange={async (v) => {
          if (v.includes("visual")) {
            if (!status?.granted) {
              if (status?.canAskAgain) {
                const permission = await requestPermission();
                if (!permission.granted) {
                  v = v.filter((e) => e !== "visual");
                }
              } else {
                v = v.filter((e) => e !== "visual");
              }
            }
          }
          setFeedbackValue(v);
        }}
        value={feedbackValue}
        type="multiple"
      >
        <ToggleGroupItem value="vibration">
          <Text>Vibration</Text>
        </ToggleGroupItem>
        <ToggleGroupItem value="visual">
          <Text>Lampe</Text>
        </ToggleGroupItem>
        <ToggleGroupItem value="audio">
          <Text>Audio</Text>
        </ToggleGroupItem>
      </ToggleGroup>
    </View>
  );
}

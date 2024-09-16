import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useCameraPermissions } from "expo-camera";
import { AngleUnit } from "./types";
import { atomWithStorage } from "jotai/utils";
import storage from "~/lib/storage";
import { useAtom } from "jotai";

export const angleUnitAtom = atomWithStorage("angleUnit", "deg", storage);
export const feedbackValueAtom = atomWithStorage("feedbackValue", [], storage);

export default function Screen() {
  const [feedbackValue, setFeedbackValue] =
    useAtom<string[]>(feedbackValueAtom);
  const [angleUnit, setAngleUnit] = useAtom<AngleUnit>(angleUnitAtom);
  const [status, requestPermission] = useCameraPermissions();

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

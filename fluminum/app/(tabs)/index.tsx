import { View } from "react-native";
import { Zap } from "lucide-react-native";
import Icon from "~/components/icon";
import { useState } from "react";

const foreground = "text-foreground fill-foreground";
const yellow = "text-yellow-400 fill-yellow-400";

export default function Screen() {
  const [className, setClassName] = useState<typeof foreground | typeof yellow>(
    foreground,
  );

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <Icon
        onPress={() =>
          setClassName((v) => (v === yellow ? foreground : yellow))
        }
        icon={Zap}
        size={200}
        className={className}
      />
    </View>
  );
}

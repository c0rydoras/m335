import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function Screen() {
  return (
    <View className="p-6 bg-secondary/30 relative h-72 flex gap-5 m-10">
      <View className="absolute top-0 inset-x-[50%]">
        <Text>Top</Text>
      </View>
      <View className="absolute right-0 inset-y-[50%]">
        <Text>Right</Text>
      </View>
      <View className="absolute left-0 inset-y-[50%]">
        <Text>Left</Text>
      </View>
      <View className="absolute bottom-0 inset-x-[50%]">
        <Text>Bottom</Text>
      </View>
    </View>
  );
}

import * as React from "react";
import { View } from "react-native";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export type State = {
  watt: number | null;
  volt: number | null;
  ampere: number | null;
};

export const isNull = (val: unknown): val is null => val === null;
export const titelize = (str: string) =>
  str ? str[0].toUpperCase() + str.slice(1) : str;

export const calcuateMap: Record<keyof State, (state: State) => number | null> =
  {
    watt: ({ volt, ampere }) =>
      isNull(ampere) || isNull(volt) || ampere === 0 ? null : volt / ampere,
    volt: ({ watt, ampere }) =>
      isNull(watt) || isNull(ampere) ? null : watt * ampere,
    ampere: ({ watt, volt }) =>
      isNull(watt) || isNull(volt) || volt === 0 ? null : watt / volt,
  };

export default function Screen() {
  const [state, setState] = React.useState<State>({
    volt: null,
    watt: 0,
    ampere: 0,
  });

  const [selectedUnit, setSelectedUnit] = React.useState<keyof State>("volt");

  const calculatedState = React.useMemo<State>(() => {
    return { ...state, [selectedUnit]: calcuateMap[selectedUnit](state) };
  }, [state, selectedUnit]);

  const updateState = (key: keyof State) => (text: string) => {
    const val = parseFloat(text);
    setState((s) => ({
      ...s,
      [key]: isNaN(val) ? null : val,
    }));
  };

  return (
    <View className="flex-1 justify-top items-center gap-5 p-3 bg-secondary/30">
      <Select
        defaultValue={{ value: "volt", label: "Volt Berechnen" }}
        onValueChange={(option) => {
          setState((s) => ({
            ...s,
            [selectedUnit]: calculatedState[selectedUnit],
          }));
          setSelectedUnit(option?.value as keyof State);
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue
            className="text-foreground text-sm native:text-lg"
            placeholder="Wähle eine Einheit zum Berechnen aus"
          />
        </SelectTrigger>
        <SelectContent className="w-[250px]">
          <SelectGroup>
            <SelectItem label="Volt Berechnen" value="volt">
              Volt
            </SelectItem>
            <SelectItem label="Watt Berechnen" value="watt">
              Watt
            </SelectItem>
            <SelectItem label="Ampere Berechnen" value="ampere">
              Ampere
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {Object.keys(state).map((k) => (
        <View key={k} className="w-full">
          <Text className="p-1 text-2xl" nativeID={k + "-label"}>
            {titelize(k)}
          </Text>
          <Input
            className="w-full text-xl rounded-none"
            aria-labelledby={k + "-label"}
            keyboardType="numeric"
            value={calculatedState[k as keyof State]?.toString() ?? ""}
            editable={selectedUnit !== k}
            onChangeText={updateState(k as keyof State)}
          />
        </View>
      ))}
    </View>
  );
}

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

/**
 * Represents ampere, volt, watt in an object as strings.
 */
export type State = {
  watt: string;
  volt: string;
  ampere: string;
};

/**
 * State object parsed into numbers.
 */
export type ParsedState = Record<keyof State, number>;

/**
 * Uppercases the first letter of a string.
 */
export const titelize = (str: string) =>
  str ? str[0].toUpperCase() + str.slice(1) : str;

/**
 * Functions for calculating electrical units (ampere, volt and watt).
 */
export const UNIT_CALCULATION_MAP: {
  [K in keyof State]: (state: Omit<ParsedState, K>) => number;
} = {
  watt: ({ volt, ampere }) => volt * ampere,
  volt: ({ watt, ampere }) => watt / ampere,
  ampere: ({ watt, volt }) => watt / volt,
};

export default function Screen() {
  const [state, setState] = React.useState<State>({
    volt: "",
    watt: "0",
    ampere: "0",
  });

  const [selectedUnit, setSelectedUnit] = React.useState<keyof State>("volt");
  const parsedState = React.useMemo<ParsedState>(
    () =>
      Object.fromEntries(
        Object.entries(state).map(([k, v]) => [k, parseFloat(v)]),
      ) as ParsedState,
    [state],
  );

  const calculatedState = React.useMemo<ParsedState>(() => {
    return {
      ...parsedState,
      [selectedUnit]: UNIT_CALCULATION_MAP[selectedUnit](parsedState),
    };
  }, [parsedState, selectedUnit]);

  const updateState = (key: keyof State) => (text: string) => {
    setState((s) => ({
      ...s,
      [key]: text,
    }));
  };

  return (
    <View className="flex-1 justify-top items-center gap-5 p-3 bg-secondary/30">
      <Select
        defaultValue={{ value: "volt", label: "Volt Berechnen" }}
        onValueChange={(option) => {
          const calculatedValue = calculatedState[selectedUnit];
          // if the calculatedValue is NaN we set it to 0 for imporved UX
          setState((s) => ({
            ...s,
            [selectedUnit]: (isNaN(calculatedValue)
              ? 0
              : calculatedValue
            ).toString(),
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
            // show calculated value if its the selected unit else show text value
            value={
              selectedUnit === k
                ? calculatedState[k as keyof State]?.toString()
                : state[k as keyof State]
            }
            editable={selectedUnit !== k}
            onChangeText={updateState(k as keyof State)}
          />
        </View>
      ))}
    </View>
  );
}

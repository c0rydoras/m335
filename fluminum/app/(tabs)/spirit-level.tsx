import { View } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { DeviceMotion } from "expo-sensors";
import Svg, { Text, Line, Polygon } from "react-native-svg";
import { Text as UiText } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useFocusEffect } from "expo-router";
import { AngleUnit } from "../types";
import { useAtom } from "jotai";
import { angleUnitAtom } from "../settings";

export function calculatePoints(topBottomDeg: number, leftRightDeg: number) {
  const middlePoint = "50,50";
  const topY = 50 - (topBottomDeg / 90) * 50;
  const topX1 = topY;
  const topX2 = 100 - topY;
  const pointsTop = middlePoint + ` ${topX1},${topY} ${topX2},${topY}`;
  const leftX = 50 - (leftRightDeg / 90) * 50;
  const leftY1 = leftX;
  const leftY2 = 100 - leftX;
  const pointsLeft = middlePoint + ` ${leftX},${leftY1} ${leftX},${leftY2}`;
  return { pointsTop, pointsLeft };
}

export function calculateCorrectAngleUnit(
  angleUnit: AngleUnit,
  radValue: number,
) {
  if (angleUnit === "deg") {
    return (180 / Math.PI) * radValue;
  }
  if (angleUnit === "percent") {
    return Math.tan(radValue) * 100;
  }
  return radValue;
}

export default function Screen() {
  const [{ beta, gamma }, setData] = useState({
    beta: 0,
    gamma: 0,
  });

  const [angleUnit, setAngleUnit] = useAtom<AngleUnit>(angleUnitAtom);

  const betaOfset = useRef(0);
  const gammaOfset = useRef(0);

  useFocusEffect(
    useCallback(() => {
      DeviceMotion.setUpdateInterval(25);
      const listener = DeviceMotion.addListener((data) => {
        if (data && data.rotation) {
          const localData = { beta: 0, gamma: 0 };
          localData.beta = data.rotation.beta - betaOfset.current;
          localData.gamma = data.rotation.gamma - gammaOfset.current;
          setData(localData);
        }
      });

      return () => {
        listener.remove();
      };
    }, []),
  );

  const { pointsTop, pointsLeft } = useMemo(
    () => calculatePoints((180 / Math.PI) * beta, (180 / Math.PI) * gamma),
    [beta, gamma],
  );

  const { betaDisplay, gammaDisplay } = useMemo(
    () => ({
      betaDisplay: calculateCorrectAngleUnit(angleUnit, beta),
      gammaDisplay: calculateCorrectAngleUnit(angleUnit, gamma),
    }),
    [beta, gamma, angleUnit],
  );

  const angleUnitSymbols: { [key: string]: string } = {
    deg: "°",
    rad: "rad",
    percent: "%",
  };

  return (
    <View className="flex-row flex justify-center w-full">
      <View className="w-[95%] h-[90%] flex items-center justify-center flex-col">
        <Svg viewBox="0 0 100 100">
          <Polygon fill="#FFE500" points={pointsTop} />
          <Polygon fill="#FFE500" points={pointsLeft} />
          <Line stroke={"black"} x1={0} y1={0} x2={100} y2={100} />
          <Line stroke={"black"} x1={100} y1={0} x2={0} y2={100} />
          <Text textAnchor="middle" y="20" x="50" fontSize="10px">
            {betaDisplay.toFixed(2) + angleUnitSymbols[angleUnit]}
          </Text>
          <Text textAnchor="middle" y="80" x="50" fontSize="10px">
            {(-betaDisplay).toFixed(2) + angleUnitSymbols[angleUnit]}
          </Text>
          <Text textAnchor="middle" y="50" x="20" fontSize="10px">
            {gammaDisplay.toFixed(2) + angleUnitSymbols[angleUnit]}
          </Text>
          <Text textAnchor="middle" y="50" x="80" fontSize="10px">
            {(-gammaDisplay).toFixed(2) + angleUnitSymbols[angleUnit]}
          </Text>
        </Svg>
        <Button
          onPress={() => {
            betaOfset.current = beta + betaOfset.current;
            gammaOfset.current = gamma + gammaOfset.current;
          }}
          className="bottom-0 bg-[#FFE500] text-black w-2/3"
        >
          <UiText className="text-black">Referenzpunkt Setzen</UiText>
        </Button>
      </View>
    </View>
  );
}

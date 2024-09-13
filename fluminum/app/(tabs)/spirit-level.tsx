import * as React from "react";
import { View } from "react-native";
import {useEffect, useMemo, useRef, useState} from "react";
import {DeviceMotion} from "expo-sensors";
import Svg, {Text,Line, Polygon} from "react-native-svg";
import {Text as UiText} from "~/components/ui/text"
import {Button} from "~/components/ui/button";

export function calculatePoints(topBottomDeg: number, leftRightDeg: number) {
    const midlePoint = "50,50"
    const topY = 50 - topBottomDeg / 90 * 50
    const topX1 = topY
    const topX2 = 100 - topY
    const pointsTop = midlePoint + ` ${topX1},${topY} ${topX2},${topY}`
    const leftX = 50 - leftRightDeg / 90 * 50
    const leftY1 = leftX
    const leftY2 = 100 - leftX
    const pointsLeft = midlePoint + ` ${leftX},${leftY1} ${leftX},${leftY2}`
    return {pointsTop,pointsLeft}
}
export default function Screen() {
    const [{beta, gamma}, setData] = useState({
        beta: 0,
        gamma: 0,
    });

    const betaOfset = useRef(0)
    const gammaOfset = useRef(0)
    useEffect(() => {
        DeviceMotion.setUpdateInterval(25)
        console.log("hi")
        const listener = DeviceMotion.addListener(data => {
            if(data && data.rotation) {
                const localData = {beta: 0, gamma: 0};
                localData.beta = data.rotation.beta - betaOfset.current
                localData.gamma = data.rotation.gamma - gammaOfset.current
                setData(localData)
            }
        })
        return () => {
            listener.remove()
        }
    }, []);

    const {pointsTop,pointsLeft}=useMemo(() => {
        return calculatePoints(180 / Math.PI * beta, 180 / Math.PI * gamma)
    }, [beta, gamma]);


    const {betaDisplay,gammaDisplay} = useMemo(
        () => ({
            betaDisplay: (180 / Math.PI) * beta,
            gammaDisplay: (180 / Math.PI) * gamma,
        }),
        [beta,gamma],
    );

  return (
      <View className="flex-row flex justify-center w-full">

          <View className="w-[95%] h-[90%] flex items-center justify-center flex-col">
              <Svg viewBox="0 0 100 100">
                <Polygon fill="#FFE500" points={pointsTop}/>
                <Polygon fill="#FFE500" points={pointsLeft}/>
                <Line stroke={"black"} x1={0} y1={0} x2={100} y2={100}/>
                <Line stroke={"black"} x1={100} y1={0} x2={0} y2={100}/>
                  <Text textAnchor="middle" y="20" x="50">{(betaDisplay).toFixed(0) + "°"}</Text>
                  <Text textAnchor="middle" y="80" x="50">{(-(betaDisplay)).toFixed(0) + "°"}</Text>
                  <Text textAnchor="middle" y="50" x="20">{(gammaDisplay).toFixed(0) + "°"}</Text>
                  <Text textAnchor="middle" y="50"
                        x="80">{(-(gammaDisplay)).toFixed(0) + "°"}</Text>
            </Svg>
              <Button onPress={()=>{
                  betaOfset.current = beta + betaOfset.current
                  gammaOfset.current = gamma + gammaOfset.current
              }} className="bottom-0 bg-[#FFE500] text-black w-2/3">
                  <UiText className="text-black">
                      Referenzpunkt Setzen
                  </UiText>
              </Button>
        </View>
    </View>
  );
}
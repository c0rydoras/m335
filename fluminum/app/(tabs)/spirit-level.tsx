import * as React from "react";
import { View } from "react-native";
import {useEffect, useMemo, useState} from "react";
import {DeviceMotion} from "expo-sensors";
import Svg, {Text,Line, Polygon} from "react-native-svg";

export default function Screen() {
    const [{beta, gamma}, setData] = useState({
        beta: 0,
        gamma: 0,
    });
    const [{betaDisplay,gammaDisplay}, setDisplayData] = useState({
        betaDisplay: 0,
        gammaDisplay: 0,
    })

    const [pointsTop, setPointsTop] = useState("");
    const [pointsLeft, setPointsLeft] = useState("");
    useEffect(() => {
        DeviceMotion.setUpdateInterval(25)
        DeviceMotion.addListener(data => {
            if(data && data.rotation) {
                setData(data.rotation)
                const localDisplayData = {betaDisplay: 0, gammaDisplay: 0,}
                localDisplayData.betaDisplay = 180 / Math.PI * data.rotation.beta
                localDisplayData.gammaDisplay = 180 / Math.PI * data.rotation.gamma
                setDisplayData(localDisplayData)
            }
        })
        return () => {
            DeviceMotion.removeAllListeners()
        }
    }, []);

    useMemo(() => {
        calculatePoints(180 / Math.PI * beta, 180 / Math.PI * gamma)
    }, [pointsTop, pointsLeft, beta, gamma]);

    function calculatePoints(topBottomDeg: number, leftRightDeg: number) {
        const MidlePoint = "50,50"
        const topY = 50 - topBottomDeg / 90 * 50
        const topX1 = topY
        const topX2 = 100 - topY
        setPointsTop(MidlePoint + ` ${topX1},${topY} ${topX2},${topY}`)
        const leftX = 50 - leftRightDeg / 90 * 50
        const leftY1 = leftX
        const leftY2 = 100 - leftX
        setPointsLeft(MidlePoint + ` ${leftX},${leftY1} ${leftX},${leftY2}`)
    }

  return (
    <View className="relative h-72 flex gap-5 m-10">
        <View>
            <Svg viewBox="0 0 100 100">
                <Polygon fill="#FFE500" points={pointsTop}/>
                <Polygon fill="#FFE500" points={pointsLeft}/>
                <Line stroke={"black"} x1={0} y1={0} x2={100} y2={100}/>
                <Line stroke={"black"} x1={100} y1={0} x2={0} y2={100}/>
                <Text textAnchor="middle" y="25" x="50">{(betaDisplay).toFixed(0)+"°"}</Text>
                <Text textAnchor="middle" y="75" x="50">{(-(betaDisplay)).toFixed(0)+"°"}</Text>
                <Text textAnchor="middle" y="50" x="25">{(gammaDisplay).toFixed(0)+"°"}</Text>
                <Text textAnchor="middle" y="50" x="75">{(-(gammaDisplay)).toFixed(0)+"°"}</Text>
            </Svg>
        </View>
    </View>
  );
}
import { calculatePoints } from "~/app/(tabs)/spirit-level";
import { render } from "@testing-library/react-native";
import Svg, { Line, Polygon, Text } from "react-native-svg";
import * as React from "react";

describe("calculatePoints", () => {
  test("topBottomDeg 0 leftRightDeg 0", () => {
    const { pointsLeft, pointsTop } = calculatePoints(0, 0);
    expect(pointsLeft).toEqual("50,50 50,50 50,50");
    expect(pointsTop).toEqual("50,50 50,50 50,50");
  });
  test("topBottomDeg 45 leftRightDeg 0", () => {
    const { pointsLeft, pointsTop } = calculatePoints(45, 0);
    expect(pointsLeft).toEqual("50,50 50,50 50,50");
    expect(pointsTop).toEqual("50,50 25,25 75,25");
  });
  test("topBottomDeg 45 leftRightDeg 90", () => {
    const { pointsLeft, pointsTop } = calculatePoints(45, 90);
    expect(pointsLeft).toEqual("50,50 0,0 0,100");
    expect(pointsTop).toEqual("50,50 25,25 75,25");
  });
  test("topBottomDeg 0 leftRightDeg -90", () => {
    const { pointsLeft, pointsTop } = calculatePoints(0, -90);
    expect(pointsLeft).toEqual("50,50 100,100 100,0");
    expect(pointsTop).toEqual("50,50 50,50 50,50");
  });
});
describe("svgRendering", () => {
  test("svgRendering", () => {
    const tree = render(
      <Svg viewBox="0 0 100 100">
        <Polygon fill="#FFE500" points="50,50 0,0 0,100" />
        <Polygon fill="#FFE500" points="50,50 25,25 75,25" />
        <Line stroke={"black"} x1={0} y1={0} x2={100} y2={100} />
        <Line stroke={"black"} x1={100} y1={0} x2={0} y2={100} />
        <Text textAnchor="middle" y="20" x="50">
          {"90°"}
        </Text>
        <Text textAnchor="middle" y="80" x="50">
          {"-90°"}
        </Text>
        <Text textAnchor="middle" y="50" x="20">
          {"45°"}
        </Text>
        <Text textAnchor="middle" y="50" x="80">
          {"-45°"}
        </Text>
      </Svg>,
    );
    expect(tree).toMatchSnapshot();
  });
});

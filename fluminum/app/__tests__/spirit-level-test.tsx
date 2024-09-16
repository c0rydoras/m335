import { calculatePoints } from "~/app/(tabs)/spirit-level";
import { calculateCorrectAngleUnit } from "~/app/(tabs)/spirit-level";
import { render } from "@testing-library/react-native";
import Svg, { Line, Polygon, Text } from "react-native-svg";
import { AngleUnit } from "../types";

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
describe("calculate correct angle unit", () => {
  it.each([22, 100, 90, 47, 20, 100])(
    "should return the same value when calculating with rad",
    (radValue) => {
      expect(calculateCorrectAngleUnit("rad", radValue)).toEqual(radValue);
    },
  );
  it.each([
    { unit: "unit that doesnt exist", value: 22 },
    { unit: "some unfathomable unit", value: 100 },
    { unit: "asdf", value: 90 },
  ])(
    "should return the same value when calculating with non supported unit",
    (radValue) => {
      expect(
        calculateCorrectAngleUnit(radValue.unit as AngleUnit, radValue.value),
      ).toEqual(radValue.value);
    },
  );
  it.each([
    { value: Math.PI / 2, solution: 90 },
    { value: 1, solution: 57.2958 },
    { value: 3.5, solution: 200.535 },
    { value: 2 * Math.PI, solution: 360 },
    { value: 0, solution: 0 },
  ])("should correctly calculate degree when given rad", (radValue) => {
    expect(calculateCorrectAngleUnit("deg", radValue.value)).toBeCloseTo(
      radValue.solution,
    );
  });
  it.each([{ value: Math.PI / 4, solution: 100 }])(
    "should correctly calculate percent when given rad",
    (radValue) => {
      expect(calculateCorrectAngleUnit("percent", radValue.value)).toBeCloseTo(
        radValue.solution,
      );
    },
  );
});

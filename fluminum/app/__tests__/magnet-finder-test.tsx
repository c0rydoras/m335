import { calcSoundRate } from "~/app/(tabs)/magnet-finder";
test("Should be able to normalize magnetometer values below 1000 to values between 1 and 5", () => {
  const magnetometerValues = [...Array(1001).keys()].slice(1);
  const normalizedValues = magnetometerValues.map((value) =>
    calcSoundRate(value),
  );
  expect(Math.min(...normalizedValues)).toBeGreaterThanOrEqual(1);
  expect(Math.max(...normalizedValues)).toBeLessThanOrEqual(5);
});

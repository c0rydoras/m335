import { isNull, calcuateMap } from "~/app/calculator";

describe("calc volt", () => {
  test("valid values work", () => {
    expect(calcuateMap.volt({ ampere: 10, watt: 10, volt: null })).toBe(100);
  });

  test("ampere or watt with value null returns null", () => {
    expect(calcuateMap.volt({ ampere: null, watt: 10, volt: null })).toBe(null);
    expect(calcuateMap.volt({ ampere: 10, watt: null, volt: null })).toBe(null);
  });

  test("ampere/watt with value 0 returns 0", () => {
    expect(calcuateMap.volt({ ampere: 10, watt: 0, volt: null })).toBe(0);
    expect(calcuateMap.volt({ ampere: 0, watt: 10, volt: null })).toBe(0);
  });
});

describe("calc watt", () => {
  test("valid values work", () => {
    expect(calcuateMap.watt({ volt: 100, ampere: 10, watt: null })).toBe(10);
  });

  test("ampere or volt with value null returns null", () => {
    expect(calcuateMap.watt({ volt: null, ampere: 10, watt: null })).toBe(null);
    expect(calcuateMap.watt({ volt: 100, ampere: null, watt: null })).toBe(
      null,
    );
    expect(calcuateMap.watt({ volt: null, ampere: null, watt: null })).toBe(
      null,
    );
  });

  test("ampere of 0 returns null", () => {
    expect(calcuateMap.watt({ volt: 100, ampere: 0, watt: null })).toBe(null);
    expect(calcuateMap.watt({ volt: 1000, ampere: 0, watt: null })).toBe(null);
  });

  test("volt of 0 returns 0", () => {
    expect(calcuateMap.watt({ volt: 0, ampere: 100, watt: null })).toBe(0);
  });
});

describe("calc ampere", () => {
  test("valid values work", () => {
    expect(calcuateMap.ampere({ volt: 100, watt: 10, ampere: null })).toBe(0.1);
  });

  test("watt or volt with value null returns null", () => {
    expect(calcuateMap.ampere({ volt: null, watt: 10, ampere: null })).toBe(
      null,
    );
    expect(calcuateMap.ampere({ volt: 100, watt: null, ampere: null })).toBe(
      null,
    );
    expect(calcuateMap.ampere({ volt: null, watt: null, ampere: null })).toBe(
      null,
    );
  });

  test("volt of 0 returns null", () => {
    expect(calcuateMap.ampere({ watt: 100, volt: 0, ampere: null })).toBe(null);
    expect(calcuateMap.ampere({ watt: 1000, volt: 0, ampere: null })).toBe(
      null,
    );
  });

  test("watt of 0 returns 0", () => {
    expect(calcuateMap.ampere({ volt: 1000, watt: 0, ampere: null })).toBe(0);
  });
});

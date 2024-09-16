import { UNIT_CALCULATION_MAP, titelize } from "~/app/calculator";

test("titelize works", () => {
  expect(titelize("volt")).toBe("Volt");
  expect(titelize("ampere")).toBe("Ampere");
  expect(titelize("watt")).toBe("Watt");
  expect(titelize("")).toBe("");
});

test("can calculate volt", () => {
  expect(UNIT_CALCULATION_MAP.volt({ watt: 10, ampere: 10, volt: 0 })).toBe(1);
  expect(UNIT_CALCULATION_MAP.volt({ watt: 100, ampere: 10, volt: -5 })).toBe(
    10,
  );
});

test("can calculate watt", () => {
  expect(UNIT_CALCULATION_MAP.watt({ volt: 10, ampere: 10, watt: 0 })).toBe(
    100,
  );
  expect(UNIT_CALCULATION_MAP.watt({ volt: 100, ampere: 10, watt: -5 })).toBe(
    1000,
  );
});

test("can calculate ampere", () => {
  expect(UNIT_CALCULATION_MAP.ampere({ watt: 200, volt: 10, ampere: 0 })).toBe(
    20,
  );
  expect(UNIT_CALCULATION_MAP.ampere({ watt: 0, volt: 10, ampere: -5 })).toBe(
    0,
  );
});

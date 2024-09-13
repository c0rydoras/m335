import type { Config } from "jest";

const config: Config = {
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)"],
  preset: "jest-expo",
};

export default config;

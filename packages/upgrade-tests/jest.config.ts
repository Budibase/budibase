import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testTimeout: 60000, // 1 minute timeout for upgrade tests
  maxWorkers: 1, // Run tests in band to avoid serialization issues
  workerIdleMemoryLimit: "512MB",
  // Force in-band execution to avoid serialization issues
  detectOpenHandles: true,
  forceExit: true,
  setupFilesAfterEnv: ["<rootDir>/src/setup.ts"],
}

export default config

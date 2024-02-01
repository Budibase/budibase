import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

const setupFiles = [
  "__mocks__/@elastic/elasticsearch.ts",
  "__mocks__/@google-cloud/firestore.ts",
  "__mocks__/@sendgrid/mail.ts",
  "__mocks__/mysql2/promise.ts",
  "__mocks__/airtable.ts",
  "__mocks__/arangojs.ts",
  "__mocks__/aws-sdk.ts",
  "__mocks__/mongodb.ts",
  "__mocks__/mssql.ts",
  "__mocks__/mysql2.ts",
  "__mocks__/node-fetch.ts",
  "__mocks__/oracledb.ts",
  "__mocks__/pg.ts",
]

export default defineConfig({
  // @ts-ignore
  plugins: [tsconfigPaths()],
  test: {
    globalSetup: ["./src/tests/setup.ts"],
    setupFiles,
    testTimeout: process.env.CI ? 10000 : 100000, // longer locally for debugging
    globals: true,
  },
})

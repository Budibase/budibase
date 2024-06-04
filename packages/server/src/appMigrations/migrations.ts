// This file should never be manually modified, use `yarn add-app-migration` in order to add a new one

import env from "../environment"
import { AppMigration } from "."

import m20240604153647_initial_sqs from "./migrations/20240604153647_initial_sqs"

// Migrations will be executed sorted by ID
export const MIGRATIONS: AppMigration[] = []

// only run the SQS migration if SQS is enabled
if (env.SQS_SEARCH_ENABLE) {
  MIGRATIONS.push({
    id: "20240604153647_initial_sqs",
    func: m20240604153647_initial_sqs,
  })
}

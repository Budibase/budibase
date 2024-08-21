// This file should never be manually modified, use `yarn add-app-migration` in order to add a new one

import { env } from "@budibase/backend-core"
import { AppMigration } from "."

import m20240604153647_initial_sqs from "./migrations/20240604153647_initial_sqs"

// Migrations will be executed sorted by ID
export const MIGRATIONS: AppMigration[] = [
  {
    id: "20240604153647_initial_sqs",
    func: m20240604153647_initial_sqs,
    disabled: !(env.SQS_MIGRATION_ENABLE || env.SQS_SEARCH_ENABLE),
  },
]

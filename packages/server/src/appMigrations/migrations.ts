// This file should never be manually modified, use `yarn add-app-migration` in order to add a new one

import { AppMigration } from "."

import m20240604153647_initial_sqs from "./migrations/20240604153647_initial_sqs"
import m20250514133719_project_apps from "./migrations/20250514133719_project_apps"

export const MIGRATIONS: AppMigration[] = [
  // Migrations will be executed sorted by id
  {
    id: "20240604153647_initial_sqs",
    func: m20240604153647_initial_sqs
  },
  {
    id: "20250514133719_project_apps",
    func: m20250514133719_project_apps
  },
]

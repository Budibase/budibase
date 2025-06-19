// This file should never be manually modified, use `yarn add-app-migration` in order to add a new one

import { AppMigration } from "."

import m20240604153647_initial_sqs from "./migrations/20240604153647_initial_sqs"
import m20250514133719_workspace_apps from "./migrations/20250514133719_workspace_apps"
import m20250612150000_workspace_apps from "./migrations/20250612150000_workspace_apps"
import m20250619143902_add_updated_function_docs from "./migrations/20250619143902_add_updated_function_docs"

export const MIGRATIONS: AppMigration[] = [
  // Migrations will be executed sorted by id
  {
    id: "20240604153647_initial_sqs",
    func: m20240604153647_initial_sqs,
  },
  {
    id: "20250514133719_workspace_apps",
    func: m20250514133719_workspace_apps,
  },
  {
    id: "20250612150000_workspace_apps",
    func: m20250612150000_workspace_apps,
  },
  {
    id: "20250619143902_add_updated_function_docs",
    func: m20250619143902_add_updated_function_docs,
  },
]

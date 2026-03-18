// This file should never be manually modified, use `yarn add-workspace-migration` in order to add a new one

import { WorkspaceMigration } from "."

import m20240604153647_initial_sqs from "./migrations/20240604153647_initial_sqs"
import m20250618162639_workspace_apps from "./migrations/20250618162639_workspace_apps"
import m20250729134531_workspace_cleanups from "./migrations/20250729134531_workspace_cleanups"
import m20260227144312_unify_ai_configs from "./migrations/20260227144312_unify_ai_configs"

export const MIGRATIONS: WorkspaceMigration[] = [
  // Migrations will be executed sorted by id
  {
    id: "20240604153647_initial_sqs",
    func: m20240604153647_initial_sqs,
  },
  {
    id: "20250618162639_workspace_apps",
    func: m20250618162639_workspace_apps,
  },
  {
    id: "20250729134531_workspace_cleanups",
    func: m20250729134531_workspace_cleanups,
  },
  {
    id: "20260227144312_unify_ai_configs",
    func: m20260227144312_unify_ai_configs,
  },
]

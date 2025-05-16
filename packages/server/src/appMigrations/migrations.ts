// This file should never be manually modified, use `yarn add-app-migration` in order to add a new one

import { features } from "@budibase/backend-core"
import { AppMigration } from "."

import m20240604153647_initial_sqs from "./migrations/20240604153647_initial_sqs"
import m20250514133719_workspace_apps from "./migrations/20250514133719_workspace_apps"
import { FeatureFlag } from "@budibase/types"

export const MIGRATIONS: AppMigration[] = [
  // Migrations will be executed sorted by id
  {
    id: "20240604153647_initial_sqs",
    func: m20240604153647_initial_sqs,
  },
  {
    id: "m20250514133719_workspace_apps",
    func: m20250514133719_workspace_apps,
    // Disabling it, enabling it via env variables to enable development.
    // Using the existing flag system would require async checks and we could run to race conditions, so this keeps is simple
    disabled: !features
      .getEnvFlags()
      .some(f => f.key === FeatureFlag.WORKSPACE_APPS && f.value === true),
  },
]

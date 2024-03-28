// This file should never be manually modified, use `yarn add-app-migration` in order to add a new one

import { AppMigration } from "."

import m20231229122514_update_link_documents from "./migrations/20231229122514_update_link_documents"

export const MIGRATIONS: AppMigration[] = [
  // Migrations will be executed sorted by id
  {
    id: "20231229122514_update_link_documents",
    func: m20231229122514_update_link_documents
  },
]

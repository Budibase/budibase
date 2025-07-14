import * as migrationsController from "../controllers/migrations"
import { publicGroup } from "./endpointGroups"

publicGroup.get(
  "/api/migrations/status",
  migrationsController.getMigrationStatus
)

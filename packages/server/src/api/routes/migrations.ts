import * as migrationsController from "../controllers/migrations"
import { publicRoutes } from "./endpointGroups"

publicRoutes.get(
  "/api/migrations/status",
  migrationsController.getMigrationStatus
)

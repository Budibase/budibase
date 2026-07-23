import * as functionBrokerController from "../controllers/functionBroker"
import { publicRoutes } from "./endpointGroups"

publicRoutes.post(
  "/api/internal/functions/query",
  functionBrokerController.execute
)

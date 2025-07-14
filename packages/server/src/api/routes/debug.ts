import * as controller from "../controllers/debug"
import { builderGroup } from "./endpointGroups"

builderGroup.get("/api/debug/diagnostics", controller.systemDebugInfo)

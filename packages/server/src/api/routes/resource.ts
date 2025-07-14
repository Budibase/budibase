import * as controller from "../controllers/resource"
import { builderGroup } from "./endpointGroups"

builderGroup.post("/api/resources/usage", controller.searchForResourceUsage)

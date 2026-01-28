import * as controller from "../../controllers/global/github"
import { builderRoutes } from "../endpointGroups"

builderRoutes.get("/api/global/github/stars", controller.getStars)

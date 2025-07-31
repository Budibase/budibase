import * as controller from "../controllers/recaptcha"
import { publicRoutes } from "./endpointGroups"

publicRoutes.post("/api/recaptcha/verify", controller.verify)
publicRoutes.get("/api/recaptcha/check", controller.check)

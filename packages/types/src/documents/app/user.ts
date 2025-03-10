import type { User } from "../global"
import type { Row } from "./row"
import type { ContextUser } from "../../sdk"

export type UserMetadata = User & Row
export type ContextUserMetadata = ContextUser & Row

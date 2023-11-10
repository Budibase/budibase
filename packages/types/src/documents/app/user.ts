import { User } from "../global"
import { Row } from "./row"
import { ContextUser } from "../../sdk"

export type UserMetadata = User & Row
export type ContextUserMetadata = ContextUser & Row

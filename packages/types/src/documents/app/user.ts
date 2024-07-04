import { ContextUser } from "../../sdk"
import { User } from "../global"
import { Row } from "./row"

export type UserMetadata = User & Row
export type ContextUserMetadata = ContextUser & Row

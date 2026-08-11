import { nanoid } from "nanoid"

const ID_LENGTH = 9

export const generateId = (): string => nanoid(ID_LENGTH)

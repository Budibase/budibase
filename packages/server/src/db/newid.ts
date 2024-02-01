import { v4 } from "uuid"

export default function (): string {
  return v4().replace(/-/g, "")
}

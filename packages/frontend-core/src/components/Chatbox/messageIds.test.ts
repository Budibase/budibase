import { describe, expect, it } from "vitest"
import { ensureUniqueMessageIds } from "./messageIds"

describe("ensureUniqueMessageIds", () => {
  it("keeps unique ids and replaces blank or duplicate ones", () => {
    let nextId = 0
    const result = ensureUniqueMessageIds(
      [
        { id: "keep", text: "first" },
        { id: "", text: "blank" },
        { id: "keep", text: "duplicate" },
        { id: "other", text: "unique" },
        { id: "", text: "blank-again" },
      ],
      () => `id-${nextId++}`
    )

    expect(result.map(message => message.id)).toEqual([
      "keep",
      "id-0",
      "id-1",
      "other",
      "id-2",
    ])
    expect(result[0]).toEqual({ id: "keep", text: "first" })
    expect(result[3]).toEqual({ id: "other", text: "unique" })
  })
})

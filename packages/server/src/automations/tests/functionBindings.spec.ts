import type { JSONValue } from "@budibase/types"
import { processFunctionBindings } from "../functionBindings"

describe("Function input bindings", () => {
  it("preserves array values containing binding delimiters", () => {
    const items: JSONValue[] = ["}}", "{{ value }}", { value: "}}" }, ["}}"]]
    const result = processFunctionBindings({
      inputs: { items: "{{ trigger.items }}" },
      inputSchema: [{ name: "items", type: "array" }],
      context: { trigger: { items } },
    })

    expect(result).toEqual({ items })
  })
})

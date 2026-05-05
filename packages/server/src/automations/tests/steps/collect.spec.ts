import { run } from "../../steps/collect"
import { CollectStepInputs } from "@budibase/types"

describe("collect step", () => {
  it("fails when no collection is supplied", async () => {
    const result = await run({
      inputs: {
        collection: undefined,
      } as unknown as CollectStepInputs,
    })

    expect(result).toEqual({
      success: false,
    })
  })

  it("returns the supplied collection", async () => {
    const collection = [{ id: 1 }, { id: 2 }]

    const result = await run({
      inputs: {
        collection,
      } as unknown as CollectStepInputs,
    })

    expect(result).toEqual({
      success: true,
      value: collection,
    })
  })
})

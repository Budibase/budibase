import { describe, expect, it, vi } from "vitest"
import { createSaveCoordinator } from "./operationSaveCoordinator"

describe("createSaveCoordinator", () => {
  it("serializes overlapping save requests", async () => {
    let persistCount = 0
    let inFlight = 0
    let maxInFlight = 0

    const coordinator = createSaveCoordinator(async () => {
      inFlight++
      maxInFlight = Math.max(maxInFlight, inFlight)
      persistCount++
      await new Promise(resolve => setTimeout(resolve, 10))
      inFlight--
      return true
    })

    const firstSave = coordinator.save()
    await Promise.resolve()
    const secondSave = coordinator.save()

    const [firstResult, secondResult] = await Promise.all([
      firstSave,
      secondSave,
    ])

    expect(persistCount).toBe(2)
    expect(maxInFlight).toBe(1)
    expect(firstResult).toBe(true)
    expect(secondResult).toBe(true)
  })

  it("coalesces synchronous requests into a single persist", async () => {
    const persist = vi.fn(async () => true)
    const coordinator = createSaveCoordinator(persist)

    await Promise.all([
      coordinator.save(),
      coordinator.save(),
      coordinator.save(),
    ])

    expect(persist).toHaveBeenCalledTimes(1)
  })

  it("runs another persist when a request arrives during save", async () => {
    let releaseFirstSave: (() => void) | undefined
    const firstSaveGate = new Promise<void>(resolve => {
      releaseFirstSave = resolve
    })
    const persist = vi
      .fn()
      .mockImplementationOnce(async () => {
        await firstSaveGate
        return true
      })
      .mockImplementationOnce(async () => true)

    const coordinator = createSaveCoordinator(persist)
    const firstSave = coordinator.save()
    await Promise.resolve()
    coordinator.save()
    releaseFirstSave?.()

    await firstSave

    expect(persist).toHaveBeenCalledTimes(2)
  })
})

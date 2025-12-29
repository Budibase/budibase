import { describe, expect, it } from "vitest"
import { MultiFieldSelectionState } from "./multiFieldSelectState"

describe("MultiFieldSelectionState", () => {
  it("keeps selection when options disappear temporarily", () => {
    const state = new MultiFieldSelectionState(["alpha"], ["alpha", "beta"])
    expect(state.getSelection()).toEqual(["alpha"])

    state.syncFromProps(["alpha"], [])
    expect(state.getSelection()).toEqual(["alpha"])

    state.syncFromProps(["alpha"], ["alpha", "beta"])
    expect(state.getSelection()).toEqual(["alpha"])
  })

  it("filters invalid entries once options change without updating value", () => {
    const state = new MultiFieldSelectionState(["alpha"], ["alpha", "beta"])
    expect(state.getSelection()).toEqual(["alpha"])

    state.syncFromProps(["alpha"], ["beta"])
    expect(state.getSelection()).toEqual([])
  })

  it("resets selection when the prop value is cleared", () => {
    const state = new MultiFieldSelectionState(["alpha"], ["alpha"])
    state.syncFromProps([], ["alpha"])
    expect(state.getSelection()).toEqual([])
  })

  it("applies user selection and stays consistent on repeated syncs", () => {
    const state = new MultiFieldSelectionState([], ["alpha", "beta"])
    state.applyUserSelection(["beta"], ["alpha", "beta"])
    expect(state.getSelection()).toEqual(["beta"])

    state.syncFromProps(["beta"], ["alpha", "beta"])
    expect(state.getSelection()).toEqual(["beta"])

    state.applyUserSelection(["alpha", "missing"], ["alpha"])
    expect(state.getSelection()).toEqual(["alpha"])
  })
})

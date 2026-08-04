import { describe, expect, it } from "vitest"
import { navigatePromptHistory } from "./promptHistory"

describe("navigatePromptHistory", () => {
  const history = ["first", "second", "third"]

  it("starts at the newest prompt from an empty input", () => {
    expect(
      navigatePromptHistory({
        key: "ArrowUp",
        history,
        inputValue: "",
        index: undefined,
      })
    ).toEqual({ inputValue: "third", index: 2 })
  })

  it("navigates backwards and stops at the oldest prompt", () => {
    expect(
      navigatePromptHistory({
        key: "ArrowUp",
        history,
        inputValue: "second",
        index: 1,
      })
    ).toEqual({ inputValue: "first", index: 0 })
    expect(
      navigatePromptHistory({
        key: "ArrowUp",
        history,
        inputValue: "first",
        index: 0,
      })
    ).toEqual({ inputValue: "first", index: 0 })
  })

  it("navigates forwards and clears after the newest prompt", () => {
    expect(
      navigatePromptHistory({
        key: "ArrowDown",
        history,
        inputValue: "first",
        index: 0,
      })
    ).toEqual({ inputValue: "second", index: 1 })
    expect(
      navigatePromptHistory({
        key: "ArrowDown",
        history,
        inputValue: "third",
        index: 2,
      })
    ).toEqual({ inputValue: "", index: undefined })
  })

  it("leaves arrow keys alone until navigation starts", () => {
    expect(
      navigatePromptHistory({
        key: "ArrowUp",
        history,
        inputValue: "draft",
        index: undefined,
      })
    ).toBeUndefined()
    expect(
      navigatePromptHistory({
        key: "ArrowDown",
        history,
        inputValue: "",
        index: undefined,
      })
    ).toBeUndefined()
  })
})

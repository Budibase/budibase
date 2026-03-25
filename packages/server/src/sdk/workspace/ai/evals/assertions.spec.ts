import {
  evaluateResponse,
  normalizeAssertions,
  validateEvalCase,
} from "./assertions"

describe("agent eval assertions", () => {
  it("normalizes blank assertion values away", () => {
    expect(
      normalizeAssertions({
        exact: "  ",
        contains: ["  employee  ", ""],
        notContains: ["  error ", "   "],
      })
    ).toEqual({
      contains: ["employee"],
      notContains: ["error"],
    })
  })

  it("validates that a case has a prompt and at least one assertion", () => {
    expect(
      validateEvalCase({
        id: "case-1",
        name: "Case 1",
        prompt: "",
        assertions: {},
      })
    ).toEqual([
      { type: "invalid", message: "Prompt is required." },
      {
        type: "invalid",
        message:
          "At least one assertion is required. Add an exact, contains, or not-contains check.",
      },
    ])
  })

  it("compares responses case-insensitively with normalized whitespace", () => {
    expect(
      evaluateResponse({
        assertions: {
          exact: "Alice Smith Product manager",
          contains: ["Product manager"],
          notContains: ["terminated"],
        },
        response: "  Alice   Smith\nProduct Manager  ",
      })
    ).toEqual([])
  })

  it("reports failures for exact, contains, and notContains checks", () => {
    expect(
      evaluateResponse({
        assertions: {
          exact: "Alice Smith",
          contains: ["London"],
          notContains: ["Confidential"],
        },
        response: "Bob Smith works in Paris. Confidential internal note.",
      })
    ).toEqual([
      {
        type: "exact",
        message: 'Expected the response to exactly match "Alice Smith".',
      },
      {
        type: "contains",
        message: 'Expected the response to include "London".',
      },
      {
        type: "notContains",
        message: 'Expected the response to not include "Confidential".',
      },
    ])
  })
})

import { evaluateReviewer, getCaseStatus, validateTestCase } from "./reviewers"

describe("agent test reviewers", () => {
  it("validates required input and reviewers", () => {
    expect(
      validateTestCase({
        id: "case-1",
        groupId: "default",
        name: "Case 1",
        input: "",
        reviewers: [],
      })
    ).toEqual([
      { message: "Input is required." },
      { message: "At least one reviewer is required." },
    ])
  })

  it("evaluates exact match reviewers using the final response string as-is", () => {
    expect(
      evaluateReviewer({
        reviewer: {
          id: "reviewer-1",
          type: "exact_match",
          value: "Alice Smith Product manager",
        },
        response: "Alice Smith Product manager",
        toolCalls: [],
      })
    ).toMatchObject({
      reviewerId: "reviewer-1",
      type: "exact_match",
      status: "passed",
    })
  })

  it("evaluates contains text reviewers using substring search on the final response", () => {
    expect(
      evaluateReviewer({
        reviewer: {
          id: "reviewer-1",
          type: "contains_text",
          value: "Product manager",
        },
        response: "Alice Smith Product manager",
        toolCalls: [],
      })
    ).toMatchObject({
      reviewerId: "reviewer-1",
      type: "contains_text",
      status: "passed",
    })
  })

  it("evaluates tool used reviewers against the executed tool list", () => {
    expect(
      evaluateReviewer({
        reviewer: {
          id: "reviewer-1",
          type: "tool_used",
          value: "search_rows",
        },
        response: "Handled it.",
        toolCalls: ["list_tables", "search_rows"],
        toolDisplayNames: {
          search_rows: "Research Notes.search_rows",
        },
      })
    ).toMatchObject({
      reviewerId: "reviewer-1",
      type: "tool_used",
      status: "passed",
      message: 'Tool "Research Notes.search_rows" was used.',
    })
  })

  it("evaluates operation used reviewers against the selected operation", () => {
    expect(
      evaluateReviewer({
        reviewer: {
          id: "reviewer-1",
          type: "operation_used",
          value: "operation_2",
        },
        response: "Handled it.",
        toolCalls: [],
        selectedOperationId: "operation_2",
        selectedOperationName: "Operation 2",
        operationNamesById: {
          operation_2: "Operation 2",
        },
      })
    ).toMatchObject({
      reviewerId: "reviewer-1",
      type: "operation_used",
      status: "passed",
      message: 'Operation "Operation 2" was used.',
    })
  })

  it("derives case status from reviewer results", () => {
    expect(
      getCaseStatus([
        {
          reviewerId: "reviewer-1",
          type: "contains_text",
          status: "passed",
        },
      ])
    ).toBe("passed")
    expect(
      getCaseStatus([
        {
          reviewerId: "reviewer-1",
          type: "contains_text",
          status: "failed",
        },
      ])
    ).toBe("failed")
    expect(
      getCaseStatus([
        {
          reviewerId: "reviewer-1",
          type: "contains_text",
          status: "error",
        },
      ])
    ).toBe("error")
  })
})

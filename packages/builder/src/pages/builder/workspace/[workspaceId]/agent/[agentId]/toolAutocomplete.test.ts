import { getPendingToolInsertion } from "./toolAutocomplete"

describe("getPendingToolInsertion", () => {
  it.each([
    {
      name: "an empty binding",
      text: "{{}}",
      from: 2,
      to: 2,
      expected: { from: 0, to: 4, removeOnCancel: true },
    },
    {
      name: "an empty binding containing whitespace",
      text: "{{ }}",
      from: 3,
      to: 3,
      expected: { from: 0, to: 5, removeOnCancel: true },
    },
    {
      name: "a partially typed binding",
      text: "{{inventory}}",
      from: 2,
      to: 11,
      expected: { from: 0, to: 13, removeOnCancel: false },
    },
    {
      name: "repeated opening braces",
      text: "{{{{}}",
      from: 4,
      to: 4,
      expected: { from: 0, to: 6, removeOnCancel: false },
    },
    {
      name: "an empty binding within instructions",
      text: "Use {{}} next",
      from: 6,
      to: 6,
      expected: { from: 4, to: 8, removeOnCancel: true },
    },
  ])("returns the replacement range for $name", testCase => {
    expect(
      getPendingToolInsertion({
        text: testCase.text,
        from: testCase.from,
        to: testCase.to,
      })
    ).toEqual(testCase.expected)
  })
})

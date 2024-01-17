const viewTemplate = require("../viewBuilder").default

describe("viewBuilder", () => {
  describe("Filter", () => {
    it("creates a view with multiple filters and conjunctions", () => {
      expect(
        viewTemplate({
          name: "Test View",
          tableId: "14f1c4e94d6a47b682ce89d35d4c78b0",
          filters: [
            {
              value: "Test",
              condition: "EQUALS",
              key: "Name",
            },
            {
              value: "Value",
              condition: "MT",
              key: "Yes",
              conjunction: "OR",
            },
          ],
        })
      ).toMatchSnapshot()
    })
  })

  describe("Calculate", () => {
    it("creates a view with the calculation statistics schema", () => {
      expect(
        viewTemplate({
          name: "Calculate View",
          field: "myField",
          calculation: "stats",
          tableId: "14f1c4e94d6a47b682ce89d35d4c78b0",
          filters: [],
        })
      ).toMatchSnapshot()
    })
  })

  describe("Group By", () => {
    it("creates a view emitting the group by field", () => {
      expect(
        viewTemplate({
          name: "Test Scores Grouped By Age",
          tableId: "14f1c4e94d6a47b682ce89d35d4c78b0",
          groupBy: "age",
          field: "score",
          filters: [],
        })
      ).toMatchSnapshot()
    })
  })

  describe("Calculate and filter", () => {
    it("creates a view with the calculation statistics and filter schema", () => {
      expect(
        viewTemplate({
          name: "Calculate View",
          field: "myField",
          calculation: "stats",
          tableId: "14f1c4e94d6a47b682ce89d35d4c78b0",
          filters: [
            {
              value: 17,
              condition: "MT",
              key: "age",
            },
          ],
        })
      ).toMatchSnapshot()
    })
  })
})

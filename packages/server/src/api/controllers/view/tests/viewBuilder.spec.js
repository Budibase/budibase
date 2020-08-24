const viewTemplate = require("../viewBuilder");

describe("viewBuilder", () => {

  describe("Filter", () => {
    it("creates a view with multiple filters and conjunctions", () => {
      expect(viewTemplate({
        "name": "Test View",
        "modelId": "14f1c4e94d6a47b682ce89d35d4c78b0",
        "filters": [{
          "value": "Test",
          "condition": "EQUALS",
          "key": "Name"
        }, {
          "value": "Value",
          "condition": "MT",
          "key": "Yes",
          "conjunction": "OR"
        }]
      })).toMatchSnapshot()
    })
  })

  describe("Calculate", () => {
    it("creates a view with the calculation statistics schema", () => {
      expect(viewTemplate({
        "name": "Calculate View",
        "field": "myField",
        "calculation": "stats",
        "modelId": "14f1c4e94d6a47b682ce89d35d4c78b0",
        "filters": []
      })).toMatchSnapshot()
    })
  })

  describe("Group By", () => {
    it("creates a view emitting the group by field", () => {
      expect(viewTemplate({
        "name": "Test Scores Grouped By Age",
        "modelId": "14f1c4e94d6a47b682ce89d35d4c78b0",
        "groupBy": "age",
        "field": "score",
        "filters": [], 
      })).toMatchSnapshot()
    })
  })
});
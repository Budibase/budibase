const statsViewTemplate = require("../viewBuilder");

describe("viewBuilder", () => {

  describe("Filter", () => {
    it("creates a view with multiple filters and conjunctions", () => {
      expect(statsViewTemplate({
        "name": "yeety",
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

  })

  describe("Group By", () => {
    it("creates a view emitting the group by field", () => {
      expect(statsViewTemplate({
        "name": "Test Scores Grouped By Age",
        "modelId": "14f1c4e94d6a47b682ce89d35d4c78b0",
        "groupBy": "age",
        "field": "score",
        "filters": [], 
      })).toMatchSnapshot()
    })
  })
});
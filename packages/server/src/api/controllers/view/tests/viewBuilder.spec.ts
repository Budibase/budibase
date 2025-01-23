import viewTemplate from "../viewBuilder"

describe("viewBuilder", () => {
  describe("Filter", () => {
    it("creates a view with multiple filters and conjunctions", () => {
      expect(
        viewTemplate({
          field: "myField",
          tableId: "tableId",
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
      ).toEqual({
        map: `function (doc) {
      if (doc.tableId === "tableId" && (doc["Name"] === "Test" || doc["Yes"] > "Value")) {
        emit(doc["_id"], doc["myField"]);
      }
    }`,
        meta: {
          calculation: undefined,
          field: "myField",
          filters: [
            {
              condition: "EQUALS",
              key: "Name",
              value: "Test",
            },
            {
              condition: "MT",
              conjunction: "OR",
              key: "Yes",
              value: "Value",
            },
          ],
          groupBy: undefined,
          schema: null,
          tableId: "tableId",
        },
      })
    })
  })

  describe("Calculate", () => {
    it("creates a view with the calculation statistics schema", () => {
      expect(
        viewTemplate({
          field: "myField",
          calculation: "stats",
          tableId: "tableId",
          filters: [],
        })
      ).toEqual({
        map: `function (doc) {
      if ((doc.tableId === "tableId" && !(
      doc["myField"] === undefined ||
      doc["myField"] === null ||
      doc["myField"] === "" ||
      (Array.isArray(doc["myField"]) && doc["myField"].length === 0)
  )) ) {
        emit(doc["_id"], doc["myField"]);
      }
    }`,
        meta: {
          calculation: "stats",
          field: "myField",
          filters: [],
          groupBy: undefined,
          schema: {
            min: { type: "number" },
            max: { type: "number" },
            avg: { type: "number" },
            count: { type: "number" },
            sumsqr: { type: "number" },
            sum: { type: "number" },
            field: { type: "string" },
          },
          tableId: "tableId",
        },
        reduce: "_stats",
      })
    })
  })

  describe("Group By", () => {
    it("creates a view emitting the group by field", () => {
      expect(
        viewTemplate({
          tableId: "tableId",
          groupBy: "age",
          field: "score",
          filters: [],
        })
      ).toEqual({
        map: `function (doc) {
      if (doc.tableId === "tableId" ) {
        emit(doc["age"], doc["score"]);
      }
    }`,
        meta: {
          calculation: undefined,
          field: "score",
          filters: [],
          groupBy: "age",
          schema: null,
          tableId: "tableId",
        },
      })
    })
  })

  describe("Calculate and filter", () => {
    it("creates a view with the calculation statistics and filter schema", () => {
      expect(
        viewTemplate({
          field: "myField",
          calculation: "stats",
          tableId: "tableId",
          filters: [
            {
              value: 17,
              condition: "MT",
              key: "age",
            },
          ],
        })
      ).toEqual({
        map: `function (doc) {
      if ((doc.tableId === "tableId" && !(
      doc["myField"] === undefined ||
      doc["myField"] === null ||
      doc["myField"] === "" ||
      (Array.isArray(doc["myField"]) && doc["myField"].length === 0)
  )) && (doc["age"] > 17)) {
        emit(doc["_id"], doc["myField"]);
      }
    }`,
        meta: {
          calculation: "stats",
          field: "myField",
          filters: [
            {
              condition: "MT",
              key: "age",
              value: 17,
            },
          ],
          groupBy: undefined,
          schema: {
            min: { type: "number" },
            max: { type: "number" },
            avg: { type: "number" },
            count: { type: "number" },
            sumsqr: { type: "number" },
            sum: { type: "number" },
            field: { type: "string" },
          },
          tableId: "tableId",
        },
        reduce: "_stats",
      })
    })
  })
})

exports.definition = {
  name: "Row Created",
  event: "row:save",
  icon: "TableRowAddBottom",
  tagline: "Row is added to {{inputs.enriched.table.name}}",
  description: "Fired when a row is added to your database",
  stepId: "ROW_SAVED",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        tableId: {
          type: "string",
          customType: "table",
          title: "Table",
        },
      },
      required: ["tableId"],
    },
    outputs: {
      properties: {
        row: {
          type: "object",
          customType: "row",
          description: "The new row that was created",
        },
        id: {
          type: "string",
          description: "Row ID - can be used for updating",
        },
        revision: {
          type: "string",
          description: "Revision of row",
        },
      },
      required: ["row", "id"],
    },
  },
  type: "TRIGGER",
}

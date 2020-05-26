const TEST_WORKFLOW = {
    "_id": "8ebe79daf1c744c7ab204c0b964e309e",
    "_rev": "37-94ae573300721c98267cc1d18822c94d",
    "name": "Workflow",
    "type": "workflow",
    "definition": {
      "next": {
        "type": "CLIENT",
        "actionId": "SET_STATE",
        "args": {
          "path": "myPath",
          "value": "foo"
        },
        "next": {
          "type": "SERVER",
          "actionId": "SAVE_RECORD",
          "args": {
             "record": {
              "modelId": "f452a2b9c3a94251b9ea7be1e20e3b19",
              "name": "workflowRecord"
            },
            "next": {
              "type": "CLIENT",
              "actionId": "SET_STATE",
              "args": {
                "path": "myPath",
                "value": "$context.SAVE_RECORD.record.name"
              },
            }
          }
        }
      }
    }
};

describe("Workflow Orchestrator", () => {
  it("executes a workflow", () => {
  });

  it("", () => {

  });
});
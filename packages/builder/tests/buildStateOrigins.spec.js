import { buildStateOrigins } from "../src/builderStore/buildStateOrigins";

it("builds the correct stateOrigins object from a screen definition with handlers", () => {
  expect(buildStateOrigins({
    "name": "screen1",
    "description": "",
    "props": {
    "_component": "@budibase/standard-components/container",
      "className": "",
      "onClick": [
        {
          "##eventHandlerType": "Set State",
          "parameters": {
            "path": "testKey",
            "value": "value"
          }
        }
      ]
    }
  })).toEqual({
    "testKey": {
      "##eventHandlerType": "Set State",
      "parameters": {
        "path": "testKey",
        "value": "value"
      }
    }
  });
});
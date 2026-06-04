import { Screen } from "@budibase/types"
import { screens } from "../sdk/documents"

describe("screens", () => {
  describe("findInSettings", () => {
    it("should find query usage in screen onLoad actions", () => {
      const queryId = "query_123"
      const screen: Screen = {
        _id: "screen_123",
        _rev: "1-test",
        workspaceAppId: "workspaceApp_123",
        name: "Screen",
        routing: {
          route: "/screen",
          roleId: "BASIC",
        },
        props: {
          _id: "root",
          _component: "@budibase/standard-components/container",
          _children: [],
          ScreenProps: [],
          _instanceName: "",
          _styles: {},
        },
        onLoad: [
          {
            "##eventHandlerType": "Execute Query",
            id: "action_123",
            parameters: {
              key: "queryId",
              type: "query",
              value: queryId,
              persist: null,
            },
          },
        ],
      }

      expect(screens.findInSettings(screen, queryId)).toEqual([
        {
          setting: "onLoad.0.parameters.value",
          value: queryId,
        },
      ])
    })
  })
})

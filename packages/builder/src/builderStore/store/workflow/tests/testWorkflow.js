export default {
  _id: "53b6148c65d1429c987e046852d11611",
  _rev: "4-02c6659734934895812fa7be0215ee59",
  name: "Test Workflow",
  definition: {
    steps: [
      {
        id: "VFWeZcIPx",
        name: "Update UI State",
        tagline: "Update <b>{{path}}</b> to <b>{{value}}</b>",
        icon: "ri-refresh-line",
        description: "Update your User Interface with some data.",
        environment: "CLIENT",
        params: {
          path: "string",
          value: "longText",
        },
        args: {
          path: "foo",
          value: "started...",
        },
        actionId: "SET_STATE",
        type: "ACTION",
      },
      {
        id: "zJQcZUgDS",
        name: "Delay",
        icon: "ri-time-fill",
        tagline: "Delay for <b>{{time}}</b> milliseconds",
        description: "Delay the workflow until an amount of time has passed.",
        environment: "CLIENT",
        params: {
          time: "number",
        },
        args: {
          time: 3000,
        },
        actionId: "DELAY",
        type: "LOGIC",
      },
      {
        id: "3RSTO7BMB",
        name: "Update UI State",
        tagline: "Update <b>{{path}}</b> to <b>{{value}}</b>",
        icon: "ri-refresh-line",
        description: "Update your User Interface with some data.",
        environment: "CLIENT",
        params: {
          path: "string",
          value: "longText",
        },
        args: {
          path: "foo",
          value: "finished",
        },
        actionId: "SET_STATE",
        type: "ACTION",
      },
    ],
  },
  type: "workflow",
  live: true,
}

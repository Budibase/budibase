import { Screen } from "@budibase/types"

export const SAMPLE_DATA_SCREEN_NAME = "sample-data-inventory-screen"
export const ONBOARDING_WELCOME_SCREEN_NAME = "onboarding-welcome-screen"

export function createSampleDataTableScreen(workspaceAppId: string): Screen {
  return {
    showNavigation: true,
    width: "Large",
    routing: { route: "/inventory", roleId: "BASIC", homeScreen: false },
    name: SAMPLE_DATA_SCREEN_NAME,
    workspaceAppId,
    props: {
      _id: "c38f2b9f250fb4c33965ce47e12c02a80",
      _component: "@budibase/standard-components/container",
      _styles: {
        normal: {},
        hover: {},
        active: {},
        selected: {},
      },
      _children: [
        {
          _id: "cf600445f0b0048c79c0c81606b30d542",
          _component: "@budibase/standard-components/gridblock",
          _styles: {
            normal: {
              "--grid-desktop-col-start": 1,
              "--grid-desktop-col-end": 13,
              "--grid-desktop-row-start": 3,
              "--grid-desktop-row-end": 19,
            },
            hover: {},
            active: {},
            selected: {},
          },
          _instanceName: "Inventory table",
          _children: [],
          table: {
            label: "Inventory",
            tableId: "ta_bb_inventory",
            type: "table",
            datasourceName: "Sample Data",
          },
          columns: [
            {
              label: "Item Tags",
              field: "Item Tags",
              active: true,
            },
            {
              label: "Purchase Date",
              field: "Purchase Date",
              active: true,
            },
            {
              label: "Purchase Price",
              field: "Purchase Price",
              active: true,
              format:
                // eslint-disable-next-line no-template-curly-in-string
                "${{ [cf600445f0b0048c79c0c81606b30d542].[Purchase Price] }}",
            },
            {
              label: "Notes",
              field: "Notes",
              active: true,
            },
            {
              label: "Status",
              field: "Status",
              active: true,
              conditions: [
                {
                  id: Math.random(),
                  target: "row",
                  metadataKey: "backgroundColor",
                  operator: "contains",
                  valueType: "array",
                  metadataValue: "var(--spectrum-global-color-red-100)",
                  noValue: false,
                  referenceValue: "Repair",
                },
              ],
            },
            {
              label: "SKU",
              field: "SKU",
              active: true,
            },
            {
              label: "Item ID",
              field: "Item ID",
              active: true,
            },
            {
              label: "Created At",
              field: "Created At",
              active: false,
            },
            {
              label: "Updated At",
              field: "Updated At",
              active: false,
            },
            {
              label: "Item Name",
              field: "Item Name",
              active: true,
            },
          ],
          initialSortColumn: "Item ID",
          allowAddRows: false,
          allowEditRows: false,
          allowDeleteRows: false,
          stripeRows: false,
          quiet: true,
          onRowClick: [
            {
              parameters: {
                key: "inventoryID",
                type: "set",
                value: "{{ [eventContext].[row]._id }}",
              },
              "##eventHandlerType": "Update State",
              id: "fgVuxCvjL",
            },
            {
              parameters: {
                id: "c73fd03209dd44dd3937a33c6205b031d",
              },
              "##eventHandlerType": "Open Side Panel",
              id: "hwnlhdSUb",
            },
          ],
        },
        {
          _id: "c09edf7de69be44ce8f0215c3f62e43a5",
          _component: "@budibase/standard-components/textv2",
          _styles: {
            normal: {
              "--grid-desktop-col-start": 1,
              "--grid-desktop-col-end": 3,
              "--grid-desktop-row-start": 1,
              "--grid-desktop-row-end": 3,
              "--grid-mobile-col-end": 7,
            },
            hover: {},
            active: {},
          },
          _instanceName: "Table title",
          align: "left",
          text: "## Inventory",
        },
        {
          _id: "c5879d3daffbd47619a833d3f88f07526",
          _component: "@budibase/standard-components/button",
          _styles: {
            normal: {
              "--grid-desktop-col-start": 11,
              "--grid-desktop-col-end": 13,
              "--grid-desktop-row-start": 1,
              "--grid-desktop-row-end": 3,
              "--grid-desktop-h-align": "end",
              "--grid-mobile-col-start": 7,
            },
            hover: {},
            active: {},
          },
          _instanceName: "New row button",
          text: "Create row",
          type: "cta",
          size: "M",
          gap: "M",
          onClick: [
            {
              parameters: {
                id: "c34d2b7c480144f3c800be15a62111d24",
              },
              "##eventHandlerType": "Open Side Panel",
              id: "rYTWHu7k0",
            },
          ],
        },
        {
          _id: "c73fd03209dd44dd3937a33c6205b031d",
          _component: "@budibase/standard-components/sidepanel",
          _styles: {
            normal: {},
            hover: {},
            active: {},
          },
          _instanceName: "Edit row side panel",
          ignoreClicksOutside: false,
          _children: [
            {
              _id: "c3a5c8d0caf35410f8b75d6cb493ac693",
              _component: "@budibase/standard-components/formblock",
              _styles: {
                normal: {},
                hover: {},
                active: {},
              },
              _instanceName: "Edit row form block",
              dataSource: {
                label: "Inventory",
                tableId: "ta_bb_inventory",
                type: "table",
                datasourceName: "Sample Data",
                resourceId: "ta_bb_inventory",
              },
              actionType: "Update",
              buttonPosition: "bottom",
              size: "spectrum--medium",
              noRowsMessage: "We couldn't find a row to display",
              disabled: false,
              buttons: [
                {
                  text: "Save",
                  _id: "cc8c5d82717a54e68a610fe7204e25392",
                  _component: "@budibase/standard-components/button",
                  onClick: [
                    {
                      "##eventHandlerType": "Validate Form",
                      parameters: {
                        componentId: "c3a5c8d0caf35410f8b75d6cb493ac693-form",
                      },
                    },
                    {
                      "##eventHandlerType": "Save Row",
                      parameters: {
                        providerId: "c3a5c8d0caf35410f8b75d6cb493ac693-form",
                        tableId: "ta_bb_inventory",
                        confirm: null,
                      },
                    },
                    {
                      "##eventHandlerType": "Close Screen Modal",
                    },
                    {
                      "##eventHandlerType": "Close Side Panel",
                    },
                    {
                      "##eventHandlerType": "Close Modal",
                    },
                  ],
                  type: "cta",
                },
                {
                  text: "Delete",
                  _id: "cf20dbe1df3d648599932b04f7e630376",
                  _component: "@budibase/standard-components/button",
                  onClick: [
                    {
                      "##eventHandlerType": "Delete Row",
                      parameters: {
                        confirm: true,
                        tableId: "ta_bb_inventory",
                        rowId:
                          "{{ [c3a5c8d0caf35410f8b75d6cb493ac693-repeater].[_id] }}",
                        revId:
                          "{{ [c3a5c8d0caf35410f8b75d6cb493ac693-repeater].[_rev] }}",
                      },
                    },
                    {
                      "##eventHandlerType": "Close Screen Modal",
                    },
                    {
                      "##eventHandlerType": "Close Side Panel",
                    },
                    {
                      "##eventHandlerType": "Close Modal",
                    },
                  ],
                  quiet: true,
                  type: "warning",
                },
              ],
              fields: null,
              rowId: "{{ [state].[inventoryID] }}",
              title:
                "{{ [c3a5c8d0caf35410f8b75d6cb493ac693-repeater].[Item Name] }}",
            },
          ],
        },
        {
          _id: "c34d2b7c480144f3c800be15a62111d24",
          _component: "@budibase/standard-components/sidepanel",
          _styles: {
            normal: {},
            hover: {},
            active: {},
          },
          _instanceName: "New row side panel",
          ignoreClicksOutside: false,
          _children: [
            {
              _id: "c61a1690c6ba0448db504eda38f766db1",
              _component: "@budibase/standard-components/formblock",
              _styles: {
                normal: {},
                hover: {},
                active: {},
              },
              _instanceName: "New Form Block",
              dataSource: {
                label: "Inventory",
                tableId: "ta_bb_inventory",
                type: "table",
                datasourceName: "Sample Data",
                resourceId: "ta_bb_inventory",
              },
              actionType: "Create",
              buttonPosition: "bottom",
              size: "spectrum--medium",
              noRowsMessage: "We couldn't find a row to display",
              disabled: false,
              buttons: [
                {
                  text: "Save",
                  _id: "ced8cf5175b9c40aabd216f23f072a44c",
                  _component: "@budibase/standard-components/button",
                  onClick: [
                    {
                      "##eventHandlerType": "Validate Form",
                      parameters: {
                        componentId: "c61a1690c6ba0448db504eda38f766db1-form",
                      },
                    },
                    {
                      "##eventHandlerType": "Save Row",
                      parameters: {
                        providerId: "c61a1690c6ba0448db504eda38f766db1-form",
                        tableId: "ta_bb_inventory",
                        confirm: null,
                      },
                    },
                    {
                      "##eventHandlerType": "Close Screen Modal",
                    },
                    {
                      "##eventHandlerType": "Close Side Panel",
                    },
                    {
                      "##eventHandlerType": "Close Modal",
                    },
                    {
                      "##eventHandlerType": "Clear Form",
                      parameters: {
                        componentId: "c61a1690c6ba0448db504eda38f766db1-form",
                      },
                    },
                  ],
                  type: "cta",
                },
              ],
              fields: null,
              title: "Add to inventory",
            },
          ],
        },
      ],
      _instanceName: "Inventory - List",
      layout: "grid",
      direction: "column",
      hAlign: "stretch",
      vAlign: "top",
      size: "grow",
      gap: "M",
    },
  }
}

export function createOnboardingWelcomeScreen(workspaceAppId: string): Screen {
  return {
    showNavigation: false,
    width: "Large",
    routing: { route: "/", roleId: "BASIC", homeScreen: true },
    name: ONBOARDING_WELCOME_SCREEN_NAME,
    workspaceAppId,
    props: {
      _id: "c38f2b9f250fb4c33965ce47e12c02a81",
      _component: "@budibase/standard-components/container",
      _styles: {
        normal: {
          "min-height": "100vh",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          padding: "4rem",
          "background-color": "#f6f7fb",
        },
        hover: {},
        active: {},
        selected: {},
      },
      _children: [
        {
          _id: "cf600445f0b0048c79c0c81606b30d543",
          _component: "@budibase/standard-components/container",
          layout: "flex",
          direction: "column",
          hAlign: "stretch",
          vAlign: "top",
          gap: "L",
          _styles: {
            normal: {
              "background-color": "white",
              "border-radius": "1rem",
              padding: "2.5rem 3.5rem 3.5rem",
              width: "690px",
              display: "flex",
              "flex-direction": "column",
              gap: "1.5rem",
              "min-height": "900px",
              height: "fit-content",
              "border-width": "1px",
              "border-color": "#E1E1E1",
              "border-style": "solid",
            },
            hover: {},
            active: {},
            selected: {},
          },
          _instanceName: "Welcome Card",
          _children: [
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43a6",
              _component: "@budibase/standard-components/iconphosphor",
              _styles: {
                normal: {
                  color: "#111827",
                  "align-self": "flex-start",
                },
                hover: {},
                active: {},
              },
              _instanceName: "Welcome Icon",
              icon: "hand-waving",
              size: 64,
              weight: "regular",
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43a7",
              _component: "@budibase/standard-components/textv2",
              _styles: {
                normal: {},
                hover: {},
                active: {},
              },
              size: "24px",
              _instanceName: "Welcome Title",
              text: "# Welcome to Budibase, the open source app builder.",
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43a8",
              _component: "@budibase/standard-components/container",
              layout: "flex",
              direction: "column",
              gap: "M",
              _styles: {
                normal: {
                  display: "flex",
                  "flex-direction": "column",
                  gap: "1.25rem",
                  "margin-left": "8px",
                },
                hover: {},
                active: {},
                selected: {},
              },
              _instanceName: "Welcome Summary",
              _children: [
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43a8a",
                  _component: "@budibase/standard-components/container",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "flex-start",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "App Building Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43a8c",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#374151",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "App Building Icon",
                      icon: "browser",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43a8b",
                      _component: "@budibase/standard-components/textv2",
                      _styles: {
                        normal: {
                          "font-size": "1.1rem",
                          color: "#4b5563",
                          "line-height": "1.5",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "App Building Text",
                      size: "18px",
                      text: "This is the app building interface where you build interfaces such as forms and internal tools.",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43a9",
                  _component: "@budibase/standard-components/container",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "flex-start",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Automation Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43a9c",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#374151",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Automation Icon",
                      icon: "path",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43a9b",
                      _component: "@budibase/standard-components/textv2",
                      _styles: {
                        normal: {
                          "font-size": "1.1rem",
                          color: "#4b5563",
                          "line-height": "1.5",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Automation Text",
                      size: "18px",
                      text: "The automation section is for automating manual tasks.",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b0",
                  _component: "@budibase/standard-components/container",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "flex-start",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Data Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b0c",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#374151",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Data Icon",
                      icon: "database",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b0b",
                      _component: "@budibase/standard-components/textv2",
                      _styles: {
                        normal: {
                          "font-size": "1.1rem",
                          color: "#4b5563",
                          "line-height": "1.5",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Data Text",
                      size: "18px",
                      text: "Use the data section to connect data to your workflows (APIs, databases, or build your own tables).",
                    },
                  ],
                },
              ],
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43b1",
              _component: "@budibase/standard-components/textv2",
              _styles: {
                normal: {
                  "font-size": "1.25rem",
                  "font-weight": "600",
                  color: "#111827",
                },
                hover: {},
                active: {},
              },
              size: "18px",
              _instanceName: "Important Docs Title",
              text: "### Important docs to help you get started",
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43b2",
              _component: "@budibase/standard-components/container",
              layout: "flex",
              direction: "column",
              gap: "S",
              _styles: {
                normal: {
                  display: "flex",
                  "flex-direction": "column",
                  gap: "0.75rem",
                  "margin-left": "8px",
                },
                hover: {},
                active: {},
                selected: {},
              },
              _instanceName: "Docs Links",
              _children: [
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b3",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "flex-start",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "App Building 101 Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b3a",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "App Building Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b3b",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "App Building 101 Link",
                      text: "App building 101",
                      url: "https://docs.budibase.com/docs/app-building-101",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b4",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Automations 101 Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b4a",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Automations Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b4b",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "Automations 101 Link",
                      text: "Automations 101",
                      url: "https://docs.budibase.com/docs/automation-steps",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b5",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Set up SSO Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b5a",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Set up SSO Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b5b",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "Set up SSO Link",
                      text: "Set up SSO",
                      url: "https://docs.budibase.com/docs/authentication-and-sso",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b6",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Set up SMTP Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b6a",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Set up SMTP Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b6b",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "Set up SMTP Link",
                      text: "Set up SMTP",
                      url: "https://docs.budibase.com/docs/email",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
              ],
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43b7",
              _component: "@budibase/standard-components/textv2",
              _styles: {
                normal: {
                  "font-size": "1.25rem",
                  "font-weight": "600",
                  color: "#111827",
                },
                hover: {},
                active: {},
              },
              size: "18px",
              _instanceName: "Community Title",
              text: "### Join the community",
            },
            {
              _id: "c09edf7de69be44ce8f0215c3f62e43b8",
              _component: "@budibase/standard-components/container",
              layout: "flex",
              direction: "column",
              gap: "M",
              _styles: {
                normal: {
                  display: "flex",
                  "flex-direction": "column",
                  gap: "0.75rem",
                  "margin-left": "8px",
                },
                hover: {},
                active: {},
                selected: {},
              },
              _instanceName: "Community Links",
              _children: [
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43b9",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Discord Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b9a",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Discord Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43b9b",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "Discord Link",
                      text: "Discord",
                      url: "https://discord.gg/ZepTmGbtfF",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43ba",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "GitHub Discussions Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43baa",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "GitHub Discussions Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43bab",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "GitHub Discussions Link",
                      text: "Github Discussions",
                      url: "https://github.com/Budibase/budibase/discussions",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
                {
                  _id: "c09edf7de69be44ce8f0215c3f62e43bb",
                  _component: "@budibase/standard-components/container",
                  layout: "flex",
                  direction: "row",
                  gap: "M",
                  _styles: {
                    normal: {
                      display: "flex",
                      "align-items": "center",
                      gap: "1rem",
                    },
                    hover: {},
                    active: {},
                    selected: {},
                  },
                  _instanceName: "Public Roadmap Row",
                  _children: [
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43bba",
                      _component: "@budibase/standard-components/iconphosphor",
                      _styles: {
                        normal: {
                          color: "#1f2937",
                          "flex-shrink": "0",
                        },
                        hover: {},
                        active: {},
                      },
                      _instanceName: "Public Roadmap Icon",
                      icon: "square",
                      size: 28,
                      weight: "regular",
                    },
                    {
                      _id: "c09edf7de69be44ce8f0215c3f62e43bbb",
                      _component: "@budibase/standard-components/link",
                      _styles: {
                        normal: {
                          color: "#6E6E6E",
                        },
                        hover: {
                          "text-decoration": "underline",
                        },
                        active: {},
                      },
                      _instanceName: "Public Roadmap Link",
                      text: "Public roadmap",
                      url: "https://github.com/orgs/Budibase/projects/15",
                      openInNewTab: true,
                      size: "L",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          _id: "6018da5d262a4f1975c0398c51ae4cab470c",
          _component: "@budibase/standard-components/embed",
          _styles: {
            normal: {},
            hover: {},
            active: {},
            selected: {},
          },
          _instanceName: "Onboarding Background Embed",
          embed:
            "<style>\n  .main-wrapper {\n    background-color: rgb(240 238 230 / 1)\n  }\n  .grid {\n    background-color: rgb(240 238 230 / 1) !important\n  }\n</style>",
        },
      ],
      _instanceName: "Onboarding Welcome",
      layout: "grid",
      direction: "column",
      hAlign: "stretch",
      vAlign: "top",
      size: "grow",
      gap: "M",
    },
  }
}

import { Screen } from "@budibase/types"

export const SAMPLE_DATA_SCREEN_NAME = "sample-data-inventory-screen"

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

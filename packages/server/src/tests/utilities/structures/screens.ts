import { Component, Query, Screen, Table, ViewV2 } from "@budibase/types"

function heading(text: string): Component {
  return {
    _id: "c1bff24cd821e41d18c894ac77a80ef99",
    _component: "@budibase/standard-components/heading",
    _styles: {
      normal: {},
      hover: {},
      active: {},
      selected: {},
    },
    _instanceName: "Table heading",
    _children: [],
    text,
  }
}

export function createTableScreen(
  datasourceName: string,
  table: Table
): Screen {
  return {
    props: {
      _id: "cad0a0904cacd4678a2ac094e293db1a5",
      _component: "@budibase/standard-components/container",
      _styles: {
        normal: {},
        hover: {},
        active: {},
        selected: {},
      },
      _children: [
        heading("table"),
        {
          _id: "ca6304be2079147bb9933092c4f8ce6fa",
          _component: "@budibase/standard-components/gridblock",
          _styles: {
            normal: {},
            hover: {},
            active: {},
            selected: {},
          },
          _instanceName: "table - Table",
          _children: [],
          table: {
            label: table.name,
            tableId: table._id!,
            type: "table",
            datasourceName,
          },
        },
      ],
      _instanceName: "table - List",
      layout: "grid",
      direction: "column",
      hAlign: "stretch",
      vAlign: "top",
      size: "grow",
      gap: "M",
    },
    routing: {
      route: "/table",
      roleId: "ADMIN",
      homeScreen: false,
    },
    name: "screen-id",
    workspaceAppId: "workspaceAppId",
  }
}

export function createViewScreen(view: ViewV2): Screen {
  return {
    props: {
      _id: "cc359092bbd6c4e10b57827155edb7872",
      _component: "@budibase/standard-components/container",
      _styles: {
        normal: {},
        hover: {},
        active: {},
        selected: {},
      },
      _children: [
        heading("view"),
        {
          _id: "ccb4a9e3734794864b5c65b012a0bdc5a",
          _component: "@budibase/standard-components/gridblock",
          _styles: {
            normal: {},
            hover: {},
            active: {},
            selected: {},
          },
          _instanceName: "view - Table",
          _children: [],
          table: {
            ...view,
            name: view.name,
            tableId: view.tableId,
            id: view.id,
            label: view.name,
            type: "viewV2",
          },
        },
      ],
      _instanceName: "view - List",
      layout: "grid",
      direction: "column",
      hAlign: "stretch",
      vAlign: "top",
      size: "grow",
      gap: "M",
    },
    routing: {
      route: "/view",
      roleId: "ADMIN",
      homeScreen: false,
    },
    name: "view-id",
    workspaceAppId: "workspaceAppId",
  }
}

export function createQueryScreen(datasourceId: string, query: Query): Screen {
  return {
    props: {
      _id: "cc59b217aed264939a6c5249eee39cb25",
      _component: "@budibase/standard-components/container",
      _styles: {
        normal: {},
        hover: {},
        active: {},
        selected: {},
      },
      _children: [
        {
          _id: "c33a4a6e3cb5343158a08625c06b5cd7c",
          _component: "@budibase/standard-components/gridblock",
          _styles: {
            normal: {},
            hover: {},
            active: {},
          },
          _instanceName: "New Table",
          table: {
            ...query,
            label: query.name,
            _id: query._id!,
            name: query.name,
            datasourceId: datasourceId,
            type: "query",
          },
          initialSortOrder: "Ascending",
          allowAddRows: true,
          allowEditRows: true,
          allowDeleteRows: true,
          stripeRows: false,
          quiet: false,
          columns: null,
        },
      ],
      _instanceName: "Blank screen",
      layout: "grid",
      direction: "column",
      hAlign: "stretch",
      vAlign: "top",
      size: "grow",
      gap: "M",
    },
    routing: {
      route: "/query",
      roleId: "BASIC",
      homeScreen: false,
    },
    name: "screen-id",
    workspaceAppId: "workspaceAppId",
  }
}

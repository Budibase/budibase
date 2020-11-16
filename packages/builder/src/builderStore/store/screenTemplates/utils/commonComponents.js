import { Component } from "./Component"

export function linkComponent(tableName) {
  return new Component("@budibase/standard-components/link")
    .normalStyle({
      color: "#757575",
      "text-transform": "capitalize",
    })
    .hoverStyle({
      color: "#4285f4",
    })
    .text(tableName)
    .customProps({
      url: `/${tableName.toLowerCase()}`,
      openInNewTab: false,
      color: "",
      hoverColor: "",
      underline: false,
      fontSize: "",
      fontFamily: "initial",
    })
}
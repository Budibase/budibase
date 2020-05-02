module.exports = {
  "components": {
    "@budibase/standard-components/button": {
      "name": "@budibase/standard-components/button",
      "description": "an html <button />",
      "props": {
        "contentText": {
          "type": "string",
          "default": "Button"
        },
        "className": "string",
        "disabled": "bool",
        "onClick": "event",
        "background": "string",
        "color": "string",
        "border": "string",
        "padding": "string",
        "hoverColor": "string",
        "hoverBackground": "string",
        "hoverBorder": "string"
      },
      "tags": ["layout"],
      "presets": {
        "primary": {
          "contentText": "Primary Button Preset",
          "color": "papayawhip",
          "padding": "20px",
          "background": "blue"
        },
        "secondary": {
          "contentText": "Secondary Button Preset",
          "color": "rebeccapurple",
          "padding": "10px",
          "background": "#fff",
          "border": "1px solid red"
        },
        "error": {
          "contentText": "ERROR",
          "color": "red",
          "padding": "10px",
          "border": "1px solid red"
        }
      }
    },
    "@budibase/standard-components/login": {
      "name": "@budibase/standard-components/login",
      "description": "A control that accepts username, password an also handles password resets",
      "props": {
        "logo": "asset",
        "loginRedirect": "string",
        "usernameLabel": {
          "type": "string",
          "default": "Username"
        },
        "passwordLabel": {
          "type": "string",
          "default": "Password"
        },
        "loginButtonLabel": {
          "type": "string",
          "default": "Login"
        },
        "buttonClass": "string",
        "inputClass": "string"
      },
      "tags": ["login", "credentials", "password", "logon"]
    },
    "@budibase/standard-components/input": {
      "name": "@budibase/standard-components/input",
      "description": "An HTML input",
      "props": {
        "value": "string",
        "type": {
          "type": "options",
          "options": ["text", "password", "checkbox", "color", "date", "datetime-local", "email", "file", "hidden", "image", "month", "number", "radio", "range", "reset", "search", "submit", "tel", "time", "week"],
          "default": "text"
        },
        "onChange": "event",
        "className": "string"
      },
      "tags": ["form"]
    },
    "@budibase/standard-components/select": {
      "name": "@budibase/standard-components/select",
      "description": "An HTML <select> (dropdown)",
      "props": {
        "value": "string",
        "className": "string"
      }
    },
    "@budibase/standard-components/option": {
      "name": "@budibase/standard-components/option",
      "description": "An HTML <option>, to be used with <select>",
      "children": false,
      "props": {
        "value": "string",
        "text": "string"
      }
    },
    "@budibase/standard-components/text": {
      "name": "@budibase/standard-components/text",
      "description": "stylable block of text",
      "children": false,
      "props": {
        "text": "string",
        "font": "string",
        "color": "string",
        "textAlign": {
          "type": "options",
          "default": "inline",
          "options": ["left", "center", "right"]
        },
        "verticalAlign": {
          "type": "options",
          "default": "inline",
          "options": ["top", "middle", "bottom"]
        },
        "formattingTag": {
          "type": "options",
          "default": "none",
          "options": ["none", "<b> - bold", "<strong> - important", "<i> - italic", "<em> - emphasized", "<mark> - marked text", "<small> - small", "<del> - deleted", "<ins> - inserted", "<sub> - subscript", "<sup> - superscript"]
        }
      },
      "tags": ["div", "container"]
    },
    "@budibase/standard-components/link": {
      "description": "an HTML anchor <a> tag",
      "props": {
        "url": "string",
        "openInNewTab": "bool",
        "text": "string",
        "color": "string",
        "hoverColor": "string",
        "underline": "bool",
        "fontSize": "string"
      },
      "name": "@budibase/standard-components/link"
    },
    "@budibase/standard-components/image": {
      "description": "an HTML <img> tag",
      "props": {
        "url": "string",
        "className": "string",
        "description": "string",
        "height": "string",
        "width": "string"
      },
      "name": "@budibase/standard-components/image"
    },
    "@budibase/standard-components/container": {
      "name": "@budibase/standard-components/container",
      "description": "An element that contains and lays out other elements. e.g. <div>, <header> etc",
      "props": {
        "className": "string",
        "onLoad": "event",
        "type": {
          "type": "options",
          "options": ["article", "aside", "details", "div", "firgure", "figcaption", "footer", "header", "main", "mark", "nav", "paragraph", "summary"],
          "default": "div"
        },
        "backgroundColor": "string",
        "color": "string",
        "borderWidth": "string",
        "borderColor": "string",
        "borderStyle": {
          "type": "options",
          "options": ["none", "solid", "dotted", "dashed", "double", "groove", "ridge", "inset", "outset"],
          "default": "none"
        }
      },
      "container": true,
      "tags": ["div", "container", "layout"]
    },
    "@budibase/standard-components/heading": {
      "name": "@budibase/standard-components/heading",
      "description": "An HTML H1 - H6 tag",
      "props": {
        "className": "string",
        "type": {
          "type": "options",
          "default": "h1",
          "options": ["h1", "h2", "h3", "h4", "h5", "h6"]
        }
      },
      "tags": []
    },
    "@budibase/standard-components/thead": {
      "name": "@budibase/standard-components/thead",
      "description": "an HTML <thead> tab",
      "props": {
        "className": "string"
      }
    },
    "@budibase/standard-components/tbody": {
      "name": "@budibase/standard-components/tbody",
      "description": "an HTML <tbody> tab",
      "props": {
        "className": "string"
      }
    },
    "@budibase/materialdesign-components/Body1": {
      "name": "@budibase/materialdesign-components/Body1",
      "description": "Sets the font properties as Roboto Body 1",
      "props": {
        "text": "string",
        "verticalMargin": "number",
        "horizontalMargin": "number"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Body2": {
      "name": "@budibase/materialdesign-components/Body2",
      "description": "Sets the font properties as Roboto Body 2",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Select": {
      "name": "@budibase/materialdesign-components/Select",
      "description": "A material design select (aka Dropdown, aka Combobox)",
      "props": {
        "onSelect": "event",
        "value": "string",
        "width": "string",
        "variant": {
          "type": "options",
          "options": ["filled", "outlined"]
        },
        "disabled": "bool",
        "required": "bool",
        "label": "string",
        "helperText": "string",
        "persistent": "bool"
      }
    },
    "@budibase/materialdesign-components/List": {
      "name": "@budibase/materialdesign-components/List",
      "description": "A Material Design List Component.",
      "props": {
        "onSelect": "event",
        "singleSelection": "bool",
        "variant": {
          "type": "options",
          "options": ["one-line", "two-line"],
          "default": "one-line"
        }
      }
    },
    "@budibase/materialdesign-components/ListItem": {
      "name": "@budibase/materialdesign-components/ListItem",
      "description": "Use as item in a 'List' or 'Select' component",
      "props": {
        "value": "string",
        "text": "string",
        "secondaryText": "string",
        "leadingIcon": "string",
        "trailingIcon": "string",
        "selected": "bool",
        "disabled": "bool",
        "divideAfter": "bool"
      }
    },
    "@budibase/materialdesign-components/Button": {
      "name": "@budibase/materialdesign-components/Button",
      "children": false,
      "description": "A Material Design button with different variations. It renders as an anchor if href is passed to it.",
      "props": {
        "onClick": "event",
        "variant": {
          "type": "options",
          "options": ["text", "raised", "unelevated", "outlined"],
          "default": "text"
        },
        "colour": {
          "type": "options",
          "options": ["primary", "secondary"],
          "default": "primary"
        },
        "size": {
          "type": "options",
          "options": ["small", "medium", "large"],
          "default": "medium"
        },
        "href": "string",
        "icon": "string",
        "trailingIcon": "bool",
        "fullwidth": "bool",
        "text": "string",
        "disabled": "bool"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Caption": {
      "name": "@budibase/materialdesign-components/Caption",
      "description": "Sets the font properties as Roboto Caption",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Card": {
      "name": "@budibase/materialdesign-components/Card",
      "description": "A Material Card container. Accepts CardHeader, CardBody and CardFooter as possible children",
      "props": {
        "width": "string",
        "height": "string",
        "variant": {
          "type": "options",
          "options": ["standard", "outlined"],
          "default": "standard"
        }
      }
    },
    "@budibase/materialdesign-components/CardBody": {
      "name": "@budibase/materialdesign-components/CardBody",
      "description": "A Material CardBody component. Contains the main content of a Material Card component",
      "props": {
        "onClick": "event"
      }
    },
    "@budibase/materialdesign-components/CardImage": {
      "name": "@budibase/materialdesign-components/CardImage",
      "description": "An image component for the Material Card component",
      "props": {
        "displayHorizontal": "bool",
        "url": "string",
        "title": "string",
        "subtitle": "string"
      }
    },
    "@budibase/materialdesign-components/CardHeader": {
      "name": "@budibase/materialdesign-components/CardHeader",
      "description": "Displays a icon, title and subtitle above main body of the Material Card component",
      "props": {
        "title": "string",
        "subtitle": "string",
        "icon": "string"
      }
    },
    "@budibase/materialdesign-components/CardFooter": {
      "name": "@budibase/materialdesign-components/CardFooter",
      "description": "Displays buttons / icon buttons as actions for the Material Card component",
      "props": {
        "padding": "string"
      }
    },
    "@budibase/materialdesign-components/Checkbox": {
      "name": "@budibase/materialdesign-components/Checkbox",
      "description": "A Material Design checkbox. Supports aligning label before or after checkbox.",
      "props": {
        "onClick": "event",
        "id": "string",
        "label": "string",
        "disabled": "bool",
        "alignEnd": "bool",
        "indeterminate": "bool",
        "checked": "bool"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Checkboxgroup": {
      "name": "@budibase/materialdesign-components/Checkboxgroup",
      "description": "A group of material design checkboxes. Supports row and column orientation.",
      "props": {
        "onChange": "event",
        "label": "string",
        "orientation": {
          "type": "options",
          "options": ["row", "column"],
          "default": "row"
        },
        "fullwidth": "bool",
        "disabled": "bool",
        "alignEnd": "bool"
      }
    },
    "@budibase/materialdesign-components/Datatable": {
      "name": "@budibase/materialdesign-components/Datatable",
      "description": "A Material Design component to represent tabular data.",
      "props": {
        "onLoad": "event"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/DatatableHead": {
      "name": "@budibase/materialdesign-components/DatatableHead",
      "description": "Material Design <thead>.",
      "props": {}
    },
    "@budibase/materialdesign-components/DatatableCell": {
      "name": "@budibase/materialdesign-components/DatatableCell",
      "description": "Material Design <td>.",
      "props": {}
    },
    "@budibase/materialdesign-components/DatatableBody": {
      "name": "@budibase/materialdesign-components/DatatableBody",
      "description": "Material Design <tbody>.",
      "props": {}
    },
    "@budibase/materialdesign-components/DatatableRow": {
      "name": "@budibase/materialdesign-components/DatatableRow",
      "description": "Material Design <tr>.",
      "props": {}
    },
    "@budibase/materialdesign-components/DatePicker": {
      "name": "@budibase/materialdesign-components/DatePicker",
      "description": "Material Design DatePicker",
      "props": {
        "date": "string",
        "label": "string",
        "onSelect": "event"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/H1": {
      "name": "@budibase/materialdesign-components/H1",
      "description": "Sets the font properties as Roboto Headline1",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/H2": {
      "name": "@budibase/materialdesign-components/H2",
      "description": "Sets the font properties as Roboto Headline2",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/H3": {
      "name": "@budibase/materialdesign-components/H3",
      "description": "Sets the font properties as Roboto Headline3",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/H4": {
      "name": "@budibase/materialdesign-components/H4",
      "description": "Sets the font properties as Roboto Headline4",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/H5": {
      "name": "@budibase/materialdesign-components/H5",
      "description": "Sets the font properties as Roboto Headline5",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/H6": {
      "name": "@budibase/materialdesign-components/H6",
      "description": "Sets the font properties as Roboto Headline6",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/IconButton": {
      "onClick": "event",
      "disabled": "bool",
      "href": "string",
      "icon": "string",
      "size": {
        "type": "options",
        "options": ["small", "medium", "large"],
        "default": "medium"
      },
      "tags": [],
      "name": "@budibase/materialdesign-components/IconButton"
    },
    "@budibase/materialdesign-components/Label": {
      "name": "@budibase/materialdesign-components/Label",
      "description": "A simple label component that displays its text in the standard Roboto Material Design font",
      "props": {
        "bold": "bool"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Menu": {
      "name": "@budibase/materialdesign-components/Menu",
      "description": "A Material Design menu component. Anchor to other components to create a pop-out menu.",
      "props": {
        "onSelect": "event",
        "width": "string",
        "open": "bool",
        "useFixedPosition": "bool",
        "absolutePositionX": "number",
        "absolutePositionY": "number"
      }
    },
    "@budibase/materialdesign-components/Overline": {
      "name": "@budibase/materialdesign-components/Overline",
      "description": "Sets the font properties as Roboto Overline",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Radiobutton": {
      "name": "@budibase/materialdesign-components/Radiobutton",
      "description": "A Material Design radiobutton. Supports aligning label before or after radiobutton.",
      "props": {
        "onClick": "event",
        "id": "string",
        "label": "string",
        "name": "string",
        "checked": "bool",
        "disabled": "bool",
        "alignEnd": "bool"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Radiobuttongroup": {
      "name": "@budibase/materialdesign-components/Radiobuttongroup",
      "description": "A Material Design Radiobutton group. Supports row and column orientation.",
      "props": {
        "onChange": "event",
        "name": "string",
        "orientation": {
          "type": "options",
          "options": ["row", "column"],
          "default": "row"
        },
        "fullwidth": "bool",
        "alignEnd": "bool",
        "disabled": "bool"
      }
    },
    "@budibase/materialdesign-components/Sub1": {
      "name": "@budibase/materialdesign-components/Sub1",
      "description": "Sets the font properties as Roboto Subtitle1",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Sub2": {
      "name": "@budibase/materialdesign-components/Sub2",
      "description": "Sets the font properties as Roboto Subtitle2",
      "props": {
        "text": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Textfield": {
      "name": "@budibase/materialdesign-components/Textfield",
      "description": "A Material Design textfield with multiple variants. Can also be converted to a text area / multine text field.",
      "props": {
        "onChange": "event",
        "value": "string",
        "label": "string",
        "variant": {
          "type": "options",
          "options": ["standard", "outlined", "filled"],
          "default": "standard"
        },
        "disabled": "bool",
        "fullwidth": "bool",
        "colour": {
          "type": "options",
          "options": ["primary", "secondary"],
          "default": "primary"
        },
        "size": {
          "type": "options",
          "options": ["small", "medium", "large"],
          "default": "medium"
        },
        "type": {
          "type": "options",
          "options": ["text", "password"],
          "default": "text"
        },
        "required": "bool",
        "minLength": "number",
        "maxLength": "number",
        "helperText": "string",
        "errorText": "string",
        "placeholder": "string",
        "icon": "string",
        "trailingIcon": "bool",
        "textarea": "bool",
        "rows": "number",
        "cols": "number",
        "validation": "bool",
        "persistent": "bool"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Switch": {
      "name": "@budibase/materialdesign-components/Switch",
      "description": "A material design switch component",
      "props": {
        "alignEnd": "bool",
        "disabled": "bool",
        "checked": "bool",
        "label": "string",
        "id": "string"
      },
      "tags": []
    },
    "@budibase/materialdesign-components/Slider": {
      "name": "@budibase/materialdesign-components/Slider",
      "description": "A material design slider component",
      "props": {
        "variant": {
          "type": "options",
          "options": ["continuous", "discrete"],
          "default": "continuous"
        },
        "showTicks": "bool",
        "min": "number",
        "max": "number",
        "value": "number",
        "step": "number",
        "label": "string",
        "disabled": "bool"
      },
      "tags": []
    }
  },
  "templates": {
    "@budibase/standard-components/saveRecordButton": {
      "description": "Save record button",
      "component": "@budibase/standard-components/button",
      "name": "@budibase/standard-components/saveRecordButton"
    },
    "@budibase/materialdesign-components/indexDatatable": {
      "description": "Datatable based on an Index",
      "component": "@budibase/materialdesign-components/Datatable",
      "name": "@budibase/materialdesign-components/indexDatatable"
    },
    "@budibase/materialdesign-components/recordForm": {
      "description": "Form for saving a record",
      "component": "@budibase/materialdesign-components/Form",
      "name": "@budibase/materialdesign-components/recordForm"
    }
  },
  "libraryPaths": {
    "@budibase/standard-components": "./dist/index.js",
    "@budibase/materialdesign-components": "./dist/index.js"
  }
}
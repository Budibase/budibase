
export const props = {

    login: { _component:"components/login" },

    form: {
        _component: "components/form",
        formControls: [
            {
                control: {
                    _component: "components/textbox"
                },
                label:"First Name"
            },
            {
                control: {
                    _component: "components/textbox"
                },
                label:"Last Name"
            }
        ]
    },

    nav: {
        _component: "components/nav",
        navBarBackground: "red",
        navBarBorder: "1px solid maroon",
        navBarColor: "black",
        selectedItemBackground: "maroon",
        selectedItemColor: "white",
        selectedItemBorder: "green",
        itemHoverBackground: "yellow",
        itemHoverColor: "pink",
        items: [
            {
                title: "People",
                component: {
                    _component: "components/panel",
                    text:"People Panel",
                    padding: "40px",
                    border: "2px solid pink",
                    background: "mistyrose"

                }
            },
            {
                title: "Animals",
                component: {
                    _component: "components/panel",
                    text:"Animals Panel",
                    padding: "40px",
                    border: "2px solid green",
                    background: "azure"
                }
            }
        ]
    },

    table: {
        _component:"components/table",
        columns: [
            {
                title: {
                    "##bbstate":"NameColumnName",
                    "##bbsource":"store",
                    "##bbstatefallback": "Name"
                },
                value: {
                    "##bbstate":"name",
                    "##bbsource":"context"
                }
            },
            {
                title: "Address",
                value: {
                    "##bbstate":"address",
                    "##bbsource":"context"
                }
            },
            {
                title: "Status",
                value: {
                    "##bbstate":"status",
                    "##bbsource":"context"
                }
            }
        ],
        data: {
            "##bbstate":"people"
        },
        onRowClick: [
            {
                "##eventHandlerType": "Set State",
                parameters: {
                    path: "NameColumnName",
                    value: {
                        "##bbstate":"name",
                        "##bbsource":"context",
                        "##bbstatefallback": "balls to that"
                    }
                }
            }
        ],
        tableClass: "table-default",
        theadClass: "thead-default",
        tbodyClass: "tbody-default",
        trClass: "tr-default",
        thClass: "th-default"

    },

    grid: {
        _component: "components/grid",
        gridTemplateColumns: "[left] auto [center] auto [right] auto",
        gridTemplateRows: "[top] auto [middle] auto [bottom] auto",
        children : [
            {
                control: {
                    _component: "components/text",
                    value: "1",
                    background: "blue",
                    textAlign:"center",
                    color: "white"
                },
                gridColumn: "left",
                gridRow: "top"
            },
            {
                control: {
                    _component: "components/text",
                    value: "2",
                    background: "red",
                    textAlign:"center",
                    color: "white",
                    padding: "10px"
                },
                gridColumn: "center",
                gridRow: "middle"
            },
            {
                control: {
                    _component: "components/text",
                    value: "3",
                    background: "yellow",
                    textAlign:"center",
                    color: "black"
                },
                gridColumn: "right",
                gridRow: "bottom"
            }
        ]
    },

}
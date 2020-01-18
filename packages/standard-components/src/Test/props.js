
export const props = {

    divWithAFewControls : {
        _component:"components/div",
        _children: [
            {
                _component:"components/h1",
                text: "This is an <h1> component"
            },
            {
                _component:"components/text",
                value: "Label for field"
            },
            {
                _component:"components/input",
                type:"text"
            },
            {
                _component:"components/button",
                _children: [
                    {
                        _component:"components/text",
                        value:"☢"
                    },
                    {
                        _component:"components/text",
                        value:"Click Me"
                    },
                ]
            }
        ]
    },

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

    hiddenNav: {
        _component: "components/stackpanel",
        children: [
            {
                control:{
                    _component: "components/button",
                    contentText: "Peep",
                    onClick: [
                        {
                            "##eventHandlerType": "Set State",
                            parameters: {
                                path: "selected",
                                value: "People"
                            }
                        }
                    ]
                }
            },
            {
                control:{
                    _component: "components/button",
                    contentText: "Ani",
                    onClick: [
                        {
                            "##eventHandlerType": "Set State",
                            parameters: {
                                path: "selected",
                                value: "Animals"
                            }
                        }
                    ]
                }
            },
            {
                control: {
                    _component: "components/nav",
                    hideNavBar: true,
                    selectedItem: {
                        "##bbstate":"selected",
                        "##bbsource":"store",
                        "##bbstatefallback": "Animals"
                    },
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
                }
            }
        ]
    }

}
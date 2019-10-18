const buttons = () => [
    {
        name: "common/Primary Button",
        description: "Bootstrap primary button ",
        inherits: "@budibase/standard-components/button",
        props: {
            className: "btn btn-primary"
        }
    },
    {
        name: "common/Default Button",
        description: "Bootstrap default button",
        inherits: "@budibase/standard-components/button",
        props: {
            className: "btn btn-light"
        }
    }
];

const forms = ({records, indexes, helpers}) => 
    [
        ...records.map(root),
        ...buttons()
    ];

const formName = record =>  `${record.name}/${record.name} Form`;

const root = record => ({
    name: formName(record),
    description: `Control for creating/updating '${record.nodeKey()}' `,
    inherits: "@budibase/standard-components/div",
    props: {
        className:"p-1",
        children: [
            {
                component: {
                    _component: "@budibase/standard-components/h3",
                    text: `Edit ${record.name}`,
                }
            },
            form(record),
            saveCancelButtons(record)
        ]
    }
}); 

const form = record => ({
    component: {
        _component: "@budibase/standard-components/form",
        formControls: 
            record.fields.map(f => formControl(record, f))
    }
});

const formControl = (record, field) => {
    if(field.type === "string" && field.typeOptions.values && field.typeOptions.values.length > 0) {
        return ({
            control: {
                _component: "@budibase/standard-components/select",
                options: field.typeOptions.values.map(v => ({id:v, value:v})),
                value: {
                    "##bbstate":`${record.name}.${field.name}`,
                    "##bbsource":"store"
                },
                className: "form-control"
            },
            label: field.label
        });
    } else {
        return ({
            control: {
                _component: "@budibase/standard-components/input",
                value: {
                    "##bbstate":`${record.name}.${field.name}`,
                    "##bbsource":"store"
                },
                className: "form-control",
                type: field.type === "string" ? "text"
                    : field.type === "datetime" ? "date"
                    : field.type === "number" ? "number"
                    : "text"
            },
            label: field.label
        });
    }
};

const saveCancelButtons = (record) => ({
    component: {
        _component: "@budibase/standard-components/stackpanel",
        direction: "horizontal",
        children: [
            paddedPanelForButton({
                _component: "common/Primary Button",
                contentText: `Save ${record.name}`,
                onClick: [                
                    {
                        "##eventHandlerType": "Save Record",
                        parameters: {
                            statePath: `${record.name}`,
                        }
                    },
                    {
                        "##eventHandlerType": "Set State",
                        parameters: {
                            path: `isEditing${record.name}`,
                            value: ""
                        }
                    }
                ]
            }),
            paddedPanelForButton({
                _component: "common/Default Button",
                contentText: `Cancel`,
                onClick: [
                    {
                        "##eventHandlerType": "Set State",
                        parameters: {
                            path: `isEditing${record.name}`,
                            value: ""
                        }
                    }
                ]
            })
        ]
    }
});

const paddedPanelForButton = (button) => ({
    control: {
        _component: "@budibase/standard-components/div",
        className: "btn-group",
        children: [
            {
                component: button
            }
        ]
    }
});

const getRecordPath = (record) => {

    const parts = [];

    return parts.reverse().join("/");
};

const indexTables = ({indexes, helpers}) => 
    indexes.map(i => indexTable(i, helpers));

const excludedColumns = ["id", "isNew", "key", "type", "sortKey"];

const indexTableProps = (index, helpers) => ({
    data: {
        "##bbstate":index.nodeKey(),
        "##bbsource":"store"
    },
    tableClass: "table table-hover",
    theadClass: "thead-dark",
    columns: helpers
                .indexSchema(index)
                .filter(c => !excludedColumns.includes(c.name))
                .map(column),
    onRowClick: [
        {
            "##eventHandlerType": "Load Record",
            parameters: {
                recordKey: {
                    "##bbstate": "key",
                    "##bbsource": "context"
                },
                statePath: {
                    "##bbstate": "type",
                    "##bbsource": "context"
                }
            },
            "##eventHandlerType": "Set State",
            parameters: {
                path: "currentView",
                value: {
                    "##bbstate": "type",
                    "##bbsource": "context"
                }
            },
        }
    ]
});

const getIndexTableName = (index, record) => {
    record = record 
             || index.parent().type === "record" ? index.parent() : null;
    
    return (record
            ? `${getRecordPath()}/${index.name} Table`
            : `${index.name} Table`);
};

const indexTable = (index, helpers) => ({
    name: getIndexTableName(index),
    inherits: "@budibase/standard-components/table",
    props: indexTableProps(index, helpers)
});

const column = (col) => ({
    title: col.name,
    value: {
        "##bbstate": col.name,
        "##bbsource":"context"
    }
});

const recordHomePageComponents = ({indexes, records, helpers}) => 
    [   
        ...recordHomepages({indexes, records})
          .map(component),

        ...recordHomepages({indexes, records})
            .map(homePageButtons),
        
        ...indexTables({indexes, records, helpers}),

        ...buttons()
    ];


const findIndexForRecord = (indexes, record) => {
    const forRecord = indexes.filter(i => i.allowedRecordNodeIds.includes(record.nodeId));
    if(forRecord.length === 0) return;
    if(forRecord.length === 1) return forRecord[0];
    const noMap = forRecord.filter(i => !i.filter || !i.filter.trim());
    if(noMap.length === 0) forRecord[0];
    return noMap[0];
};

const recordHomepages = ({indexes, records}) => 
    records.filter(r => r.parent().type === "root")
        .map(r =>({
            record:r, 
            index:findIndexForRecord(indexes, r)
        }))
        .filter(r => r.index);


const  homepageComponentName = (record) => 
    `${record.name}/${record.name} homepage`;

const component = ({record, index}) => ({
    inherits: "@budibase/standard-components/div",
    name: homepageComponentName(record),
    props: {
        className: "p-3",
        children: [
            {
                component: {
                    _component: "@budibase/standard-components/h2",
                    text: record.collectionName
                }
            },
            {
                component: {
                    _component: `${record.name}/homepage buttons`,
                }
            },
            {
                component: {
                    _component: getIndexTableName(index)
                }
            }
        ],
        onLoad: [
            {
                "##eventHandlerType": "Set State",
                parameters: {
                    path: `isEditing${record.name}`,
                    value: ""
                }
            },
            {
                "##eventHandlerType": "List Records",
                parameters: {
                    statePath: index.nodeKey(),
                    indexKey: index.nodeKey()
                }
            }
        ]
    }

});

const homePageButtons = ({index, record}) => ({
    inherits: "@budibase/standard-components/div",
    name: `${record.name}/homepage buttons`,
    props: {
        className: "btn-group",
        children: [
            {
                component: {
                    _component: "common/Default Button",
                    contentText: `Create ${record.name}`,
                    onClick: [
                        {
                            "##eventHandlerType": "Get New Record",
                            parameters: {
                                statePath: record.name,
                                collectionKey: `/${record.collectionName}`,
                                childRecordType: record.name
                            }
                        }, 
                        {
                            "##eventHandlerType": "Set State",
                            parameters: {
                                path: `isEditing${record.name}`,
                                value: "true"
                            }
                        }
                    ]
                }
            },
            {
                component: {
                    _component: "common/Default Button",
                    contentText: `Refresh`,
                    onClick: [
                        {
                            "##eventHandlerType": "List Records",
                            parameters: {
                                statePath: index.nodeKey(),
                                indexKey: index.nodeKey()
                            }
                        }
                    ]
                }
            }
        ]
    }
});

const selectNavContent = ({indexes, records, helpers}) => 
    [
        ...recordHomepages({indexes, records})
            .map(component$1),

        ...recordHomePageComponents({indexes, records, helpers}),

        ...forms({indexes, records, helpers})

    ];


const navContentComponentName = record =>
    `${record.name}/${record.name} Nav Content`;

const component$1 = ({record, index}) => ({
    inherits: "@budibase/standard-components/if",
    description: `the component that gets displayed when the ${record.collectionName} nav is selected`,
    name: navContentComponentName(record),
    props: {
        condition: `$store.isEditing${record.name}`,
        thenComponent: {
            _component: formName(record)
        },
        elseComponent: {
            _component: homepageComponentName(record)
        }
    }
});

const app = ({records, indexes, helpers}) => [
    {
        name: "Application Root",
        inherits: "@budibase/bootstrap-components/nav",
        props: {
            items: recordHomepages({indexes, records})
                    .map(navItem),
            orientation: "horizontal",
            alignment: "start",
            fill: false,
            pills: true,
            selectedItem: {
                "##bbstate":"selectedNav",
                "##bbstatefallback":`${records[0].name}`,
                "##bbsource": "store"
            }
        }
    },
    {
        name: "Login",
        inherits: "@budibase/standard-components/login",
        props: {}
    },
    ...selectNavContent({records, indexes, helpers})
];


const navItem = ({record}) => ({
    title: record.collectionName,
    component : {
        _component: navContentComponentName(record)
    }
});

export { app, forms, indexTables, recordHomePageComponents as recordHomepages };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9ycy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2dlbmVyYXRvcnMvYnV0dG9uR2VuZXJhdG9ycy5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2Zvcm1zR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvZ2V0UmVjb3JkUGF0aC5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2luZGV4VGFibGVzR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvcmVjb3JkSG9tZVBhZ2VHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9zZWxlY3RlZE5hdkNvbnRlbnRHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9hcHBHZW5lcmF0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGJ1dHRvbnMgPSAoKSA9PiBbXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogXCJjb21tb24vUHJpbWFyeSBCdXR0b25cIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJCb290c3RyYXAgcHJpbWFyeSBidXR0b24gXCIsXHJcbiAgICAgICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvYnV0dG9uXCIsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcImNvbW1vbi9EZWZhdWx0IEJ1dHRvblwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkJvb3RzdHJhcCBkZWZhdWx0IGJ1dHRvblwiLFxyXG4gICAgICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvblwiLFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4gYnRuLWxpZ2h0XCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbl0iLCJpbXBvcnQge2J1dHRvbnN9IGZyb20gXCIuL2J1dHRvbkdlbmVyYXRvcnNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBmb3JtcyA9ICh7cmVjb3JkcywgaW5kZXhlcywgaGVscGVyc30pID0+IFxyXG4gICAgW1xyXG4gICAgICAgIC4uLnJlY29yZHMubWFwKHJvb3QpLFxyXG4gICAgICAgIC4uLmJ1dHRvbnMoe3JlY29yZHMsIGluZGV4ZXMsIGhlbHBlcnN9KVxyXG4gICAgXTtcclxuXHJcbmV4cG9ydCBjb25zdCBmb3JtTmFtZSA9IHJlY29yZCA9PiAgYCR7cmVjb3JkLm5hbWV9LyR7cmVjb3JkLm5hbWV9IEZvcm1gO1xyXG5cclxuY29uc3Qgcm9vdCA9IHJlY29yZCA9PiAoe1xyXG4gICAgbmFtZTogZm9ybU5hbWUocmVjb3JkKSxcclxuICAgIGRlc2NyaXB0aW9uOiBgQ29udHJvbCBmb3IgY3JlYXRpbmcvdXBkYXRpbmcgJyR7cmVjb3JkLm5vZGVLZXkoKX0nIGAsXHJcbiAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9kaXZcIixcclxuICAgIHByb3BzOiB7XHJcbiAgICAgICAgY2xhc3NOYW1lOlwicC0xXCIsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9oM1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGBFZGl0ICR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybShyZWNvcmQpLFxyXG4gICAgICAgICAgICBzYXZlQ2FuY2VsQnV0dG9ucyhyZWNvcmQpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG59KSBcclxuXHJcbmNvbnN0IGZvcm0gPSByZWNvcmQgPT4gKHtcclxuICAgIGNvbXBvbmVudDoge1xyXG4gICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvZm9ybVwiLFxyXG4gICAgICAgIGZvcm1Db250cm9sczogXHJcbiAgICAgICAgICAgIHJlY29yZC5maWVsZHMubWFwKGYgPT4gZm9ybUNvbnRyb2wocmVjb3JkLCBmKSlcclxuICAgIH1cclxufSlcclxuXHJcbmNvbnN0IGZvcm1Db250cm9sID0gKHJlY29yZCwgZmllbGQpID0+IHtcclxuICAgIGlmKGZpZWxkLnR5cGUgPT09IFwic3RyaW5nXCIgJiYgZmllbGQudHlwZU9wdGlvbnMudmFsdWVzICYmIGZpZWxkLnR5cGVPcHRpb25zLnZhbHVlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuICh7XHJcbiAgICAgICAgICAgIGNvbnRyb2w6IHtcclxuICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvc2VsZWN0XCIsXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBmaWVsZC50eXBlT3B0aW9ucy52YWx1ZXMubWFwKHYgPT4gKHtpZDp2LCB2YWx1ZTp2fSkpLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIiMjYmJzdGF0ZVwiOmAke3JlY29yZC5uYW1lfS4ke2ZpZWxkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICBcIiMjYmJzb3VyY2VcIjpcInN0b3JlXCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGFiZWw6IGZpZWxkLmxhYmVsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoe1xyXG4gICAgICAgICAgICBjb250cm9sOiB7XHJcbiAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2lucHV0XCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiIyNiYnN0YXRlXCI6YCR7cmVjb3JkLm5hbWV9LiR7ZmllbGQubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIyNiYnNvdXJjZVwiOlwic3RvcmVcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIixcclxuICAgICAgICAgICAgICAgIHR5cGU6IGZpZWxkLnR5cGUgPT09IFwic3RyaW5nXCIgPyBcInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgIDogZmllbGQudHlwZSA9PT0gXCJkYXRldGltZVwiID8gXCJkYXRlXCJcclxuICAgICAgICAgICAgICAgICAgICA6IGZpZWxkLnR5cGUgPT09IFwibnVtYmVyXCIgPyBcIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgOiBcInRleHRcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsYWJlbDogZmllbGQubGFiZWxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2F2ZUNhbmNlbEJ1dHRvbnMgPSAocmVjb3JkKSA9PiAoe1xyXG4gICAgY29tcG9uZW50OiB7XHJcbiAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9zdGFja3BhbmVsXCIsXHJcbiAgICAgICAgZGlyZWN0aW9uOiBcImhvcml6b250YWxcIixcclxuICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICBwYWRkZWRQYW5lbEZvckJ1dHRvbih7XHJcbiAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcImNvbW1vbi9QcmltYXJ5IEJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFRleHQ6IGBTYXZlICR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IFsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNhdmUgUmVjb3JkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlUGF0aDogYCR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNldCBTdGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBgaXNFZGl0aW5nJHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHBhZGRlZFBhbmVsRm9yQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL0RlZmF1bHQgQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VGV4dDogYENhbmNlbGAsXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNldCBTdGF0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBgaXNFZGl0aW5nJHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdXHJcbiAgICB9XHJcbn0pXHJcblxyXG5jb25zdCBwYWRkZWRQYW5lbEZvckJ1dHRvbiA9IChidXR0b24pID0+ICh7XHJcbiAgICBjb250cm9sOiB7XHJcbiAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9kaXZcIixcclxuICAgICAgICBjbGFzc05hbWU6IFwiYnRuLWdyb3VwXCIsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiBidXR0b25cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxufSk7XHJcblxyXG4iLCJleHBvcnQgY29uc3QgZ2V0UmVjb3JkUGF0aCA9IChyZWNvcmQpID0+IHtcclxuXHJcbiAgICBjb25zdCBwYXJ0cyA9IFtdO1xyXG5cclxuICAgIGNvbnN0IGFkZCA9IChjdXJyZW50KSA9PiB7XHJcbiAgICAgICAgcGFydHMucHVzaChjdXJyZW50Lm5hbWUpO1xyXG4gICAgICAgIGlmKGN1cnJlbnQucGFyZW50KCkudHlwZSA9PT0gXCJyb290XCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYWRkKGN1cnJlbnQucGFyZW50KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJ0cy5yZXZlcnNlKCkuam9pbihcIi9cIik7XHJcbn0iLCJpbXBvcnQgeyBnZXRSZWNvcmRQYXRoIH0gZnJvbSBcIi4vZ2V0UmVjb3JkUGF0aFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluZGV4VGFibGVzID0gKHtpbmRleGVzLCBoZWxwZXJzfSkgPT4gXHJcbiAgICBpbmRleGVzLm1hcChpID0+IGluZGV4VGFibGUoaSwgaGVscGVycykpO1xyXG5cclxuY29uc3QgZXhjbHVkZWRDb2x1bW5zID0gW1wiaWRcIiwgXCJpc05ld1wiLCBcImtleVwiLCBcInR5cGVcIiwgXCJzb3J0S2V5XCJdO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluZGV4VGFibGVQcm9wcyA9IChpbmRleCwgaGVscGVycykgPT4gKHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBcIiMjYmJzdGF0ZVwiOmluZGV4Lm5vZGVLZXkoKSxcclxuICAgICAgICBcIiMjYmJzb3VyY2VcIjpcInN0b3JlXCJcclxuICAgIH0sXHJcbiAgICB0YWJsZUNsYXNzOiBcInRhYmxlIHRhYmxlLWhvdmVyXCIsXHJcbiAgICB0aGVhZENsYXNzOiBcInRoZWFkLWRhcmtcIixcclxuICAgIGNvbHVtbnM6IGhlbHBlcnNcclxuICAgICAgICAgICAgICAgIC5pbmRleFNjaGVtYShpbmRleClcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoYyA9PiAhZXhjbHVkZWRDb2x1bW5zLmluY2x1ZGVzKGMubmFtZSkpXHJcbiAgICAgICAgICAgICAgICAubWFwKGNvbHVtbiksXHJcbiAgICBvblJvd0NsaWNrOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkxvYWQgUmVjb3JkXCIsXHJcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICAgIHJlY29yZEtleToge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiIyNiYnN0YXRlXCI6IFwia2V5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIjI2Jic291cmNlXCI6IFwiY29udGV4dFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc3RhdGVQYXRoOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCIjI2Jic3RhdGVcIjogXCJ0eXBlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIjI2Jic291cmNlXCI6IFwiY29udGV4dFwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXHJcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICAgIHBhdGg6IFwiY3VycmVudFZpZXdcIixcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCIjI2Jic3RhdGVcIjogXCJ0eXBlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCIjI2Jic291cmNlXCI6IFwiY29udGV4dFwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRJbmRleFRhYmxlTmFtZSA9IChpbmRleCwgcmVjb3JkKSA9PiB7XHJcbiAgICByZWNvcmQgPSByZWNvcmQgXHJcbiAgICAgICAgICAgICB8fCBpbmRleC5wYXJlbnQoKS50eXBlID09PSBcInJlY29yZFwiID8gaW5kZXgucGFyZW50KCkgOiBudWxsO1xyXG4gICAgXHJcbiAgICByZXR1cm4gKHJlY29yZFxyXG4gICAgICAgICAgICA/IGAke2dldFJlY29yZFBhdGgocmVjb3JkKX0vJHtpbmRleC5uYW1lfSBUYWJsZWBcclxuICAgICAgICAgICAgOiBgJHtpbmRleC5uYW1lfSBUYWJsZWApO1xyXG59XHJcblxyXG5jb25zdCBpbmRleFRhYmxlID0gKGluZGV4LCBoZWxwZXJzKSA9PiAoe1xyXG4gICAgbmFtZTogZ2V0SW5kZXhUYWJsZU5hbWUoaW5kZXgpLFxyXG4gICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFibGVcIixcclxuICAgIHByb3BzOiBpbmRleFRhYmxlUHJvcHMoaW5kZXgsIGhlbHBlcnMpXHJcbn0pO1xyXG5cclxuY29uc3QgY29sdW1uID0gKGNvbCkgPT4gKHtcclxuICAgIHRpdGxlOiBjb2wubmFtZSxcclxuICAgIHZhbHVlOiB7XHJcbiAgICAgICAgXCIjI2Jic3RhdGVcIjogY29sLm5hbWUsXHJcbiAgICAgICAgXCIjI2Jic291cmNlXCI6XCJjb250ZXh0XCJcclxuICAgIH1cclxufSkiLCJpbXBvcnQge1xyXG4gICAgZ2V0SW5kZXhUYWJsZU5hbWUsIGluZGV4VGFibGVzXHJcbn0gZnJvbSBcIi4vaW5kZXhUYWJsZXNHZW5lcmF0b3JcIjtcclxuXHJcbmltcG9ydCB7XHJcbiAgICBidXR0b25zXHJcbn0gZnJvbSBcIi4vYnV0dG9uR2VuZXJhdG9yc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlY29yZEhvbWVQYWdlQ29tcG9uZW50cyA9ICh7aW5kZXhlcywgcmVjb3JkcywgaGVscGVyc30pID0+IFxyXG4gICAgWyAgIFxyXG4gICAgICAgIC4uLnJlY29yZEhvbWVwYWdlcyh7aW5kZXhlcywgcmVjb3Jkc30pXHJcbiAgICAgICAgICAubWFwKGNvbXBvbmVudCksXHJcblxyXG4gICAgICAgIC4uLnJlY29yZEhvbWVwYWdlcyh7aW5kZXhlcywgcmVjb3Jkc30pXHJcbiAgICAgICAgICAgIC5tYXAoaG9tZVBhZ2VCdXR0b25zKSxcclxuICAgICAgICBcclxuICAgICAgICAuLi5pbmRleFRhYmxlcyh7aW5kZXhlcywgcmVjb3JkcywgaGVscGVyc30pLFxyXG5cclxuICAgICAgICAuLi5idXR0b25zKHtpbmRleGVzLCBidXR0b25zLCBoZWxwZXJzfSlcclxuICAgIF1cclxuXHJcblxyXG5jb25zdCBmaW5kSW5kZXhGb3JSZWNvcmQgPSAoaW5kZXhlcywgcmVjb3JkKSA9PiB7XHJcbiAgICBjb25zdCBmb3JSZWNvcmQgPSBpbmRleGVzLmZpbHRlcihpID0+IGkuYWxsb3dlZFJlY29yZE5vZGVJZHMuaW5jbHVkZXMocmVjb3JkLm5vZGVJZCkpO1xyXG4gICAgaWYoZm9yUmVjb3JkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgaWYoZm9yUmVjb3JkLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGZvclJlY29yZFswXTtcclxuICAgIGNvbnN0IG5vTWFwID0gZm9yUmVjb3JkLmZpbHRlcihpID0+ICFpLmZpbHRlciB8fCAhaS5maWx0ZXIudHJpbSgpKTtcclxuICAgIGlmKG5vTWFwLmxlbmd0aCA9PT0gMCkgZm9yUmVjb3JkWzBdO1xyXG4gICAgcmV0dXJuIG5vTWFwWzBdO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVjb3JkSG9tZXBhZ2VzID0gKHtpbmRleGVzLCByZWNvcmRzfSkgPT4gXHJcbiAgICByZWNvcmRzLmZpbHRlcihyID0+IHIucGFyZW50KCkudHlwZSA9PT0gXCJyb290XCIpXHJcbiAgICAgICAgLm1hcChyID0+KHtcclxuICAgICAgICAgICAgcmVjb3JkOnIsIFxyXG4gICAgICAgICAgICBpbmRleDpmaW5kSW5kZXhGb3JSZWNvcmQoaW5kZXhlcywgcilcclxuICAgICAgICB9KSlcclxuICAgICAgICAuZmlsdGVyKHIgPT4gci5pbmRleCk7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0ICBob21lcGFnZUNvbXBvbmVudE5hbWUgPSAocmVjb3JkKSA9PiBcclxuICAgIGAke3JlY29yZC5uYW1lfS8ke3JlY29yZC5uYW1lfSBob21lcGFnZWA7XHJcblxyXG5jb25zdCBjb21wb25lbnQgPSAoe3JlY29yZCwgaW5kZXh9KSA9PiAoe1xyXG4gICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvZGl2XCIsXHJcbiAgICBuYW1lOiBob21lcGFnZUNvbXBvbmVudE5hbWUocmVjb3JkKSxcclxuICAgIHByb3BzOiB7XHJcbiAgICAgICAgY2xhc3NOYW1lOiBcInAtM1wiLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDoge1xyXG4gICAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvaDJcIixcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiByZWNvcmQuY29sbGVjdGlvbk5hbWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2NvbXBvbmVudDogYCR7cmVjb3JkLm5hbWV9L2hvbWVwYWdlIGJ1dHRvbnNgLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBnZXRJbmRleFRhYmxlTmFtZShpbmRleClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgb25Mb2FkOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXHJcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogYGlzRWRpdGluZyR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkxpc3QgUmVjb3Jkc1wiLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlUGF0aDogaW5kZXgubm9kZUtleSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4S2V5OiBpbmRleC5ub2RlS2V5KClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuY29uc3QgaG9tZVBhZ2VCdXR0b25zID0gKHtpbmRleCwgcmVjb3JkfSkgPT4gKHtcclxuICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2RpdlwiLFxyXG4gICAgbmFtZTogYCR7cmVjb3JkLm5hbWV9L2hvbWVwYWdlIGJ1dHRvbnNgLFxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgICBjbGFzc05hbWU6IFwiYnRuLWdyb3VwXCIsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vRGVmYXVsdCBCdXR0b25cIixcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VGV4dDogYENyZWF0ZSAke3JlY29yZC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljazogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkdldCBOZXcgUmVjb3JkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVQYXRoOiByZWNvcmQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uS2V5OiBgLyR7cmVjb3JkLmNvbGxlY3Rpb25OYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRSZWNvcmRUeXBlOiByZWNvcmQubmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJTZXQgU3RhdGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBgaXNFZGl0aW5nJHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInRydWVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcImNvbW1vbi9EZWZhdWx0IEJ1dHRvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUZXh0OiBgUmVmcmVzaGAsXHJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljazogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkxpc3QgUmVjb3Jkc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlUGF0aDogaW5kZXgubm9kZUtleSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4S2V5OiBpbmRleC5ub2RlS2V5KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxufSkiLCJpbXBvcnQgeyBcclxuICAgIHJlY29yZEhvbWVwYWdlcywgXHJcbiAgICBob21lcGFnZUNvbXBvbmVudE5hbWUsXHJcbiAgICByZWNvcmRIb21lUGFnZUNvbXBvbmVudHNcclxufSBmcm9tIFwiLi9yZWNvcmRIb21lUGFnZUdlbmVyYXRvclwiO1xyXG5pbXBvcnQgeyBmb3JtTmFtZSwgZm9ybXMgfSBmcm9tIFwiLi9mb3Jtc0dlbmVyYXRvclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNlbGVjdE5hdkNvbnRlbnQgPSAoe2luZGV4ZXMsIHJlY29yZHMsIGhlbHBlcnN9KSA9PiBcclxuICAgIFtcclxuICAgICAgICAuLi5yZWNvcmRIb21lcGFnZXMoe2luZGV4ZXMsIHJlY29yZHN9KVxyXG4gICAgICAgICAgICAubWFwKGNvbXBvbmVudCksXHJcblxyXG4gICAgICAgIC4uLnJlY29yZEhvbWVQYWdlQ29tcG9uZW50cyh7aW5kZXhlcywgcmVjb3JkcywgaGVscGVyc30pLFxyXG5cclxuICAgICAgICAuLi5mb3Jtcyh7aW5kZXhlcywgcmVjb3JkcywgaGVscGVyc30pXHJcblxyXG4gICAgXVxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBuYXZDb250ZW50Q29tcG9uZW50TmFtZSA9IHJlY29yZCA9PlxyXG4gICAgYCR7cmVjb3JkLm5hbWV9LyR7cmVjb3JkLm5hbWV9IE5hdiBDb250ZW50YDtcclxuXHJcbmNvbnN0IGNvbXBvbmVudCA9ICh7cmVjb3JkLCBpbmRleH0pID0+ICh7XHJcbiAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9pZlwiLFxyXG4gICAgZGVzY3JpcHRpb246IGB0aGUgY29tcG9uZW50IHRoYXQgZ2V0cyBkaXNwbGF5ZWQgd2hlbiB0aGUgJHtyZWNvcmQuY29sbGVjdGlvbk5hbWV9IG5hdiBpcyBzZWxlY3RlZGAsXHJcbiAgICBuYW1lOiBuYXZDb250ZW50Q29tcG9uZW50TmFtZShyZWNvcmQpLFxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgICBjb25kaXRpb246IGAkc3RvcmUuaXNFZGl0aW5nJHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgIHRoZW5Db21wb25lbnQ6IHtcclxuICAgICAgICAgICAgX2NvbXBvbmVudDogZm9ybU5hbWUocmVjb3JkKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZWxzZUNvbXBvbmVudDoge1xyXG4gICAgICAgICAgICBfY29tcG9uZW50OiBob21lcGFnZUNvbXBvbmVudE5hbWUocmVjb3JkKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7IiwiaW1wb3J0IHsgbmF2Q29udGVudENvbXBvbmVudE5hbWUsIHNlbGVjdE5hdkNvbnRlbnQgfSBmcm9tIFwiLi9zZWxlY3RlZE5hdkNvbnRlbnRHZW5lcmF0b3JcIjtcclxuaW1wb3J0IHsgcmVjb3JkSG9tZXBhZ2VzIH0gZnJvbSBcIi4vcmVjb3JkSG9tZVBhZ2VHZW5lcmF0b3JcIjtcclxuZXhwb3J0IGNvbnN0IGFwcCA9ICh7cmVjb3JkcywgaW5kZXhlcywgaGVscGVyc30pID0+IFtcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcIkFwcGxpY2F0aW9uIFJvb3RcIixcclxuICAgICAgICBpbmhlcml0czogXCJAYnVkaWJhc2UvYm9vdHN0cmFwLWNvbXBvbmVudHMvbmF2XCIsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgaXRlbXM6IHJlY29yZEhvbWVwYWdlcyh7aW5kZXhlcywgcmVjb3Jkc30pXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChuYXZJdGVtKSxcclxuICAgICAgICAgICAgb3JpZW50YXRpb246IFwiaG9yaXpvbnRhbFwiLFxyXG4gICAgICAgICAgICBhbGlnbm1lbnQ6IFwic3RhcnRcIixcclxuICAgICAgICAgICAgZmlsbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHBpbGxzOiB0cnVlLFxyXG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW06IHtcclxuICAgICAgICAgICAgICAgIFwiIyNiYnN0YXRlXCI6XCJzZWxlY3RlZE5hdlwiLFxyXG4gICAgICAgICAgICAgICAgXCIjI2Jic3RhdGVmYWxsYmFja1wiOmAke3JlY29yZHNbMF0ubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgXCIjI2Jic291cmNlXCI6IFwic3RvcmVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcIkxvZ2luXCIsXHJcbiAgICAgICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvbG9naW5cIixcclxuICAgICAgICBwcm9wczoge31cclxuICAgIH0sXHJcbiAgICAuLi5zZWxlY3ROYXZDb250ZW50KHtyZWNvcmRzLCBpbmRleGVzLCBoZWxwZXJzfSlcclxuXVxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBuYXZJdGVtID0gKHtyZWNvcmR9KSA9PiAoe1xyXG4gICAgdGl0bGU6IHJlY29yZC5jb2xsZWN0aW9uTmFtZSxcclxuICAgIGNvbXBvbmVudCA6IHtcclxuICAgICAgICBfY29tcG9uZW50OiBuYXZDb250ZW50Q29tcG9uZW50TmFtZShyZWNvcmQpXHJcbiAgICB9XHJcbn0pXHJcblxyXG4iXSwibmFtZXMiOlsiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiQUFBTyxNQUFNLE9BQU8sR0FBRyxNQUFNO0lBQ3pCO1FBQ0ksSUFBSSxFQUFF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

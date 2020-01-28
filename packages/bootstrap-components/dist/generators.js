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
            className: "btn btn-secondary"
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
            "##eventHandlerType": "Set State",
            parameters: {
                path: `selectedrow_${index.name}`,
                value: {
                    "##bbstate": "key",
                    "##bbsource": "event"
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
        className: "d-flex flex-column h-100",
        children: [
            {
                component: {
                    _component: `${record.name}/homepage buttons`,
                }
            },
            {
                component: {
                    _component: getIndexTableName(index)
                },
                className: "flex-gow-1 overflow-auto"
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
        className: "btn-toolbar mt-4 mb-2",
        children: [
            {
                component: {
                    _component: "@budibase/standard-components/div",
                    className: "btn-group mr-3",
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
            },
            {
                component: {
                    _component: "@budibase/standard-components/if",
                    condition: `$store.selectedrow_${index.name} && $store.selectedrow_${index.name}.length > 0`,
                    thenComponent: {
                        _component: "@budibase/standard-components/div",
                        className: "btn-group",
                        children: [
                            {
                                component: {
                                    _component: "common/Default Button",
                                    contentText: `Edit ${record.name}`,
                                    onClick: [
                                        {
                                            "##eventHandlerType": "Load Record",
                                            parameters: {
                                                statePath: record.name,
                                                recordKey: {
                                                    "##bbstate" : `selectedrow_${index.name}`,
                                                    "##source": "store"
                                                }
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
                                    contentText: `Delete ${record.name}`,
                                    onClick: [
                                        {
                                            "##eventHandlerType": "Delete Record",
                                            parameters: {
                                                recordKey: {
                                                    "##bbstate" : `selectedrow_${index.name}`,
                                                    "##source": "store"
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
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
            },
            className: "p-3"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9ycy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2dlbmVyYXRvcnMvYnV0dG9uR2VuZXJhdG9ycy5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2Zvcm1zR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvZ2V0UmVjb3JkUGF0aC5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2luZGV4VGFibGVzR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvcmVjb3JkSG9tZVBhZ2VHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9zZWxlY3RlZE5hdkNvbnRlbnRHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9hcHBHZW5lcmF0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGJ1dHRvbnMgPSAoKSA9PiBbXG4gICAge1xuICAgICAgICBuYW1lOiBcImNvbW1vbi9QcmltYXJ5IEJ1dHRvblwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJCb290c3RyYXAgcHJpbWFyeSBidXR0b24gXCIsXG4gICAgICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvblwiLFxuICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogXCJjb21tb24vRGVmYXVsdCBCdXR0b25cIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiQm9vdHN0cmFwIGRlZmF1bHQgYnV0dG9uXCIsXG4gICAgICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvblwiLFxuICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tc2Vjb25kYXJ5XCJcbiAgICAgICAgfVxuICAgIH1cbl0iLCJpbXBvcnQge2J1dHRvbnN9IGZyb20gXCIuL2J1dHRvbkdlbmVyYXRvcnNcIjtcblxuZXhwb3J0IGNvbnN0IGZvcm1zID0gKHtyZWNvcmRzLCBpbmRleGVzLCBoZWxwZXJzfSkgPT4gXG4gICAgW1xuICAgICAgICAuLi5yZWNvcmRzLm1hcChyb290KSxcbiAgICAgICAgLi4uYnV0dG9ucyh7cmVjb3JkcywgaW5kZXhlcywgaGVscGVyc30pXG4gICAgXTtcblxuZXhwb3J0IGNvbnN0IGZvcm1OYW1lID0gcmVjb3JkID0+ICBgJHtyZWNvcmQubmFtZX0vJHtyZWNvcmQubmFtZX0gRm9ybWA7XG5cbmNvbnN0IHJvb3QgPSByZWNvcmQgPT4gKHtcbiAgICBuYW1lOiBmb3JtTmFtZShyZWNvcmQpLFxuICAgIGRlc2NyaXB0aW9uOiBgQ29udHJvbCBmb3IgY3JlYXRpbmcvdXBkYXRpbmcgJyR7cmVjb3JkLm5vZGVLZXkoKX0nIGAsXG4gICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvZGl2XCIsXG4gICAgcHJvcHM6IHtcbiAgICAgICAgY2xhc3NOYW1lOlwicC0xXCIsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvaDNcIixcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYEVkaXQgJHtyZWNvcmQubmFtZX1gLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmb3JtKHJlY29yZCksXG4gICAgICAgICAgICBzYXZlQ2FuY2VsQnV0dG9ucyhyZWNvcmQpXG4gICAgICAgIF1cbiAgICB9XG59KSBcblxuY29uc3QgZm9ybSA9IHJlY29yZCA9PiAoe1xuICAgIGNvbXBvbmVudDoge1xuICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2Zvcm1cIixcbiAgICAgICAgZm9ybUNvbnRyb2xzOiBcbiAgICAgICAgICAgIHJlY29yZC5maWVsZHMubWFwKGYgPT4gZm9ybUNvbnRyb2wocmVjb3JkLCBmKSlcbiAgICB9XG59KVxuXG5jb25zdCBmb3JtQ29udHJvbCA9IChyZWNvcmQsIGZpZWxkKSA9PiB7XG4gICAgaWYoZmllbGQudHlwZSA9PT0gXCJzdHJpbmdcIiAmJiBmaWVsZC50eXBlT3B0aW9ucy52YWx1ZXMgJiYgZmllbGQudHlwZU9wdGlvbnMudmFsdWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuICh7XG4gICAgICAgICAgICBjb250cm9sOiB7XG4gICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9zZWxlY3RcIixcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBmaWVsZC50eXBlT3B0aW9ucy52YWx1ZXMubWFwKHYgPT4gKHtpZDp2LCB2YWx1ZTp2fSkpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiIyNiYnN0YXRlXCI6YCR7cmVjb3JkLm5hbWV9LiR7ZmllbGQubmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICBcIiMjYmJzb3VyY2VcIjpcInN0b3JlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxhYmVsOiBmaWVsZC5sYWJlbFxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKHtcbiAgICAgICAgICAgIGNvbnRyb2w6IHtcbiAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2lucHV0XCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIjI2Jic3RhdGVcIjpgJHtyZWNvcmQubmFtZX0uJHtmaWVsZC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgIFwiIyNiYnNvdXJjZVwiOlwic3RvcmVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IGZpZWxkLnR5cGUgPT09IFwic3RyaW5nXCIgPyBcInRleHRcIlxuICAgICAgICAgICAgICAgICAgICA6IGZpZWxkLnR5cGUgPT09IFwiZGF0ZXRpbWVcIiA/IFwiZGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgIDogZmllbGQudHlwZSA9PT0gXCJudW1iZXJcIiA/IFwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgOiBcInRleHRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxhYmVsOiBmaWVsZC5sYWJlbFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNvbnN0IHNhdmVDYW5jZWxCdXR0b25zID0gKHJlY29yZCkgPT4gKHtcbiAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9zdGFja3BhbmVsXCIsXG4gICAgICAgIGRpcmVjdGlvbjogXCJob3Jpem9udGFsXCIsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICBwYWRkZWRQYW5lbEZvckJ1dHRvbih7XG4gICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vUHJpbWFyeSBCdXR0b25cIixcbiAgICAgICAgICAgICAgICBjb250ZW50VGV4dDogYFNhdmUgJHtyZWNvcmQubmFtZX1gLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IFsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2F2ZSBSZWNvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVBhdGg6IGAke3JlY29yZC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYGlzRWRpdGluZyR7cmVjb3JkLm5hbWV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBwYWRkZWRQYW5lbEZvckJ1dHRvbih7XG4gICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vRGVmYXVsdCBCdXR0b25cIixcbiAgICAgICAgICAgICAgICBjb250ZW50VGV4dDogYENhbmNlbGAsXG4gICAgICAgICAgICAgICAgb25DbGljazogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNldCBTdGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGBpc0VkaXRpbmcke3JlY29yZC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIF1cbiAgICB9XG59KVxuXG5jb25zdCBwYWRkZWRQYW5lbEZvckJ1dHRvbiA9IChidXR0b24pID0+ICh7XG4gICAgY29udHJvbDoge1xuICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2RpdlwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYnRuLWdyb3VwXCIsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiBidXR0b25cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH1cbn0pO1xuXG4iLCJleHBvcnQgY29uc3QgZ2V0UmVjb3JkUGF0aCA9IChyZWNvcmQpID0+IHtcblxuICAgIGNvbnN0IHBhcnRzID0gW107XG5cbiAgICBjb25zdCBhZGQgPSAoY3VycmVudCkgPT4ge1xuICAgICAgICBwYXJ0cy5wdXNoKGN1cnJlbnQubmFtZSk7XG4gICAgICAgIGlmKGN1cnJlbnQucGFyZW50KCkudHlwZSA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZChjdXJyZW50LnBhcmVudCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFydHMucmV2ZXJzZSgpLmpvaW4oXCIvXCIpO1xufSIsImltcG9ydCB7IGdldFJlY29yZFBhdGggfSBmcm9tIFwiLi9nZXRSZWNvcmRQYXRoXCI7XG5cbmV4cG9ydCBjb25zdCBpbmRleFRhYmxlcyA9ICh7aW5kZXhlcywgaGVscGVyc30pID0+IFxuICAgIGluZGV4ZXMubWFwKGkgPT4gaW5kZXhUYWJsZShpLCBoZWxwZXJzKSk7XG5cbmNvbnN0IGV4Y2x1ZGVkQ29sdW1ucyA9IFtcImlkXCIsIFwiaXNOZXdcIiwgXCJrZXlcIiwgXCJ0eXBlXCIsIFwic29ydEtleVwiXTtcblxuZXhwb3J0IGNvbnN0IGluZGV4VGFibGVQcm9wcyA9IChpbmRleCwgaGVscGVycykgPT4gKHtcbiAgICBkYXRhOiB7XG4gICAgICAgIFwiIyNiYnN0YXRlXCI6aW5kZXgubm9kZUtleSgpLFxuICAgICAgICBcIiMjYmJzb3VyY2VcIjpcInN0b3JlXCJcbiAgICB9LFxuICAgIHRhYmxlQ2xhc3M6IFwidGFibGUgdGFibGUtaG92ZXJcIixcbiAgICB0aGVhZENsYXNzOiBcInRoZWFkLWRhcmtcIixcbiAgICBjb2x1bW5zOiBoZWxwZXJzXG4gICAgICAgICAgICAgICAgLmluZGV4U2NoZW1hKGluZGV4KVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoYyA9PiAhZXhjbHVkZWRDb2x1bW5zLmluY2x1ZGVzKGMubmFtZSkpXG4gICAgICAgICAgICAgICAgLm1hcChjb2x1bW4pLFxuICAgIG9uUm93Q2xpY2s6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJTZXQgU3RhdGVcIixcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICBwYXRoOiBgc2VsZWN0ZWRyb3dfJHtpbmRleC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIjI2Jic3RhdGVcIjogXCJrZXlcIixcbiAgICAgICAgICAgICAgICAgICAgXCIjI2Jic291cmNlXCI6IFwiZXZlbnRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICBdXG59KTtcblxuZXhwb3J0IGNvbnN0IGdldEluZGV4VGFibGVOYW1lID0gKGluZGV4LCByZWNvcmQpID0+IHtcbiAgICByZWNvcmQgPSByZWNvcmQgXG4gICAgICAgICAgICAgfHwgaW5kZXgucGFyZW50KCkudHlwZSA9PT0gXCJyZWNvcmRcIiA/IGluZGV4LnBhcmVudCgpIDogbnVsbDtcbiAgICBcbiAgICByZXR1cm4gKHJlY29yZFxuICAgICAgICAgICAgPyBgJHtnZXRSZWNvcmRQYXRoKHJlY29yZCl9LyR7aW5kZXgubmFtZX0gVGFibGVgXG4gICAgICAgICAgICA6IGAke2luZGV4Lm5hbWV9IFRhYmxlYCk7XG59XG5cbmNvbnN0IGluZGV4VGFibGUgPSAoaW5kZXgsIGhlbHBlcnMpID0+ICh7XG4gICAgbmFtZTogZ2V0SW5kZXhUYWJsZU5hbWUoaW5kZXgpLFxuICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3RhYmxlXCIsXG4gICAgcHJvcHM6IGluZGV4VGFibGVQcm9wcyhpbmRleCwgaGVscGVycylcbn0pO1xuXG5jb25zdCBjb2x1bW4gPSAoY29sKSA9PiAoe1xuICAgIHRpdGxlOiBjb2wubmFtZSxcbiAgICB2YWx1ZToge1xuICAgICAgICBcIiMjYmJzdGF0ZVwiOiBjb2wubmFtZSxcbiAgICAgICAgXCIjI2Jic291cmNlXCI6XCJjb250ZXh0XCJcbiAgICB9XG59KSIsImltcG9ydCB7XG4gICAgZ2V0SW5kZXhUYWJsZU5hbWUsIGluZGV4VGFibGVzXG59IGZyb20gXCIuL2luZGV4VGFibGVzR2VuZXJhdG9yXCI7XG5cbmltcG9ydCB7XG4gICAgYnV0dG9uc1xufSBmcm9tIFwiLi9idXR0b25HZW5lcmF0b3JzXCI7XG5cbmV4cG9ydCBjb25zdCByZWNvcmRIb21lUGFnZUNvbXBvbmVudHMgPSAoe2luZGV4ZXMsIHJlY29yZHMsIGhlbHBlcnN9KSA9PiBcbiAgICBbICAgXG4gICAgICAgIC4uLnJlY29yZEhvbWVwYWdlcyh7aW5kZXhlcywgcmVjb3Jkc30pXG4gICAgICAgICAgLm1hcChjb21wb25lbnQpLFxuXG4gICAgICAgIC4uLnJlY29yZEhvbWVwYWdlcyh7aW5kZXhlcywgcmVjb3Jkc30pXG4gICAgICAgICAgICAubWFwKGhvbWVQYWdlQnV0dG9ucyksXG4gICAgICAgIFxuICAgICAgICAuLi5pbmRleFRhYmxlcyh7aW5kZXhlcywgcmVjb3JkcywgaGVscGVyc30pLFxuXG4gICAgICAgIC4uLmJ1dHRvbnMoe2luZGV4ZXMsIGJ1dHRvbnMsIGhlbHBlcnN9KVxuICAgIF1cblxuXG5jb25zdCBmaW5kSW5kZXhGb3JSZWNvcmQgPSAoaW5kZXhlcywgcmVjb3JkKSA9PiB7XG4gICAgY29uc3QgZm9yUmVjb3JkID0gaW5kZXhlcy5maWx0ZXIoaSA9PiBpLmFsbG93ZWRSZWNvcmROb2RlSWRzLmluY2x1ZGVzKHJlY29yZC5ub2RlSWQpKTtcbiAgICBpZihmb3JSZWNvcmQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgaWYoZm9yUmVjb3JkLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGZvclJlY29yZFswXTtcbiAgICBjb25zdCBub01hcCA9IGZvclJlY29yZC5maWx0ZXIoaSA9PiAhaS5maWx0ZXIgfHwgIWkuZmlsdGVyLnRyaW0oKSk7XG4gICAgaWYobm9NYXAubGVuZ3RoID09PSAwKSBmb3JSZWNvcmRbMF07XG4gICAgcmV0dXJuIG5vTWFwWzBdO1xufVxuXG5leHBvcnQgY29uc3QgcmVjb3JkSG9tZXBhZ2VzID0gKHtpbmRleGVzLCByZWNvcmRzfSkgPT4gXG4gICAgcmVjb3Jkcy5maWx0ZXIociA9PiByLnBhcmVudCgpLnR5cGUgPT09IFwicm9vdFwiKVxuICAgICAgICAubWFwKHIgPT4oe1xuICAgICAgICAgICAgcmVjb3JkOnIsIFxuICAgICAgICAgICAgaW5kZXg6ZmluZEluZGV4Rm9yUmVjb3JkKGluZGV4ZXMsIHIpXG4gICAgICAgIH0pKVxuICAgICAgICAuZmlsdGVyKHIgPT4gci5pbmRleCk7XG5cblxuZXhwb3J0IGNvbnN0ICBob21lcGFnZUNvbXBvbmVudE5hbWUgPSAocmVjb3JkKSA9PiBcbiAgICBgJHtyZWNvcmQubmFtZX0vJHtyZWNvcmQubmFtZX0gaG9tZXBhZ2VgO1xuXG5jb25zdCBjb21wb25lbnQgPSAoe3JlY29yZCwgaW5kZXh9KSA9PiAoe1xuICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2RpdlwiLFxuICAgIG5hbWU6IGhvbWVwYWdlQ29tcG9uZW50TmFtZShyZWNvcmQpLFxuICAgIHByb3BzOiB7XG4gICAgICAgIGNsYXNzTmFtZTogXCJkLWZsZXggZmxleC1jb2x1bW4gaC0xMDBcIixcbiAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgX2NvbXBvbmVudDogYCR7cmVjb3JkLm5hbWV9L2hvbWVwYWdlIGJ1dHRvbnNgLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IGdldEluZGV4VGFibGVOYW1lKGluZGV4KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImZsZXgtZ293LTEgb3ZlcmZsb3ctYXV0b1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIG9uTG9hZDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBgaXNFZGl0aW5nJHtyZWNvcmQubmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJMaXN0IFJlY29yZHNcIixcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlUGF0aDogaW5kZXgubm9kZUtleSgpLFxuICAgICAgICAgICAgICAgICAgICBpbmRleEtleTogaW5kZXgubm9kZUtleSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxuXG59KTtcblxuY29uc3QgaG9tZVBhZ2VCdXR0b25zID0gKHtpbmRleCwgcmVjb3JkfSkgPT4gKHtcbiAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9kaXZcIixcbiAgICBuYW1lOiBgJHtyZWNvcmQubmFtZX0vaG9tZXBhZ2UgYnV0dG9uc2AsXG4gICAgcHJvcHM6IHtcbiAgICAgICAgY2xhc3NOYW1lOiBcImJ0bi10b29sYmFyIG10LTQgbWItMlwiLFxuICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudDoge1xuICAgICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2RpdlwiLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuLWdyb3VwIG1yLTNcIixcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vRGVmYXVsdCBCdXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFRleHQ6IGBDcmVhdGUgJHtyZWNvcmQubmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJHZXQgTmV3IFJlY29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVQYXRoOiByZWNvcmQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbktleTogYC8ke3JlY29yZC5jb2xsZWN0aW9uTmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFJlY29yZFR5cGU6IHJlY29yZC5uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2V2ZW50SGFuZGxlclR5cGVcIjogXCJTZXQgU3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGBpc0VkaXRpbmcke3JlY29yZC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL0RlZmF1bHQgQnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUZXh0OiBgUmVmcmVzaGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkxpc3QgUmVjb3Jkc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVQYXRoOiBpbmRleC5ub2RlS2V5KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4S2V5OiBpbmRleC5ub2RlS2V5KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudDoge1xuICAgICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2lmXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogYCRzdG9yZS5zZWxlY3RlZHJvd18ke2luZGV4Lm5hbWV9ICYmICRzdG9yZS5zZWxlY3RlZHJvd18ke2luZGV4Lm5hbWV9Lmxlbmd0aCA+IDBgLFxuICAgICAgICAgICAgICAgICAgICB0aGVuQ29tcG9uZW50OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2RpdlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ0bi1ncm91cFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vRGVmYXVsdCBCdXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUZXh0OiBgRWRpdCAke3JlY29yZC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkxvYWQgUmVjb3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlUGF0aDogcmVjb3JkLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRLZXk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjYmJzdGF0ZVwiIDogYHNlbGVjdGVkcm93XyR7aW5kZXgubmFtZX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNzb3VyY2VcIjogXCJzdG9yZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2V0IFN0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGBpc0VkaXRpbmcke3JlY29yZC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogXCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL0RlZmF1bHQgQnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VGV4dDogYERlbGV0ZSAke3JlY29yZC5uYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIkRlbGV0ZSBSZWNvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3JkS2V5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2Jic3RhdGVcIiA6IGBzZWxlY3RlZHJvd18ke2luZGV4Lm5hbWV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiMjc291cmNlXCI6IFwic3RvcmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxufSkiLCJpbXBvcnQgeyBcbiAgICByZWNvcmRIb21lcGFnZXMsIFxuICAgIGhvbWVwYWdlQ29tcG9uZW50TmFtZSxcbiAgICByZWNvcmRIb21lUGFnZUNvbXBvbmVudHNcbn0gZnJvbSBcIi4vcmVjb3JkSG9tZVBhZ2VHZW5lcmF0b3JcIjtcbmltcG9ydCB7IGZvcm1OYW1lLCBmb3JtcyB9IGZyb20gXCIuL2Zvcm1zR2VuZXJhdG9yXCI7XG5cbmV4cG9ydCBjb25zdCBzZWxlY3ROYXZDb250ZW50ID0gKHtpbmRleGVzLCByZWNvcmRzLCBoZWxwZXJzfSkgPT4gXG4gICAgW1xuICAgICAgICAuLi5yZWNvcmRIb21lcGFnZXMoe2luZGV4ZXMsIHJlY29yZHN9KVxuICAgICAgICAgICAgLm1hcChjb21wb25lbnQpLFxuXG4gICAgICAgIC4uLnJlY29yZEhvbWVQYWdlQ29tcG9uZW50cyh7aW5kZXhlcywgcmVjb3JkcywgaGVscGVyc30pLFxuXG4gICAgICAgIC4uLmZvcm1zKHtpbmRleGVzLCByZWNvcmRzLCBoZWxwZXJzfSlcblxuICAgIF1cblxuXG5leHBvcnQgY29uc3QgbmF2Q29udGVudENvbXBvbmVudE5hbWUgPSByZWNvcmQgPT5cbiAgICBgJHtyZWNvcmQubmFtZX0vJHtyZWNvcmQubmFtZX0gTmF2IENvbnRlbnRgO1xuXG5jb25zdCBjb21wb25lbnQgPSAoe3JlY29yZCwgaW5kZXh9KSA9PiAoe1xuICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2lmXCIsXG4gICAgZGVzY3JpcHRpb246IGB0aGUgY29tcG9uZW50IHRoYXQgZ2V0cyBkaXNwbGF5ZWQgd2hlbiB0aGUgJHtyZWNvcmQuY29sbGVjdGlvbk5hbWV9IG5hdiBpcyBzZWxlY3RlZGAsXG4gICAgbmFtZTogbmF2Q29udGVudENvbXBvbmVudE5hbWUocmVjb3JkKSxcbiAgICBwcm9wczoge1xuICAgICAgICBjb25kaXRpb246IGAkc3RvcmUuaXNFZGl0aW5nJHtyZWNvcmQubmFtZX1gLFxuICAgICAgICB0aGVuQ29tcG9uZW50OiB7XG4gICAgICAgICAgICBfY29tcG9uZW50OiBmb3JtTmFtZShyZWNvcmQpXG4gICAgICAgIH0sXG4gICAgICAgIGVsc2VDb21wb25lbnQ6IHtcbiAgICAgICAgICAgIF9jb21wb25lbnQ6IGhvbWVwYWdlQ29tcG9uZW50TmFtZShyZWNvcmQpXG4gICAgICAgIH1cbiAgICB9XG59KTsiLCJpbXBvcnQgeyBuYXZDb250ZW50Q29tcG9uZW50TmFtZSwgc2VsZWN0TmF2Q29udGVudCB9IGZyb20gXCIuL3NlbGVjdGVkTmF2Q29udGVudEdlbmVyYXRvclwiO1xuaW1wb3J0IHsgcmVjb3JkSG9tZXBhZ2VzIH0gZnJvbSBcIi4vcmVjb3JkSG9tZVBhZ2VHZW5lcmF0b3JcIjtcbmV4cG9ydCBjb25zdCBhcHAgPSAoe3JlY29yZHMsIGluZGV4ZXMsIGhlbHBlcnN9KSA9PiBbXG4gICAge1xuICAgICAgICBuYW1lOiBcIkFwcGxpY2F0aW9uIFJvb3RcIixcbiAgICAgICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL2Jvb3RzdHJhcC1jb21wb25lbnRzL25hdlwiLFxuICAgICAgICBwcm9wczoge1xuICAgICAgICAgICAgaXRlbXM6IHJlY29yZEhvbWVwYWdlcyh7aW5kZXhlcywgcmVjb3Jkc30pXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobmF2SXRlbSksXG4gICAgICAgICAgICBvcmllbnRhdGlvbjogXCJob3Jpem9udGFsXCIsXG4gICAgICAgICAgICBhbGlnbm1lbnQ6IFwic3RhcnRcIixcbiAgICAgICAgICAgIGZpbGw6IGZhbHNlLFxuICAgICAgICAgICAgcGlsbHM6IHRydWUsXG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW06IHtcbiAgICAgICAgICAgICAgICBcIiMjYmJzdGF0ZVwiOlwic2VsZWN0ZWROYXZcIixcbiAgICAgICAgICAgICAgICBcIiMjYmJzdGF0ZWZhbGxiYWNrXCI6YCR7cmVjb3Jkc1swXS5uYW1lfWAsXG4gICAgICAgICAgICAgICAgXCIjI2Jic291cmNlXCI6IFwic3RvcmVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJwLTNcIlxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6IFwiTG9naW5cIixcbiAgICAgICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvbG9naW5cIixcbiAgICAgICAgcHJvcHM6IHt9XG4gICAgfSxcbiAgICAuLi5zZWxlY3ROYXZDb250ZW50KHtyZWNvcmRzLCBpbmRleGVzLCBoZWxwZXJzfSlcbl1cblxuXG5leHBvcnQgY29uc3QgbmF2SXRlbSA9ICh7cmVjb3JkfSkgPT4gKHtcbiAgICB0aXRsZTogcmVjb3JkLmNvbGxlY3Rpb25OYW1lLFxuICAgIGNvbXBvbmVudCA6IHtcbiAgICAgICAgX2NvbXBvbmVudDogbmF2Q29udGVudENvbXBvbmVudE5hbWUocmVjb3JkKVxuICAgIH1cbn0pXG5cbiJdLCJuYW1lcyI6WyJjb21wb25lbnQiXSwibWFwcGluZ3MiOiJBQUFPLE1BQU0sT0FBTyxHQUFHLE1BQU07QUFDN0IsSUFBSTtBQUNKLFFBQVEsSUFBSSxFQUFFLHVCQUF1QjtBQUNyQyxRQUFRLFdBQVcsRUFBRSwyQkFBMkI7QUFDaEQsUUFBUSxRQUFRLEVBQUUsc0NBQXNDO0FBQ3hELFFBQVEsS0FBSyxFQUFFO0FBQ2YsWUFBWSxTQUFTLEVBQUUsaUJBQWlCO0FBQ3hDLFNBQVM7QUFDVCxLQUFLO0FBQ0wsSUFBSTtBQUNKLFFBQVEsSUFBSSxFQUFFLHVCQUF1QjtBQUNyQyxRQUFRLFdBQVcsRUFBRSwwQkFBMEI7QUFDL0MsUUFBUSxRQUFRLEVBQUUsc0NBQXNDO0FBQ3hELFFBQVEsS0FBSyxFQUFFO0FBQ2YsWUFBWSxTQUFTLEVBQUUsbUJBQW1CO0FBQzFDLFNBQVM7QUFDVCxLQUFLO0FBQ0w7O0FDZlksTUFBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FB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

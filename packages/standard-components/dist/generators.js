const headers = () => [
    {
        name: "common/H1",
        description: "Header 1",
        inherits: "@budibase/standard-components/text",
        props: {
            font: "20pt",
        }
    },
    {
        name: "common/H2",
        description: "Header 2",
        inherits: "@budibase/standard-components/text",
        props: {
            font: "15pt",
        }
    },
    {
        name: "common/H3",
        description: "Header 3",
        inherits: "@budibase/standard-components/text",
        props: {
            font: "12pt bold",
        }
    },
    {
        name: "common/H4",
        description: "Header 4",
        inherits: "@budibase/standard-components/text",
        props: {
            font: "10pt bold",
        }
    }
];

const forms = ({records, indexes}) => 
    [...headers(),
    ...records.map(root)];

const root = record => ({
    name: `${record.name} Form`,
    description: `All fields on record '${record.nodeKey()}' `,
    inherits: "@budibase/standard-components/stackpanel",
    props: {
        direction: "vertical",
        children: [
            {
                control: {
                    _component: "common/H1",
                    value: `Edit ${record.name}`,
                }
            },
            form(record),
            saveCancelButtons(record)
        ]
    }
}); 

const form = record => ({
    control: {
        _component: "@budibase/standard-components/form",
        formControls: 
            record.fields.map(f => ({
                label: f.label,
                control: {
                    _component: "@budibase/standard-components/textbox",
                    value: {
                        "##bbstate":`current${record.name}.${f.name}`,
                        "##bbsource":"store"
                    }
                }
            }))
    }
});

const saveCancelButtons = (record) => ({
    control: {
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
                            statePath: `current${record.name}`,
                        }
                    }
                ]
            }),
            paddedPanelForButton({
                _component: "common/Secondary Button",
                contentText: `Cancel`,
                onClick: [
                    {
                        "##eventHandlerType": "Save Record",
                        parameters: {
                            statePath: `current${record.name}`,
                        }
                    }
                ]
            })
        ]
    }
});

const paddedPanelForButton = (button) => ({
    control: {
        _component: "@budibase/standard-components/panel",
        padding: "20px",
        component: button
    }
});

const indexTables = ({indexes, helpers}) => 
    indexes.filter(i => i.parent().type === "root")
           .map(i => indexTable(i, helpers));

const indexTableProps = (index, helpers) => ({
    data: {
        "##bbstate":index.nodeKey(),
        "##bbsource":"store"
    },
    columns: helpers.indexSchema(index).map(column)
});

const indexTable = (index, helpers) => ({
    name: `tables/${index.name} Table`,
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

const nav = ({records, indexes, helpers}) => [
    {
        name: "Application Root",
        inherits: "@budibase/standard-components/nav",
        props: {
            items: indexes
                    .filter(i => i.parent().type === "root")
                    .map(navItem)
        }
    },
    ...indexTables({records, indexes, helpers})
];


const navItem = (index) => ({
    title: index.name,
    component : {
        _component: `tables/${index.name} Table`
    }
});

const app = (params) => {

    return [
        ...nav(params),
        ...forms(params)
    ];
};

const buttons = () => [
    {
        name: "common/Primary Button",
        description: "a styled button",
        inherits: "@budibase/standard-components/button",
        props: {
            padding: "5px 7px",
            border: "1px solid #EEE",
            color: "#5F6368",
            background: "##f2f2f2",
            hoverColor: "black",
            hoverBackground: "#cccccc"
        }
    },
    {
        name: "common/Secondary Button",
        description: "a styled button",
        inherits: "@budibase/standard-components/button",
        props: {
            padding: "5px 7px",
            border: "1px solid #EEE",
            color: "#5F6368",
            background: "##f2f2f2",
            hoverColor: "black",
            hoverBackground: "#cccccc"
        }
    }
];

export { app, buttons, forms, headers, indexTables, nav };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9ycy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2dlbmVyYXRvcnMvaGVhZGVyc0dlbmVyYXRvci5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2Zvcm1zR2VuZXJhdG9yLmpzIiwiLi4vc3JjL2dlbmVyYXRvcnMvaW5kZXhUYWJsZXNHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9uYXZHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9hcHBHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9idXR0b25zR2VuZXJhdG9yLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBoZWFkZXJzID0gKCkgPT4gW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6IFwiY29tbW9uL0gxXCIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSGVhZGVyIDFcIixcclxuICAgICAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy90ZXh0XCIsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgZm9udDogXCIyMHB0XCIsXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcImNvbW1vbi9IMlwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkhlYWRlciAyXCIsXHJcbiAgICAgICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvdGV4dFwiLFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIGZvbnQ6IFwiMTVwdFwiLFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogXCJjb21tb24vSDNcIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJIZWFkZXIgM1wiLFxyXG4gICAgICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3RleHRcIixcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICBmb250OiBcIjEycHQgYm9sZFwiLFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogXCJjb21tb24vSDRcIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJIZWFkZXIgNFwiLFxyXG4gICAgICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3RleHRcIixcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICBmb250OiBcIjEwcHQgYm9sZFwiLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXSIsImltcG9ydCB7aGVhZGVyc30gZnJvbSBcIi4vaGVhZGVyc0dlbmVyYXRvclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGZvcm1zID0gKHtyZWNvcmRzLCBpbmRleGVzfSkgPT4gXHJcbiAgICBbLi4uaGVhZGVycyh7cmVjb3JkcywgaW5kZXhlc30pLFxyXG4gICAgLi4ucmVjb3Jkcy5tYXAocm9vdCldO1xyXG5cclxuY29uc3Qgcm9vdCA9IHJlY29yZCA9PiAoe1xyXG4gICAgbmFtZTogYCR7cmVjb3JkLm5hbWV9IEZvcm1gLFxyXG4gICAgZGVzY3JpcHRpb246IGBBbGwgZmllbGRzIG9uIHJlY29yZCAnJHtyZWNvcmQubm9kZUtleSgpfScgYCxcclxuICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3N0YWNrcGFuZWxcIixcclxuICAgIHByb3BzOiB7XHJcbiAgICAgICAgZGlyZWN0aW9uOiBcInZlcnRpY2FsXCIsXHJcbiAgICAgICAgY2hpbGRyZW46IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL0gxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGBFZGl0ICR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybShyZWNvcmQpLFxyXG4gICAgICAgICAgICBzYXZlQ2FuY2VsQnV0dG9ucyhyZWNvcmQpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG59KSBcclxuXHJcbmNvbnN0IGZvcm0gPSByZWNvcmQgPT4gKHtcclxuICAgIGNvbnRyb2w6IHtcclxuICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2Zvcm1cIixcclxuICAgICAgICBmb3JtQ29udHJvbHM6IFxyXG4gICAgICAgICAgICByZWNvcmQuZmllbGRzLm1hcChmID0+ICh7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogZi5sYWJlbCxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2w6IHtcclxuICAgICAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3RleHRib3hcIixcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiMjYmJzdGF0ZVwiOmBjdXJyZW50JHtyZWNvcmQubmFtZX0uJHtmLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCIjI2Jic291cmNlXCI6XCJzdG9yZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSlcclxuICAgIH1cclxufSlcclxuXHJcbmNvbnN0IHNhdmVDYW5jZWxCdXR0b25zID0gKHJlY29yZCkgPT4gKHtcclxuICAgIGNvbnRyb2w6IHtcclxuICAgICAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3N0YWNrcGFuZWxcIixcclxuICAgICAgICBkaXJlY3Rpb246IFwiaG9yaXpvbnRhbFwiLFxyXG4gICAgICAgIGNoaWxkcmVuOiBbXHJcbiAgICAgICAgICAgIHBhZGRlZFBhbmVsRm9yQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL1ByaW1hcnkgQnV0dG9uXCIsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VGV4dDogYFNhdmUgJHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgb25DbGljazogWyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2F2ZSBSZWNvcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVQYXRoOiBgY3VycmVudCR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHBhZGRlZFBhbmVsRm9yQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgIF9jb21wb25lbnQ6IFwiY29tbW9uL1NlY29uZGFyeSBCdXR0b25cIixcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUZXh0OiBgQ2FuY2VsYCxcclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiIyNldmVudEhhbmRsZXJUeXBlXCI6IFwiU2F2ZSBSZWNvcmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVQYXRoOiBgY3VycmVudCR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICBdXHJcbiAgICB9XHJcbn0pXHJcblxyXG5jb25zdCBwYWRkZWRQYW5lbEZvckJ1dHRvbiA9IChidXR0b24pID0+ICh7XHJcbiAgICBjb250cm9sOiB7XHJcbiAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9wYW5lbFwiLFxyXG4gICAgICAgIHBhZGRpbmc6IFwiMjBweFwiLFxyXG4gICAgICAgIGNvbXBvbmVudDogYnV0dG9uXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuIiwiZXhwb3J0IGNvbnN0IGluZGV4VGFibGVzID0gKHtpbmRleGVzLCBoZWxwZXJzfSkgPT4gXHJcbiAgICBpbmRleGVzLmZpbHRlcihpID0+IGkucGFyZW50KCkudHlwZSA9PT0gXCJyb290XCIpXHJcbiAgICAgICAgICAgLm1hcChpID0+IGluZGV4VGFibGUoaSwgaGVscGVycykpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluZGV4VGFibGVQcm9wcyA9IChpbmRleCwgaGVscGVycykgPT4gKHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBcIiMjYmJzdGF0ZVwiOmluZGV4Lm5vZGVLZXkoKSxcclxuICAgICAgICBcIiMjYmJzb3VyY2VcIjpcInN0b3JlXCJcclxuICAgIH0sXHJcbiAgICBjb2x1bW5zOiBoZWxwZXJzLmluZGV4U2NoZW1hKGluZGV4KS5tYXAoY29sdW1uKVxyXG59KTtcclxuXHJcbmNvbnN0IGluZGV4VGFibGUgPSAoaW5kZXgsIGhlbHBlcnMpID0+ICh7XHJcbiAgICBuYW1lOiBgdGFibGVzLyR7aW5kZXgubmFtZX0gVGFibGVgLFxyXG4gICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFibGVcIixcclxuICAgIHByb3BzOiBpbmRleFRhYmxlUHJvcHMoaW5kZXgsIGhlbHBlcnMpXHJcbn0pO1xyXG5cclxuY29uc3QgY29sdW1uID0gKGNvbCkgPT4gKHtcclxuICAgIHRpdGxlOiBjb2wubmFtZSxcclxuICAgIHZhbHVlOiB7XHJcbiAgICAgICAgXCIjI2Jic3RhdGVcIjogY29sLm5hbWUsXHJcbiAgICAgICAgXCIjI2Jic291cmNlXCI6XCJjb250ZXh0XCJcclxuICAgIH1cclxufSkiLCJpbXBvcnQge2luZGV4VGFibGVzfSBmcm9tIFwiLi9pbmRleFRhYmxlc0dlbmVyYXRvclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IG5hdiA9ICh7cmVjb3JkcywgaW5kZXhlcywgaGVscGVyc30pID0+IFtcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcIkFwcGxpY2F0aW9uIFJvb3RcIixcclxuICAgICAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9uYXZcIixcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICBpdGVtczogaW5kZXhlc1xyXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoaSA9PiBpLnBhcmVudCgpLnR5cGUgPT09IFwicm9vdFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobmF2SXRlbSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLi4uaW5kZXhUYWJsZXMoe3JlY29yZHMsIGluZGV4ZXMsIGhlbHBlcnN9KVxyXG5dXHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG5hdkl0ZW0gPSAoaW5kZXgpID0+ICh7XHJcbiAgICB0aXRsZTogaW5kZXgubmFtZSxcclxuICAgIGNvbXBvbmVudCA6IHtcclxuICAgICAgICBfY29tcG9uZW50OiBgdGFibGVzLyR7aW5kZXgubmFtZX0gVGFibGVgXHJcbiAgICB9XHJcbn0pXHJcblxyXG4iLCJpbXBvcnQgeyBmb3JtcyB9IGZyb20gXCIuL2Zvcm1zR2VuZXJhdG9yXCI7XHJcbmltcG9ydCB7IG5hdiB9IGZyb20gXCIuL25hdkdlbmVyYXRvclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFwcCA9IChwYXJhbXMpID0+IHtcclxuXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIC4uLm5hdihwYXJhbXMpLFxyXG4gICAgICAgIC4uLmZvcm1zKHBhcmFtcylcclxuICAgIF07XHJcbn1cclxuXHJcbiIsImV4cG9ydCBjb25zdCBidXR0b25zID0gKCkgPT4gW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6IFwiY29tbW9uL1ByaW1hcnkgQnV0dG9uXCIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiYSBzdHlsZWQgYnV0dG9uXCIsXHJcbiAgICAgICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvYnV0dG9uXCIsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgcGFkZGluZzogXCI1cHggN3B4XCIsXHJcbiAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgI0VFRVwiLFxyXG4gICAgICAgICAgICBjb2xvcjogXCIjNUY2MzY4XCIsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiIyNmMmYyZjJcIixcclxuICAgICAgICAgICAgaG92ZXJDb2xvcjogXCJibGFja1wiLFxyXG4gICAgICAgICAgICBob3ZlckJhY2tncm91bmQ6IFwiI2NjY2NjY1wiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcImNvbW1vbi9TZWNvbmRhcnkgQnV0dG9uXCIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiYSBzdHlsZWQgYnV0dG9uXCIsXHJcbiAgICAgICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvYnV0dG9uXCIsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgcGFkZGluZzogXCI1cHggN3B4XCIsXHJcbiAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgI0VFRVwiLFxyXG4gICAgICAgICAgICBjb2xvcjogXCIjNUY2MzY4XCIsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiIyNmMmYyZjJcIixcclxuICAgICAgICAgICAgaG92ZXJDb2xvcjogXCJibGFja1wiLFxyXG4gICAgICAgICAgICBob3ZlckJhY2tncm91bmQ6IFwiI2NjY2NjY1wiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5dIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFZLE1BQUMsT0FBTyxHQUFHLE1BQU07SUFDekI7UUFDSSxJQUFJLEVBQUUsV0FBVztRQUNqQixXQUFXLEVBQUUsVUFBVTtRQUN2QixRQUFRLEVBQUUsb0NBQW9DO1FBQzlDLEtBQUssRUFBRTtZQUNILElBQUksRUFBRSxNQUFNO1NBQ2Y7S0FDSjtJQUNEO1FBQ0ksSUFBSSxFQUFFLFdBQVc7UUFDakIsV0FBVyxFQUFFLFVBQVU7UUFDdkIsUUFBUSxFQUFFLG9DQUFvQztRQUM5QyxLQUFLLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtTQUNmO0tBQ0o7SUFDRDtRQUNJLElBQUksRUFBRSxXQUFXO1FBQ2pCLFdBQVcsRUFBRSxVQUFVO1FBQ3ZCLFFBQVEsRUFBRSxvQ0FBb0M7UUFDOUMsS0FBSyxFQUFFO1lBQ0gsSUFBSSxFQUFFLFdBQVc7U0FDcEI7S0FDSjtJQUNEO1FBQ0ksSUFBSSxFQUFFLFdBQVc7UUFDakIsV0FBVyxFQUFFLFVBQVU7UUFDdkIsUUFBUSxFQUFFLG9DQUFvQztRQUM5QyxLQUFLLEVBQUU7WUFDSCxJQUFJLEVBQUUsV0FBVztTQUNwQjtLQUNKOzs7Q0FDSixEQy9CVyxNQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUNwQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEFBQWtCLENBQUM7SUFDL0IsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRTFCLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSztJQUNwQixJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzNCLFdBQVcsRUFBRSxDQUFDLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDMUQsUUFBUSxFQUFFLDBDQUEwQztJQUNwRCxLQUFLLEVBQUU7UUFDSCxTQUFTLEVBQUUsVUFBVTtRQUNyQixRQUFRLEVBQUU7WUFDTjtnQkFDSSxPQUFPLEVBQUU7b0JBQ0wsVUFBVSxFQUFFLFdBQVc7b0JBQ3ZCLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQy9CO2FBQ0o7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ1osaUJBQWlCLENBQUMsTUFBTSxDQUFDO1NBQzVCO0tBQ0o7Q0FDSixFQUFDOztBQUVGLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSztJQUNwQixPQUFPLEVBQUU7UUFDTCxVQUFVLEVBQUUsb0NBQW9DO1FBQ2hELFlBQVk7WUFDUixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUs7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztnQkFDZCxPQUFPLEVBQUU7b0JBQ0wsVUFBVSxFQUFFLHVDQUF1QztvQkFDbkQsS0FBSyxFQUFFO3dCQUNILFdBQVcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzdDLFlBQVksQ0FBQyxPQUFPO3FCQUN2QjtpQkFDSjthQUNKLENBQUMsQ0FBQztLQUNWO0NBQ0osRUFBQzs7QUFFRixNQUFNLGlCQUFpQixHQUFHLENBQUMsTUFBTSxNQUFNO0lBQ25DLE9BQU8sRUFBRTtRQUNMLFVBQVUsRUFBRSwwQ0FBMEM7UUFDdEQsU0FBUyxFQUFFLFlBQVk7UUFDdkIsUUFBUSxFQUFFO1lBQ04sb0JBQW9CLENBQUM7Z0JBQ2pCLFVBQVUsRUFBRSx1QkFBdUI7Z0JBQ25DLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xDLE9BQU8sRUFBRTtvQkFDTDt3QkFDSSxvQkFBb0IsRUFBRSxhQUFhO3dCQUNuQyxVQUFVLEVBQUU7NEJBQ1IsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDckM7cUJBQ0o7aUJBQ0o7YUFDSixDQUFDO1lBQ0Ysb0JBQW9CLENBQUM7Z0JBQ2pCLFVBQVUsRUFBRSx5QkFBeUI7Z0JBQ3JDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQztnQkFDckIsT0FBTyxFQUFFO29CQUNMO3dCQUNJLG9CQUFvQixFQUFFLGFBQWE7d0JBQ25DLFVBQVUsRUFBRTs0QkFDUixTQUFTLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3lCQUNyQztxQkFDSjtpQkFDSjthQUNKLENBQUM7U0FDTDtLQUNKO0NBQ0osRUFBQzs7QUFFRixNQUFNLG9CQUFvQixHQUFHLENBQUMsTUFBTSxNQUFNO0lBQ3RDLE9BQU8sRUFBRTtRQUNMLFVBQVUsRUFBRSxxQ0FBcUM7UUFDakQsT0FBTyxFQUFFLE1BQU07UUFDZixTQUFTLEVBQUUsTUFBTTtLQUNwQjtDQUNKLENBQUMsQ0FBQzs7QUNqRlMsTUFBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7SUFDMUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUM7WUFDdkMsR0FBRyxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7O0FBRTdDLEFBQU8sTUFBTSxlQUFlLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxNQUFNO0lBQ2hELElBQUksRUFBRTtRQUNGLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO1FBQzNCLFlBQVksQ0FBQyxPQUFPO0tBQ3ZCO0lBQ0QsT0FBTyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztDQUNsRCxDQUFDLENBQUM7O0FBRUgsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxNQUFNO0lBQ3BDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNsQyxRQUFRLEVBQUUscUNBQXFDO0lBQy9DLEtBQUssRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQztDQUN6QyxDQUFDLENBQUM7O0FBRUgsTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLE1BQU07SUFDckIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJO0lBQ2YsS0FBSyxFQUFFO1FBQ0gsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJO1FBQ3JCLFlBQVksQ0FBQyxTQUFTO0tBQ3pCO0NBQ0o7O0VBQUMsRkN0QlUsTUFBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUs7SUFDaEQ7UUFDSSxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLFFBQVEsRUFBRSxtQ0FBbUM7UUFDN0MsS0FBSyxFQUFFO1lBQ0gsS0FBSyxFQUFFLE9BQU87cUJBQ0wsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQztxQkFDdkMsR0FBRyxDQUFDLE9BQU8sQ0FBQztTQUN4QjtLQUNKO0lBQ0QsR0FBRyxXQUFXLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0VBQzlDOzs7QUFHRCxBQUFPLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBSyxNQUFNO0lBQy9CLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSTtJQUNqQixTQUFTLEdBQUc7UUFDUixVQUFVLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDM0M7Q0FDSixDQUFDOztBQ2xCVSxNQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sS0FBSzs7SUFFM0IsT0FBTztRQUNILEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNkLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztLQUNuQixDQUFDO0NBQ0w7O0FDVFcsTUFBQyxPQUFPLEdBQUcsTUFBTTtJQUN6QjtRQUNJLElBQUksRUFBRSx1QkFBdUI7UUFDN0IsV0FBVyxFQUFFLGlCQUFpQjtRQUM5QixRQUFRLEVBQUUsc0NBQXNDO1FBQ2hELEtBQUssRUFBRTtZQUNILE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE1BQU0sRUFBRSxnQkFBZ0I7WUFDeEIsS0FBSyxFQUFFLFNBQVM7WUFDaEIsVUFBVSxFQUFFLFVBQVU7WUFDdEIsVUFBVSxFQUFFLE9BQU87WUFDbkIsZUFBZSxFQUFFLFNBQVM7U0FDN0I7S0FDSjtJQUNEO1FBQ0ksSUFBSSxFQUFFLHlCQUF5QjtRQUMvQixXQUFXLEVBQUUsaUJBQWlCO1FBQzlCLFFBQVEsRUFBRSxzQ0FBc0M7UUFDaEQsS0FBSyxFQUFFO1lBQ0gsT0FBTyxFQUFFLFNBQVM7WUFDbEIsTUFBTSxFQUFFLGdCQUFnQjtZQUN4QixLQUFLLEVBQUUsU0FBUztZQUNoQixVQUFVLEVBQUUsVUFBVTtZQUN0QixVQUFVLEVBQUUsT0FBTztZQUNuQixlQUFlLEVBQUUsU0FBUztTQUM3QjtLQUNKOzs7OzsifQ==

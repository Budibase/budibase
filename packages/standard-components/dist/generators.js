const forms = ({records}) => 
    records.map(root);

const root = record => ({
    name: `${record.name} Form`,
    description: `All fields on record '${record.nodeKey()}' `,
    inherits: "@budibase/standard-components/stackpanel",
    props: {
        direction: "vertical",
        children: [
            {
                _component: "common/Header 1",
                value: `Edit ${record.name}`,
            },
            form(record),
            saveCancelButtons(record)
        ]
    }
}); 

const form = record => ({
    _component: "@budibase/standard-components/form",
    formControls: [
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
    ]
});

const saveCancelButtons = (record) => ({
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
});

const paddedPanelForButton = (button) => ({
    _component: "@budibase/standard-components/panel",
    padding: "20px",
    component: button
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
            items: index.map(navItem)
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

export { app, buttons, forms, headers, indexTables, nav };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9ycy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2dlbmVyYXRvcnMvZm9ybXNHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9pbmRleFRhYmxlc0dlbmVyYXRvci5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL25hdkdlbmVyYXRvci5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2FwcEdlbmVyYXRvci5qcyIsIi4uL3NyYy9nZW5lcmF0b3JzL2J1dHRvbnNHZW5lcmF0b3IuanMiLCIuLi9zcmMvZ2VuZXJhdG9ycy9oZWFkZXJzR2VuZXJhdG9yLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBmb3JtcyA9ICh7cmVjb3Jkc30pID0+IFxyXG4gICAgcmVjb3Jkcy5tYXAocm9vdCk7XHJcblxyXG5jb25zdCByb290ID0gcmVjb3JkID0+ICh7XHJcbiAgICBuYW1lOiBgJHtyZWNvcmQubmFtZX0gRm9ybWAsXHJcbiAgICBkZXNjcmlwdGlvbjogYEFsbCBmaWVsZHMgb24gcmVjb3JkICcke3JlY29yZC5ub2RlS2V5KCl9JyBgLFxyXG4gICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvc3RhY2twYW5lbFwiLFxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgICBkaXJlY3Rpb246IFwidmVydGljYWxcIixcclxuICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBfY29tcG9uZW50OiBcImNvbW1vbi9IZWFkZXIgMVwiLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGBFZGl0ICR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZm9ybShyZWNvcmQpLFxyXG4gICAgICAgICAgICBzYXZlQ2FuY2VsQnV0dG9ucyhyZWNvcmQpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG59KSBcclxuXHJcbmNvbnN0IGZvcm0gPSByZWNvcmQgPT4gKHtcclxuICAgIF9jb21wb25lbnQ6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvZm9ybVwiLFxyXG4gICAgZm9ybUNvbnRyb2xzOiBbXHJcbiAgICAgICAgcmVjb3JkLmZpZWxkcy5tYXAoZiA9PiAoe1xyXG4gICAgICAgICAgICBsYWJlbDogZi5sYWJlbCxcclxuICAgICAgICAgICAgY29udHJvbDoge1xyXG4gICAgICAgICAgICAgICAgX2NvbXBvbmVudDogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy90ZXh0Ym94XCIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiIyNiYnN0YXRlXCI6YGN1cnJlbnQke3JlY29yZC5uYW1lfS4ke2YubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiIyNiYnNvdXJjZVwiOlwic3RvcmVcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpXHJcbiAgICBdXHJcbn0pXHJcblxyXG5jb25zdCBzYXZlQ2FuY2VsQnV0dG9ucyA9IChyZWNvcmQpID0+ICh7XHJcbiAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3N0YWNrcGFuZWxcIixcclxuICAgIGRpcmVjdGlvbjogXCJob3Jpem9udGFsXCIsXHJcbiAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgIHBhZGRlZFBhbmVsRm9yQnV0dG9uKHtcclxuICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vUHJpbWFyeSBCdXR0b25cIixcclxuICAgICAgICAgICAgY29udGVudFRleHQ6IGBTYXZlICR7cmVjb3JkLm5hbWV9YCxcclxuICAgICAgICAgICAgb25DbGljazogWyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNhdmUgUmVjb3JkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVBhdGg6IGBjdXJyZW50JHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHBhZGRlZFBhbmVsRm9yQnV0dG9uKHtcclxuICAgICAgICAgICAgX2NvbXBvbmVudDogXCJjb21tb24vU2Vjb25kYXJ5IEJ1dHRvblwiLFxyXG4gICAgICAgICAgICBjb250ZW50VGV4dDogYENhbmNlbGAsXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBcIiMjZXZlbnRIYW5kbGVyVHlwZVwiOiBcIlNhdmUgUmVjb3JkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZVBhdGg6IGBjdXJyZW50JHtyZWNvcmQubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pXHJcbiAgICBdXHJcbn0pXHJcblxyXG5jb25zdCBwYWRkZWRQYW5lbEZvckJ1dHRvbiA9IChidXR0b24pID0+ICh7XHJcbiAgICBfY29tcG9uZW50OiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3BhbmVsXCIsXHJcbiAgICBwYWRkaW5nOiBcIjIwcHhcIixcclxuICAgIGNvbXBvbmVudDogYnV0dG9uXHJcbn0pO1xyXG5cclxuIiwiZXhwb3J0IGNvbnN0IGluZGV4VGFibGVzID0gKHtpbmRleGVzLCBoZWxwZXJzfSkgPT4gXHJcbiAgICBpbmRleGVzLmZpbHRlcihpID0+IGkucGFyZW50KCkudHlwZSA9PT0gXCJyb290XCIpXHJcbiAgICAgICAgICAgLm1hcChpID0+IGluZGV4VGFibGUoaSwgaGVscGVycykpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluZGV4VGFibGVQcm9wcyA9IChpbmRleCwgaGVscGVycykgPT4gKHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBcIiMjYmJzdGF0ZVwiOmluZGV4Lm5vZGVLZXkoKSxcclxuICAgICAgICBcIiMjYmJzb3VyY2VcIjpcInN0b3JlXCJcclxuICAgIH0sXHJcbiAgICBjb2x1bW5zOiBoZWxwZXJzLmluZGV4U2NoZW1hKGluZGV4KS5tYXAoY29sdW1uKVxyXG59KTtcclxuXHJcbmNvbnN0IGluZGV4VGFibGUgPSAoaW5kZXgsIGhlbHBlcnMpID0+ICh7XHJcbiAgICBuYW1lOiBgdGFibGVzLyR7aW5kZXgubmFtZX0gVGFibGVgLFxyXG4gICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvdGFibGVcIixcclxuICAgIHByb3BzOiBpbmRleFRhYmxlUHJvcHMoaW5kZXgsIGhlbHBlcnMpXHJcbn0pO1xyXG5cclxuY29uc3QgY29sdW1uID0gKGNvbCkgPT4gKHtcclxuICAgIHRpdGxlOiBjb2wubmFtZSxcclxuICAgIHZhbHVlOiB7XHJcbiAgICAgICAgXCIjI2Jic3RhdGVcIjogY29sLm5hbWUsXHJcbiAgICAgICAgXCIjI2Jic291cmNlXCI6XCJjb250ZXh0XCJcclxuICAgIH1cclxufSkiLCJpbXBvcnQge2luZGV4VGFibGVzfSBmcm9tIFwiLi9pbmRleFRhYmxlc0dlbmVyYXRvclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IG5hdiA9ICh7cmVjb3JkcywgaW5kZXhlcywgaGVscGVyc30pID0+IFtcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcIkFwcGxpY2F0aW9uIFJvb3RcIixcclxuICAgICAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy9uYXZcIixcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICBpdGVtczogaW5kZXgubWFwKG5hdkl0ZW0pXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC4uLmluZGV4VGFibGVzKHtyZWNvcmRzLCBpbmRleGVzLCBoZWxwZXJzfSlcclxuXVxyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBuYXZJdGVtID0gKGluZGV4KSA9PiAoe1xyXG4gICAgdGl0bGU6IGluZGV4Lm5hbWUsXHJcbiAgICBjb21wb25lbnQgOiB7XHJcbiAgICAgICAgX2NvbXBvbmVudDogYHRhYmxlcy8ke2luZGV4Lm5hbWV9IFRhYmxlYFxyXG4gICAgfVxyXG59KVxyXG5cclxuIiwiaW1wb3J0IHsgZm9ybXMgfSBmcm9tIFwiLi9mb3Jtc0dlbmVyYXRvclwiO1xyXG5pbXBvcnQgeyBuYXYgfSBmcm9tIFwiLi9uYXZHZW5lcmF0b3JcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBhcHAgPSAocGFyYW1zKSA9PiB7XHJcblxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICAuLi5uYXYocGFyYW1zKSxcclxuICAgICAgICAuLi5mb3JtcyhwYXJhbXMpXHJcbiAgICBdO1xyXG59XHJcblxyXG4iLCJleHBvcnQgY29uc3QgYnV0dG9ucyA9ICgpID0+IFtcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcImNvbW1vbi9QcmltYXJ5IEJ1dHRvblwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcImEgc3R5bGVkIGJ1dHRvblwiLFxyXG4gICAgICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvblwiLFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IFwiNXB4IDdweFwiLFxyXG4gICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkICNFRUVcIixcclxuICAgICAgICAgICAgY29sb3I6IFwiIzVGNjM2OFwiLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcIiMjZjJmMmYyXCIsXHJcbiAgICAgICAgICAgIGhvdmVyQ29sb3I6IFwiYmxhY2tcIixcclxuICAgICAgICAgICAgaG92ZXJCYWNrZ3JvdW5kOiBcIiNjY2NjY2NcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogXCJjb21tb24vU2Vjb25kYXJ5IEJ1dHRvblwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcImEgc3R5bGVkIGJ1dHRvblwiLFxyXG4gICAgICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL2J1dHRvblwiLFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IFwiNXB4IDdweFwiLFxyXG4gICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkICNFRUVcIixcclxuICAgICAgICAgICAgY29sb3I6IFwiIzVGNjM2OFwiLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcIiMjZjJmMmYyXCIsXHJcbiAgICAgICAgICAgIGhvdmVyQ29sb3I6IFwiYmxhY2tcIixcclxuICAgICAgICAgICAgaG92ZXJCYWNrZ3JvdW5kOiBcIiNjY2NjY2NcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXSIsImV4cG9ydCBjb25zdCBoZWFkZXJzID0gKCkgPT4gW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6IFwiY29tbW9uL0gxXCIsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSGVhZGVyIDFcIixcclxuICAgICAgICBpbmhlcml0czogXCJAYnVkaWJhc2Uvc3RhbmRhcmQtY29tcG9uZW50cy90ZXh0XCIsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgZm9udDogXCIyMHB0XCIsXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiBcImNvbW1vbi9IMlwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkhlYWRlciAyXCIsXHJcbiAgICAgICAgaW5oZXJpdHM6IFwiQGJ1ZGliYXNlL3N0YW5kYXJkLWNvbXBvbmVudHMvdGV4dFwiLFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIGZvbnQ6IFwiMTVwdFwiLFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogXCJjb21tb24vSDNcIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJIZWFkZXIgM1wiLFxyXG4gICAgICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3RleHRcIixcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICBmb250OiBcIjEycHQgYm9sZFwiLFxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogXCJjb21tb24vSDRcIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJIZWFkZXIgNFwiLFxyXG4gICAgICAgIGluaGVyaXRzOiBcIkBidWRpYmFzZS9zdGFuZGFyZC1jb21wb25lbnRzL3RleHRcIixcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICBmb250OiBcIjEwcHQgYm9sZFwiLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBWSxNQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXRCLE1BQU0sSUFBSSxHQUFHLE1BQU0sS0FBSztJQUNwQixJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzNCLFdBQVcsRUFBRSxDQUFDLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDMUQsUUFBUSxFQUFFLDBDQUEwQztJQUNwRCxLQUFLLEVBQUU7UUFDSCxTQUFTLEVBQUUsVUFBVTtRQUNyQixRQUFRLEVBQUU7WUFDTjtnQkFDSSxVQUFVLEVBQUUsaUJBQWlCO2dCQUM3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

import {headers} from "./headersGenerator";

export const forms = ({records, indexes}) => 
    [...headers({records, indexes}),
    ...records.map(root)];

const root = record => ({
    name: `${record.name} Form`,
    description: `Control for creating/updating '${record.nodeKey()}' `,
    inherits: "@budibase/standard-components/div",
    props: {
        direction: "vertical",
        children: [
            {
                control: {
                    _component: "@budibase/standard-components/H3",
                    text: `Edit ${record.name}`,
                }
            },
            form(record),
            saveCancelButtons(record)
        ]
    }
}) 

const form = record => ({
    control: {
        _component: "@budibase/standard-components/form",
        formControls: 
            record.fields.map(f => ({
                label: f.label,
                control: {
                    _component: "@budibase/standard-components/input",
                    value: {
                        "##bbstate":`current${record.name}.${f.name}`,
                        "##bbsource":"store"
                    }
                }
            }))
    }
})

const formControl = (record, field) => {
    if(field.type === "string" && field.typeOptions.values && values.typeOptions.length > 0) {
        return ({
            _component: "@budibase/standard-components/select",
            options: field.typeOptions.values.map(v => ({id:v, value:v})),
            value: {
                "##bbstate":`current${record.name}.${f.name}`,
                "##bbsource":"store"
            },
            className: "form-control"
        });
    } else {
        return ({
            _component: "@budibase/standard-components/input",
            value: {
                "##bbstate":`current${record.name}.${f.name}`,
                "##bbsource":"store"
            },
            className: "form-control",
            type: field.type === "string" ? "text"
                  : field.type === "datetime" ? "date"
                  : field.type === "number" ? "number"
                  : "text"
        });
    }
}

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
                _component: "common/Default Button",
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
})

const paddedPanelForButton = (button) => ({
    control: {
        _component: "@budibase/standard-components/panel",
        padding: "20px",
        component: button
    }
});


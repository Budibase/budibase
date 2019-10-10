import {headers} from "./headersGenerator";

export const forms = ({records, indexes}) => 
    [...headers({records, indexes}),
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
}) 

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
})

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
})

const paddedPanelForButton = (button) => ({
    control: {
        _component: "@budibase/standard-components/panel",
        padding: "20px",
        component: button
    }
});


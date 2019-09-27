
export const allComponents = () => ([
    {
        name: "budibase-components/TextBox",
        tags: ["Text", "input"],
        props: {
            size: {type:"options", options:["small", "medium", "large"]},
            isPassword: "bool",
            placeholder: "string",
            label:"string"
        } 
    },
    {
        name: "budibase-components/Button",
        tags: ["input"],
        props: {
            size: {type:"options", options:["small", "medium", "large"]},
            css: "string",
            content: "component",
            contentText: "string"
        } 
    },
    {
        name: "budibase-components/div",
        tags: ["input"],
        props: {
            width: "number",
            header : "component",
            children: {
                type:"array",
                elementDefinition: {
                    control: "component"
                }
            } 
        }
    },
    {
        name:"budibase-components/RecordView",
        tags: ["record"],
        props: {
            data: "state"
        }
    },
    {
        inherits:"budibase-components/TextBox",
        name: "common/SmallTextbox",
        props: {
            size: "small"
        }
    },
    
    {
        inherits:"common/SmallTextbox",
        name: "common/PasswordBox",
        tags: ["mask"],
        props: {
            isPassword: true
        }
    },
    {
        inherits:"budibase-components/Button",
        name:"PrimaryButton",
        props: {
            css:"btn-primary"
        }
    },
    {
        inherits:"budibase-components/div",
        name:"ButtonGroup",
        props: {

            width: 100,
            header: {
                _component: "PrimaryButton"
            },
            children: [
                {
                    control: {
                        _component: "PrimaryButton",
                        contentText: "Button 1"
                    }
                },
                {
                    control: {
                        _component: "PrimaryButton",
                        contentText: "Button 2"
                    }
                }
            ]
        }
    }

    ])
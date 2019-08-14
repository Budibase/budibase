
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
            content: "component"
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
    }
    ])
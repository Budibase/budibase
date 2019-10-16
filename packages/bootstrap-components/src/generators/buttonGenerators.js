export const buttons = () => [
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
            className: "btn"
        }
    }
]
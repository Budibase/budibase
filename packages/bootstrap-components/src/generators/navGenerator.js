import {indexTables, getIndexTableName} from "./indexTablesGenerator";

export const nav = ({records, indexes, helpers}) => [
    {
        name: "Application Root",
        inherits: "@budibase/bootstrap-components/nav",
        props: {
            items: indexes
                    .filter(i => i.parent().type === "root")
                    .map(navItem),
            orientation: "horizontal",
            alignment: "center",
            fill: true,
            pills: false
        }
    },
    ...indexTables({records, indexes, helpers})
]


export const navItem = (index) => ({
    title: index.name,
    component : {
        _component: getIndexTableName(index)
    }
})


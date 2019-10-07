import {indexTables} from "./indexTablesGenerator";

export const nav = ({records, indexes, helpers}) => [
    {
        name: "Application Root",
        inherits: "@budibase/standard-components/nav",
        props: {
            items: index.map(navItem)
        }
    },
    ...indexTables({records, indexes, helpers})
]


export const navItem = (index) => ({
    title: index.name,
    component : {
        _component: `tables/${index.name} Table`
    }
})


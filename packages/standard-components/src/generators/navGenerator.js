import {indexTables} from "./indexTablesGenerator";

export const nav = ({records, indexes, helpers}) => [
    {
        name: "Application Root",
        inherits: "@budibase/standard-components/nav",
        props: {
            items: indexes
                    .filter(i => i.parent().type === "root")
                    .map(navItem),
            selectedItem: {
                "##bbstate": "selectedNav",
                "##bbstatefallback": records[0].collectionName,
                "##bbsource":"store"
            }
        },
    },
    ...indexTables({records, indexes, helpers})
]


export const navItem = (index) => ({
    title: index.name,
    component : {
        _component: `tables/${index.name} Table`
    }
})


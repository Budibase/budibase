import { 
    recordHomepages, 
    homepageComponentName,
    recordHomePageComponents
} from "./recordHomePageGenerator";
import { formName, forms } from "./formsGenerator";

export const selectNavContent = ({indexes, records, helpers}) => 
    [
        ...recordHomepages({indexes, records})
            .map(component),

        ...recordHomePageComponents({indexes, records, helpers}),

        ...forms({indexes, records, helpers})

    ]


export const navContentComponentName = record =>
    `${record.name}/${record.name} Nav Content`;

const component = ({record, index}) => ({
    inherits: "@budibase/standard-components/if",
    description: `the component that gets displayed when the ${record.collectionName} nav is selected`,
    name: navContentComponentName(record),
    props: {
        condition: `$store.isEditing${record.name}`,
        thenComponent: {
            _component: formName(record)
        },
        elseComponent: {
            _component: homepageComponentName(record)
        }
    }
});
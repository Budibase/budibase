<script>
import { store } from "../builderStore";
import { makeLibraryUrl } from "../builderStore/loadComponentLibraries";
import {
    last, split, map, join
} from "lodash/fp";
import { pipe } from "../common/core";
import { splitName } from "./pagesParsing/splitRootComponentName"
import { afterUpdate } from 'svelte';
import { getRootComponent } from "./pagesParsing/getRootComponent";
import { buildPropsHierarchy } from "./pagesParsing/buildPropsHierarchy";


let component;
let stylesheetLinks = "";
let rootComponentName = "";
let libraries;
let allComponents;
let appDefinition = {};

store.subscribe(s => {
    const {componentName, libName} = splitName(
        s.currentComponentInfo.rootComponent.name);

    rootComponentName = componentName;
    component = s.libraries[libName][componentName];
    stylesheetLinks = pipe(s.pages.stylesheets, [
        map(s => `<link rel="stylesheet" href="${s}"/>`),
        join("\n")
    ]);
    appDefinition = {
        componentLibraries: s.loadLibraryUrls(),
        props: buildPropsHierarchy(s.allComponents, s.currentFrontEndItem)
    };
    libraries = s.libraries;
    allComponents = s.allComponents;
});



</script>

<div class="component-preview" >
    <div class="component-container">
        <iframe style="height: 100%; width: 100%"
                title="componentPreview"
                srcdoc={
`<html>
    
<head>
    ${stylesheetLinks}
    <script>
        window["##BUDIBASE_APPDEFINITION##"] = ${JSON.stringify(appDefinition)};
        import('./budibase-client.esm.mjs')
        .then(module => {
            module.loadBudibase();
        })        
    </script>
</head>
<body>
</body>
</html>`}>
        </iframe>
    </div>
</div>

<style>
.component-preview {
    display: grid;
    grid-template-rows: [top] 1fr [middle] auto [bottom] 1fr;
    grid-template-columns: [left] 1fr [middle] auto [right] 1fr;
    grid-column-start: preview;
    height:100%;
}

.component-container {
    grid-row-start: middle;
    grid-column-start: middle;
}

</style>
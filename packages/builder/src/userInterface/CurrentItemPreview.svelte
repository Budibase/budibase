<script>
import { store } from "../builderStore";
import {
    last,
    split,
    map,
    join
} from "lodash/fp";
import { pipe } from "../common/core";
import { splitName } from "./pagesParsing/splitRootComponentName"
import { afterUpdate } from 'svelte';

let component;
let stylesheetLinks = "";
let componentHtml = "";

store.subscribe(s => {
    const {componentName, libName} = splitName(
        s.currentComponentInfo.rootComponent.name);

    component = s.libraries[libName][componentName];
    stylesheetLinks = pipe(s.pages.stylesheets, [
        map(s => `<link rel="stylesheet" href="${s}"/>`),
        join("\n")
    ])
});



afterUpdate(() => {
    componentHtml = document.getElementById("comonent-container-mock").innerHTML
});


</script>

<div class="component-preview" >
    <div class="component-container">
        <iframe title="componentPreview"
                srcdoc={`<html>
    
                <head>
                    ${stylesheetLinks}
                </head>
                <body>
                    ${componentHtml}
                </body>
            </html>`}>
        </iframe>
    </div>
</div>

<div id="comonent-container-mock">
    <svelte:component this={component} {...$store.currentComponentInfo.fullProps}/>
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

#comonent-container-mock {
    position:fixed;
    left: -2000px
}

</style>
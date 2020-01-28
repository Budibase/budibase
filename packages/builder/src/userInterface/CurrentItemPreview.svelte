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


let hasComponent=false;
let stylesheetLinks = "";
let appDefinition = {};

store.subscribe(s => {
    hasComponent = !!s.currentFrontEndItem;

    stylesheetLinks = pipe(s.pages.stylesheets, [
        map(s => `<link rel="stylesheet" href="${s}"/>`),
        join("\n")
    ]);
    appDefinition = {
        componentLibraries: s.loadLibraryUrls(),
        props: buildPropsHierarchy(
                s.components,
                s.screens,
                s.currentFrontEndItem),
        hierarchy: s.hierarchy,
        appRootPath: ""
    };

});



</script>


<div class="component-container">
    {#if hasComponent}
    <iframe style="height: 100%; width: 100%"
            title="componentPreview"
            srcdoc={
`<html>

<head>
    ${stylesheetLinks}
    <script>
        window["##BUDIBASE_APPDEFINITION##"] = ${JSON.stringify(appDefinition)};
        import('/_builder/budibase-client.esm.mjs')
        .then(module => {
            console.log(module, window);
            module.loadBudibase({ window, localStorage });
        })
    </script>
    <style>

        body {
            box-sizing: border-box;
            padding: 20px;
        }
    </style>
</head>
<body>
</body>
</html>`}>
    </iframe>
    {/if}
</div>


<style>

.component-container {
    grid-row-start: middle;
    grid-column-start: middle;
    position: relative;
    overflow: hidden;
    padding-top: 56.25%;
    margin: auto;
}

.component-container iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
}

</style>

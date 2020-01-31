<script>
    import { store } from "../builderStore";
    import { map, join } from "lodash/fp";
    import { pipe } from "../common/core";
    import { buildPropsHierarchy } from "./pagesParsing/buildPropsHierarchy";

    $: hasComponent = !!$store.currentFrontEndItem;

    $: stylesheetLinks = pipe($store.pages.stylesheets, [
        map(s => `<link rel="stylesheet" href="${s}"/>`),
        join("\n")
    ]);

    $: appDefinition = {
        componentLibraries: $store.loadLibraryUrls(),
        props: buildPropsHierarchy(
                $store.components,
                $store.screens,
                $store.currentFrontEndItem),
        hierarchy: $store.hierarchy,
        appRootPath: ""
    };
    
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
        window["##BUDIBASE_UIFUNCTIONS"] = ${$store.currentScreenFunctions};
        
        import('/_builder/budibase-client.esm.mjs')
        .then(module => {
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

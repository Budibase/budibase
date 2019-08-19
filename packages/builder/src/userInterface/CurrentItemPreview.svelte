<script>
import { store } from "../builderStore";
import {
    last,
    split
} from "lodash/fp";
import { pipe } from "../common/core";
import { splitName } from "./pagesParsing/splitRootComponentName"

let component;

store.subscribe(s => {
    const {componentName, libName} = splitName(
        s.currentComponentInfo.rootComponent.name);

    component = s.libraries[libName][componentName];
});

</script>

<div class="component-preview" >
    <div class="component-container">
        <iframe title="componentPreview">
 
                <head>
                    {#each $store.pages.stylesheets as stylesheet}
                    <link rel="stylesheet" href="{stylesheet}"/>
                    {/each}
                </head>
                <body>
                    <svelte:component this={component} {...$store.currentComponentInfo.fullProps}/>
                </body>
      
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
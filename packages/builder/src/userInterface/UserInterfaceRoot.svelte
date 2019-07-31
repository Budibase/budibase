<script>

import ComingSoon from "../common/ComingSoon.svelte";
import { store } from "../builderStore";

</script>

<div class="root">
    
    <div class="ui-nav">

    </div>

    <div class="component-preview">
    
    </div>

</div>

<style>

.root {
    display: grid;
    grid-template-columns: [uiNav] 300px [preview] auto;
    height: 100%;
    width: 100%;
}

.ui-nav {
    grid-column-start: uiNav;
    background-color: red;
}

.component-preview {
    grid-column-start: preview;
}

</style>
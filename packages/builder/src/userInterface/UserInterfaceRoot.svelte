<script>

import ComingSoon from "../common/ComingSoon.svelte";

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
    grid-template-columns: [uiNav] 200px [preview] auto;
    height: 100%;
}

.ui-nav {
    grid-column-start: uiNav;
}

.component-preview {
    grid-column-start: preview;
}

</style>
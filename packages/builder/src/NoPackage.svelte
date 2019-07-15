<script>

import Button from "./common/Button.svelte"
import { database } from "./builderStore";

let errors = [];

</script>

<div class="root">
    <div class="inner">
        <img src="/_builder/assets/budibase-logo.png" class="logo" alt="budibase logo"/>
        <div>
            
            <div>
                <h4 style="margin-bottom: 20px">Choose an Application</h4>
                {#each $database.apps as app}
                <a href={`#/${app}`} class="app-link">{app}</a>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>

.root {
    position: fixed;
    margin: 0 auto;
    text-align: center;
    top: 20%;
    /*color: #333333;
    background-color: #fdfdfd;*/
    width:100%;
}

.inner {
    display:inline-block;
    margin: auto;
}

.logo {
    width: 300px;
    margin-bottom: 40px;
}

.root :global(.option) {
    width:250px;
}

.app-link {
    margin-top: 10px;
    display: block;
}

</style>
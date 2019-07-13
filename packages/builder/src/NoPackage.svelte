<script>

import Button from "./common/Button.svelte"

let errors = [];

</script>

<div class="root">
    <div class="inner">
        <img src="./assets/budibase-logo.png" class="logo" alt="budibase logo"/>
        <div>
            
            <div>
                <h4 style="margin-bottom: 20px">What would you like not to do?</h4>
                <Button color="primary"
                        class="option">
                    Create a New Package
                </Button>
                <Button color="primary-outline"
                        class="option">
                    Import a Package
                </Button>
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

</style>
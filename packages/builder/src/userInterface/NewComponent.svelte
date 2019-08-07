<script>

import ComponentSearch from "./ComponentSearch.svelte";
import { store } from "../builderStore";
import PropsView from "./PropsView.svelte";
import Modal from "../common/Modal.svelte";
import Textbox from "../common/Textbox.svelte";

export let isCreatingNewComponent;
let basedOnComponent;

const onBasedOnChosen = component => {
    basedOnComponent = component;
}

</script>

<Modal bind:isOpen={isCreatingNewComponent} id="search-component-modal">
    <div class="uk-margin">
        <form class="uk-form-horizontal">
            {#if basedOnComponent}
            
            <Textbox label="name"/>
            
            
            {:else}
            
            <label class="uk-form-label" for="form-stacked-text">Based On</label>
            <div class="uk-form-controls">
                <ComponentSearch allComponents={$store.allComponents}
                                onComponentChosen={onBasedOnChosen} />
            </div>
            
            {/if}
        </form>
    </div>
</Modal>

<style>

</style>
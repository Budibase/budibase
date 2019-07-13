<script>
import UIkit from "uikit";

export let isOpen = false;
export let onClosed = () => {};

let ukModal;
let listenerAdded = false;

$: if(ukModal && !listenerAdded) {
    listenerAdded = true;
    ukModal.addEventListener("hide", onClosed);
}

$: {
    if(ukModal) {
        if(isOpen) {
            UIkit.modal(ukModal).show();
        } else {
            UIkit.modal(ukModal).hide();
        }
    }
}

</script>

<div bind:this={ukModal} uk-modal >
    <div class="uk-modal-dialog uk-modal-body" uk-overflow-auto>
        <slot />
    </div>
</div>


<style>

</style>
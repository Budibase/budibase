<script>
import UIkit from "uikit";

export let isOpen = false;
export let onClosed = () => {};
export let id = "";

let ukModal;
let listenerAdded = false;

$: {
    if(ukModal && !listenerAdded) {
        listenerAdded = true;
        ukModal.addEventListener("hidden", onClosed);
    }

    if(ukModal) {
        if(isOpen) {
            UIkit.modal(ukModal).show();
        } else {
            UIkit.modal(ukModal).hide();
        }
    }
}

</script>

<div bind:this={ukModal} uk-modal {id}>
    <div class="uk-modal-dialog uk-modal-body" uk-overflow-auto>
        <slot />
    </div>
</div>


<style>

.uk-modal-dialog {
    border-radius: .3rem;
}

</style>
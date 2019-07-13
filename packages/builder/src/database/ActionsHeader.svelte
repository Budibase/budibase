<script>
import Button from "../common/Button.svelte";
import ButtonGroup from "../common/ButtonGroup.svelte";
import {database} from "../builderStore";
import Modal from "../common/Modal.svelte";
import ErrorsBox from "../common/ErrorsBox.svelte";

export let left;
let confirmDelete = false;
const openConfirmDelete = () => {
    confirmDelete = true;
}

const deleteCurrentNode = () => {
    confirmDelete = false;
    database.deleteCurrentNode();
}

</script>

<div class="root" style="left: {left}">

    <ButtonGroup>
        <Button color="secondary" grouped on:click={database.saveCurrentNode}>
            {#if $database.currentNodeIsNew}
            Create
            {:else}
            Update
            {/if}
        </Button>

        {#if !$database.currentNodeIsNew}
        <Button color="secondary" grouped on:click={openConfirmDelete}>
            Delete
        </Button>
        {/if}
    </ButtonGroup>

    {#if !!$database.errors && $database.errors.length > 0}
    <div style="width: 500px">
        <ErrorsBox errors={$database.errors}/>
    </div>
    {/if}
    
    <Modal bind:isOpen={confirmDelete}>
        <div style="margin: 10px 0px 20px 0px">Are you sure you want to delete {$database.currentNode.name} ?</div>
        <div style="float:right">
            <Button color="primary"  on:click={deleteCurrentNode}>Yes</Button>
            <Button color="secondary" on:click={() => confirmDelete = false}>No</Button>
        </div>
    </Modal>
</div>

<style>

.root {
    padding:5px;
    top:0;
    width:100%;
}

</style>
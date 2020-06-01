<script>
import { MoreIcon } from "components/common/Icons"
import { store } from "builderStore"
import { getComponentDefinition } from "builderStore/store"
import ConfirmDialog from "components/common/ConfirmDialog.svelte"
import { last } from "lodash/fp"
import UIkit from "uikit"

export let component

let confirmDeleteDialog
let dropdownEl

$: dropdown = UIkit.dropdown(dropdownEl, { mode: "click", offset: 0, pos: "bottom-right" });
$: noChildrenAllowed = !component || getComponentDefinition($store, component._component).children === false
$: noPaste = !$store.componentToPaste || $store.componentToPaste._id === component._id

const lastPartOfName = c => (c ? last(c._component.split("/")) : "")
const showDropdown = () => {
  dropdown.show()
}

/*
{#if index > 0}
            <button
              class:solo={index === components.length - 1}
              on:click|stopPropagation={() => onMoveUpComponent(component)}>
              <ChevronUpIcon />
            </button>
          {/if}
          {#if index < components.length - 1}
            <button
              class:solo={index === 0}
              on:click|stopPropagation={moveDownComponent(component)}>
              <ChevronDownIcon />
            </button>
          {/if}
*/

</script>

<div class="root" on:click|stopPropagation={()  => {}}>
  <button>
    <MoreIcon />
  </button>
  <ul class="menu" bind:this={dropdownEl} on:mouseout={() => dropdown.hide()} on:click={() => dropdown.hide()}>
    <li on:click={() => confirmDeleteDialog.show()}>Delete</li>
    <li on:click={() => store.moveUpComponent(component)}>Move up</li>
    <li on:click={() => store.moveDownComponent(component)}>Move down</li>
    <li on:click={() => store.copyComponent(component)}>Duplicate</li>
    <li on:click={() => store.storeComponentForCopy(component, true)}>Cut</li>
    <li on:click={() => store.storeComponentForCopy(component)}>Copy</li>
    <hr />
    <li class:disabled={noPaste} on:click={() => store.pasteComponent(component, "above")}>Paste above</li>
    <li class:disabled={noPaste} on:click={() => store.pasteComponent(component, "below")}>Paste below</li>
    <li class:disabled={noPaste || noChildrenAllowed} on:click={() => store.pasteComponent(component, "inside")}>Paste inside</li>    
  </ul>
</div>



<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Delete"
  body={`Are you sure you wish to delete this '${lastPartOfName(component)}' component?`}
  okText="Delete Component"
  onOk={() => store.deleteComponent(component)} />

<style>

.root {
  overflow: hidden;
  z-index:9;
}

.root button {
  border-style: none;
  border-radius: 2px;
  padding: 5px;
  background: var(--grey);
  cursor: pointer;
}

.menu {
  z-index: 100000;
  overflow: visible;
  padding: 10px 0
}

.menu li {
  border-style: none;
  background-color: transparent;
  list-style-type: none;
  padding: 4px 5px 4px 15px;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
}


.menu li:not(.disabled) {
  cursor: pointer;
  color: var(--ink);
}

.menu li:not(.disabled):hover {
  color: var(--button-text);
  background-color: var(--grey-light); 
}

.disabled {
  color: var(--grey-dark);
  cursor: default;
}

</style>
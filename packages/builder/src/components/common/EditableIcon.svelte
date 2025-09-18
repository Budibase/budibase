<script lang="ts">
  import ChooseIconModal from "@/components/start/ChooseIconModal.svelte"
  import { Icon, Modal } from "@budibase/bbui"

  export let name: string
  export let size: "M" | "L" | "XL" = "M"
  export let color: string
  export let disabled: boolean = false
  export let defaultValue = "squares-four"

  let modal: Modal

  $: icon = name || defaultValue
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="editable-icon" class:disabled>
  {#if !disabled}
    <div class="hover" on:click={modal.show}>
      <Icon
        name="pencil"
        {size}
        color="var(--spectrum-global-color-gray-600)"
      />
    </div>
    <div class="normal">
      <Icon name={icon} {size} {color} />
    </div>
  {:else}
    <Icon name={icon} {size} {color} />
  {/if}
</div>

<Modal bind:this={modal}>
  <ChooseIconModal {name} {color} on:change />
</Modal>

<style>
  .editable-icon {
    position: relative;
    display: flex;
    justify-content: flex-start;
  }
  .normal {
    display: block;
  }
  .hover {
    display: none;
    cursor: pointer;
  }
  .editable-icon:hover .normal {
    display: none;
  }
  .editable-icon:hover .hover {
    display: block;
  }
  .disabled {
    opacity: 0.5;
  }
</style>

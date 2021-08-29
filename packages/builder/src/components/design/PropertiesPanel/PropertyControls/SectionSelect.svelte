<script>
  import { createEventDispatcher } from "svelte"
  import { ActionButton, Body, Icon, Modal, ModalContent } from "@budibase/bbui"
  import { _ as t } from "svelte-i18n"

  const dispatch = createEventDispatcher()

  export let value = ""
  let selected = value

  let modal
  let layoutMap = {
    mainSidebar: {
      name: $t('main-with-sidebar'),
      icon: "ColumnTwoB",
    },
    sidebarMain: {
      name: $t('sidebar-with-main'),
      icon: "ColumnTwoC",
    },
    twoColumns: {
      name: $t('two-columns'),
      icon: "ColumnTwoA",
    },
    threeColumns: {
      name: $t('three-columns'),
      icon: "ViewColumn",
    },
  }
</script>

<ActionButton on:click={modal.show}>{layoutMap[value].name}</ActionButton>
<Modal bind:this={modal}>
  <ModalContent
    onConfirm={() => dispatch("change", selected)}
    size="L"
    title={ $t('select-layout') }
  >
    <div class="container">
      {#each Object.entries(layoutMap) as [key, value]}
        <button
          class:selected={selected === key}
          on:click={() => (selected = key)}
          class="layout"
        >
          <Icon color="white" size="L" name={value.icon} />
          <Body size="XS">{value.name}</Body>
        </button>
      {/each}
    </div>
  </ModalContent>
</Modal>

<style>
  .container {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .layout {
    color: var(--spectrum-body-m-text-color, var(--spectrum-alias-text-color));
    border: none;
    box-sizing: border-box;
    display: grid;
    place-items: center;
    background: var(--background-alt);
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    transition: 0.3s all;
    border-radius: var(--spacing-s);
  }
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
</style>

<script>
  import { Body } from "@budibase/bbui"
  import CreationPage from "@/components/common/CreationPage.svelte"
  import blank from "./images/blank.svg"
  import table from "./images/tableInline.svg"
  import form from "./images/formUpdate.svg"
  import CreateScreenModal from "./CreateScreenModal.svelte"
  import { screenStore } from "@/stores/builder"

  export let onClose = null

  let createScreenModal

  $: hasScreens = $screenStore.screens?.length
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="page">
  <CreationPage
    showClose={!!onClose}
    {onClose}
    heading={hasScreens ? "Create new screen" : "Create your first screen"}
  >
    <div class="subHeading">
      <Body>Start from scratch or create screens from your data</Body>
    </div>

    <div class="cards">
      <div class="card" on:click={() => createScreenModal.show("blank")}>
        <div class="image">
          <img alt="A blank screen" src={blank} />
        </div>
        <div class="text">
          <Body size="S">Blank</Body>
          <Body size="XS">Add an empty blank screen</Body>
        </div>
      </div>

      <div class="card" on:click={() => createScreenModal.show("table")}>
        <div class="image">
          <img alt="A table of data" src={table} />
        </div>
        <div class="text">
          <Body size="S">Table</Body>
          <Body size="XS">List rows in a table</Body>
        </div>
      </div>

      <div class="card" on:click={() => createScreenModal.show("form")}>
        <div class="image">
          <img alt="A form containing data" src={form} />
        </div>
        <div class="text">
          <Body size="S">Form</Body>
          <Body size="XS">Capture data from your users</Body>
        </div>
      </div>
    </div>
  </CreationPage>
</div>

<CreateScreenModal bind:this={createScreenModal} />

<style>
  .page {
    padding: 28px 40px 40px 40px;
  }

  .subHeading :global(p) {
    text-align: center;
    margin-top: 12px;
    margin-bottom: 36px;
    color: var(--spectrum-global-color-gray-600);
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
  }

  .card {
    max-width: 235px;
    transition: filter 150ms;
  }

  .card:hover {
    filter: brightness(1.1);
    cursor: pointer;
  }

  .image {
    border-radius: 4px 4px 0 0;
    width: 100%;
    max-height: 127px;
    overflow: hidden;
  }

  .image img {
    width: 100%;
  }

  .card .image {
    min-width: 235px;
    height: 127px;
    background-color: var(--grey-2);
  }

  .text {
    border: 1px solid var(--grey-4);
    border-radius: 0 0 4px 4px;
    padding: 8px 16px 13px 16px;
  }

  .text :global(p:nth-child(1)) {
    margin-bottom: 6px;
  }

  .text :global(p:nth-child(2)) {
    color: var(--grey-6);
  }
</style>

<script>
  import { Body } from "@budibase/bbui"
  import CreationPage from "components/common/CreationPage.svelte"
  import blankImage from "./blank.png"
  import tableImage from "./table.png"
  import CreateScreenModal from "./CreateScreenModal.svelte"
  import { store } from "builderStore"

  export let onClose = null

  let createScreenModal

  $: hasScreens = $store.screens?.length
</script>

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
          <img alt="" src={blankImage} />
        </div>
        <div class="text">
          <Body size="S">Blank screen</Body>
          <Body size="XS">Add an empty blank screen</Body>
        </div>
      </div>

      <div class="card" on:click={() => createScreenModal.show("table")}>
        <div class="image">
          <img alt="" src={tableImage} />
        </div>
        <div class="text">
          <Body size="S">Table</Body>
          <Body size="XS">View, edit and delete rows on a table</Body>
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

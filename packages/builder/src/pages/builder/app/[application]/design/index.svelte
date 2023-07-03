<script>
  import { store, selectedScreen } from "builderStore"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"
  import { Body } from "@budibase/bbui"
  import CreationPage from "components/common/CreationPage.svelte"
  import blankImage from "./blank.png"
  import tableImage from "./table.png"
  import CreateScreenModal from "./_components/CreateScreenModal.svelte"

  let loaded = false
  let createScreenModal

  onMount(() => {
    loaded = true
    if ($selectedScreen) {
      $redirect(`./${$selectedScreen._id}`)
    } else if ($store.screens?.length) {
      $redirect(`./${$store.screens[0]._id}`)
    } else {
      loaded = true
    }
  })
</script>

{#if loaded}
  <CreationPage showClose={false} heading="Create your first screen">
    <div class="subHeading">
      <Body size="L">Start from scratch or create screens from your data</Body>
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
{/if}

<CreateScreenModal bind:this={createScreenModal} />

<style>
  .subHeading :global(p) {
    text-align: center;
    margin-top: 12px;
    margin-bottom: 24px;
    color: var(--grey-6);
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .card {
    margin: 12px;
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

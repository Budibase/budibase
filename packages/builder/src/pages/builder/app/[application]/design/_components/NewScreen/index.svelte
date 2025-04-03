<script>
  import { Body, Tag, Tags } from "@budibase/bbui"
  import CreationPage from "@/components/common/CreationPage.svelte"
  import blank from "./images/blank.svg"
  import table from "./images/tableInline.svg"
  import form from "./images/formUpdate.svg"
  import pdf from "./images/pdf.svg"
  import CreateScreenModal from "./CreateScreenModal.svelte"
  import { screenStore } from "@/stores/builder"
  import { licensing } from "@/stores/portal"
  import { AutoScreenTypes } from "@/constants"

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
      <div
        class="card"
        on:click={() => createScreenModal.show(AutoScreenTypes.BLANK)}
      >
        <div class="image">
          <img alt="A blank screen" src={blank} />
        </div>
        <div class="text">
          <Body size="M">Blank</Body>
          <Body size="XS">Add an empty blank screen</Body>
        </div>
      </div>

      <div
        class="card"
        on:click={() => createScreenModal.show(AutoScreenTypes.TABLE)}
      >
        <div class="image">
          <img alt="A table of data" src={table} />
        </div>
        <div class="text">
          <Body size="M">Table</Body>
          <Body size="XS">List rows in a table</Body>
        </div>
      </div>

      <div
        class="card"
        on:click={() => createScreenModal.show(AutoScreenTypes.FORM)}
      >
        <div class="image">
          <img alt="A form containing data" src={form} />
        </div>
        <div class="text">
          <Body size="M">Form</Body>
          <Body size="XS">Capture data from your users</Body>
        </div>
      </div>

      <div
        class="card"
        class:disabled={!$licensing.pdfEnabled}
        on:click={$licensing.pdfEnabled
          ? () => createScreenModal.show(AutoScreenTypes.PDF)
          : null}
      >
        <div class="image">
          <img alt="A PDF document" src={pdf} width="185" />
        </div>
        <div class="text">
          <Body size="M">
            PDF
            {#if !$licensing.pdfEnabled}
              <Tags>
                <Tag icon="LockClosed">Premium</Tag>
              </Tags>
            {/if}
          </Body>
          <Body size="XS">Create, edit and export your PDF</Body>
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

  .card:not(.disabled):hover {
    filter: brightness(1.1);
    cursor: pointer;
  }

  .image {
    border-radius: 4px 4px 0 0;
    width: 100%;
    max-height: 127px;
    overflow: hidden;
    min-width: 235px;
    height: 127px;
    background-color: var(--grey-2);
    position: relative;
  }
  .card.disabled .image:after {
    content: "";
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
  }
  .image img {
    width: 100%;
  }

  .text {
    border: 1px solid var(--grey-4);
    border-radius: 0 0 4px 4px;
    padding: 12px 16px 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .text :global(p:first-child) {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }
  .text :global(p:nth-child(2)) {
    color: var(--spectrum-global-color-gray-600);
  }
</style>

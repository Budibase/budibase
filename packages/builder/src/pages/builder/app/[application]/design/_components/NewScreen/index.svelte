<script lang="ts">
  import CreationPage from "@/components/common/CreationPage.svelte"
  import { AutoScreenTypes } from "@/constants"
  import { appStore, screenStore, workspaceAppStore } from "@/stores/builder"
  import { licensing } from "@/stores/portal"
  import {
    Body,
    keepOpen,
    Modal,
    ModalCancelFrom,
    ModalContent,
    notifications,
    Tag,
    Tags,
  } from "@budibase/bbui"
  import CreateScreenModal from "./CreateScreenModal.svelte"
  import blank from "./images/blank.svg"
  import form from "./images/formUpdate.svg"
  import pdf from "./images/pdf.svg"
  import table from "./images/tableInline.svg"

  export let onClose: (() => void) | null = null
  export let inline: boolean = false
  export let submitOnClick: boolean = false
  export let workspaceAppId: string | undefined

  let title: string
  let rootModal: Modal
  let createScreenModal: CreateScreenModal
  let selectedType: AutoScreenTypes | undefined
  let currentStepIndex: number

  $: hasScreens = $screenStore.screens?.length
  $: title = hasScreens ? "Create new screen" : "Create your first screen"

  export const open = () => {
    currentStepIndex = 0
    selectedType = undefined
    rootModal.show()
  }

  function onSelect(screenType: AutoScreenTypes) {
    if (submitOnClick) {
      onConfirm(screenType)
    } else if (selectedType === screenType) {
      selectedType = undefined
    } else {
      selectedType = screenType
    }
  }

  async function onConfirm(type = selectedType) {
    if (!type) {
      notifications.error("Select screen type")
      return
    }
    rootModal.hide()
    if (!workspaceAppId) {
      const workspaceApp = await workspaceAppStore.add({
        name: $appStore.name,
        url: "/",
      })
      workspaceAppId = workspaceApp._id
    }
    createScreenModal.show(type, workspaceAppId)

    const selectedTypeSnapshot = selectedType
    createScreenModal.$on("cancel", e => {
      if (
        [ModalCancelFrom.CANCEL_BUTTON, ModalCancelFrom.ESCAPE_KEY].includes(
          e.detail
        )
      ) {
        selectedType = selectedTypeSnapshot
        rootModal.show()
      }
    })
  }
</script>

<Modal bind:this={rootModal} {inline}>
  <ModalContent
    title={inline ? "" : title}
    size="L"
    {onConfirm}
    onCancel={() => {
      if (currentStepIndex > 0) {
        currentStepIndex--
        return keepOpen
      }
    }}
    disabled={!selectedType}
    confirmText="Next"
    cancelText={currentStepIndex === 0 ? "Cancel" : "Back"}
    showDivider={!inline}
    showCloseIcon={!inline}
    showCancelButton={!inline}
    showConfirmButton={!submitOnClick}
  >
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <CreationPage showClose={!!onClose} {onClose} heading={inline ? title : ""}>
      <div class="subHeading" class:inline>
        <Body size="M">
          Start from scratch or create screens from your data
        </Body>
      </div>
      <div class="cards">
        <div
          class="card"
          on:click={() => onSelect(AutoScreenTypes.BLANK)}
          class:selected={selectedType === AutoScreenTypes.BLANK}
        >
          <div class="image">
            <img alt="A blank screen" src={blank} />
          </div>
          <div class="text">
            <Body
              size="M"
              weight="500"
              color="var(--spectrum-global-color-gray-900)">Blank</Body
            >
            <Body size="S">Add an empty blank screen</Body>
          </div>
        </div>

        <div
          class="card"
          on:click={() => onSelect(AutoScreenTypes.TABLE)}
          class:selected={selectedType === AutoScreenTypes.TABLE}
        >
          <div class="image">
            <img alt="A table of data" src={table} />
          </div>
          <div class="text">
            <Body
              size="M"
              weight="500"
              color="var(--spectrum-global-color-gray-900)">Table</Body
            >
            <Body size="S">List rows in a table</Body>
          </div>
        </div>

        <div
          class="card"
          on:click={() => onSelect(AutoScreenTypes.FORM)}
          class:selected={selectedType === AutoScreenTypes.FORM}
        >
          <div class="image">
            <img alt="A form containing data" src={form} />
          </div>
          <div class="text">
            <Body
              size="M"
              weight="500"
              color="var(--spectrum-global-color-gray-900)">Form</Body
            >
            <Body size="S">Capture data from your users</Body>
          </div>
        </div>

        <div
          class="card"
          class:disabled={!$licensing.pdfEnabled}
          on:click={$licensing.pdfEnabled
            ? () => onSelect(AutoScreenTypes.PDF)
            : null}
          class:selected={selectedType === AutoScreenTypes.PDF}
        >
          <div class="image">
            <img alt="A PDF document" src={pdf} width="185" />
          </div>
          <div class="text">
            <Body
              size="M"
              weight="500"
              color="var(--spectrum-global-color-gray-900)"
            >
              PDF
              {#if !$licensing.pdfEnabled}
                <Tags>
                  <Tag icon="lock" emphasized>Premium</Tag>
                </Tags>
              {/if}
            </Body>
            <Body size="S">Create, edit and export your PDF</Body>
          </div>
        </div>
      </div>
    </CreationPage>
  </ModalContent>
</Modal>

<CreateScreenModal bind:this={createScreenModal} />

<style>
  .subHeading {
    padding-bottom: var(--spacing-l);
  }
  .subHeading:not(.inline) {
    align-self: start;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  .card {
    width: 265px;
    transition: filter 150ms;
  }

  .card:not(.disabled):hover {
    filter: brightness(1.1);
    cursor: pointer;
  }

  .image {
    border-radius: 8px 8px 0 0;
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
    border: 1px solid var(--grey-2);
    border-radius: 0 0 8px 8px;
    padding: 12px 16px 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 46px;
  }
  .text :global(p:first-child) {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }
  .text :global(p:nth-child(2)) {
    color: var(--spectrum-global-color-gray-600);
  }

  .selected {
    border-radius: 8px;
    outline: 1px solid var(--blue);
  }
</style>

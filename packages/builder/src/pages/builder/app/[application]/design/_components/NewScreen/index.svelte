<script lang="ts">
  import CreationPage from "@/components/common/CreationPage.svelte"
  import { AutoScreenTypes } from "@/constants"
  import { screenStore, workspaceAppStore } from "@/stores/builder"
  import { featureFlags, licensing } from "@/stores/portal"
  import {
    Body,
    keepOpen,
    Modal,
    ModalCancelFrom,
    ModalContent,
    notifications,
    Select,
    Tag,
    Tags,
  } from "@budibase/bbui"
  import CreateScreenModal from "./CreateScreenModal.svelte"
  import blank from "./images/blank.svg"
  import form from "./images/formUpdate.svg"
  import pdf from "./images/pdf.svg"
  import table from "./images/tableInline.svg"

  const enum CreationStep {
    // eslint-disable-next-line no-unused-vars
    APP_PICKER = "app_picker",
    // eslint-disable-next-line no-unused-vars
    SCREEN_TYPE_PICKER = "screen_type_picker",
  }

  export let onClose: (() => void) | null = null
  export let inline: boolean = false
  export let submitOnClick: boolean = false

  let modalSteps: CreationStep[] = []
  let currentStepIndex: number

  let workspaceAppId: string
  let rootModal: Modal

  export const open = (addToWorkspaceId?: string) => {
    if (
      $featureFlags.WORKSPACE_APPS &&
      !addToWorkspaceId &&
      $workspaceAppStore.workspaceApps.length > 1
    ) {
      modalSteps = [CreationStep.APP_PICKER, CreationStep.SCREEN_TYPE_PICKER]
    } else {
      modalSteps = [CreationStep.SCREEN_TYPE_PICKER]
      workspaceAppId =
        addToWorkspaceId || $workspaceAppStore.workspaceApps[0]._id!
    }

    currentStepIndex = 0
    selectedType = undefined

    rootModal.show()
  }

  $: hasScreens = $screenStore.screens?.length
  let title: string
  $: {
    if (!workspaceAppId) {
      title = "Create new screen"
    } else {
      title = hasScreens ? "Create new screen" : "Create your first screen"
    }
  }

  let createScreenModal: CreateScreenModal
  let selectedType: AutoScreenTypes | undefined

  function onSelect(screenType: AutoScreenTypes) {
    if (submitOnClick) {
      onConfirm(screenType)
    } else if (selectedType === screenType) {
      selectedType = undefined
    } else {
      selectedType = screenType
    }
  }

  function onConfirm(type = selectedType) {
    if (!type) {
      notifications.error("Select screen type")
      return
    }
    rootModal.hide()
    createScreenModal.show(type)

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
  {#if modalSteps[currentStepIndex] === CreationStep.APP_PICKER}
    <ModalContent
      title="Create new screen"
      size="L"
      confirmText="Continue"
      disabled={!workspaceAppId}
      onConfirm={() => {
        currentStepIndex++
        return keepOpen
      }}
    >
      <div class:inline>
        Select which app you would like to add your screen to
      </div>
      <Select
        bind:value={workspaceAppId}
        options={$workspaceAppStore.workspaceApps}
        getOptionLabel={a => a.name}
        getOptionValue={a => a._id}
        getOptionIcon={() => undefined}
      />
    </ModalContent>
  {:else}
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
      <CreationPage
        showClose={!!onClose}
        {onClose}
        heading={inline ? title : ""}
      >
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
              <Body size="M">Blank</Body>
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
              <Body size="M">Table</Body>
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
              <Body size="M">Form</Body>
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
              <Body size="M">
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
  {/if}
</Modal>

<CreateScreenModal {workspaceAppId} bind:this={createScreenModal} />

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
    border-radius: 4px;
    outline: 1px solid var(--blue);
  }
</style>

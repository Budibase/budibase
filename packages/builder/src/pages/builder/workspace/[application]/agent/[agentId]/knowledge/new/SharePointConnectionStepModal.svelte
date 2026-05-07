<script lang="ts">
  import {
    Body,
    Button,
    ButtonGroup,
    Modal,
    ModalContent,
    Select,
  } from "@budibase/bbui"

  export interface SharePointConnectionOption {
    id: string
    name: string
    account: string
  }

  export interface Props {
    options: SharePointConnectionOption[]
    selectedConnectionId: string
    loadingNextStep?: boolean
    onNext: () => Promise<void> | void
    onConnectionChange: (_connectionId: string) => void
  }

  let {
    options,
    selectedConnectionId,
    loadingNextStep = false,
    onNext,
    onConnectionChange,
  }: Props = $props()

  let modal = $state<Modal>()

  export function show() {
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    custom
    showDivider={false}
    showConfirmButton={false}
    showCancelButton={false}
  >
    <div class="content">
      <div class="title">
        <Body size="S">Add from SharePoint</Body>
      </div>

      {#if options.length === 0}
        <Body size="S">No SharePoint OAuth2 auth configs found.</Body>
      {:else}
        <Select
          value={selectedConnectionId}
          on:change={e => e.detail && onConnectionChange(e.detail)}
          label="Select auth config"
          {options}
          getOptionLabel={o => `${o.name} - ${o.account}`}
          getOptionValue={o => o.id}
          sort
        />
      {/if}
    </div>

    <ButtonGroup slot="footer">
      <Button
        cta
        primary
        on:click={onNext}
        disabled={!selectedConnectionId || loadingNextStep}
      >
        {loadingNextStep ? "Loading..." : "Next"}
      </Button>
    </ButtonGroup>
  </ModalContent>
</Modal>

<style>
  .content {
    padding: var(--spacing-l);
    width: min(460px, 95vw);
  }

  .title {
    padding-bottom: var(--spacing-s);
  }
</style>

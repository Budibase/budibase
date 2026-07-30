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
    hasSharePointDatasource?: boolean
    onNext: () => Promise<void> | void
    onConfigure: () => Promise<void> | void
    onConnectionChange: (_connectionId: string) => void
  }

  let {
    options,
    selectedConnectionId,
    loadingNextStep = false,
    hasSharePointDatasource = false,
    onNext,
    onConfigure,
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
        {#if hasSharePointDatasource}
          <Body size="S">
            Your SharePoint connection cannot be used for Agent Knowledge
            because it does not have an OAuth2 client credentials auth config.
            Add one to continue.
          </Body>
        {:else}
          <Body size="S">No SharePoint connections found.</Body>
        {/if}
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
      {#if options.length === 0 && hasSharePointDatasource}
        <Button cta primary on:click={onConfigure}>Configure connection</Button>
      {:else}
        <Button
          cta
          primary
          on:click={onNext}
          disabled={!selectedConnectionId || loadingNextStep}
        >
          {loadingNextStep ? "Loading..." : "Next"}
        </Button>
      {/if}
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

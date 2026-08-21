<script lang="ts">
  import {
    Body,
    Heading,
    Label,
    Modal,
    ModalContent,
    Select,
  } from "@budibase/bbui"
  import { ToolExecutionPrincipal } from "@budibase/types"
  import ToolIcon from "./ToolIcon.svelte"
  import type { AgentTool } from "./toolTypes"

  export let onSave: (args: {
    tool: AgentTool
    executionPrincipal: ToolExecutionPrincipal
  }) => void | Promise<void>
  export let onRemove: (tool: AgentTool) => void
  export let onClose: (() => void) | undefined = undefined

  let modal: Modal
  let tool: AgentTool | undefined
  let principalConfigurable = false
  let adding = false
  let executionPrincipal = ToolExecutionPrincipal.REQUESTER

  const options = [
    { label: "Requester", value: ToolExecutionPrincipal.REQUESTER },
    { label: "Admin (elevated)", value: ToolExecutionPrincipal.ADMIN },
  ]

  export const show = (
    selectedTool: AgentTool,
    principal: ToolExecutionPrincipal,
    canConfigurePrincipal: boolean,
    isAdding = false
  ) => {
    tool = selectedTool
    executionPrincipal = principal
    principalConfigurable = canConfigurePrincipal
    adding = isAdding
    modal.show()
  }

  const save = async () => {
    if (tool) {
      await onSave({ tool, executionPrincipal })
    }
  }

  const remove = () => {
    if (tool) {
      onRemove(tool)
    }
  }
</script>

<Modal bind:this={modal} on:hide={() => onClose?.()}>
  <ModalContent
    size="M"
    confirmText={adding ? "Add tool" : "Save tool"}
    showConfirmButton={adding || principalConfigurable}
    showSecondaryButton={!adding}
    secondaryButtonText="Remove tool"
    secondaryButtonWarning
    secondaryAction={remove}
    onConfirm={save}
  >
    <div slot="header" class="modal-title">
      {#if tool}
        <ToolIcon icon={tool.icon} size="S" fallbackIcon="Wrench" />
        <Heading size="S">
          {adding ? "Add" : "Configure"}
          {tool.readableBinding}
        </Heading>
      {/if}
    </div>

    {#if tool}
      <div class="configuration-field">
        <div class="field-copy">
          <Label size="M">Run as</Label>
          <Body size="XS" color="var(--spectrum-global-color-gray-700)">
            Choose the role used to access data and perform this action.
          </Body>
        </div>
        <Select
          size="M"
          bind:value={executionPrincipal}
          placeholder={false}
          {options}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          disabled={!principalConfigurable}
        />
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .modal-title {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: var(--spacing-s);
  }

  .configuration-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .field-copy {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>

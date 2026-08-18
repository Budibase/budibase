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
  }) => void
  export let onRemove: (tool: AgentTool) => void

  let modal: Modal
  let tool: AgentTool | undefined
  let principalConfigurable = false
  let executionPrincipal = ToolExecutionPrincipal.REQUESTER

  const options = [
    { label: "Requester", value: ToolExecutionPrincipal.REQUESTER },
    { label: "Admin (elevated)", value: ToolExecutionPrincipal.ADMIN },
  ]

  export const show = (
    selectedTool: AgentTool,
    principal: ToolExecutionPrincipal,
    canConfigurePrincipal: boolean
  ) => {
    tool = selectedTool
    executionPrincipal = principal
    principalConfigurable = canConfigurePrincipal
    modal.show()
  }

  const save = () => {
    if (tool) {
      onSave({ tool, executionPrincipal })
    }
  }

  const remove = () => {
    if (tool) {
      const selectedTool = tool
      setTimeout(() => onRemove(selectedTool))
    }
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    size="M"
    confirmText="Save tool"
    showSecondaryButton
    secondaryButtonText="Remove tool"
    secondaryButtonWarning
    secondaryAction={remove}
    onConfirm={save}
  >
    <div slot="header" class="modal-title">
      {#if tool}
        <ToolIcon icon={tool.icon} size="S" fallbackIcon="Wrench" />

        <Heading size="S">Configure {tool.readableBinding}</Heading>
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
          value={executionPrincipal}
          {options}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          disabled={!principalConfigurable}
          on:change={event =>
            (executionPrincipal = event.detail as ToolExecutionPrincipal)}
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

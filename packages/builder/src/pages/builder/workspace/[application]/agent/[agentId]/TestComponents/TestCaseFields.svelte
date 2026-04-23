<script lang="ts">
  import { Select, TextArea } from "@budibase/bbui"
  import type { AgentTestCase } from "@budibase/types"

  type GroupOption = {
    label: string
    value: string
  }

  type Props = {
    selectedCase: AgentTestCase
    groupOptions: GroupOption[]
    onUpdateCase: (
      _updater: (_testCase: AgentTestCase) => AgentTestCase
    ) => void
  }

  let { selectedCase, groupOptions, onUpdateCase }: Props = $props()

  const updateInput = (event: CustomEvent<string>) =>
    onUpdateCase(testCase => ({ ...testCase, input: event.detail }))

  const updateGroup = (groupId: string) =>
    onUpdateCase(testCase => ({ ...testCase, groupId }))
</script>

<div class="case-fields">
  <div class="group-field">
    <Select
      value={selectedCase.groupId}
      options={groupOptions}
      placeholder={false}
      getOptionLabel={option => option.label}
      getOptionValue={option => option.value}
      on:change={event => updateGroup(event.detail)}
    />
  </div>

  <TextArea
    placeholder="Ask the agent a question, paste a prompt, or describe the incoming system message..."
    value={selectedCase.input}
    minHeight={156}
    updateOnChange
    on:change={updateInput}
  />
</div>

<style>
  .case-fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .case-fields :global(.spectrum-Field) {
    width: 100%;
  }

  .group-field {
    width: 100%;
  }
</style>

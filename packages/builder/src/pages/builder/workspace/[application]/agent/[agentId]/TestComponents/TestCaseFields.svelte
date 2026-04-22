<script lang="ts">
  import { TextArea } from "@budibase/bbui"
  import type { AgentTestCase } from "@budibase/types"

  type Props = {
    selectedCase: AgentTestCase
    onUpdateCase: (
      _updater: (_testCase: AgentTestCase) => AgentTestCase
    ) => void
  }

  let { selectedCase, onUpdateCase }: Props = $props()

  const updateInput = (event: CustomEvent<string>) =>
    onUpdateCase(testCase => ({ ...testCase, input: event.detail }))
</script>

<div class="case-fields">
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
  }

  .case-fields :global(.spectrum-Field) {
    width: 100%;
  }
</style>

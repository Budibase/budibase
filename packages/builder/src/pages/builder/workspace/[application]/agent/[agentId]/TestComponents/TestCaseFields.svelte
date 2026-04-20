<script lang="ts">
  import { Input, TextArea } from "@budibase/bbui"
  import type { AgentTestCase } from "@budibase/types"

  type Props = {
    selectedCase: AgentTestCase
    onUpdateCase: (
      _updater: (_testCase: AgentTestCase) => AgentTestCase
    ) => void
  }

  let { selectedCase, onUpdateCase }: Props = $props()

  const updateField =
    (field: "name" | "input") => (event: CustomEvent<string>) =>
      onUpdateCase(testCase => ({ ...testCase, [field]: event.detail }))
</script>

<div class="case-fields">
  <Input
    label="Test name"
    value={selectedCase.name}
    on:change={updateField("name")}
  />

  <TextArea
    label="Input"
    value={selectedCase.input}
    height={140}
    on:change={updateField("input")}
  />
</div>

<style>
  .case-fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
</style>

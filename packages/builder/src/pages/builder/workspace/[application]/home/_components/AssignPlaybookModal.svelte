<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { ModalContent } from "@budibase/bbui"
  import type { HomeRow, PlaybookResponse } from "@budibase/types"

  export let row: HomeRow | null = null
  export let playbooks: PlaybookResponse[] = []

  const dispatch = createEventDispatcher<{
    confirm: string | undefined
  }>()

  let selectedPlaybookId = ""

  $: selectedPlaybookId = row?.playbookId || ""
</script>

<ModalContent
  title={`Assign playbook${row ? ` to ${row.name}` : ""}`}
  confirmText="Save"
  size="M"
  onConfirm={() => dispatch("confirm", selectedPlaybookId || undefined)}
>
  <label class="field">
    <span class="label">Playbook</span>
    <select bind:value={selectedPlaybookId}>
      <option value="">No playbook</option>
      {#each playbooks as playbook}
        <option value={playbook._id}>{playbook.name}</option>
      {/each}
    </select>
  </label>
</ModalContent>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .label {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }

  select {
    min-height: 32px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 6px;
    padding: 0 10px;
    background: white;
  }
</style>

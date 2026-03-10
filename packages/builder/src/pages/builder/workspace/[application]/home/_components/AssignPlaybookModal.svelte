<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body, ModalContent, Select } from "@budibase/bbui"
  import type { HomeRow, PlaybookResponse } from "@budibase/types"

  export let row: HomeRow | null = null
  export let playbooks: PlaybookResponse[] = []

  const dispatch = createEventDispatcher<{
    confirm: string | undefined
  }>()

  interface PlaybookOption {
    label: string
    value: string
    color?: string
  }

  let selectedPlaybookId = ""
  let playbookOptions: PlaybookOption[] = []

  $: selectedPlaybookId = row?.playbookId || ""
  $: playbookOptions = [
    { label: "No playbook", value: "", color: undefined },
    ...playbooks.map(playbook => ({
      label: playbook.name,
      value: playbook._id,
      color: playbook.color,
    })),
  ] satisfies PlaybookOption[]
</script>

<ModalContent
  title={`Assign playbook${row ? ` to ${row.name}` : ""}`}
  confirmText="Save"
  size="M"
  onConfirm={() => dispatch("confirm", selectedPlaybookId || undefined)}
>
  {#if row}
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Choose which playbook this {row.type} belongs to.
    </Body>
  {/if}

  <Select
    label="Playbook"
    bind:value={selectedPlaybookId}
    options={playbookOptions}
    getOptionLabel={option => option.label}
    getOptionValue={option => option.value}
    getOptionColour={option => option.color}
  />
</ModalContent>

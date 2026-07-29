<script lang="ts">
  import {
    Body,
    ActionButton,
    Button,
    Helpers,
    Icon,
    Input,
    ListItem,
    Popover,
    type PopoverAPI,
    Select,
    Toggle,
  } from "@budibase/bbui"
  import type {
    AgentOperation,
    AgentRequestInputDefinition,
  } from "@budibase/types"

  let {
    operation = $bindable(),
    onUpdated,
  }: {
    operation: AgentOperation
    onUpdated: () => Promise<boolean>
  } = $props()

  let popover: PopoverAPI
  let editorAnchor = $state<HTMLElement>()
  let editingId = $state<string | undefined>()
  let name = $state("")
  let required = $state(false)
  let touched = $state(false)

  let inputs = $derived(operation.requestInputs ?? [])
  let trimmedName = $derived(name.trim())
  let nameError = $derived.by(() => {
    if (!touched) return undefined
    if (!trimmedName) return "Name is required"
    const duplicate = inputs.some(
      input =>
        input.id !== editingId &&
        input.name.trim().toLowerCase() === trimmedName.toLowerCase()
    )
    return duplicate ? "Input names must be unique" : undefined
  })

  const showEditor = (
    anchor: HTMLElement,
    input?: AgentRequestInputDefinition
  ) => {
    editorAnchor = anchor
    editingId = input?.id
    name = input?.name ?? ""
    required = input?.required ?? false
    touched = false
    popover.show()
  }

  const save = async () => {
    touched = true
    if (!trimmedName || nameError) return

    const input: AgentRequestInputDefinition = {
      id: editingId ?? `request_input_${Helpers.uuid()}`,
      name: trimmedName,
      type: "text",
      required,
    }
    operation.requestInputs = editingId
      ? inputs.map(existing => (existing.id === editingId ? input : existing))
      : [...inputs, input]
    await onUpdated()
    popover.hide()
  }

  const remove = async () => {
    if (!editingId) return
    operation.requestInputs = inputs.filter(input => input.id !== editingId)
    await onUpdated()
    popover.hide()
  }
</script>

<div class="request-inputs">
  <div>
    <Body size="S" color="var(--spectrum-global-color-gray-900)">
      Required information
    </Body>
    <Body size="XS" color="var(--spectrum-global-color-gray-700)">
      The information required to complete this operation.
    </Body>
  </div>

  <ActionButton
    size="S"
    icon="plus"
    on:click={event => showEditor(event.currentTarget as HTMLElement)}
  >
    Add request input
  </ActionButton>

  <div class="input-list">
    {#each inputs as input (input.id)}
      <div>
        <ListItem
          title={input.name}
          hoverable
          on:click={event =>
            showEditor(event.currentTarget as HTMLElement, input)}
        >
          <svelte:fragment slot="right">
            <Icon name="dots-three" size="S" />
          </svelte:fragment>
        </ListItem>
      </div>
    {/each}
  </div>
</div>

<Popover
  bind:this={popover}
  anchor={editorAnchor}
  align="left"
  minWidth={320}
  maxWidth={320}
  resizable={false}
>
  <form
    class="input-form"
    onsubmit={event => {
      event.preventDefault()
      save()
    }}
  >
    <Input
      label="Name"
      bind:value={name}
      error={nameError}
      on:input={() => (touched = true)}
    />
    <Select
      label="Type"
      value="text"
      options={[{ label: "Text", value: "text" }]}
    />
    <Toggle text="Required" bind:value={required} />
    <div class="input-form__actions">
      {#if editingId}
        <Button quiet overBackground on:click={remove}>Delete</Button>
      {/if}
      <Button
        cta
        type="submit"
        disabled={!trimmedName || !!nameError}
        on:click={save}
      >
        Save
      </Button>
    </div>
  </form>
</Popover>

<style>
  .request-inputs {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-m);
  }

  .input-form {
    box-sizing: border-box;
    width: 320px;
    padding: var(--spacing-xl) var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    background: var(--spectrum-global-color-gray-50);
  }

  .input-form__actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }

  .input-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
</style>

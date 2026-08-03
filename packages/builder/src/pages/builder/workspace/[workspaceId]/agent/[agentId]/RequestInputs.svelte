<script lang="ts">
  import {
    ActionButton,
    Body,
    Button,
    Helpers,
    Input,
    ListItem,
    PillInput,
    Popover,
    type PopoverAPI,
    Select,
    Toggle,
  } from "@budibase/bbui"
  import type {
    AgentOperation,
    AgentRequestInputDefinition,
  } from "@budibase/types"
  import { confirm } from "@/helpers/confirm"

  let {
    operation = $bindable(),
    onUpdated,
  }: {
    operation: AgentOperation
    onUpdated: () => Promise<boolean>
  } = $props()

  let popover: PopoverAPI
  let addButton = $state<HTMLButtonElement>()
  let editorAnchor = $state<HTMLElement>()
  let editingId = $state<string | undefined>()
  let name = $state("")
  let type = $state<AgentRequestInputDefinition["type"]>("text")
  let options = $state<string[]>([])
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
  let optionsError = $derived.by(() => {
    if (!touched || type !== "select") return undefined
    if (!options.length) return "At least one option is required"
    const normalized = options.map(option => option.trim().toLowerCase())
    return new Set(normalized).size !== normalized.length
      ? "Options must be unique"
      : undefined
  })

  const showEditor = (
    anchor: HTMLElement,
    input?: AgentRequestInputDefinition
  ) => {
    editorAnchor = anchor
    editingId = input?.id
    name = input?.name ?? ""
    type = input?.type ?? "text"
    options = [...(input?.options ?? [])]
    required = input?.required ?? false
    touched = false
    popover.show()
  }

  const showEditorFromContextMenu = (
    event: MouseEvent,
    input: AgentRequestInputDefinition
  ) => {
    event.preventDefault()
    event.stopPropagation()
    showEditor(event.currentTarget as HTMLElement, input)
  }

  const save = async () => {
    touched = true
    if (!trimmedName || nameError || optionsError) return

    const isEditing = !!editingId
    const inputId = editingId ?? `request_input_${Helpers.uuid()}`
    editingId = inputId
    const inputBase = {
      id: inputId,
      name: trimmedName,
      required,
    }
    const input: AgentRequestInputDefinition =
      type === "select"
        ? { ...inputBase, type, options }
        : { ...inputBase, type }
    operation.requestInputs = isEditing
      ? inputs.map(existing => (existing.id === inputId ? input : existing))
      : [...inputs, input]
    await onUpdated()
    popover.hide()
  }

  const remove = async (inputId: string) => {
    operation.requestInputs = inputs.filter(input => input.id !== inputId)
    await onUpdated()
    popover.hide()
  }

  const confirmRemove = async () => {
    const inputToRemove = inputs.find(input => input.id === editingId)
    if (!inputToRemove) return

    popover.hide()
    const confirmed = await confirm({
      title: "Confirm deletion",
      body: `Delete the “${inputToRemove.name}” request input?`,
      okText: "Delete",
      warning: true,
    })
    if (confirmed) {
      await remove(inputToRemove.id)
    } else {
      popover.show()
    }
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

  <Button
    bind:ref={addButton}
    size="S"
    icon="plus"
    secondary
    on:click={() => addButton && showEditor(addButton)}
  >
    Add request input
  </Button>

  <div class="input-list" role="list">
    {#each inputs as input (input.id)}
      <div
        role="listitem"
        oncontextmenu={event => showEditorFromContextMenu(event, input)}
      >
        <ListItem title={input.name}>
          <svelte:fragment slot="right">
            <ActionButton
              quiet
              noPadding
              icon="dots-three"
              size="S"
              on:click={event =>
                showEditor(event.currentTarget as HTMLElement, input)}
            />
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
      autofocus
      label="Name"
      bind:value={name}
      error={nameError}
      on:input={() => (touched = true)}
    />
    <Select
      label="Type"
      bind:value={type}
      options={[
        { label: "Text", value: "text" },
        { label: "Number", value: "number" },
        { label: "Select", value: "select" },
      ]}
    />
    {#if type === "select"}
      <PillInput
        label="Options"
        bind:value={options}
        error={optionsError}
        placeholder="Add an option"
      />
    {/if}
    <Toggle text="Required" bind:value={required} />
    <div class="input-form__actions">
      {#if editingId}
        <Button type="button" quiet overBackground on:click={confirmRemove}>
          Delete
        </Button>
      {/if}
      <Button
        cta
        type="submit"
        disabled={!trimmedName || !!nameError || !!optionsError}
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

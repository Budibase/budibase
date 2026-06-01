<script lang="ts">
  let {
    value = "",
    onSave = (_value: string) => {},
  }: {
    value?: string
    onSave?: (_value: string) => void
  } = $props()

  let editing = $state(false)
  let draft = $state(value)

  $effect(() => {
    if (!editing) {
      draft = value
    }
  })

  const startEditing = () => {
    editing = true
    draft = value
  }

  const stopEditing = () => {
    editing = false
    onSave(draft)
  }
</script>

<input
  class="operation-title-input"
  value={draft}
  onclick={startEditing}
  oninput={event => {
    const target = event.target as HTMLInputElement
    draft = target.value
  }}
  onkeydown={event => {
    if (event.key === "Enter") {
      stopEditing()
    }
  }}
  onblur={stopEditing}
/>

<style>
  .operation-title-input {
    width: 100%;
    background: transparent;
    border: 1px solid transparent;
    color: var(--spectrum-global-color-gray-900);
    font-size: var(--spectrum-global-dimension-font-size-100);
    font-family: var(--font-sans);
    font-weight: 500;
    padding: 0;
    text-overflow: ellipsis;
  }

  .operation-title-input:focus {
    outline: none;
  }
</style>

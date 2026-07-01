<svelte:options runes={true} />

<script lang="ts">
  import { createEventDispatcher } from "svelte"

  interface Props {
    value?: string | undefined
    disabled?: boolean
  }

  let { value = $bindable<string | undefined>(""), disabled = false }: Props =
    $props()

  const dispatch = createEventDispatcher<{
    change: string | undefined
  }>()

  const clear = () => {
    value = undefined
    dispatch("change", value)
  }
</script>

<label>
  <span>Color</span>
  <input aria-label="Color" bind:value {disabled} />
</label>
<button type="button" onclick={clear} {disabled}>Clear color</button>

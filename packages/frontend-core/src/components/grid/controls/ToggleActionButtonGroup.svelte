<script>
  import { createEventDispatcher } from "svelte"

  import { ActionButton } from "@budibase/bbui"

  export let value
  export let options

  let dispatch = createEventDispatcher()
  const onClick = value => {
    dispatch("change", value)
  }
</script>

<div>
  {#each options as option}
    <ActionButton
      on:click={() => onClick(option.value)}
      size="S"
      icon={option.icon}
      quiet
      selected={option.value === value}
    />
  {/each}
</div>

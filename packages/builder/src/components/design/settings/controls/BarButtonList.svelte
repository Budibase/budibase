<script>
  import { ActionButton, ActionGroup } from "@budibase/bbui"

  export let value
  export let onChange
  export let options
</script>

<ActionGroup>
  {#each options as option}
    <ActionButton
      icon={option.barIcon}
      quiet={option.value !== value}
      on:click={() => onChange(option.value)}
    />
  {/each}
</ActionGroup>

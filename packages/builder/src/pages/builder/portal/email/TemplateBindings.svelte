<script>
  import {
    Body,
    Menu,
    MenuItem,
    Detail,
    MenuSection,
    DetailSummary,
  } from "@budibase/bbui"

  export let bindings
  export let onBindingClick = () => {}
</script>

<Menu>
  {#each bindings as binding}
    <MenuItem on:click={() => onBindingClick(binding)}>
      <Detail size="M">{binding.name}</Detail>
      <Body size="XS" noPadding>{binding.description}</Body>
    </MenuItem>
  {/each}
</Menu>

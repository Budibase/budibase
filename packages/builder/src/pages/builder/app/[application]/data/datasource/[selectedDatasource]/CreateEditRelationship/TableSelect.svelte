<script>
  import { Menu, Icon, MenuSection, MenuItem } from "@budibase/bbui"

  export let heading
  export let tables
  export let selected = false
  export let select
</script>

<Menu>
  <MenuSection {heading}>
    {#each tables as table}
      <MenuItem noClose icon="Table" on:click={() => select(table)}>
        {table.name}
        {#if selected}
          <Icon size="S" name="Checkmark" />
        {/if}
      </MenuItem>
    {/each}
  </MenuSection>
</Menu>

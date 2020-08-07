<script>
  import { backendUiStore } from "builderStore"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import { ModelSetupNav } from "components/nav/ModelSetupNav"
  import ModelFieldEditor from "components/nav/ModelSetupNav/ModelFieldEditor.svelte"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"

  let anchor
  let dropdown
  let fieldName
</script>

<div bind:this={anchor}>
  <Button text small on:click={dropdown.show}>
    <Icon name="addcolumn" />
    Create New Column
  </Button>
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  <h4>Create Column</h4>
  <CreateEditColumn onClosed={dropdown.hide} />
</DropdownMenu>

<style>
  h4 {
    padding: var(--spacing-l);
    margin: 0;
  }
</style>

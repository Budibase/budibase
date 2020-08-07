<script>
  import { backendUiStore } from "builderStore"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import { ModelSetupNav } from "components/nav/ModelSetupNav"
  import ModelFieldEditor from "components/nav/ModelSetupNav/ModelFieldEditor.svelte"
  import CreateEditTable from "../modals/CreateEditTable.svelte"

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
  <CreateEditTable onClosed={dropdown.hide} />
</DropdownMenu>

<style>
</style>

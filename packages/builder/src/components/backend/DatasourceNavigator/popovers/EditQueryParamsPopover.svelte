<!--<script>
  import { backendUiStore, store, allScreens } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu, Button, Input, TextButton, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import IntegrationConfigForm from "../TableIntegrationMenu//IntegrationConfigForm.svelte"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"
  import ParameterBuilder from "components/integration/QueryParameterBuilder.svelte"

  export let bindable
  export let parameters

  let anchor
  let dropdown
  let confirmDeleteDialog

  function hideEditor() {
    dropdown?.hide()
  }
</script><div on:click|stopPropagation bind:this={anchor}>
  <TextButton text on:click={dropdown.show} active={false}>
    <Icon name="add" />
    Add Parameters
  </TextButton>
  <DropdownMenu align="right" {anchor} bind:this={dropdown}>
    <div class="wrapper">
      <ParameterBuilder bind:parameters {bindable} />
    </div>
  </DropdownMenu>
</div><style>
  .wrapper {
    padding: var(--spacing-xl);
    min-width: 600px;
  }
</style>-->

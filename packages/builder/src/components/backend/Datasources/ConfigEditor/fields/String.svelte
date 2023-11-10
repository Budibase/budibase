<script>
  import { Label, EnvDropdown } from "@budibase/bbui"
  import { environment, licensing } from "stores/portal"

  export let type
  export let name
  export let value
  export let error
  export let showModal = () => {}

  async function handleUpgradePanel() {
    await environment.upgradePanelOpened()
    $licensing.goToUpgradePage()
  }
</script>

<div class="form-row">
  <Label>{name}</Label>
  <EnvDropdown
    on:change
    on:blur
    type={type === "port" ? "string" : type}
    {value}
    {error}
    variables={$environment.variables}
    environmentVariablesEnabled={$licensing.environmentVariablesEnabled}
    {showModal}
    {handleUpgradePanel}
  />
</div>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>

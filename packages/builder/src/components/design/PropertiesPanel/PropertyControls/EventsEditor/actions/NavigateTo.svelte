<script>
  import { Label, Checkbox } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { _ as t } from "svelte-i18n"

  export let parameters
  export let bindings = []
</script>

<div class="root">
  <Label small>Screen</Label>
  <DrawerBindableInput
    title={$t("destination-url")}
    placeholder="/screen"
    value={parameters.url}
    on:change={value => (parameters.url = value.detail)}
    {bindings}
  />
  <div />
  <Checkbox text={$t("open-screen-in-modal")} bind:value={parameters.peek} />
</div>

<style>
  .root {
    display: grid;
    align-items: center;
    gap: var(--spacing-m);
    grid-template-columns: auto 1fr;
    max-width: 800px;
    margin: 0 auto;
  }
</style>

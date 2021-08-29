<script>
  import { Select, Label, Stepper } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { getActionProviderComponents } from "builderStore/dataBinding"
  import { onMount } from "svelte"
  import { _ as t } from "svelte-i18n"

  export let parameters

  $: actionProviders = getActionProviderComponents(
    $currentAsset,
    $store.selectedComponentId,
    "ChangeFormStep"
  )

  const typeOptions = [
    {
      label: $t("next-step"),
      value: "next",
    },
    {
      label: $t("previous-step"),
      value: "prev",
    },
    {
      label: $t("first-step"),
      value: "first",
    },
    {
      label: $t("specific-step"),
      value: "specific",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "next"
    }
  })
</script>

<div class="root">
  <Label small>{$t("Form")}</Label>
  <Select
    placeholder={null}
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x._instanceName}
    getOptionValue={x => x._id}
  />
  <Label small>{$t("step")}</Label>
  <Select bind:value={parameters.type} options={typeOptions} />
  {#if parameters.type === "specific"}
    <Label small>{$t("number")}</Label>
    <Stepper bind:value={parameters.number} />
  {/if}
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>

<script>
  import { _ } from "../../../lang/i18n"
  import { Body, Heading, Icon, Input, Layout } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let bindable = true
  export let queryBindings = []
  export let bindings = []
  export let customParams = {}

  function deleteQueryBinding(idx) {
    queryBindings.splice(idx, 1)
    queryBindings = queryBindings
  }

  // This is necessary due to the way readable and writable bindings are stored.
  // The readable binding in the UI gets converted to a UUID value that the client understands
  // for parsing, then converted back so we can display it the readable form in the UI
  function onBindingChange(param, valueToParse) {
    customParams[param] = readableToRuntimeBinding(bindings, valueToParse)
  }
</script>

<Layout noPadding={bindable} gap="S">
  <div class="controls" class:height={!bindable}>
    <Heading size="XS"
      >{$_("components.integration.QueryBindingsBuilder.Bindings")}</Heading
    >
  </div>
  <Body size="S">
    {#if !bindable}
      {$_("components.integration.QueryBindingsBuilder.Bindings_come")}
    {:else}
      {$_("components.integration.QueryBindingsBuilder.Enter_value")}
    {/if}
  </Body>
  <div class="bindings" class:bindable>
    {#each queryBindings as binding, idx}
      <Input
        placeholder={$_(
          "components.integration.QueryBindingsBuilder.Binding_name"
        )}
        thin
        disabled={bindable}
        bind:value={binding.name}
      />
      <Input
        placeholder={$_("components.integration.QueryBindingsBuilder.Default")}
        thin
        disabled={bindable}
        on:change={evt => onBindingChange(binding.name, evt.detail)}
        bind:value={binding.default}
      />
      {#if bindable}
        <DrawerBindableInput
          title={`${$_(
            "components.integration.QueryBindingsBuilder.Query_binding"
          )} "${binding.name}"`}
          placeholder={$_("components.integration.QueryBindingsBuilder.Value")}
          thin
          on:change={evt => onBindingChange(binding.name, evt.detail)}
          value={runtimeToReadableBinding(
            bindings,
            customParams?.[binding.name]
          )}
          {bindings}
        />
      {:else}
        <Icon hoverable name="Close" on:click={() => deleteQueryBinding(idx)} />
      {/if}
    {/each}
  </div>
</Layout>

<style>
  .bindings.bindable {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .bindings {
    display: grid;
    grid-template-columns: 1fr 1fr 5%;
    grid-gap: 10px;
    align-items: center;
  }

  .height {
    height: 40px;
  }
</style>

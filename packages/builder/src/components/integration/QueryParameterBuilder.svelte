<script>
  import { Icon, Body, Button, Input, Heading, Layout } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { _ as t } from "svelte-i18n"

  export let bindable = true
  export let parameters = []
  export let bindings = []
  export let customParams = {}

  function newQueryParameter() {
    parameters = [...parameters, {}]
  }

  function deleteQueryParameter(idx) {
    parameters.splice(idx, 1)
    parameters = parameters
  }

  // This is necessary due to the way readable and writable bindings are stored.
  // The readable binding in the UI gets converted to a UUID value that the client understands
  // for parsing, then converted back so we can display it the readable form in the UI
  function onBindingChange(param, valueToParse) {
    const parsedBindingValue = readableToRuntimeBinding(bindings, valueToParse)
    customParams[param] = parsedBindingValue
  }
</script>

<Layout paddingX="none" gap="S">
  <div class="controls">
    <Heading size="XS">{ $t('parameters') }</Heading>
    {#if !bindable}
      <Button secondary on:click={newQueryParameter}>{ $t('add-param') }</Button>
    {/if}
  </div>
  <Body size="S">
    {#if !bindable}
      { $t('parameters-come-in-two-parts-the-parameter-name-and-a-default-fallback-value') }
    {:else}
      { $t('enter-a-value-for-each-parameter-the-default-values-will-be-used-for-any-values-left-blank') }
    {/if}
  </Body>
  <div class="parameters" class:bindable>
    {#each parameters as parameter, idx}
      <Input
        placeholder={ $t('parameter-name') }
        thin
        disabled={bindable}
        bind:value={parameter.name}
      />
      <Input
        placeholder="Default"
        thin
        disabled={bindable}
        bind:value={parameter.default}
      />
      {#if bindable}
        <DrawerBindableInput
          title={$t('query-parameter') + ` "${parameter.name}"`}
          placeholder="Value"
          thin
          on:change={evt => onBindingChange(parameter.name, evt.detail)}
          value={runtimeToReadableBinding(
            bindings,
            customParams?.[parameter.name]
          )}
          {bindings}
        />
      {:else}
        <Icon
          hoverable
          name="Close"
          on:click={() => deleteQueryParameter(idx)}
        />
      {/if}
    {/each}
  </div>
</Layout>

<style>
  .parameters.bindable {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
  }

  .parameters {
    display: grid;
    grid-template-columns: 1fr 1fr 5%;
    grid-gap: 10px;
    align-items: center;
  }
</style>

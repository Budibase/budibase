<script>
  import { Body, Button, Input, Heading, Spacer } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import DrawerBindableInput from "components/common/DrawerBindableInput.svelte"

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

<section>
  <div class="controls">
    <Heading small lh>Parameters</Heading>
    {#if !bindable}
      <Button secondary on:click={newQueryParameter}>Add Param</Button>
    {/if}
  </div>
  <Body small grey>
    {#if !bindable}
      Parameters come in two parts: the parameter name, and a default/fallback
      value.
    {:else}
      Enter a value for each parameter. The default values will be used for any
      values left blank.
    {/if}
  </Body>
  <Spacer large />
  <div class="parameters" class:bindable>
    {#each parameters as parameter, idx}
      <Input
        placeholder="Parameter Name"
        thin
        disabled={bindable}
        bind:value={parameter.name} />
      <Input
        placeholder="Default"
        thin
        disabled={bindable}
        bind:value={parameter.default} />
      {#if bindable}
        <DrawerBindableInput
          title={`Query parameter "${parameter.name}"`}
          placeholder="Value"
          thin
          on:change={evt => onBindingChange(parameter.name, evt.detail)}
          value={runtimeToReadableBinding(bindings, customParams?.[parameter.name])}
          {bindings} />
      {:else}
        <i
          class="ri-close-circle-line delete"
          on:click={() => deleteQueryParameter(idx)} />
      {/if}
    {/each}
  </div>
</section>

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
    margin-bottom: var(--spacing-xl);
  }

  .delete {
    transition: all 0.2s;
  }

  .delete:hover {
    transform: scale(1.1);
    font-weight: 500;
    cursor: pointer;
  }
</style>

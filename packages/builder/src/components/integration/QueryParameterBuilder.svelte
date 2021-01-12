<script>
  import { Button, TextArea, Label, Input, Heading } from "@budibase/bbui"
  import BindableInput from "components/userInterface/BindableInput.svelte"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/replaceBindings"

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
  <Heading extraSmall black>Parameters</Heading>
  <div class="parameters" class:bindable>
    <Label extraSmall grey>Parameter Name</Label>
    <Label extraSmall grey>Default</Label>
    {#if bindable}
      <Label extraSmall grey>Value</Label>
    {:else}
      <div />
    {/if}
    {#each parameters as parameter, idx}
      <Input thin bind:value={parameter.name} />
      <Input thin bind:value={parameter.default} />
      {#if bindable}
        <BindableInput
          type="string"
          thin
          on:change={evt => onBindingChange(parameter.name, evt.detail)}
          value={runtimeToReadableBinding(bindings, customParams[parameter.name])}
          {bindings} />
      {:else}
        <i
          class="ri-close-circle-line delete"
          on:click={() => deleteQueryParameter(idx)} />
      {/if}
    {/each}
  </div>
  {#if !bindable}
    <Button thin secondary small on:click={newQueryParameter}>
      Add Parameter
    </Button>
  {/if}

</section>

<style>
  .parameters.bindable {
    grid-template-columns: 1fr 1fr 1fr;
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

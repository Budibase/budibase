<script>
  import { Button, TextArea, Label, Input, Heading } from "@budibase/bbui"
  import Editor from "./QueryEditor.svelte"
  import BindableInput from "components/userInterface/BindableInput.svelte"

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
</script>

<section>
  <Heading extraSmall black>Parameters</Heading>
  <div class="parameters">
    <Label extraSmall grey>Parameter Name</Label>
    <Label extraSmall grey>Default</Label>
    <Label extraSmall grey>Value</Label>
    <div />
    {#each parameters as parameter, idx}
      <Input thin bind:value={parameter.name} />
      <Input thin bind:value={parameter.default} />
      <BindableInput
        type="string"
        thin
        bind:value={customParams[parameter.name]}
        {bindings} />
      <i
        class="ri-close-circle-line delete"
        on:click={() => deleteQueryParameter(idx)} />
    {/each}
  </div>
  <Button thin secondary on:click={newQueryParameter}>New Parameter</Button>
</section>

<style>
  .parameters {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 5%;
    grid-gap: 10px;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }
</style>

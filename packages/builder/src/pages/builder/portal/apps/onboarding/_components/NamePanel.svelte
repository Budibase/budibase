<script>
  import { Button, FancyForm, FancyInput } from "@budibase/bbui"
  import PanelHeader from "./PanelHeader.svelte"

  export let name = ""
  export let url = ""
  export let onNext = () => {}

  const nameRegex = /^[a-zA-Z0-9\s]*$/
  let nameError = null
  let urlError = null

  $: isValid = name.length && url.length && !nameError && !urlError

  const validateName = name => {
    if (name.length < 1) {
      return "Name must be provided"
    }
    if (!nameRegex.test(name)) {
      return "No special characters are allowed"
    }
  }

  const validateUrl = url => {
    if (url.length < 1) {
      return "URL must be provided"
    }
  }
</script>

<div>
  <PanelHeader
    title="Build your first app"
    subtitle="Name your app and set the URL"
  />
  <FancyForm>
    <FancyInput
      bind:value={name}
      bind:error={nameError}
      validate={validateName}
      label="Name"
    />
    <FancyInput
      bind:value={url}
      bind:error={urlError}
      validate={validateUrl}
      label="URL"
    />
  </FancyForm>
  {#if url}
    <p><span class="host">{window.location.origin}/app/</span>{url}</p>
  {:else}
    <p>‎</p>
  {/if}
  <Button size="L" cta disabled={!isValid} on:click={onNext}>Lets go!</Button>
</div>

<style>
  p {
    color: white;
  }
  .host {
    color: #b0b0b0;
  }
</style>

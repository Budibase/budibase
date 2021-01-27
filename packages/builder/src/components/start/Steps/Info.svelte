<script>
  import { Label, Heading, Input } from "@budibase/bbui"
  import Dropzone from "components/common/Dropzone.svelte"

  export let validationErrors
  export let template

  let blurred = { appName: false }
  let files

  $: if (files) {
    template.fileImportPath = files[0]
  }
</script>

<h2>Create your Web App</h2>
<div class="container">
  {#if template.fromFile}
    <div class="template">
      <Dropzone bind:files />
    </div>
  {:else if template}
    <div class="template">
      <Label extraSmall grey>Selected Template</Label>
      <Heading small>{template.name}</Heading>
    </div>
  {/if}
  <Input
    on:input={() => (blurred.appName = true)}
    label="Web App Name"
    name="applicationName"
    placeholder="Enter name of your web application"
    type="name"
    error={blurred.appName && validationErrors.applicationName} />
</div>

<style>
  .container {
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  .template :global(label) {
    /*  Fix layout due to LH 0 on heading */
    margin-bottom: 16px;
  }
</style>

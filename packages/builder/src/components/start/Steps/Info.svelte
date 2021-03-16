<script>
  import { Label, Heading, Input } from "@budibase/bbui"

  const BYTES_IN_MB = 1000000
  const FILE_SIZE_LIMIT = BYTES_IN_MB * 5

  export let validationErrors
  export let template

  let blurred = { appName: false }
  let file

  function handleFile(evt) {
    const fileArray = Array.from(evt.target.files)
    if (fileArray.some(file => file.size >= FILE_SIZE_LIMIT)) {
      notifier.danger(
        `Files cannot exceed ${FILE_SIZE_LIMIT /
          BYTES_IN_MB}MB. Please try again with smaller files.`
      )
      return
    }
    file = evt.target.files[0]
    template.file = file
  }
</script>

{#if template?.fromFile}
  <h2>Import Your Web App From A File</h2>
{:else}
  <h2>Create your Web App</h2>
{/if}
<div class="container">
  {#if template?.fromFile}
    <div class="template">
      <Label extraSmall grey>Import File</Label>
      <div class="dropzone">
        <input
          id="file-upload"
          accept=".txt"
          type="file"
          on:change={handleFile} />
        <label for="file-upload" class:uploaded={file}>
          {#if file}{file.name}{:else}Import{/if}
        </label>
      </div>
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

  .dropzone {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    transition: all 0.3s;
  }

  .uploaded {
    color: var(--blue);
  }

  input[type="file"] {
    display: none;
  }

  label {
    font-family: var(--font-sans);
    cursor: pointer;
    font-weight: 500;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    color: var(--ink);
    padding: var(--spacing-m) var(--spacing-l);
    transition: all 0.2s ease 0s;
    display: inline-flex;
    text-rendering: optimizeLegibility;
    min-width: auto;
    outline: none;
    font-feature-settings: "case" 1, "rlig" 1, "calt" 0;
    -webkit-box-align: center;
    user-select: none;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: var(--grey-2);
    font-size: var(--font-size-xs);
    line-height: normal;
    border: var(--border-transparent);
  }
</style>

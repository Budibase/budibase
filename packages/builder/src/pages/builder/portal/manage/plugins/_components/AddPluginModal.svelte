<script>
  import { ModalContent, Label, Input, Select, Dropzone } from "@budibase/bbui"
  import { plugins } from "stores/portal"

  let authOptions = {
    URL: ["Headers", "URL"],
    NPM: ["URL"],
    Github: ["Github Token", "URL"],
    "File Upload": ["File Upload"],
  }
  let file
  let sourceValue = "URL"
  let typeValue = "Component"
  let dynamicValues = {}

  let validation
  $: validation = sourceValue === "File Upload" ? file : dynamicValues["URL"]

  async function save() {
    const source = sourceValue.toLocaleLowerCase()
    const url = dynamicValues["URL"]

    switch (source) {
      case "file upload":
        if (file) {
          await plugins.uploadPlugin(file, sourceValue)
        }
        break
      case "github":
        await plugins.createPlugin(
          typeValue,
          source,
          url,
          dynamicValues["Github Token"]
        )
        break
      case "url":
        await plugins.createPlugin(
          typeValue,
          source,
          url,
          dynamicValues["Headers"]
        )
        break
      case "npm":
        await plugins.createPlugin(typeValue, source, url)
        break
    }
  }
</script>

<ModalContent
  confirmText={"Save"}
  onConfirm={save}
  disabled={!validation}
  size="M"
  title="Add new plugin"
>
  <div class="form-row">
    <Label size="M">Type</Label>
    <Select
      bind:value={typeValue}
      placeholder={null}
      options={["Component", "Datasource"]}
    />
  </div>
  <div class="form-row">
    <Label size="M">Source</Label>
    <Select
      placeholder={null}
      bind:value={sourceValue}
      options={["NPM", "Github", "URL", "File Upload"]}
    />
  </div>

  {#each authOptions[sourceValue] as option}
    {#if option === "File Upload"}
      <div class="form-row">
        <Label size="M">{option}</Label>

        <Dropzone
          gallery={false}
          value={[file]}
          on:change={e => {
            if (!e.detail || e.detail.length === 0) {
              file = null
            } else {
              file = e.detail[0]
            }
          }}
        />
      </div>
    {:else}
      <div class="form-row">
        <Label size="M">{option}</Label>
        <Input bind:value={dynamicValues[option]} />
      </div>
    {/if}
  {/each}
</ModalContent>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>

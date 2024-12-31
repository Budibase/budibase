<script>
  import {
    ModalContent,
    Label,
    Input,
    Select,
    Dropzone,
    Body,
    notifications,
  } from "@budibase/bbui"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import { plugins } from "@/stores/portal"
  import { PluginSource } from "@/constants"

  function opt(name, optional) {
    if (optional) {
      return { name, optional }
    }
    return { name }
  }

  let authOptions = {
    [PluginSource.URL]: [opt("URL"), opt("Headers", true)],
    [PluginSource.NPM]: [opt("URL")],
    [PluginSource.GITHUB]: [opt("URL"), opt("Github Token", true)],
    [PluginSource.FILE]: [opt("File Upload")],
  }
  let file
  let source = PluginSource.GITHUB
  let dynamicValues = {}

  let validation
  $: validation = source === "File Upload" ? file : dynamicValues["URL"]

  function infoMessage(optionName) {
    switch (optionName) {
      case PluginSource.URL:
        return "Please specify a URL which directs to a built plugin TAR archive. You can provide headers if authentication is required."
      case PluginSource.NPM:
        return "Please specify the URL to a public NPM package which contains the built version of the plugin you wish to install."
      case PluginSource.GITHUB:
        return "Please specify the URL to a Github repository which contains built plugin releases. If this is a private repo you can provide a token to access it."
      case PluginSource.FILE:
        return "Please provide a built plugin TAR archive. You can build a plugin locally using the Budibase CLI."
    }
  }

  async function save() {
    try {
      if (source === PluginSource.FILE) {
        await plugins.uploadPlugin(file)
      } else {
        const url = dynamicValues["URL"]
        let auth =
          source === PluginSource.GITHUB
            ? dynamicValues["Github Token"]
            : source === PluginSource.URL
            ? dynamicValues["Headers"]
            : undefined
        await plugins.createPlugin(source, url, auth)
      }
      notifications.success("Plugin added successfully.")
    } catch (err) {
      const msg = err?.message ? err.message : JSON.stringify(err)
      notifications.error(`Failed to add plugin: ${msg}`)
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
    <Label size="M">Source</Label>
    <Select
      placeholder={null}
      bind:value={source}
      options={Object.values(PluginSource)}
    />
  </div>
  <Body size="S">{infoMessage(source)}</Body>
  {#each authOptions[source] as option}
    {#if option.name === PluginSource.FILE}
      <div class="form-row">
        <Label size="M">{option.name}</Label>
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
        <div>
          <Label size="M">{option.name}</Label>
          {#if option.optional}
            <Label size="S" muted><i>Optional</i></Label>
          {/if}
        </div>
        {#if option.name === "Headers"}
          <KeyValueBuilder bind:object={dynamicValues[option.name]} />
        {:else}
          <Input bind:value={dynamicValues[option.name]} />
        {/if}
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

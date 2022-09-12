<script>
  import {
    ModalContent,
    Label,
    Input,
    Select,
    Dropzone,
    notifications,
  } from "@budibase/bbui"
  import { plugins } from "stores/portal"

  const Sources = {
    NPM: "NPM",
    GITHUB: "Github",
    URL: "URL",
    FILE: "File Upload",
  }

  let authOptions = {
    [Sources.NPM]: ["URL"],
    [Sources.GITHUB]: ["Github Token", "URL"],
    [Sources.URL]: ["Headers", "URL"],
    [Sources.FILE]: ["File Upload"],
  }
  let file
  let source = Sources.URL
  let dynamicValues = {}

  let validation
  $: validation = source === "File Upload" ? file : dynamicValues["URL"]

  async function save() {
    try {
      if (source === Sources.FILE) {
        await plugins.uploadPlugin(file)
      } else {
        const url = dynamicValues["URL"]
        let auth =
          source === Sources.GITHUB
            ? dynamicValues["Github Token"]
            : source === Sources.URL
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
      options={Object.values(Sources)}
    />
  </div>

  {#each authOptions[source] as option}
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

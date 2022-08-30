<script>
  import {
    ModalContent,
    Label,
    Input,
    Select,
    Body,
    StatusLight,
    Dropzone,
  } from "@budibase/bbui"
  import { plugins } from "stores/portal"

  let authOptions = {
    NPM: ["NPM Token", "URL"],
    Github: ["Github Token", "URL"],
    URL: ["Header", "URL"],
    File: ["Path", "Header"],
    Upload: ["Upload"],
  }
  let file
  let sourceValue = "Upload"

  let verificationSuccessful = false

  async function save() {
    if (file) {
      await plugins.uploadPlugin(file, sourceValue)
    }
  }

  function verify() {
    verificationSuccessful = true
    // return false so modal doesn't exit
    return false
  }
</script>

<ModalContent
  confirmText={verificationSuccessful ? "Save" : "Verify"}
  buttonCta={verificationSuccessful}
  onConfirm={verificationSuccessful ? save : verify}
  size="M"
  title="Add new plugin"
>
  <div class="form-row">
    <Label size="M">Type</Label>
    <Select
      value="Datasource"
      placeholder={null}
      options={["Component", "Datasource"]}
    />
  </div>
  <div class="form-row">
    <Label size="M">Source</Label>
    <Select
      placeholder={null}
      bind:value={sourceValue}
      options={["NPM", "Github", "URL", "File", "Upload"]}
    />
  </div>

  <div class="form-row">
    <Label size="M">Name</Label>
    <Input />
  </div>
  {#each authOptions[sourceValue] as option}
    {#if option === "Upload"}
      <div class="form-row">
        <Label size="M">{option}</Label>

        <Dropzone
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
        <Input />
      </div>
    {/if}
  {/each}

  <div class="verification" slot="footer">
    <div>
      <StatusLight
        positive={verificationSuccessful}
        neutral={!verificationSuccessful}
      />
    </div>
    <div class="verification-spacing">
      {#if verificationSuccessful}
        <Body size="XS">Verification Successful</Body>
      {:else}
        <Body size="XS"><i>Verify your source</i></Body>
      {/if}
    </div>
  </div>
</ModalContent>

<style>
  .verification-spacing {
    padding-left: var(--spacing-s);
  }
  .verification {
    display: flex;
    margin-right: auto;
    align-items: center;
  }
  .form-row {
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>

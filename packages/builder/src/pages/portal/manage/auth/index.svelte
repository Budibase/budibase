<script>
  import GoogleLogo from "./logos/Google.svelte"
  import {
    Button,
    Heading,
    Divider,
    Label,
    notifications,
    Layout,
    Input,
    Body,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import api from "builderStore/api"

  const ConfigTypes = {
    Google: "google",
    // Github: "github",
    // AzureAD: "ad",
  }

  const ConfigFields = {
    Google: ["clientID", "clientSecret", "callbackURL"],
  }

  let google

  async function save(doc) {
    try {
      // Save an oauth config
      const response = await api.post(`/api/admin/configs`, doc)
      const json = await response.json()
      if (response.status !== 200) throw new Error(json.message)
      google._rev = json._rev
      google._id = json._id

      notifications.success(`Settings saved.`)
    } catch (err) {
      notifications.error(`Failed to update OAuth settings. ${err}`)
    }
  }

  onMount(async () => {
    // fetch the configs for oauth
    const googleResponse = await api.get(
      `/api/admin/configs/${ConfigTypes.Google}`
    )
    const googleDoc = await googleResponse.json()

    if (!googleDoc._id) {
      google = {
        type: ConfigTypes.Google,
        config: {},
      }
    } else {
      google = googleDoc
    }
  })
</script>

<section>
  <header>
    <Heading size="M">OAuth</Heading>
    <Body size="S">
      Every budibase app comes with basic authentication (email/password)
      included. You can add additional authentication methods from the options
      below.
    </Body>
  </header>
  <Divider />
  {#if google}
    <div class="config-form">
      <Layout gap="S">
        <Heading size="S">
          <span>
            <GoogleLogo />
            Google
          </span>
        </Heading>
        {#each ConfigFields.Google as field}
          <div class="form-row">
            <Label>{field}</Label>
            <Input bind:value={google.config[field]} />
          </div>
        {/each}
      </Layout>
      <Button primary on:click={() => save(google)}>Save</Button>
    </div>
    <Divider />
  {/if}
</section>

<style>
  .config-form {
    margin-top: 42px;
    margin-bottom: 42px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
  }

  span {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  header {
    margin-bottom: 42px;
  }
</style>

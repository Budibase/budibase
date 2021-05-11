<script>
  import GoogleLogo from "./_logos/Google.svelte"
  import {
    Button,
    Heading,
    Divider,
    Page,
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

<Page>
  <Layout noPadding>
    <div>
      <Heading size="M">OAuth</Heading>
      <Body>
        Every budibase app comes with basic authentication (email/password)
        included. You can add additional authentication methods from the options
        below.
      </Body>
    </div>
    <Divider />
    {#if google}
      <div>
        <Heading size="S">
          <span>
            <GoogleLogo />
            Google
          </span>
        </Heading>
        <Body>
          To allow users to authenticate using their Google accounts, fill out
          the fields below.
        </Body>
      </div>

      {#each ConfigFields.Google as field}
        <div class="form-row">
          <Label size="L">{field}</Label>
          <Input bind:value={google.config[field]} />
        </div>
      {/each}
      <div>
        <Button primary on:click={() => save(google)}>Save</Button>
      </div>
      <Divider />
    {/if}
  </Layout>
</Page>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  span {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
</style>

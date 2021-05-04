<script>
  import { hostingStore } from "builderStore"
  import { HostingTypes } from "constants/backend"
  import GoogleLogo from "./logos/Google.svelte"
  import {
    Button,
    Heading,
    Divider,
    notifications,
    Input,
    ModalContent,
    Toggle,
    Body,
  } from "@budibase/bbui"
  import ThemeEditor from "components/settings/ThemeEditor.svelte"
  import analytics from "analytics"
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
        type: "google",
        config: {},
      }
    } else {
      google = googleDoc
    }
  })
</script>

<section class="container">
  <Heading size="M">OAuth</Heading>
  <Body size="S">
    Every budibase app comes with basic authentication (email/password)
    included. You can add additional authentication methods from the options
    below.
  </Body>
  <Divider />
  {#if google}
    <div class="form">
      <Heading size="S">
        <GoogleLogo />
        Google
      </Heading>
      {#each ConfigFields.Google as field}
        <Input bind:value={google.config[field]} label={field} />
      {/each}
      <Button primary on:click={() => save(google)}>Save</Button>
    </div>
  {/if}
</section>

<style>
  section {
    margin: 40px 80px;
  }
</style>

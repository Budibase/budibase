<script>
  import { onMount } from "svelte"
  import {
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    notifications,
  } from "@budibase/bbui"
  import api from "builderStore/api"
  import { auth } from "stores/portal"
  import { redirect } from "@roxi/routify"

  let version

  // Only admins allowed here
  $: {
    if (!$auth.isAdmin) {
      $redirect("../../portal")
    }
  }

  async function updateBudibase() {
    try {
      notifications.info("Updating budibase..")
      await fetch("/v1/update", {
        headers: {
          Authorization: "Bearer budibase",
        },
      })
      notifications.success("Your budibase installation is up to date.")
      getVersion()
    } catch (err) {
      notifications.error(`Error installing budibase update ${err}`)
    }
  }

  async function getVersion() {
    const response = await api.get("/api/dev/version")
    version = await response.text()
  }

  onMount(() => {
    getVersion()
  })
</script>

{#if $auth.isAdmin}
  <Layout>
    <Layout gap="XS" noPadding>
      <Heading size="M">Update</Heading>
      <Body>
        Keep your budibase installation up to date to take advantage of the
        latest features, security updates and much more.
      </Body>
    </Layout>
    <Divider size="S" />
    <div class="fields">
      <div class="field">
        {#if version}
          Current Version: {version}
        {/if}
      </div>
      <div class="field">
        <Button cta on:click={updateBudibase}>Check For Updates</Button>
      </div>
    </div>
  </Layout>
{/if}

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 33% 1fr;
    align-items: center;
  }
</style>

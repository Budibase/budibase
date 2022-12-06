<script>
  import { onMount } from "svelte"
  import {
    Layout,
    Heading,
    Body,
    Button,
    Divider,
    notifications,
    Label,
  } from "@budibase/bbui"
  import { API } from "api"
  import { auth, admin } from "stores/portal"
  import { redirect } from "@roxi/routify"

  let version

  // Only admins allowed here
  $: {
    if (!$auth.isAdmin || $admin.cloud) {
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
    try {
      version = await API.getBudibaseVersion()
    } catch (error) {
      notifications.error("Error getting Budibase version")
      version = null
    }
  }

  onMount(() => {
    getVersion()
  })
</script>

{#if $auth.isAdmin}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">Updates</Heading>
      <Body>
        Keep your budibase installation up to date to take advantage of the
        latest features, security updates and much more.
      </Body>
    </Layout>
    <Divider />
    {#if version}
      <div>
        <Label size="L">Current version</Label>
        <Heading size="XS">
          {version}
        </Heading>
      </div>
    {/if}
    <div>
      <Button cta on:click={updateBudibase}>Check for updates</Button>
    </div>
  </Layout>
{/if}

<script>
  import { onMount } from "svelte"
  import {
    Layout,
    Heading,
    Body,
    Divider,
    notifications,
    Label,
    Link,
  } from "@budibase/bbui"
  import { API } from "@/api"
  import { auth, admin } from "@/stores/portal"
  import { redirect } from "@roxi/routify"
  import { sdk } from "@budibase/shared-core"

  let version
  let loaded = false
  let githubVersion
  let githubPublishedDate
  let githubPublishedTime

  // Only admins allowed here
  $: {
    if (!sdk.users.isAdmin($auth.user) || $admin.cloud) {
      $redirect("../../portal")
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

  async function getLatestVersion() {
    try {
      //Check github API for the latest release
      const githubCheck = await fetch(
        "https://api.github.com/repos/Budibase/budibase/releases/latest"
      )
      const githubResponse = await githubCheck.json()

      githubVersion = githubResponse.tag_name

      //Get the release date and output it in the local time format
      githubPublishedDate = new Date(githubResponse.published_at)
      githubPublishedTime = githubPublishedDate.toLocaleTimeString()
      githubPublishedDate = githubPublishedDate.toLocaleDateString()
    } catch (error) {
      notifications.error("Error getting the latest Budibase version")
      githubVersion = null
    }
  }

  onMount(async () => {
    await getVersion()
    await getLatestVersion()
    loaded = true
  })
</script>

{#if sdk.users.isAdmin($auth.user)}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">Version</Heading>
      <Body>
        Keep your budibase installation up to date to take advantage of the
        latest features, security updates and much more
      </Body>
    </Layout>
    <Divider />
    {#if loaded}
      <Layout noPadding gap="XS">
        <Label size="L">Current version</Label>
        <Heading size="S">
          {version || "-"}
        </Heading>
        <Divider />
        <Label size="L">Latest version</Label>
        <Heading size="S">
          {githubVersion}
        </Heading>
        <Label size="L"
          >This version was released on {githubPublishedDate} at {githubPublishedTime}</Label
        >
      </Layout>
      <Divider />
      <Layout noPadding gap="XS">
        <Heading>Updating Budibase</Heading>
        <Body
          >To update your self-host installation, follow the docs found <Link
            size="L"
            href="https://docs.budibase.com/docs/updating-budibase">here.</Link
          ></Body
        >
      </Layout>
    {/if}
  </Layout>
{/if}

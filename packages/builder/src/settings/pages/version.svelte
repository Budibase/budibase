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

  let version
  let loaded = false
  let githubVersion
  let githubPublishedDate
  let githubPublishedTime

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

<Layout noPadding>
  {#if loaded}
    <Layout noPadding gap="S">
      <Label size="L">Current version</Label>
      <Heading size="XS">
        {version || "-"}
      </Heading>
      <Divider noMargin />
      <Label size="L">Latest version</Label>
      <Heading size="XS">
        {githubVersion}
      </Heading>
      <Label size="L"
        >This version was released on {githubPublishedDate} at {githubPublishedTime}</Label
      >
    </Layout>
    <Divider noMargin />
    <Layout noPadding gap="XS">
      <Heading size="XS">Updating Budibase</Heading>
      <Body size="S"
        >To update your self-host installation, follow the docs found <Link
          size="L"
          href="https://docs.budibase.com/docs/updating-budibase">here.</Link
        ></Body
      >
    </Layout>
  {/if}
</Layout>

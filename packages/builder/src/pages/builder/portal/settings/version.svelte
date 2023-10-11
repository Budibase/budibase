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
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import { API } from "api"
  import { auth, admin } from "stores/portal"
  import { redirect } from "@roxi/routify"
  import { sdk } from "@budibase/shared-core"

  let version
  let loaded = false
  let githubVersion
  let githubPublishedDate
  let githubPublishedTime
  let needsUpdate = true
  let updateModal

  // Only admins allowed here
  $: {
    if (!sdk.users.isAdmin($auth.user) || $admin.cloud) {
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

      //Does Budibase need to be updated?
      if (githubVersion === version) {
        needsUpdate = false
      } else {
        needsUpdate = true
      }
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
      <div>
        <Button cta on:click={updateModal.show} disabled={!needsUpdate}
          >Update Budibase</Button
        >
        <Modal bind:this={updateModal}>
          <ModalContent
            title="Update Budibase"
            confirmText="Update"
            onConfirm={updateBudibase}
          >
            <span
              >Are you sure you want to update your budibase installation to the
              latest version?</span
            >
          </ModalContent>
        </Modal>
      </div>
    {/if}
  </Layout>
{/if}

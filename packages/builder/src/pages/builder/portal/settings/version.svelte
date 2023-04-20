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

  import { _ } from "../../../../../../lang/i18n"

  let version
  let loaded = false
  let githubVersion
  let githubPublishedDate
  let githubPublishedTime
  let needsUpdate = true
  let updateModal

  // Only admins allowed here
  $: {
    if (!$auth.isAdmin || $admin.cloud) {
      $redirect("../../portal")
    }
  }

  async function updateBudibase() {
    try {
      notifications.info(
        $_("pages.builder.portal.settings.version.Updating_budibase")
      )
      await fetch("/v1/update", {
        headers: {
          Authorization: $_(
            "pages.builder.portal.settings.version.Bearer_budibase"
          ),
        },
      })
      notifications.success(
        $_("pages.builder.portal.settings.version.installation_date")
      )
      getVersion()
    } catch (err) {
      notifications.error(
        `${$_("pages.builder.portal.settings.version.Error_installing")} ${err}`
      )
    }
  }

  async function getVersion() {
    try {
      version = await API.getBudibaseVersion()
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.settings.version.Error_getting")
      )
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

      //Get tag and remove the v infront of the tage name e.g. v1.0.0 is 1.0.0
      githubVersion = githubResponse.tag_name.slice(1)

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
      notifications.error(
        $_("pages.builder.portal.settings.version.Error_latest")
      )
      githubVersion = null
    }
  }

  onMount(async () => {
    await getVersion()
    await getLatestVersion()
    loaded = true
  })
</script>

{#if $auth.isAdmin}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M"
        >{$_("pages.builder.portal.settings.version.Version")}</Heading
      >
      <Body>
        {$_("pages.builder.portal.settings.version.Keep_installation")}
      </Body>
    </Layout>
    <Divider />
    {#if loaded}
      <Layout noPadding gap="XS">
        <Label size="L"
          >{$_("pages.builder.portal.settings.version.Current_version")}</Label
        >
        <Heading size="S">
          {version || "-"}
        </Heading>
        <Divider />
        <Label size="L"
          >{$_("pages.builder.portal.settings.version.Latest_version")}</Label
        >
        <Heading size="S">
          {githubVersion}
        </Heading>
        <Label size="L"
          >{$_("pages.builder.portal.settings.version.version_released")}
          {githubPublishedDate}
          {$_("pages.builder.portal.settings.version.at")}
          {githubPublishedTime}</Label
        >
      </Layout>
      <Divider />
      <div>
        <Button cta on:click={updateModal.show} disabled={!needsUpdate}
          >{$_("pages.builder.portal.settings.version.Update_Budibase")}</Button
        >
        <Modal bind:this={updateModal}>
          <ModalContent
            title={$_("pages.builder.portal.settings.version.Update_Budibase")}
            confirmText={$_("pages.builder.portal.settings.version.Update")}
            onConfirm={updateBudibase}
          >
            <span
              >{$_(
                "pages.builder.portal.settings.version.update_latest_version?"
              )}</span
            >
          </ModalContent>
        </Modal>
      </div>
    {/if}
  </Layout>
{/if}

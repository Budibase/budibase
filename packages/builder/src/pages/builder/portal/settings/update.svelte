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
  import api from "builderStore/api"
  import { auth } from "stores/portal"
  import { redirect } from "@roxi/routify"
  import { _ as t } from "svelte-i18n"
  import { organisation } from "stores/portal"

  let version

  // Only admins allowed here
  $: {
    if (!$auth.isAdmin) {
      $redirect("../../portal")
    }
  }

  async function updateBudibase() {
    try {
      notifications.info($t("updating"))
      await fetch("/v1/update", {
        headers: {
          Authorization: "Bearer budibase",
        },
      })
      notifications.success($t("installation-is-up-to-date"))
      getVersion()
    } catch (err) {
      notifications.error(
        `${$t("error-installing")} ${
          $organisation.company ? $organisation.company : "Budibase"
        } ${$t("update")}` + ` ${err}`
      )
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
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">{$t("updates")}</Heading>
      <Body>
        {$t(
          "keep-installation-up-to-date-to-take-advantage-of-the-latest-features-security-updates-and-much-more"
        )}
      </Body>
    </Layout>
    <Divider size="S" />
    {#if version}
      <div>
        <Label size="L">{$t("current-version")}</Label>
        <Heading size="XS">
          {version}
        </Heading>
      </div>
    {/if}
    <div>
      <Button cta on:click={updateBudibase}>{$t("check-for-updates")}</Button>
    </div>
  </Layout>
{/if}

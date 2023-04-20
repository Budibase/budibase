<script>
  import {
    Layout,
    Heading,
    Body,
    Divider,
    Link,
    Button,
    Input,
    Label,
    ButtonGroup,
    notifications,
  } from "@budibase/bbui"
  import { auth, admin } from "stores/portal"
  import { redirect } from "@roxi/routify"
  import { processStringSync } from "@budibase/string-templates"
  import DeleteLicenseKeyModal from "../../../../components/portal/licensing/DeleteLicenseKeyModal.svelte"
  import { API } from "api"
  import { onMount } from "svelte"

  import { _ } from "../../../../../lang/i18n"

  $: license = $auth.user.license
  $: upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`

  $: activateDisabled = !licenseKey || licenseKeyDisabled

  let licenseInfo

  let licenseKeyDisabled = false
  let licenseKeyType = "text"
  let licenseKey = ""
  let deleteLicenseKeyModal

  // Make sure page can't be visited directly in cloud
  $: {
    if ($admin.cloud) {
      $redirect("../../portal")
    }
  }

  const activate = async () => {
    try {
      await API.activateLicenseKey({ licenseKey })
      await auth.getSelf()
      await setLicenseInfo()
      notifications.success(
        $_("pages.builder.portal.account.upgrade.Successfully_activated")
      )
    } catch (e) {
      notifications.error(e.message)
    }
  }

  const destroy = async () => {
    try {
      await API.deleteLicenseKey({ licenseKey })
      await auth.getSelf()
      await setLicenseInfo()
      // reset the form
      licenseKey = ""
      licenseKeyDisabled = false
      notifications.success(
        $_("pages.builder.portal.account.upgrade.Successfully_deleted")
      )
    } catch (e) {
      notifications.error(e.message)
    }
  }

  const refresh = async () => {
    try {
      await API.refreshLicense()
      await auth.getSelf()
      notifications.success(
        $_("pages.builder.portal.account.upgrade.Refreshed_license")
      )
    } catch (err) {
      console.error(err)
      notifications.error(
        $_("pages.builder.portal.account.upgrade.Error_refreshing_license")
      )
    }
  }

  // deactivate the license key field if there is a license key set
  $: {
    if (licenseInfo?.licenseKey) {
      licenseKey = "**********************************************"
      licenseKeyType = "password"
      licenseKeyDisabled = true
      activateDisabled = true
    }
  }

  const setLicenseInfo = async () => {
    licenseInfo = await API.getLicenseInfo()
  }

  onMount(async () => {
    await setLicenseInfo()
  })
</script>

{#if $auth.isAdmin}
  <DeleteLicenseKeyModal
    bind:this={deleteLicenseKeyModal}
    onConfirm={destroy}
  />
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M"
        >{$_("pages.builder.portal.account.upgrade.Upgrade")}</Heading
      >
      <Body size="M">
        {#if license.plan.type === "free"}
          {$_("pages.builder.portal.account.upgrade.Upgrade_your_Budibase")}
          <Link size="L" href={upgradeUrl}
            >{$_("pages.builder.portal.account.upgrade.account")}</Link
          >.
        {:else}
          {$_(
            "pages.builder.portal.account.upgrade.To_manage_your_plan_visit_your"
          )}
          <Link size="L" href={upgradeUrl}
            >{$_("pages.builder.portal.account.upgrade.account")}</Link
          >
        {/if}
      </Body>
    </Layout>
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S"
        >{$_("pages.builder.portal.account.upgrade.Activate")}</Heading
      >
      <Body size="S"
        >{$_(
          "pages.builder.portal.account.upgrade.Enter_your_license_key"
        )}</Body
      >
    </Layout>
    <Layout noPadding>
      <div class="fields">
        <div class="field">
          <Label size="L"
            >{$_("pages.builder.portal.account.upgrade.License_key")}</Label
          >
          <Input
            thin
            bind:value={licenseKey}
            type={licenseKeyType}
            disabled={licenseKeyDisabled}
          />
        </div>
      </div>
      <ButtonGroup>
        <Button cta on:click={activate} disabled={activateDisabled}>
          {$_("pages.builder.portal.account.upgrade.Activate")}
        </Button>
        {#if licenseInfo?.licenseKey}
          <Button warning on:click={() => deleteLicenseKeyModal.show()}>
            {$_("pages.builder.portal.account.upgrade.DeleteButton")}
          </Button>
        {/if}
      </ButtonGroup>
    </Layout>
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="S"
        >{$_("pages.builder.portal.account.upgrade.Plan")}</Heading
      >
      <Layout noPadding gap="XXS">
        <Body size="S"
          >{$_("pages.builder.portal.account.upgrade.You_are_currently_on_the")}
          {license.plan.type}
          {$_("pages.builder.portal.account.upgrade.plan")}</Body
        >
        <Body size="XS">
          {processStringSync(
            `${$_(
              "pages.builder.portal.account.upgrade.Updated"
            )} {{ duration time 'millisecond' }} ${$_(
              "pages.builder.portal.account.upgrade.ago"
            )}`,
            {
              time:
                new Date().getTime() - new Date(license.refreshedAt).getTime(),
            }
          )}
        </Body>
      </Layout>
    </Layout>
    <div>
      <Button secondary on:click={refresh}
        >{$_("pages.builder.portal.account.upgrade.Refresh")}</Button
      >
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
    grid-template-columns: 100px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>

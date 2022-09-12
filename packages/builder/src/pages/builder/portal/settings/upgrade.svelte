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
    notifications,
  } from "@budibase/bbui"
  import { auth, admin } from "stores/portal"
  import { redirect } from "@roxi/routify"
  import { processStringSync } from "@budibase/string-templates"
  import { API } from "api"
  import { onMount } from "svelte"

  $: license = $auth.user.license
  $: upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`

  $: activateDisabled = !licenseKey || licenseKeyDisabled

  let licenseInfo

  let licenseKeyDisabled = false
  let licenseKeyType = "text"
  let licenseKey = ""

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
      notifications.success("Successfully activated")
    } catch (e) {
      notifications.error(e.message)
    }
  }

  const refresh = async () => {
    try {
      await API.refreshLicense()
      await auth.getSelf()
      notifications.success("Refreshed license")
    } catch (err) {
      console.error(err)
      notifications.error("Error refreshing license")
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
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">Upgrade</Heading>
      <Body size="M">
        {#if license.plan.type === "free"}
          Upgrade your budibase installation to unlock additional features. To
          subscribe to a plan visit your <Link size="L" href={upgradeUrl}
            >Account</Link
          >.
        {:else}
          To manage your plan visit your <Link size="L" href={upgradeUrl}
            >Account</Link
          >.
        {/if}
      </Body>
    </Layout>
    <Divider size="S" />
    <Layout gap="XS" noPadding>
      <Heading size="S">Activate</Heading>
      <Body size="S">Enter your license key below to activate your plan</Body>
    </Layout>
    <Layout noPadding>
      <div class="fields">
        <div class="field">
          <Label size="L">License Key</Label>
          <Input
            thin
            bind:value={licenseKey}
            type={licenseKeyType}
            disabled={licenseKeyDisabled}
          />
        </div>
      </div>
      <div>
        <Button cta on:click={activate} disabled={activateDisabled}
          >Activate</Button
        >
      </div>
    </Layout>
    <Divider size="S" />
    <Layout gap="L" noPadding>
      <Layout gap="S" noPadding>
        <Heading size="S">Plan</Heading>
        <Layout noPadding gap="XXS">
          <Body size="S">You are currently on the {license.plan.type} plan</Body
          >
          <Body size="XS">
            {processStringSync(
              "Updated {{ duration time 'millisecond' }} ago",
              {
                time:
                  new Date().getTime() -
                  new Date(license.refreshedAt).getTime(),
              }
            )}
          </Body>
        </Layout>
      </Layout>
      <div>
        <Button secondary on:click={refresh}>Refresh</Button>
      </div>
    </Layout>
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

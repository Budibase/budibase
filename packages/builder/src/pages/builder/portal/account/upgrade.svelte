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
    CopyInput,
    File,
  } from "@budibase/bbui"
  import { auth, admin } from "@/stores/portal"
  import { redirect } from "@roxi/routify"
  import { processStringSync } from "@budibase/string-templates"
  import DeleteLicenseKeyModal from "@/components/portal/licensing/DeleteLicenseKeyModal.svelte"
  import { API } from "@/api"
  import { onMount } from "svelte"
  import { sdk } from "@budibase/shared-core"

  $: license = $auth.user.license
  $: upgradeUrl = `${$admin.accountPortalUrl}/portal/upgrade`

  // LICENSE KEY

  $: activateDisabled = !licenseKey || licenseKeyDisabled
  let licenseKeyDisabled = false
  let licenseKeyType = "text"
  let licenseKey = ""
  let deleteLicenseKeyModal

  // OFFLINE

  let offlineLicenseIdentifier = ""
  let offlineLicense = undefined
  const offlineLicenseExtensions = [".txt"]

  // Make sure page can't be visited directly in cloud
  $: {
    if ($admin.cloud) {
      $redirect("../../portal")
    }
  }

  // LICENSE KEY

  const getLicenseKey = async () => {
    try {
      licenseKey = await API.getLicenseKey()
      if (licenseKey) {
        licenseKey = "**********************************************"
        licenseKeyType = "password"
        licenseKeyDisabled = true
        activateDisabled = true
      }
    } catch (e) {
      console.error(e)
      notifications.error("Error retrieving license key")
    }
  }

  const activateLicenseKey = async () => {
    try {
      await API.activateLicenseKey(licenseKey)
      await auth.getSelf()
      await getLicenseKey()
      notifications.success("Successfully activated")
    } catch (e) {
      console.error(e)
      notifications.error("Error activating license key")
    }
  }

  const deleteLicenseKey = async () => {
    try {
      await API.deleteLicenseKey({ licenseKey })
      await auth.getSelf()
      await getLicenseKey()
      // reset the form
      licenseKey = ""
      licenseKeyDisabled = false
      notifications.success("Offline license removed")
    } catch (e) {
      console.error(e)
      notifications.error("Error deleting license key")
    }
  }

  // OFFLINE LICENSE

  const getOfflineLicense = async () => {
    try {
      const license = await API.getOfflineLicense()
      if (license) {
        offlineLicense = {
          name: "license",
        }
      } else {
        offlineLicense = undefined
      }
    } catch (e) {
      console.error(e)
      notifications.error("Error loading offline license")
    }
  }

  const getOfflineLicenseIdentifier = async () => {
    try {
      const res = await API.getOfflineLicenseIdentifier()
      offlineLicenseIdentifier = res.identifierBase64
    } catch (e) {
      console.error(e)
      notifications.error("Error loading installation identifier")
    }
  }

  async function activateOfflineLicense(offlineLicenseToken) {
    try {
      await API.activateOfflineLicense(offlineLicenseToken)
      await auth.getSelf()
      await getOfflineLicense()
      notifications.success("Successfully activated")
    } catch (e) {
      console.error(e)
      notifications.error("Error activating offline license")
    }
  }

  async function deleteOfflineLicense() {
    try {
      await API.deleteOfflineLicense()
      await auth.getSelf()
      await getOfflineLicense()
      notifications.success("Successfully removed ofline license")
    } catch (e) {
      console.error(e)
      notifications.error("Error upload offline license")
    }
  }

  async function onOfflineLicenseChange(event) {
    if (event.detail) {
      // prevent file preview jitter by assigning constant
      // as soon as possible
      offlineLicense = {
        name: "license",
      }
      const reader = new FileReader()
      reader.readAsText(event.detail)
      reader.onload = () => activateOfflineLicense(reader.result)
    } else {
      offlineLicense = undefined
      await deleteOfflineLicense()
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

  onMount(async () => {
    if ($admin.offlineMode) {
      await Promise.all([getOfflineLicense(), getOfflineLicenseIdentifier()])
    } else {
      await getLicenseKey()
    }
  })
</script>

{#if sdk.users.isAdmin($auth.user)}
  <DeleteLicenseKeyModal
    bind:this={deleteLicenseKeyModal}
    onConfirm={deleteLicenseKey}
  />
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">Upgrade</Heading>
      <Body size="M">
        {#if license.plan.type === "free"}
          Upgrade your Budibase installation to unlock additional features. To
          subscribe to a plan visit your
          <Link size="L" href={upgradeUrl}>account</Link>.
        {:else}
          To manage your plan visit your
          <Link size="L" href={upgradeUrl}>account</Link>
          <div>&nbsp</div>
        {/if}
      </Body>
    </Layout>
    <Divider />
    {#if $admin.offlineMode}
      <Layout gap="XS" noPadding>
        <Heading size="XS">Installation identifier</Heading>
        <Body size="S"
          >Share this with support@budibase.com to obtain your offline license</Body
        >
      </Layout>
      <Layout noPadding>
        <div class="identifier-input">
          <CopyInput value={offlineLicenseIdentifier} />
        </div>
      </Layout>
      <Divider />
      <Layout gap="XS" noPadding>
        <Heading size="XS">License</Heading>
        <Body size="S">Upload your license to activate your plan</Body>
      </Layout>
      <Layout noPadding>
        <div>
          <File
            title="Upload license"
            extensions={offlineLicenseExtensions}
            value={offlineLicense}
            on:change={onOfflineLicenseChange}
            allowClear={true}
            disabled={!!offlineLicense}
          />
        </div>
      </Layout>
    {:else}
      <Layout gap="XS" noPadding>
        <Heading size="XS">Activate</Heading>
        <Body size="S">Enter your license key below to activate your plan</Body>
      </Layout>
      <Layout noPadding>
        <div class="fields">
          <div class="field">
            <Label size="L">License key</Label>
            <Input
              thin
              bind:value={licenseKey}
              type={licenseKeyType}
              disabled={licenseKeyDisabled}
            />
          </div>
        </div>
        <ButtonGroup gap="M">
          <Button cta on:click={activateLicenseKey} disabled={activateDisabled}>
            Activate
          </Button>
          {#if licenseKey}
            <Button warning on:click={() => deleteLicenseKeyModal.show()}>
              Delete
            </Button>
          {/if}
        </ButtonGroup>
      </Layout>
    {/if}
    <Divider />
    <Layout gap="XS" noPadding>
      <Heading size="XS">Plan</Heading>
      <Layout noPadding gap="S">
        <Body size="S">You are currently on the {license.plan.type} plan</Body>
        <div>
          <Body size="S"
            >If you purchase or update your plan on the account</Body
          >
          <Body size="S"
            >portal, click the refresh button to sync those changes</Body
          >
        </div>
        <Body size="XS">
          {processStringSync("Updated {{ duration time 'millisecond' }} ago", {
            time:
              new Date().getTime() - new Date(license.refreshedAt).getTime(),
          })}
        </Body>
      </Layout>
    </Layout>
    <div>
      <Button secondary on:click={refresh}>Refresh</Button>
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
  .identifier-input {
    width: 300px;
  }
</style>

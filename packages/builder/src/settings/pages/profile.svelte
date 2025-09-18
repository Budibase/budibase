<script lang="ts">
  import { onMount } from "svelte"
  import { writable } from "svelte/store"
  import { API } from "@/api"
  import {
    Body,
    Input,
    notifications,
    Layout,
    Button,
    Select,
    Heading,
    CopyInput,
    Divider,
    Label,
    ButtonGroup,
    Modal,
  } from "@budibase/bbui"
  import { auth } from "@/stores/portal/auth"
  import { admin } from "@/stores/portal/admin"
  import { themeStore } from "@/stores/portal/theme"
  import { type UpdateSelfRequest } from "@budibase/types"
  import { ThemeOptions } from "@budibase/shared-core"
  import ChangePasswordModal from "@budibase/frontend-core/src/components/ChangePasswordModal.svelte"

  const values = writable<UpdateSelfRequest>({})
  let updating = false
  let apiKey: string | undefined = undefined
  let updatePasswordModal: Modal

  $: isOwner = $auth.accountPortalAccess && $admin.cloud
  $: user = $auth.user
  $: first = user?.firstName
  $: last = user?.lastName

  $: if (first || last) {
    values.set({
      firstName: first,
      lastName: last,
    })
  }

  $: altered = isAltered($values)

  const isAltered = (vals: UpdateSelfRequest) => {
    return vals && (vals.firstName !== first || vals.lastName !== last)
  }

  const updateInfo = async () => {
    updating = true
    try {
      await API.updateSelf($values)
      notifications.success("Information updated successfully")
      // Refresh cached user
      await auth.getSelf()
    } catch (error) {
      console.error(error)
      notifications.error("Failed to update information")
    }
    updating = false
  }

  async function generateAPIKey() {
    try {
      apiKey = await auth.generateAPIKey()
      notifications.success("New API key generated")
    } catch (err) {
      notifications.error("Unable to generate new API key")
    }
  }

  onMount(async () => {
    try {
      apiKey = await auth.fetchAPIKey()
    } catch (err) {
      notifications.error("Unable to fetch API key")
    }
  })
</script>

<Layout gap="S" noPadding>
  <Layout gap="S" noPadding>
    <Heading size="XS">Profile</Heading>
    <Body size="S">
      Personalise the platform by adding your first name and last name.
    </Body>
    <div class="form">
      <Layout gap="S" noPadding>
        <div class="form-row">
          <Label>Email</Label>
          <Input disabled value={user?.email || ""} />
        </div>
        <div class="form-row">
          <Label>First name</Label>
          <Input bind:value={$values.firstName} />
        </div>
        <div class="form-row">
          <Label>Last name</Label>
          <Input bind:value={$values.lastName} />
        </div>
        <div>
          <ButtonGroup>
            <Button cta on:click={updateInfo} disabled={!altered || updating}>
              Save
            </Button>
            {#if !$auth.isSSO}
              <Button
                secondary
                on:click={() => {
                  if (isOwner) {
                    window.location.href = `${$admin.accountPortalUrl}/portal/account`
                  } else {
                    updatePasswordModal.show()
                  }
                }}
              >
                Update password
              </Button>
            {/if}
          </ButtonGroup>
        </div>
      </Layout>
    </div>
  </Layout>
  <Divider noMargin />
  <Layout gap="S" noPadding>
    <Heading size="XS">Theme</Heading>
    <Body size="S">Update the Budibase portal theme</Body>
    <div class="form">
      <Select
        options={ThemeOptions}
        bind:value={$themeStore.theme}
        getOptionLabel={x => x.name}
        getOptionValue={x => x.id}
      />
    </div>
  </Layout>
  <Divider noMargin />
  <Layout gap="S" noPadding>
    <Heading size="XS">API Key</Heading>
    <Body size="S">Your API key for accessing the Budibase public API:</Body>
    <div class="form">
      <Layout gap="S" noPadding>
        <CopyInput bind:value={apiKey} />
        <div>
          <Button secondary on:click={generateAPIKey}>Regenerate</Button>
        </div>
      </Layout>
    </div>
  </Layout>
</Layout>

<Modal bind:this={updatePasswordModal}>
  <ChangePasswordModal
    {API}
    passwordMinLength={$admin.passwordMinLength}
    on:save={() => auth.getSelf()}
  />
</Modal>

<style>
  .form {
    width: 70%;
    max-width: 70%;
  }
  .form-row {
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>

<script>
  import {
    Button,
    Heading,
    notifications,
    Layout,
    Input,
    Body,
    ActionButton,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import api from "builderStore/api"
  import { admin, auth } from "stores/portal"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import Logo from "assets/bb-emblem.svg"
  import { _ as t } from "svelte-i18n"

  let adminUser = {}
  let error

  $: tenantId = $auth.tenantId
  $: multiTenancyEnabled = $admin.multiTenancy

  async function save() {
    try {
      adminUser.tenantId = tenantId
      // Save the admin user
      const response = await api.post(`/api/global/users/init`, adminUser)
      const json = await response.json()
      if (response.status !== 200) {
        throw new Error(json.message)
      }
      notifications.success($t("admin-user-created"))
      await admin.init()
      $goto("../portal")
    } catch (err) {
      notifications.error($t("failed-to-create-admin-user"))
    }
  }
</script>

<section>
  <div class="container">
    <Layout>
      <img alt="logo" src={Logo} />
      <Layout gap="XS" justifyItems="center" noPadding>
        <Heading size="M">{$t("create-an-admin-user")}</Heading>
        <Body size="M" textAlign="center">
          {$t("the-admin-user-has-access-to-everything-in-budibase")}
        </Body>
      </Layout>
      <Layout gap="XS" noPadding>
        <Input label={$t("email")} bind:value={adminUser.email} />
        <PasswordRepeatInput bind:password={adminUser.password} bind:error />
      </Layout>
      <Layout gap="XS" noPadding>
        <Button cta disabled={error} on:click={save}>
          {$t("create-super-admin-user")}
        </Button>
        {#if multiTenancyEnabled}
          <ActionButton
            quiet
            on:click={() => {
              admin.unload()
              $goto("../auth/org")
            }}
          >
            {$t("change-organisation")}
          </ActionButton>
        {/if}
      </Layout>
    </Layout>
  </div>
</section>

<style>
  section {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .container {
    margin: 0 auto;
    width: 260px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  img {
    width: 48px;
    margin: 0 auto;
  }
</style>

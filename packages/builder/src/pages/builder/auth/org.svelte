<script>
import {
  Body,
  Button,
  Divider,
  Heading,
  Input,
  Layout,
  notifications,
} from "@budibase/bbui"
import { goto } from "@roxi/routify"
import Logo from "assets/bb-emblem.svg"
import { admin, auth } from "stores/portal"
import { onMount } from "svelte"
import { get } from "svelte/store"

let tenantId = get(auth).tenantSet ? get(auth).tenantId : ""
$: multiTenancyEnabled = $admin.multiTenancy
$: cloud = $admin.cloud

$: useAccountPortal = cloud && !$admin.disableAccountPortal

async function setOrg() {
  try {
    if (tenantId == null || tenantId === "") {
      tenantId = "default"
    }
    await auth.setOrg(tenantId)
    // re-init now org selected
    await admin.init()
    $goto("../")
  } catch (error) {
    notifications.error("Error setting organisation")
  }
}

function handleKeydown(evt) {
  if (evt.key === "Enter") setOrg()
}

onMount(async () => {
  await auth.checkQueryString()
  if (!multiTenancyEnabled || useAccountPortal) {
    $goto("../")
  } else {
    admin.unload()
  }
})
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="login">
  <div class="main">
    <Layout>
      <Layout noPadding justifyItems="center">
        <img alt="logo" src={Logo} />
        <Heading>Set Budibase organisation</Heading>
      </Layout>
      <Divider noGrid />
      <Layout gap="XS" noPadding>
        <Body size="S" textAlign="center">Set organisation</Body>
        <Input label="Organisation" bind:value={tenantId} />
      </Layout>
      <Layout gap="XS" noPadding>
        <Button cta on:click={setOrg}>Set organisation</Button>
      </Layout>
    </Layout>
  </div>
</div>

<style>
  .login {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .main {
    width: 300px;
  }

  img {
    width: 48px;
  }
</style>

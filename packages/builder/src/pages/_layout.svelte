<script>
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import {
    SideNavigation as Navigation,
    SideNavigationItem as Item,
  } from "@budibase/bbui"
  import { admin } from "stores/portal"
  import LoginForm from "components/login/LoginForm.svelte"
  import BuilderSettingsButton from "components/start/BuilderSettingsButton.svelte"
  import LogoutButton from "components/start/LogoutButton.svelte"
  import Logo from "/assets/budibase-logo.svg"
  import api from "builderStore/api"

  let checklist

  onMount(async () => {
    await admin.init()
    if (!$admin?.checklist?.adminUser) {
      $goto("./admin")
    } else {
      $goto("./portal")
    }
  })
</script>

{#if $admin.checklist}
  <slot />
{/if}

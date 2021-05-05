<script>
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import {
    SideNavigation as Navigation,
    SideNavigationItem as Item,
  } from "@budibase/bbui"
  import { auth } from "stores/backend"
  import LoginForm from "components/login/LoginForm.svelte"
  import BuilderSettingsButton from "components/start/BuilderSettingsButton.svelte"
  import LogoutButton from "components/start/LogoutButton.svelte"
  import Logo from "/assets/budibase-logo.svg"
  import api from "builderStore/api"

  let modal
  let checklist

  async function fetchConfigChecklist() {
    const response = await api.get("/api/admin/configs/checklist")
    return await response.json()
  }

  onMount(async () => {
    const response = await fetchConfigChecklist()
    if (!response.adminUser) {
      $goto("./admin")
    }

    checklist = response
  })
</script>

{#if checklist}
  <slot />
{/if}

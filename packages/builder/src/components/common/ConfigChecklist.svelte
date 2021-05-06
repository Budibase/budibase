<script>
  import { isActive, url, goto } from "@roxi/routify"
  import { onMount } from "svelte"
  import {
    ActionMenu,
    Checkbox,
    Body,
    MenuItem,
    Icon,
    Heading,
    Avatar,
    Search,
    Layout,
    ProgressCircle,
    SideNavigation as Navigation,
    SideNavigationItem as Item,
  } from "@budibase/bbui"
  import api from "builderStore/api"
  import { organisation, admin } from "stores/portal"

  const MESSAGES = {
    apps: "Create your first app",
    smtp: "Set up email",
    adminUser: "Create your first user",
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <ProgressCircle size="S" value={$admin.onboardingProgress} />
  </div>
  <MenuItem disabled>
    <header>
      <Heading size="XXS">Get Started Checklist</Heading>
      <ProgressCircle size="S" value={$admin.onboardingProgress} />
    </header>
  </MenuItem>
  {#each Object.keys($admin.checklist) as checklistItem, idx}
    <MenuItem>
      <div class="checklist-item">
        <span>{idx + 1}. {MESSAGES[checklistItem]}</span>
        <Checkbox value={!!$admin.checklist[checklistItem]} />
      </div>
    </MenuItem>
  {/each}
</ActionMenu>

<style>
  header {
    display: grid;
    align-items: center;
    grid-template-columns: 90% 10%;
  }

  .checklist-item {
    display: grid;
    align-items: center;
    grid-template-columns: 90% 10%;
  }
</style>

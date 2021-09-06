<script>
  import {
    ActionMenu,
    Checkbox,
    MenuItem,
    Heading,
    ProgressCircle,
  } from "@budibase/bbui"
  import { admin } from "stores/portal"
  import { goto } from "@roxi/routify"
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <ProgressCircle size="S" value={$admin.onboardingProgress} />
  </div>
  <MenuItem disabled>
    <header class="item">
      <Heading size="XXS">Get Started Checklist</Heading>
      <ProgressCircle size="S" value={$admin.onboardingProgress} />
    </header>
  </MenuItem>
  {#each Object.keys($admin.checklist) as checklistItem, idx}
    <MenuItem>
      <div
        class="item"
        on:click={() => $goto($admin.checklist[checklistItem].link)}
      >
        <span>{idx + 1}. {$admin.checklist[checklistItem].label}</span>
        <Checkbox value={!!$admin.checklist[checklistItem].checked} />
      </div>
    </MenuItem>
  {/each}
</ActionMenu>

<style>
  .item {
    display: grid;
    align-items: center;
    grid-template-columns: 200px 20px;
  }
  .icon {
    cursor: pointer;
  }
</style>

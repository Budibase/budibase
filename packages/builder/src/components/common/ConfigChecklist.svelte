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
  import { onMount } from "svelte"

  let width = window.innerWidth
  $: side = width < 500 ? "right" : "left"

  const resizeObserver = new ResizeObserver(entries => {
    if (entries?.[0]) {
      width = entries[0].contentRect?.width
    }
  })

  onMount(() => {
    const doc = document.documentElement
    resizeObserver.observe(doc)

    return () => {
      resizeObserver.unobserve(doc)
    }
  })
</script>

<ActionMenu align={side}>
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
        <Checkbox value={$admin.checklist[checklistItem].checked} />
      </div>
    </MenuItem>
  {/each}
</ActionMenu>

<style>
  .item {
    display: grid;
    align-items: center;
    grid-template-columns: 175px 20px;
  }
  .icon {
    cursor: pointer;
  }
</style>

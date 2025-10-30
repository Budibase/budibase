<script>
  import { ActionMenu, MenuItem, Tags, Tag } from "@budibase/bbui"
  import { licensing } from "@/stores/portal"
  import {
    CHANGELOG_URL,
    DOCUMENTATION_URL,
    GITHUB_DISCUSSIONS_URL,
    DISCORD_URL,
    BUDIBASE_UNIVERSITY_URL,
    SUPPORT_EMAIL,
  } from "@/constants"
  import { Constants } from "@budibase/frontend-core"

  export let align = "right"

  const openLink = url => {
    window.open(url, "_blank")
  }
</script>

<ActionMenu {align}>
  <svelte:fragment slot="control" let:open>
    <slot {open} />
  </svelte:fragment>

  <MenuItem
    icon="book"
    on:click={() => openLink(DOCUMENTATION_URL)}
    on:auxclick={() => openLink(DOCUMENTATION_URL)}
  >
    Documentation
  </MenuItem>
  <MenuItem
    icon="list-bullets"
    on:click={() => openLink(CHANGELOG_URL)}
    on:auxclick={() => openLink(CHANGELOG_URL)}
  >
    Changelog
  </MenuItem>
  <MenuItem
    icon="github-logo"
    on:click={() => openLink(GITHUB_DISCUSSIONS_URL)}
    on:auxclick={() => openLink(GITHUB_DISCUSSIONS_URL)}
  >
    Discussions
  </MenuItem>
  <MenuItem
    icon="discord-logo"
    on:click={() => openLink(DISCORD_URL)}
    on:auxclick={() => openLink(DISCORD_URL)}
  >
    Discord
  </MenuItem>
  <MenuItem
    icon="graduation-cap"
    on:click={() => openLink(BUDIBASE_UNIVERSITY_URL)}
    on:auxclick={() => openLink(BUDIBASE_UNIVERSITY_URL)}
  >
    Budibase University
  </MenuItem>
  <MenuItem
    icon="envelope"
    on:click={() => {
      if (!$licensing.isFreePlan) {
        openLink(SUPPORT_EMAIL)
        return
      }
      licensing.goToUpgradePage()
    }}
    on:auxclick={() => {
      if (!$licensing.isFreePlan) {
        openLink(SUPPORT_EMAIL)
        return
      }
      licensing.goToUpgradePage()
    }}
  >
    <div class="email-menu">
      Email
      {#if $licensing.isFreePlan}
        <Tags>
          <Tag icon="lock" emphasized>{Constants.PlanType.PREMIUM}</Tag>
        </Tags>
      {/if}
    </div>
  </MenuItem>
</ActionMenu>

<style>
  .email-menu {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-s);
    align-items: center;
  }
</style>

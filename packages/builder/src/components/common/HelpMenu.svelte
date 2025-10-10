<script>
  import { ActionMenu, MenuItem, Tags, Tag } from "@budibase/bbui"
  import { licensing } from "@/stores/portal"
  import { ChangelogURL } from "@/constants"
  import { isPremiumOrAbove } from "@/helpers/planTitle"
  import { Constants } from "@budibase/frontend-core"

  export let align = "right"

  $: premiumOrAboveLicense = isPremiumOrAbove($licensing?.license?.plan?.type)

  const DISCORD_URL = "https://discord.com/invite/ZepTmGbtfF"
  const DOCUMENTATION_URL = "https://docs.budibase.com/docs"
  const GITHUB_DISCUSSIONS_URL =
    "https://github.com/Budibase/budibase/discussions"
  const BUDIBASE_UNIVERSITY_URL =
    "https://vimeo.com/showcase/budibase-university"
  const SUPPORT_EMAIL = "mailto:support@budibase.com"

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
    on:click={() => openLink(ChangelogURL)}
    on:auxclick={() => openLink(ChangelogURL)}
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
      if (premiumOrAboveLicense) {
        openLink(SUPPORT_EMAIL)
        return
      }
      licensing.goToUpgradePage()
    }}
    on:auxclick={() => {
      if (premiumOrAboveLicense) {
        openLink(SUPPORT_EMAIL)
        return
      }
      licensing.goToUpgradePage()
    }}
  >
    <div class="email-menu">
      Email
      {#if !premiumOrAboveLicense}
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

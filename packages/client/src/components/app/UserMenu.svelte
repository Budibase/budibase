<script lang="ts">
  import { ActionMenu, Icon, MenuItem } from "@budibase/bbui"
  import { UserAvatar } from "@budibase/frontend-core"
  import { getContext } from "svelte"
  import { User, ContextUser } from "@budibase/types"

  export let compact: boolean = false

  const { authStore } = getContext("sdk")

  $: text = getText($authStore)

  const getText = (user: User | ContextUser | null): string => {
    if (!user) {
      return ""
    }
    if (user.firstName) {
      let text = user.firstName
      if (user.lastName) {
        text += ` ${user.lastName}`
      }
      return text
    } else {
      return user.email
    }
  }

  const goToPortal = () => {
    window.location.href = "/builder/apps"
  }
</script>

{#if $authStore}
  <ActionMenu align={compact ? "right" : "left"}>
    <svelte:fragment slot="control">
      <div class="container">
        <UserAvatar user={$authStore} size="M" showTooltip={false} />
        {#if !compact}
          <div class="text">
            <div class="name">
              {text}
            </div>
          </div>
        {/if}
        <Icon size="L" name="ChevronDown" />
      </div>
    </svelte:fragment>
    <MenuItem icon="Apps" on:click={goToPortal}>Go to portal</MenuItem>
    <MenuItem icon="LogOut" on:click={authStore.actions.logOut}>
      Log out
    </MenuItem>
  </ActionMenu>
{/if}

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-xs);
    transition: filter 130ms ease-out;
    overflow: hidden;
  }
  .text {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    color: var(--navTextColor);
    display: flex;
    margin-left: var(--spacing-xs);
    overflow: hidden;
  }
  .name {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }
  .container:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
</style>

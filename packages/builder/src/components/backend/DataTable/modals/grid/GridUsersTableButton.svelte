<script>
  import { ActionButton, Popover, Heading, Body, Button } from "@budibase/bbui"
  import { store } from "builderStore"

  let anchor
  let open = false

  const openSidePanel = () => {
    store.update(state => ({
      ...state,
      builderSidePanel: true,
    }))
    open = false
  }
</script>

<div bind:this={anchor}>
  <ActionButton on:click={() => (open = true)} icon="Help" quiet>
    Why can't I edit this table?
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    <Heading size="XS">The app users table is read only</Heading>
    <Body size="S">
      You can continue to view the users that have access to your application.
    </Body>
    <Body size="S">
      Manage and invite more application users using the user side panel in the
      top right of your screen.
    </Body>
    <div class="button">
      <Button cta on:click={openSidePanel}>Open users panel</Button>
    </div>
  </div>
</Popover>

<style>
  .content {
    width: 300px;
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .content :global(.spectrum-Heading) {
    font-weight: 400;
  }
  .button {
    display: flex;
    justify-content: flex-end;
  }
</style>

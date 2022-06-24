<script>
  import { Icon, Body, Avatar } from "@budibase/bbui"

  export let user
  export let removeUser
</script>

<div class="title">
  <div class="name" style="display: flex; margin-left: var(--spacing-xl)">
    <div>
      <Avatar size="L" initials="PC" />
    </div>
  </div>
</div>
<div class="desktop">
  <div class="align-email">
    <Body size="M">{user.email}</Body>
    <div class="text">
      <Body size="XS">{user.access}</Body>
    </div>
  </div>
</div>
<div class="desktop" />
<div>
  <Icon on:click={() => removeUser(user._id)} hoverable size="L" name="Close" />
</div>

<style>
  .name {
    grid-gap: var(--spacing-xl);
    grid-template-columns: 75px 75px;
    align-items: center;
  }

  .text {
    opacity: 0.5;
    margin: var(--spacing-xs) 0 0 var(--spacing-m);
  }

  .align-email {
    display: flex;
    align-items: center;
  }

  .name {
    text-decoration: none;
    overflow: hidden;
  }
  .name :global(.spectrum-Heading) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: calc(1.5 * var(--spacing-xl));
  }
  .title :global(h1:hover) {
    color: var(--spectrum-global-color-blue-600);
    cursor: pointer;
    transition: color 130ms ease;
  }

  @media (max-width: 640px) {
    .desktop {
      display: none !important;
    }
  }
</style>

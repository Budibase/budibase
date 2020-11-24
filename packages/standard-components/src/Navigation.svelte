<script>
  import { getContext } from "svelte"

  const { authStore, linkable, styleable } = getContext("sdk")
  const styles = getContext("style")

  export let logoUrl
  export let title

  const logOut = () => {
    authStore.actions.logOut()
  }
</script>

<div class="nav" use:styleable={$styles}>
  <div class="nav__top">
    <a href="/" use:linkable>
      {#if logoUrl}
        <img class="logo" alt="logo" src={logoUrl} height="48" />
      {/if}
      {#if title}<span>{title}</span>{/if}
    </a>
    <div class="nav__controls">
      <div on:click={logOut}>Log out</div>
    </div>
  </div>
  <div class="nav__menu">
    <slot />
  </div>
</div>

<style>
  .nav {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  .nav__top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .nav__top img {
    margin-right: 16px;
  }

  .nav__controls {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
  }
  .nav__controls > div:hover {
    cursor: pointer;
    color: #4285f4;
  }

  .nav__menu {
    display: flex;
    margin-top: 40px;
    gap: 16px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .nav__menu > a {
    font-size: 1.5em;
    text-decoration: none;
  }
</style>

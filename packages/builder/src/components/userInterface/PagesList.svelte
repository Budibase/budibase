<script>
  import { store } from "builderStore"
  import getIcon from "components/common/icon"
  import { CheckIcon } from "components/common/Icons"

  const getPage = (s, name) => {
    const props = s.pages[name]
    return { name, props }
  }

  const pages = [
    {
      title: "Main",
      id: "main",
    },
    {
      title: "Login",
      id: "unauthenticated",
    },
  ]

  store.setCurrentPage("main")
</script>

<div class="root">
  <ul>
    {#each pages as { title, id }}
      <li>
        <span class="icon">
          {#if id === $store.currentPageName}
            <CheckIcon />
          {/if}
        </span>

        <button
          class:active={id === $store.currentPageName}
          on:click={() => store.setCurrentPage(id)}>
          {title}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .root {
    padding-bottom: 10px;
    font-size: 0.9rem;
    color: #000333;
    font-weight: bold;
    position: relative;
    padding-left: 1.8rem;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    margin: 0.5rem 0;
  }

  button {
    margin: 0 0 0 6px;
    padding: 0;
    border: none;
    font-family: Roboto;
    font-size: 0.8rem;
    outline: none;
    cursor: pointer;
    background: rgba(0, 0, 0, 0);
  }

  .active {
    font-weight: 500;
  }

  .icon {
    display: inline-block;
    width: 14px;
    color: #000333;
  }
</style>

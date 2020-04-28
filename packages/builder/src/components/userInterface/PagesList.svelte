<script>
  import { params, goto } from "@sveltech/routify"
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

  store.setCurrentPage($params.page ? $params.page : "main")

  const changePage = id => {
    store.setCurrentPage(id)
    $goto(`./${id}`)
  }
</script>

<div class="root">
  <ul>
    {#each pages as { title, id }}
      <li>
        <span class="icon">
          {#if id === $params.page}
            <CheckIcon />
          {/if}
        </span>

        <button
          class:active={id === $params.page}
          on:click={() => changePage(id)}>
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
    font-size: 13px;
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

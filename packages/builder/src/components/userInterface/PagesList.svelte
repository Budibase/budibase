<script>
  import { params, goto } from "@sveltech/routify"
  import { store } from "builderStore"

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

  if (!$store.currentPageName)
    store.setCurrentPage($params.page ? $params.page : "main")

  const changePage = id => {
    store.setCurrentPage(id)
    $goto(`./${id}/page-layout`)
  }
</script>

<div class="root">
  {#each pages as { title, id }}
    <button class:active={id === $params.page} on:click={() => changePage(id)}>
      {title}
    </button>
  {/each}
</div>

<style>
  .root {
    display: flex;
    flex-direction: row;
  }

  button {
    cursor: pointer;
    padding: 8px 16px;
    text-align: center;
    background: #ffffff;
    color: var(--ink-light);
    border-radius: 5px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.3s;
    text-rendering: optimizeLegibility;
    border: none !important;
    transition: 0.2s;
  }

  .active {
    background: var(--ink-light);
    color: var(--white);
  }
</style>

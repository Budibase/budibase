<script>
  import { params, goto } from "@sveltech/routify"
  import { store } from "builderStore"

  const getPage = (state, name) => {
    const props = state.pages[name]
    return { name, props }
  }

  const layouts = [
    {
      title: "Private",
      id: "main",
    },
    {
      title: "Public",
      id: "unauthenticated",
    },
  ]

  if (!$store.currentAssetId)
    store.actions.layouts.select($params.layout ? $params.layout : "main")

  const changeLayout = id => {
    store.actions.layouts.select(id)
    $goto(`./${id}/page-layout`)
  }
</script>

<div class="root">
  {#each layouts as { title, id }}
    <button class:active={id === $params.layout} on:click={() => changeLayout(id)}>
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
    padding: 0 var(--spacing-m);
    height: 32px;
    text-align: center;
    background: var(--background);
    color: var(--grey-7);
    border-radius: 5px;
    font-size: var(--font-size-xs);
    font-weight: 500;
    transition: all 0.3s;
    text-rendering: optimizeLegibility;
    border: none !important;
    outline: none;
    font-family: var(--font-sans);
  }

  .active {
    background: var(--grey-2);
    color: var(--ink);
  }
</style>

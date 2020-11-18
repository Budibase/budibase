<script>
  import { goto } from "@sveltech/routify"
  import ComponentTree from "./ComponentTree.svelte"
  import { store } from "builderStore"
  import ScreenDropdownMenu from "../ScreenDropdownMenu.svelte"
  import { writable } from "svelte/store"
  import NavItem from "components/common/NavItem.svelte"
  import PathTree from "./PathTree.svelte"

  export let routes = {}
</script>

<div class="root">
  {#each Object.keys(routes) as path}
    <PathTree route={routes[path]} />
  {/each}
</div>

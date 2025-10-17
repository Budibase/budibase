<script>
  import Logo from "assets/bb-emblem.svg"
  import { goto } from "@roxi/routify"
  import { organisation } from "@/stores/portal"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $goto
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions-->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<img
  src={$organisation.logoUrl || Logo}
  alt="Budibase Logo"
  on:click={() => $goto("./apps")}
/>

<style>
  img {
    width: 30px;
    height: 30px;
  }
</style>

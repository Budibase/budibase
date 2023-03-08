<script>
  import Logo from "assets/bb-emblem.svg"
  import { goto } from "@roxi/routify"
  import { organisation } from "stores/portal"
</script>

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

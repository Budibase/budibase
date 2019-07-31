<script>

import NavItem from "./NavItem.svelte";

export let width=50;

</script>

<nav class="nav"
     style="width: {width};">
    <img src="/_builder/assets/budibase-logo-only.png" class="logo" alt="budibase logo"/>
    <NavItem name="database" label="Database" icon="database" />
    <NavItem name="actions" label="Actions" icon="zap" />
    <NavItem name="access levels" label="Access Levels" icon="user" />
    <NavItem name="user interface" label="User Interface" icon="monitor"/>
</nav>



<style>

.nav {
  height: 100%;
  position: fixed;
  left: 0px;
  background-color: var(--secondary100);
  color: var(--darkslate);
}

.nav > img {
  width:100%;
  margin-bottom: 30px;
  margin-top: 5px;
  margin-left:0px;
}

</style>
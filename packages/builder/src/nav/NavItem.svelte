<script>

import {store} from "../builderStore";
import getIcon from "../common/icon";

export let name = "";
export let label = "";

let navActive = "";

store.subscribe(db => {
    navActive = (db.activeNav === name ? "active" : "")
});

const setActive = () => 
    store.setActiveNav(name);

</script>

<div class="nav-item {navActive}" on:click={setActive}>
    {label}
</div>


<style>

.nav-item {
    padding: 7px;
    font-size: 12pt;
    font-weight: bold;
    cursor: pointer;
    flex: 0 0 auto;
}

.nav-item:hover {
    background-color: var(--primary10);
}

.active {
    background-color: var(--primary10);
}

</style>
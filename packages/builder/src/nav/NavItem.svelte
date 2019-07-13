<script>

import {database} from "../builderStore";
import getIcon from "../common/icon";

export let name = "";
export let label = "";
export let icon = "";

let navActive = "";

database.subscribe(db => {
    navActive = (db.activeNav === name ? "active" : "")
});

const setActive = () => 
    database.setActiveNav(name);

</script>

<div class="{navActive}">
    <div class="nav-item" 
        on:click={setActive}>
        <div class="inner">
            <div class="icon">{@html getIcon(icon)}</div>
        </div>
    </div>
</div>


<style>

.nav-item {
    padding: 0px 5px;
    display: block;
    padding: 10px;
    color: var(--slate);
    cursor: pointer;
}

.inner {
    padding: 0px 20px 10px 0px;
    display: inline-block;
    width:100%;
}

.nav-item:hover {
    background-color: var(--primary25);
}

.icon {
    font-size:0.9em; 
    display: inline-block; 
    position: relative;
    top: 5px;
    margin-right:5px;
    width:100%;
}

.active > div {
    background-color: var(--primary10);
    color: var(--secondary100);
}

.active>div:hover {
    background-color: var(--slate);
    color: var(--secondary100);
}

.active {
    background-color: white; 
}


</style>
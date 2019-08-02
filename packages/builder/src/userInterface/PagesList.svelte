<script>
import { store } from "../builderStore";
import getIcon from "../common/icon";

const getPage = (s, name) => {
    const props = s.pages[name];
    return ({name, props});
}

</script>

<div class="root">
    <div class="hierarchy-item component" class:selected={$store.currentFrontEndItem && $store.currentFrontEndItem.name === "main"}
            on:click|stopPropagation={() => store.setCurrentPage("main")}>
        <span>{@html getIcon("circle", "7")}</span>
        <span class="title">Main</span>
    </div>

    <div class="hierarchy-item component" class:selected={$store.currentFrontEndItem && $store.currentFrontEndItem.name === "unauthenticated"}
            on:click|stopPropagation={() => store.setCurrentPage("unauthenticated")}>
        <span>{@html getIcon("circle", "7")}</span>
        <span class="title">Login</span>
    </div>

</div>

<style>

.root {
    padding-left: 20px;
    padding-bottom: 20px;
    color: var(--secondary50);
}

.hierarchy-item {
    cursor: pointer;
}

.hierarchy-item:hover {
    color: var(--secondary75);
}

.component {
    margin-left: 5px;
}

.selected {
    color: var(--primary100);
}


.title {
    margin-left: 10px;
}

</style>
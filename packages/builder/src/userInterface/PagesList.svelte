<script>
import { store } from "../builderStore";
import getIcon from "../common/icon";

const getPage = (s, name) => {
    const props = s.pages[name];
    return ({name, props});
}

</script>

<div class="root">
    <div class="hierarchy-item component" class:selected={$store.currentFrontEndItem && $store.currentPageName === "main"}
            on:click|stopPropagation={() => store.setCurrentPage("main")}>
        <span>{@html getIcon("circle", "7")}</span>
        <span class="title">Main</span>
    </div>

    <div class="hierarchy-item component" class:selected={$store.currentFrontEndItem && $store.currentPageName === "unauthenticated"}
            on:click|stopPropagation={() => store.setCurrentPage("unauthenticated")}>
        <span>{@html getIcon("circle", "7")}</span>
        <span class="title">Login</span>
    </div>

</div>

<style>

.root {
    padding-bottom: 10px;
    padding-left: 10px;
    font-size: 16px;
    color: var(--secondary50);
}

.hierarchy-item {
    cursor: pointer;
    padding: 5px 0px;
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
<script>
import getIcon from "./icon";

export let size = 18;
export let icon = "";
export let style = "";
export let color = "var(--secondary100)";
export let hoverColor = "var(--secondary75)";
export let attributes = {};

let currentAttributes = [];
const addAttributes = (node, attributes) => {

    const add = (_attributes) => {
        const attrs = [];
        for(let attr in _attributes) {
            node.setAttribute(attr, _attributes[attr]);
            attrs.push("uk-toggle")
        }
        currentAttributes = attrs;
    }

    add(attributes);

    return {
        // should implement update method
        update(attributes) {
            for(let attr of currentAttributes) {
                node.removeAttribute(attr)
            }
            add(attributes);
        },
        destroy() {}
    }
}

</script>

<button style="{style}{style ? ";" : ""} color:{color}; --hovercolor:{hoverColor}"
        on:click
        use:addAttributes={attributes}>
    {@html getIcon(icon, size)}
</button>


<style>

button {
    border-style: none;
    background-color: rgba(0,0,0,0);
    cursor: pointer;
    outline:none;
}

button:hover {
    color: var(--hovercolor);
}

button:active {
    outline:none;
}

</style>
<script>
import { getContext } from "svelte"
import ClassBuilder from "../ClassBuilder.js"

export let _bb

const cb = new ClassBuilder("data-table")

let tbody

$: tbody && _bb.attachChildren(tbody)

</script>

<tbody bind:this={tbody} class={cb.elem`content`}></tbody>
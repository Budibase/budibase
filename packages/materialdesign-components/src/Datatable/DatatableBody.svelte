<script>
import { getContext } from "svelte"

export let _bb

const cb =  _bb.getContext("BBMD:data-table:cb")

let tbody

$: tbody && _bb.attachChildren(tbody)

</script>

<tbody bind:this={tbody} class={cb.elem`content`}></tbody>
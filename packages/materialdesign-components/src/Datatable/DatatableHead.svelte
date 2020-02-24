<script>

import ClassBuilder from "../ClassBuilder.js"

export let _bb

const cb = new ClassBuilder("data-table")

let thead

$: thead && _bb.attachChildren(thead)

</script>

<thead bind:this={thead} class=className></thead>
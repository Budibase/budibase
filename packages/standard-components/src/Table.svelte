<script>

export let columns=[];
export let data="";
export let tableClass="";
export let theadClass="";
export let tbodyClass="";
export let trClass="";
export let thClass="";
export let onRowClick;

export let _bb;

const rowClickHandler = (row) => () => {
    _bb.call(onRowClick, row);
}

const cellValue = (colIndex, row) => {
    const val = _bb.getStateOrValue(
        _bb.bindings.columns[colIndex].value
        , row)
    return val;
}


</script>

 <table class={tableClass}>
    <thead class={theadClass}>
        <tr class={trClass}>
            {#each columns as col}
            <th class={thClass}>{col.title}</th>
            {/each}
        </tr>
    </thead>
    <tbody class={tbodyClass}>
        {#if data}
        {#each data as row}
        <tr class={trClass}
            on:click={rowClickHandler(row)} >
            {#each columns as col, index}
            <th class={thClass}>{cellValue(index, row)}</th>
            {/each}
        </tr>
        {/each}
        {/if}
    </tbody>
</table> 

<style>

.table-default {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
    border-collapse: collapse;
}

.table-default .thead-default .th-default {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
    font-weight: bold;
}

.table-default .th-default {
    padding: .75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
    font-weight: normal;
}

.th-default {
    text-align: inherit;
}

.table-default .tbody-default .tr-default:hover {
    color: #212529;
    background-color: rgba(0,0,0,.075);
    cursor: pointer;
}

</style>
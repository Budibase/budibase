<script>
    import "@spectrum-css/actiongroup/dist/index-vars.css"
    export let vertical;
    export let justified;
    export let quiet;
    export let compact;

    // Attaches a spectrum-ActionGroup-item class to buttons inside the div
    function group(element) {
        const buttons = Array.from(element.getElementsByTagName('button'))
        buttons.forEach(button => {
            button.classList.add('spectrum-ActionGroup-item')
        })
    }
</script>

<div use:group class="spectrum-ActionGroup 
    {vertical && 'spectrum-ActionGroup--vertical'} 
    {justified && 'spectrum-ActionGroup--justified'} 
    {quiet && 'spectrum-ActionGroup--quiet'} 
    {compact && 'spectrum-ActionGroup--compact'}">
    <slot />
</div>
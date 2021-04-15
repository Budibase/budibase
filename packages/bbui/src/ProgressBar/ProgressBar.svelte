<script>
    import "@spectrum-css/progressbar/dist/index-vars.css"
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    export let value = false
    export let easing = cubicOut
    export let duration = 1000;
    export let width = false;
    export let sideLabel = false
    export let overBackground = false

    export let s = false;
    export let m = false;
    export let l = false;
    export let xl = false;

    const progress = tweened(0, {
		duration: duration,
		easing: easing
	});

    $: if (value) $progress = value
</script>


<div class:spectrum-ProgressBar--indeterminate={!value} class:spectrum-ProgressBar--sideLabel={sideLabel} class:spectrum-ProgressBar--sizeS={s} class:spectrum-ProgressBar--sizeM={m} class:spectrum-ProgressBar--sizeL={l} class:spectrum-ProgressBar--sizeXL={xl} class="spectrum-ProgressBar"  value={$progress} role="progressbar" aria-valuenow={$progress} aria-valuemin="0" aria-valuemax="100" style={width ? `width: ${width}px;` : ''}>
    {#if $$slots}
        <div class:spectrum-FieldLabel--sizeS={s} class:spectrum-FieldLabel--sizeM={m} class:spectrum-FieldLabel--sizeL={l} class:spectrum-FieldLabel--sizeXL={xl} class="spectrum-FieldLabel spectrum-ProgressBar-label"><slot /></div>
    {/if}
    {#if value}
        <div class:spectrum-FieldLabel--sizeS={s} class:spectrum-FieldLabel--sizeM={m} class:spectrum-FieldLabel--sizeL={l} class:spectrum-FieldLabel--sizeXL={xl} class="spectrum-FieldLabel spectrum-ProgressBar-percentage">{Math.round($progress)}%</div>
    {/if}
    <div class="spectrum-ProgressBar-track">
        <div class="spectrum-ProgressBar-fill" style={value ? `width: ${$progress}%` : ''}></div>
    </div>
    <div class="spectrum-ProgressBar-label" hidden=""></div>
</div>

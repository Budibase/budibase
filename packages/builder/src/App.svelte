<script>
	
	import NoPackage from "./NoPackage.svelte";
	import PackageRoot from "./PackageRoot.svelte";
	import {store, initialise} from "./builderStore";
	import { onMount } from 'svelte';
	
	let init = initialise();

</script>

<main>

	{#await init}
	
		<h1>loading</h1>

	{:then result}
		{#if $store.hasAppPackage}
		<PackageRoot />
		{/if}

		{#if !$store.hasAppPackage}
		<NoPackage />
		{/if}

	{:catch err}
		<h1 style="color:red">{err}</h1>
	{/await}
</main>

<style>
	main {
		height: 100%;
		width: 100%;
		font-family: "Lato", Helvetica, Arial, sans-serif;
	}
</style>
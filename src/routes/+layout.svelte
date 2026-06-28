<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Kurspåmelding | Bergen fallskjermklubb</title>
</svelte:head>

<div class=" bg-gray-600 min-h-screen p-4">
	<div class="max-w-200 m-auto">
		{@render children()}
	</div>
</div>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { photosForYear, filmsForYear } from '#lib/photos';
	import PhotoGrid from '#lib/PhotoGrid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const photos = $derived(photosForYear(data.year));
	const films = $derived(filmsForYear(data.year));
</script>

<svelte:head>
	<title>Alexandre Cirilo - Photos {data.year}</title>
	<meta name="description" content="Photos from {data.year}." />
</svelte:head>

<main class="mx-auto max-w-5xl px-4 py-10">
	<header class="mb-10">
		<a href={resolve('/')} class="opacity-60 hover:opacity-100">&larr; All years</a>
		<h1 class="mt-2 text-lg">{data.year}</h1>
		{#if films.length}
			<p class="mt-1 text-sm opacity-60">{films.join(' · ')}</p>
		{/if}
	</header>

	<PhotoGrid {photos} />
</main>

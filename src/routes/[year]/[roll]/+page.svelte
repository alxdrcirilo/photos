<script lang="ts">
	import { resolve } from '$app/paths';
	import { photosForRoll, formatDateRange } from '#lib/photos';
	import PhotoGrid from '#lib/PhotoGrid.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const photos = $derived(photosForRoll(data.year, data.roll));
</script>

<svelte:head>
	<title>Alexandre Cirilo - {data.film} {data.year}</title>
	<meta name="description" content="Photos from {data.film}, {data.year}." />
</svelte:head>

<main class="mx-auto max-w-5xl px-4 py-10">
	<header class="mb-10">
		<a href={resolve('/[year]', { year: data.year })} class="opacity-60 hover:opacity-100"
			>&larr; {data.year}</a
		>
		<h1 class="mt-2 text-lg">{data.film}</h1>
		<p class="mt-1 text-sm opacity-60">
			{formatDateRange(data.first, data.last)} &middot; {data.count} photos
		</p>
	</header>

	<PhotoGrid {photos} />
</main>

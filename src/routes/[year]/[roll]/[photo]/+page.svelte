<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { photosForRoll, formatDate, formatLocation, formatPeople } from '#lib/photos';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const inRoll = $derived(photosForRoll(data.year, data.roll));
	const index = $derived(inRoll.findIndex((p) => p.name === data.photo));
	const photo = $derived(inRoll[index]);
	const prev = $derived(index > 0 ? inRoll[index - 1] : undefined);
	const next = $derived(index < inRoll.length - 1 ? inRoll[index + 1] : undefined);

	function onkeydown(e: KeyboardEvent) {
		const target = e.key === 'ArrowLeft' ? prev : e.key === 'ArrowRight' ? next : undefined;
		if (!target) return;
		goto(
			resolve('/[year]/[roll]/[photo]', { year: data.year, roll: data.roll, photo: target.name })
		);
	}
</script>

<svelte:window {onkeydown} />

<svelte:head>
	<title>Alexandre Cirilo - {photo.film} {data.year}</title>
</svelte:head>

<main class="mx-auto max-w-5xl px-4 py-10">
	<header class="mb-6">
		<a
			href={resolve('/[year]/[roll]', { year: data.year, roll: data.roll })}
			class="opacity-60 hover:opacity-100">&larr; {photo.film} {data.year}</a
		>
	</header>

	<figure>
		<enhanced:img
			src={photo.image}
			alt="{formatDate(photo.date)}, {formatLocation(photo.location)}"
			sizes="(min-width: 1024px) 64rem, 100vw"
			class="mx-auto block max-h-[calc(100vh-12rem)] w-auto max-w-full"
		/>
		<figcaption class="mt-2 text-center text-xs opacity-60">
			{formatDate(photo.date)} &middot; {formatLocation(photo.location)}
			{#if photo.people.length}
				({formatPeople(photo.people)})
			{/if}
		</figcaption>
	</figure>

	<nav class="mt-6 flex justify-between text-xs">
		{#if prev}
			<a
				href={resolve('/[year]/[roll]/[photo]', {
					year: data.year,
					roll: data.roll,
					photo: prev.name
				})}
				class="opacity-60 hover:opacity-100">&larr; Previous</a
			>
		{:else}
			<span></span>
		{/if}
		{#if next}
			<a
				href={resolve('/[year]/[roll]/[photo]', {
					year: data.year,
					roll: data.roll,
					photo: next.name
				})}
				class="opacity-60 hover:opacity-100">Next &rarr;</a
			>
		{/if}
	</nav>
</main>

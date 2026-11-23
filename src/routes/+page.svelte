<script lang="ts">
	import { resolve } from '$app/paths';
	import { years, formatDateRange } from '#lib/photos';
	import FilmCanister from '#lib/FilmCanister.svelte';
</script>

<svelte:head>
	<title>Alexandre Cirilo - Photos</title>
	<meta name="description" content="A selection of my photos." />
</svelte:head>

<main class="mx-auto max-w-5xl px-4 py-10">
	<header class="mb-10">
		<h1 class="text-xl">Photos</h1>
		<p class="opacity-60">Alexandre Cirilo</p>
	</header>

	<div class="mb-10 opacity-75" style="font-size: 0.8rem;">
		<p>A collection of photos taken with my Pentax ME Super.</p>
	</div>

	{#if years.length === 0}
		<p class="opacity-60">No photos yet.</p>
	{:else}
		<ul class="mb-3 list-disc space-y-3 pl-5 text-base">
			{#each years as { year, count, rolls } (year)}
				<li>
					<a href={resolve('/[year]', { year })} class="underline">{year}</a>
					<span class="opacity-60">({count})</span>
					<ul
						class="mt-3 grid list-[circle] grid-cols-1 gap-x-4 gap-y-3 pl-5 text-xs sm:grid-cols-[13rem_auto_1fr] sm:gap-y-1"
					>
						{#each rolls as { roll, film, first, last, count, places } (roll)}
							<!-- subgrid: lines up date/places/film across rolls, same tracks as the outer ul -->
							<li class="sm:col-span-3 sm:grid sm:grid-cols-subgrid">
								<a
									href={resolve('/[year]/[roll]', { year, roll })}
									class="underline max-sm:mb-1 max-sm:block"
									>{formatDateRange(first, last)}</a
								>
								<span
									class="flex items-center gap-1.5 whitespace-nowrap opacity-60 max-sm:mb-1"
								>
									<FilmCanister
										class="h-3.5 w-auto shrink-0"
										body={film.includes('LomoChrome') ? 'var(--film-body-lomo)' : undefined}
									/>
									{film} ({count})
								</span>
								<span class="opacity-40">{places}</span>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	{/if}
</main>

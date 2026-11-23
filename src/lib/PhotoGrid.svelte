<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatDate, formatLocation, formatPeople, type Photo } from '#lib/photos';

	let { photos }: { photos: Photo[] } = $props();
</script>

<div class="grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2">
	{#each photos as photo (photo.name)}
		<figure>
			<!-- the link's accessible name is the enhanced:img alt below, which the compiler can't see through -->
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<a
				href={resolve('/[year]/[roll]/[photo]', {
					year: photo.year,
					roll: photo.roll,
					photo: photo.name
				})}
			>
				<enhanced:img
					src={photo.image}
					alt="{formatDate(photo.date)}, {formatLocation(photo.location)}"
					sizes="(min-width: 640px) 50vw, 100vw"
					loading="lazy"
					decoding="async"
					class="block h-auto w-full"
				/>
			</a>
			<figcaption class="mt-2 text-xs opacity-60">
				{formatDate(photo.date)} &middot; {formatLocation(photo.location)}
				{#if photo.people.length}
					({formatPeople(photo.people)})
				{/if}
			</figcaption>
		</figure>
	{/each}
</div>

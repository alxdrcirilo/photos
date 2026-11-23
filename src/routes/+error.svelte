<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Alexandre Cirilo - Photos</title>
</svelte:head>

<main class="mx-auto max-w-5xl px-4 py-10">
	<h1 class="text-xl">{page.status}</h1>
	<p class="mt-2 opacity-60">{page.error?.message ?? 'Not found'}</p>
	<a href={resolve('/')} class="mt-6 inline-block underline">&larr; Back home</a>
</main>

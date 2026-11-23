<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// No reactive state: the theme lives on <html>, set before paint by the inline script in
	// app.html, and CSS picks the button's glyph and label, so prerendered markup is never stale.
	function toggleTheme() {
		const root = document.documentElement;
		const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
		root.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// storage may be disabled (e.g. private browsing)
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<button
	type="button"
	onclick={toggleTheme}
	class="absolute top-10 right-[max(1rem,calc((100vw-64rem)/2+1rem))] z-10 flex h-7 cursor-pointer items-center text-2xl transition-opacity duration-300 hover:opacity-60"
>
	<span class="theme-to-dark">☀<span class="sr-only">Switch to dark theme</span></span>
	<span class="theme-to-light">☼<span class="sr-only">Switch to light theme</span></span>
</button>

<div class="relative min-h-screen pb-12">
	{@render children()}

	<footer class="absolute inset-x-0 bottom-0 px-4 py-4 text-center text-[0.7rem] opacity-60">
		© 2026 Alexandre Cirilo. Powered by Svelte.
	</footer>
</div>

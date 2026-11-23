<script lang="ts">
	let { class: className = '', body = 'var(--film-body)' }: { class?: string; body?: string } =
		$props();
</script>

<svg
	viewBox="0 0 13 16"
	shape-rendering="crispEdges"
	class={className}
	xmlns="http://www.w3.org/2000/svg"
>
	<rect x="4" y="0" width="2" height="1" fill="var(--film-cap)" />
	<rect x="3" y="1" width="4" height="1" fill="var(--film-cap)" />
	<rect x="2" y="2" width="6" height="1" fill="var(--film-cap)" />
	<rect x="1" y="3" width="8" height="1" fill={body} />
	<rect x="0" y="4" width="10" height="1" fill={body} />
	<rect x="0" y="5" width="10" height="1" fill={body} />
	<rect x="0" y="6" width="10" height="1" fill={body} />
	<rect x="10" y="6" width="3" height="1" fill="var(--film-leader)" />
	<rect x="0" y="7" width="10" height="1" fill={body} />
	<rect x="10" y="7" width="1" height="1" fill="var(--film-leader)" />
	<rect x="11" y="7" width="1" height="1" fill="#140a08" />
	<rect x="12" y="7" width="1" height="1" fill="var(--film-leader)" />
	<rect x="0" y="8" width="10" height="1" fill={body} />
	<rect x="10" y="8" width="3" height="1" fill="var(--film-leader)" />
	<rect x="0" y="9" width="10" height="1" fill={body} />
	<rect x="10" y="9" width="1" height="1" fill="var(--film-leader)" />
	<rect x="11" y="9" width="1" height="1" fill="#140a08" />
	<rect x="12" y="9" width="1" height="1" fill="var(--film-leader)" />
	<rect x="0" y="10" width="10" height="1" fill={body} />
	<rect x="10" y="10" width="3" height="1" fill="var(--film-leader)" />
	<rect x="0" y="11" width="10" height="1" fill={body} />
	<rect x="0" y="12" width="10" height="1" fill={body} />
	<rect x="0" y="13" width="10" height="1" fill={body} />
	<rect x="0" y="14" width="10" height="1" fill="var(--film-cap)" />
	<rect x="1" y="15" width="8" height="1" fill="var(--film-cap)" />
</svg>

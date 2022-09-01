<script>
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<slot />
<SvelteToast />

<style>
	:global(.btn-main) {
		@apply btn btn-block mt-8 border-0 bg-accent bg-gradient-to-r from-accent to-accent-focus text-accent-content shadow-lg shadow-accent/30;
	}
</style>

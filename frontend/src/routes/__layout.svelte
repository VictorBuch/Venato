<script>
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<slot />

<style>
	:global(.btn-main) {
		@apply btn bg-accent btn-block from-accent to-accent-focus text-accent-content shadow-accent/30 mt-8 border-0 bg-gradient-to-r shadow-lg;
	}
</style>

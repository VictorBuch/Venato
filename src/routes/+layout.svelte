<script>
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	export const ssr = false;
</script>

<slot />
<SvelteToast />

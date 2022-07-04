<script context="module">
	import { authGuard, authGuardRedirect } from '../$lib/guards/index';
	export const load = async ({ url }) => {
		if (await authGuard(url)) return authGuardRedirect(url);
		return {};
	};
</script>

<script>
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import CalendarToday from 'svelte-material-icons/CalendarToday.svelte';
	import ChartLine from 'svelte-material-icons/ChartLine.svelte';
	import Noodles from 'svelte-material-icons/Noodles.svelte';
	import Account from 'svelte-material-icons/Account.svelte';
	import { fly } from 'svelte/transition';
</script>

<slot />

<footer
	class="bg-accent container fixed bottom-0 right-0 left-0 flex w-full items-end justify-between rounded-t pt-3 pb-1"
>
	<a
		href="/dashboard"
		class="fill-accent-content flex flex-col items-center justify-end text-sm font-light"
	>
		<CalendarToday size={'23'} color="inherit" />
		Tracking
	</a>
	<a
		href="/progress"
		class="fill-accent-content flex flex-col items-center justify-end text-sm font-light"
	>
		<ChartLine size={'23'} color="inherit" />
		Progress
	</a>
	<a
		href="/recipes"
		class="fill-accent-content flex flex-col items-center justify-end text-sm font-light"
	>
		<Noodles size={'23'} color="inherit" />
		Recipes
	</a>
	<a
		href="/my-account"
		class="fill-accent-content flex flex-col items-center justify-end text-sm font-light"
	>
		<Account size={'23'} color="inherit" />
		My account
	</a>
</footer>
<SvelteToast />

<style>
	:global main {
		@apply mb-20;
	}

	:global(.btn-main) {
		@apply btn bg-accent btn-block from-accent to-accent-focus text-accent-content shadow-accent/30 mt-8 border-0 bg-gradient-to-r shadow-lg;
	}
</style>

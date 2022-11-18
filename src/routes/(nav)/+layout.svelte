<script>
	import '../../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import CalendarToday from 'svelte-material-icons/CalendarToday.svelte';
	import ChartLine from 'svelte-material-icons/ChartLine.svelte';
	import Noodles from 'svelte-material-icons/Noodles.svelte';
	import Account from 'svelte-material-icons/Account.svelte';
</script>

<slot />

<div
	class="container fixed -bottom-[0.5px] right-0 left-0 rounded-t-md bg-accent pt-3 pb-1 drop-shadow-md"
>
	<footer class=" flex w-full items-end justify-around  text-accent-content ">
		<a
			href="/dashboard"
			class="flex flex-col items-center justify-end fill-accent-content text-sm font-light"
		>
			<CalendarToday size={'23'} color="inherit" />
			Tracking
		</a>
		<!-- <a
			href="/progress"
			class="flex flex-col items-center justify-end fill-accent-content text-sm font-light"
		>
			<ChartLine size={'23'} color="inherit" />
			Progress
		</a>
		<a
			href="/recipes"
			class="flex flex-col items-center justify-end fill-accent-content text-sm font-light"
		>
			<Noodles size={'23'} color="inherit" />
			Recipes
		</a> -->
		<a
			href="/my-account"
			class="flex flex-col items-center justify-end fill-accent-content text-sm font-light"
		>
			<Account size={'23'} color="inherit" />
			My account
		</a>
	</footer>
</div>
<SvelteToast />

<style>
	:global main {
		@apply pb-20;
	}
</style>

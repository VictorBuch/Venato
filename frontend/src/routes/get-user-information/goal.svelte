<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/userStore';
	import { toast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';

	const updateUserGoal = async (goal: string) => {
		console.log(goal);
		$user = { ...$user, goal };
		goto('/get-user-information/weight');
	};
</script>

<svelte:head>
	<title>Firness Journey | Set goal</title>
</svelte:head>
<template>
	<section class="container z-20 bg-accent-focus py-4 drop-shadow-md">
		<div class=" flex h-full w-full  items-center space-x-2">
			<a href="/my-account">
				<svg
					class="h-6 w-6 !stroke-accent-content"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
			</a>
			<h1 class="w-max text-xl font-bold text-accent-content">My Goal</h1>
		</div>
	</section>
	<div class="container h-screen w-screen bg-gradient-to-t from-accent to-accent-focus">
		<main class="flex flex-col items-center justify-center pt-32">
			<h1 class="text-3xl font-medium text-accent-content">What's your goal?</h1>
			<div class="mt-20 flex w-full flex-col items-center justify-center space-y-8">
				<button
					on:click={() => updateUserGoal('loss')}
					class="w-full rounded-3xl bg-accent-content p-4 drop-shadow-lg"
				>
					<p class="text-lg font-semibold text-accent-focus">Lose weight</p>
					<p class="text-sm font-light text-black">Get leaner and gain stamina</p>
				</button>
				<button
					on:click={() => updateUserGoal('maintain')}
					class="w-full rounded-3xl bg-accent-content p-4 drop-shadow-lg"
				>
					<p class="text-lg font-semibold text-accent-focus">Maintain weigth</p>
					<p class="text-sm font-light text-black">Eat and train for optimum health</p>
				</button>
				<button
					on:click={() => updateUserGoal('gain')}
					class="w-full rounded-3xl bg-accent-content p-4 drop-shadow-lg"
				>
					<p class="text-lg font-semibold text-accent-focus">Gain weight</p>
					<p class="text-sm font-light text-black">Build muscle strength</p>
				</button>
			</div>
		</main>
	</div>
</template>

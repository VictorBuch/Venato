<script lang="ts">
	import { user } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';
	import { updateUserCaloriesAndMacros } from '$lib/calculateCaloricIntake';

	const updateUserActivity = async (
		activity_level: 'sedentary' | 'lightly active' | 'moderately active' | 'active' | 'very active'
	) => {
		$user = { ...$user, activity_level };
		if ($user.firstTimeSetup) {
			delete $user.firstTimeSetup;
			const { data, error } = await updateUserCaloriesAndMacros();
			if (!error) {
				goto('/get-user-information/completed');
			} else {
				console.log(error);
			}
		} else {
			const { data, error } = await updateUserCaloriesAndMacros();
			if (!error) {
				goto('/my-account');
			} else {
				console.log(error);
			}
		}
	};
</script>

<svelte:head>
	<title>Venato | Set Activity</title>
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
			<h1 class="w-max text-xl font-bold text-accent-content">My Activity</h1>
		</div>
	</section>
	<div class="container h-screen w-screen bg-gradient-to-t from-accent to-accent-focus">
		<main class="flex flex-col items-center justify-center pt-24">
			<h1 class="text-center text-3xl font-medium text-accent-content">
				How active are you normally?
			</h1>
			<div class="mt-12 flex w-full flex-col items-center justify-center space-y-6">
				<button
					on:click={() => updateUserActivity('sedentary')}
					class="w-full rounded-3xl bg-accent-content p-4 drop-shadow-lg"
				>
					<p class="text-lg font-semibold text-accent-focus">Sedentary</p>
					<p class="text-sm font-light text-black">little to no exercise</p>
				</button>
				<button
					on:click={() => updateUserActivity('lightly active')}
					class="w-full rounded-3xl bg-accent-content p-4 drop-shadow-lg"
				>
					<p class="text-lg font-semibold text-accent-focus">Lightly Active</p>
					<p class="text-sm font-light text-black">exercise 1-3 days/week</p>
				</button>
				<button
					on:click={() => updateUserActivity('moderately active')}
					class="w-full rounded-3xl bg-accent-content p-4 drop-shadow-lg"
				>
					<p class="text-lg font-semibold text-accent-focus">Moderately Active</p>
					<p class="text-sm font-light text-black">exercise 3-5 days/week</p>
				</button>
				<button
					on:click={() => updateUserActivity('active')}
					class="w-full rounded-3xl bg-accent-content p-4 drop-shadow-lg"
				>
					<p class="text-lg font-semibold text-accent-focus">Active</p>
					<p class="text-sm font-light text-black">exercise 6-7 days/week</p>
				</button>
				<button
					on:click={() => updateUserActivity('very active')}
					class="w-full rounded-3xl bg-accent-content p-4 drop-shadow-lg"
				>
					<p class="text-lg font-semibold text-accent-focus">Very Active</p>
					<p class="text-sm font-light text-black">hard exercise 6-7 days/week</p>
				</button>
			</div>
		</main>
	</div>
</template>

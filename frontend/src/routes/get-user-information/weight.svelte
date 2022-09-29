<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { user } from '../../stores/userStore';
	import { toast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import {
		calculateCaloricIntake,
		calculateCarbFatProteinRatio
	} from '$lib/calculateCaloricIntake';

	let weight = '';
	let desiredWeight = '';
	let lossAmount = 2;
	let step = 'weight';
	$: lossPerWeek = lossAmount === 1 ? 0.25 : lossAmount === 2 ? 0.5 : 1;

	const handleClick = async () => {
		console.log(step);
		if (step === 'weight') {
			await updateWeight();
		} else if (step === 'desiredWeight') {
			await updateDesiredWeight();
		} else if (step === 'weightLossAmount') {
			await updateWeightLossAmount();
		}
	};

	const updateUserCaloriesAndMacros = async () => {
		const calories = calculateCaloricIntake(
			$user.weight,
			$user.height,
			$user.age,
			$user.sex,
			$user.goal,
			$user.weight_loss_amount,
			$user.activityLevel
		);
		console.log('calories', calories);
		const { carbGoal, fatGoal, proteinGoal } = calculateCarbFatProteinRatio(calories);
		console.log(carbGoal, fatGoal, proteinGoal);
		const { data, error } = await supabase
			.from('profiles')
			.update({
				...$user,
				calorie_goal: calories,
				carb_goal: carbGoal,
				fat_goal: fatGoal,
				protein_goal: proteinGoal
			})
			.match({ id: $user.id })
			.single();

		if (!error) {
			$user = data;
			toast.push('Success');
			goto('/dashboard');
		} else {
			toast.push(error.message);
		}
	};

	const updateWeightLossAmount = async () => {
		$user = { ...$user, weight_loss_amount: lossPerWeek };
		await updateUserCaloriesAndMacros();
	};
	const updateDesiredWeight = async () => {
		$user = { ...$user, desired_weight: desiredWeight };
		step = 'weightLossAmount';
	};
	const updateWeight = async () => {
		$user = { ...$user, weight };
		if ($user?.goal !== 'maintain') {
			step = 'desiredWeight';
		} else {
			$user = { ...$user, weight_loss_amount: null, desired_weight: null };
			await updateUserCaloriesAndMacros();
		}
	};

	function enterKeyEventListener(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleClick();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', enterKeyEventListener);
	});
	onDestroy(() => {
		document.removeEventListener('keydown', enterKeyEventListener);
	});
</script>

<svelte:head>
	<title>Firness Journey | Set weight</title>
</svelte:head>
<template>
	<section class="container z-20 bg-accent-focus py-4 drop-shadow-md">
		<div class=" flex h-full w-full  items-center space-x-2">
			<a href="/get-user-information/goal">
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
			<h1 class="w-max text-xl font-bold text-accent-content">Get Started</h1>
		</div>
	</section>
	<div
		class="container h-screen w-screen overflow-hidden bg-gradient-to-t from-accent to-accent-focus"
	>
		<main class="flex flex-col items-center justify-center pt-32">
			{#if step === 'weight'}
				<h1 class="text-3xl font-medium text-accent-content">What is your weight?</h1>
				<div class="mt-20 flex w-full flex-col items-center justify-center space-y-8">
					<div class="form-control">
						<label class="flex items-end space-x-2">
							<input
								type="number"
								placeholder=""
								autofocus
								class="max-w-xs input input-ghost w-24 !rounded-none border-0 border-b border-gray-800 !bg-transparent text-center text-xl focus:border-accent-content"
								bind:value={weight}
							/>
							<span class="text-md font-medium text-accent-content">Kg</span>
						</label>
					</div>
				</div>
			{:else if step === 'desiredWeight'}
				<h1 class="text-center text-3xl font-medium text-accent-content">
					What is your desired weight?
				</h1>
				<div class="mt-20 flex w-full flex-col items-center justify-center space-y-8">
					<div class="form-control">
						<label class="flex items-end space-x-2">
							<input
								type="number"
								placeholder=""
								autofocus
								class="max-w-xs input input-ghost w-24 !rounded-none border-0 border-b border-gray-800 !bg-transparent text-center text-xl focus:border-accent-content"
								bind:value={desiredWeight}
							/>
							<span class="text-md font-medium text-accent-content">Kg</span>
						</label>
					</div>
				</div>
			{:else if step === 'weightLossAmount'}
				<h1 class="text-center text-3xl font-medium text-accent-content">
					How much do you want to {$user.goal === 'loss' ? 'lose' : 'gain'}?
				</h1>
				<div class="mt-20 flex w-full flex-col items-center justify-center ">
					<p class="text-md pb-8 font-light text-accent-content">{lossPerWeek} kg/week</p>
					<input
						bind:value={lossAmount}
						type="range"
						min="1"
						max="3"
						class="range range-lg "
						step="1"
					/>
					<div class="flex w-full justify-between px-4 text-xs">
						<span>|</span>
						<span>|</span>
						<span>|</span>
					</div>
				</div>
			{/if}
		</main>
	</div>
	<div class="text-md  container fixed bottom-0  pb-4">
		<button
			on:click|preventDefault={handleClick}
			class=" btn-main !from-accent-focus !to-teal-500 "
		>
			Confirm
		</button>
	</div>
</template>

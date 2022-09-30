<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import { fade } from 'svelte/transition';
	import type { Meal } from '$lib/types/meals';
	import { page } from '$app/stores';

	// Icons
	import EmoticonExcited from 'svelte-material-icons/EmoticonExcited.svelte';
	import EmoticonHappy from 'svelte-material-icons/EmoticonHappy.svelte';
	import EmoticonSad from 'svelte-material-icons/EmoticonSad.svelte';
	import EmoticonFrown from 'svelte-material-icons/EmoticonFrown.svelte';
	import EmoticonConfused from 'svelte-material-icons/EmoticonConfused.svelte';
	import { onMount } from 'svelte';

	let mealType: string;
	let food: Meal;
	let isSaved = false;
	let portion = '';
	let unit = 'g';

	// TODO: make food rating work
	let foodRating = 'A';

	const getMealData = async () => {
		try {
			const { data, error } = await supabase
				.from('meals')
				.select()
				.match({ id: $page.params.food })
				.single();
			if (data) {
				food = data;
				mealType = $page.params.mealType;
				portion = String(food.portion);
				console.log(food);
			}
		} catch (error) {
			console.log(error);
			throw new Error('Error fetching meal data');
		}
		try {
			const { data, error } = await supabase
				.from('saved_meals')
				.select()
				.match({ meal_id: $page.params.food, user_id: $user.id })
				.single();

			if (data) {
				isSaved = true;
			}
		} catch (err) {
			console.log(err);
			throw new Error('Error fetching meal data');
		}
	};

	let promise = getMealData();

	const handleSubmit = async (e: MouseEvent) => {
		if (portion && unit) {
			try {
				const { data } = await supabase.from('consumed_meals').insert({
					meal_id: food.id,
					user_id: $user.id,
					meal_type: mealType,
					portion,
					portion_unit: unit
				});

				if (data) {
					toast.push('Meal added successfully!');
					goto(`/track-food/${mealType}`);
				}
			} catch (error) {
				console.log(error);
				toast.push('Something went wrong!');
			}
		}
	};

	const toggleFavorite = async () => {
		if (isSaved) {
			try {
				const { data, error } = await supabase
					.from('saved_meals')
					.delete()
					.match({ meal_id: food.id, user_id: $user.id });
				isSaved = false;
			} catch (error) {
				console.log(error);
				toast.push('Something went wrong!');
			}
		} else {
			try {
				const { data, error } = await supabase
					.from('saved_meals')
					.insert({ meal_id: food.id, user_id: $user.id });
				isSaved = true;
			} catch (error) {
				console.log(error);
				toast.push('Something went wrong!');
			}
		}
	};

	$: calculateFoodCalories = () => {
		const calories = food?.calories * (Number(portion) / food?.portion);
		return Math.ceil(calories);
	};

	function calculatePercentage(amount: number, total: number): number {
		return Math.ceil((amount / total) * 100);
	}
</script>

<svelte:head>
	<title>fitness Journey | {food?.name}</title>
</svelte:head>
{#await promise then data}
	<section class="flex items-end  justify-between  bg-accent-focus px-4 py-8 drop-shadow-md">
		<div class="flex items-center space-x-4">
			<a href="/track-food/{mealType}">
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
			<h1 class="text-lg font-semibold text-accent-content ">
				{food?.name}
			</h1>
		</div>
		<button on:click={toggleFavorite}>
			<div class="rounded-full bg-white p-2 drop-shadow-xl hover:drop-shadow-2xl">
				{#if !isSaved}
					<svg
						class="h-6 w-6"
						fill="gray"
						stroke="gray"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							in:fade
							d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
						/>
					</svg>
				{:else}
					<svg
						class="h-6 w-6"
						fill="red"
						stroke="red"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							in:fade
							d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
						/>
					</svg>
				{/if}
			</div>
		</button>
	</section>
	<div class="container relative mb-24 h-max">
		<form class="mt-8 space-y-2">
			<div class="flex space-x-2">
				<input
					class="w-full  rounded border border-gray-400 p-2 text-gray-800 outline-none ring-0"
					type="number"
					bind:value={portion}
					required
					min={1}
				/>
				<select class="select select-bordered select-lg bg-neutral " name="Unit" bind:value={unit}>
					<option disabled selected>Pick one</option>
					<option value={'g'}>grams</option>
					<option value={'pound'}>pound</option>
					<option value={'tbs'}>Tbs</option>
				</select>
			</div>
		</form>
		<div class="my-8 flex items-center space-x-3">
			{#if foodRating === 'A'}
				<figure class=" fill-info">
					<EmoticonExcited color="inherit" size="40" />
				</figure>
			{:else if foodRating === 'B'}
				<figure class=" fill-success">
					<EmoticonHappy color="inherit" size="40" />
				</figure>
			{:else if foodRating === 'C'}
				<figure class=" fill-warning">
					<EmoticonSad color="inherit" size="40" />
				</figure>
			{:else if foodRating === 'D'}
				<figure class=" fill-error">
					<EmoticonFrown color="inherit" size="40" />
				</figure>
			{:else}
				<figure class=" fill-base-content">
					<EmoticonConfused color="inherit" size="40" />
				</figure>
			{/if}
			<p class="text-md text-base-content">
				<span class="text-2xl font-semibold text-base-content ">
					{calculateFoodCalories()}
				</span> kcal
			</p>
		</div>
		<section class="my-8 space-y-6">
			<p class="text-lg font-semibold text-base-content">Nutritional information</p>
			<div class="flex justify-center space-x-6">
				<div class="flex flex-col items-center">
					<ProgressRing
						radius={75}
						percent={calculatePercentage(food.carbs, food.carbs + food.protein + food.fat)}
						percentOver={0}
						stroke={1}
						text={`${calculatePercentage(food.carbs, food.carbs + food.protein + food.fat)}%`}
					/>
					<p class="mt-2 text-xs uppercase text-base-content">Carbs</p>
				</div>
				<div class="flex flex-col items-center">
					<ProgressRing
						radius={75}
						percent={calculatePercentage(food.protein, food.carbs + food.protein + food.fat)}
						percentOver={0}
						stroke={1}
						text={`${calculatePercentage(food.protein, food.carbs + food.protein + food.fat)}%`}
					/>
					<p class="mt-2 text-xs uppercase text-base-content">Protein</p>
				</div>
				<div class="flex flex-col items-center">
					<ProgressRing
						radius={75}
						percent={calculatePercentage(food.fat, food.carbs + food.protein + food.fat)}
						percentOver={0}
						stroke={1}
						text={`${calculatePercentage(food.fat, food.carbs + food.protein + food.fat)}%`}
					/>
					<p class="mt-2 text-xs uppercase text-base-content">Fat</p>
				</div>
			</div>
		</section>
		<section class="space-y-6">
			<h1 class="font-semi-bold text-lg text-base-content">Other information</h1>
			<section class="space-y-2">
				<div class="text-semi-bold flex w-full items-center justify-between text-lg">
					<p>Carbs</p>
					<p>{food.carbs}</p>
				</div>
				{#if Object.hasOwn(food, 'fiber')}
					<div class="flex w-full items-center justify-between text-sm font-light">
						<p>Fiber</p>
						<p>{food.fiber}</p>
					</div>
				{/if}
				{#if Object.hasOwn(food, 'sugars')}
					<div class="flex w-full items-center justify-between text-sm font-light">
						<p>Sugars</p>
						<p>{food.sugars}</p>
					</div>
				{/if}
			</section>
			<div class="text-semi-bold flex w-full items-center justify-between text-lg">
				<p>Protein</p>
				<p>{food.protein}</p>
			</div>
			<section class="space-y-2">
				<div class="text-semi-bold flex w-full items-center justify-between text-lg">
					<p>Fat</p>
					<p>{food.fat}</p>
				</div>
				{#if Object.hasOwn(food, 'saturated_fat')}
					<div class="flex w-full items-center justify-between text-sm font-light">
						<p>Saturated fat</p>
						<p>{food.saturated_fat}</p>
					</div>
				{/if}
				{#if Object.hasOwn(food, 'unsaturated_fat')}
					<div class="flex w-full items-center justify-between text-sm font-light">
						<p>Unsaturated fat</p>
						<p>{food.unsaturated_fat}</p>
					</div>
				{/if}
			</section>
			<section class="space-y-2">
				<div class="text-semi-bold flex w-full items-center text-lg">
					<p>Other</p>
				</div>
				{#if Object.hasOwn(food, 'cholesterol')}
					<div class="flex w-full items-center justify-between text-sm font-light">
						<p>Cholesterol</p>
						<p>{food.cholesterol}</p>
					</div>
				{/if}
				{#if Object.hasOwn(food, 'sodium')}
					<div class="flex w-full items-center justify-between text-sm font-light">
						<p>Sodium</p>
						<p>{food.sodium}</p>
					</div>
				{/if}
				{#if Object.hasOwn(food, 'potasium')}
					<div class="flex w-full items-center justify-between text-sm font-light">
						<p>Potasium</p>
						<p>{food.potasium}</p>
					</div>
				{/if}
			</section>
		</section>
	</div>
	<div class="text-md  container fixed bottom-0 bg-gradient-to-t from-base-100 to-transparent pb-4">
		<button on:click|preventDefault={handleSubmit} class=" btn-main "> Track </button>
	</div>
{/await}

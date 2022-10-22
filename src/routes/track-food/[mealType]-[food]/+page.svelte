<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import { fade } from 'svelte/transition';
	import type { Meal } from '$lib/types/meals';
	import { page } from '$app/stores';
	import autoAnimate from '@formkit/auto-animate';

	// Icons
	import EmoticonExcited from 'svelte-material-icons/EmoticonExcited.svelte';
	import EmoticonHappy from 'svelte-material-icons/EmoticonHappy.svelte';
	import EmoticonSad from 'svelte-material-icons/EmoticonSad.svelte';
	import EmoticonFrown from 'svelte-material-icons/EmoticonFrown.svelte';
	import EmoticonConfused from 'svelte-material-icons/EmoticonConfused.svelte';

	let mealType = $page.params.mealType;
	let food: Meal;
	let isSaved = false;
	let serving_size = '';
	let unit = 'g';
	// TODO: see if the food is consumed and then use the consumed properties instead of default
	// can be done by looping through the consumed meals and checking if the food is in there

	const getFood = async () => {
		try {
			const { data, error } = await supabase
				.from('meals')
				.select()
				.match({ id: $page.params.food })
				.single();
			if (data) {
				food = data;
				serving_size = String(food.serving_size);
				console.log(food, 'food');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getIsFoodSaved = async () => {
		try {
			const { data, error } = await supabase
				.from('saved_meals')
				.select()
				.match({ meal_id: $page.params.food, user_id: $user.id })
				.single();

			if (data) {
				isSaved = true;
			}
		} catch (error) {
			console.log(error);
		}
	};

	let foodPromise = getFood();
	let savedPromise = getIsFoodSaved();

	const handleSubmit = async (e: MouseEvent) => {
		if (serving_size && unit) {
			try {
				const { data } = await supabase.from('consumed_meals').insert({
					meal_id: food.id,
					user_id: $user.id,
					meal_type: mealType,
					portion: serving_size
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
		const calories = food?.calories_serving_size * (Number(serving_size) / food?.serving_size);
		return Math.ceil(calories);
	};

	function calculatePercentage(amount: number, total: number): number {
		return Math.ceil((amount / total) * 100);
	}
</script>

<svelte:head>
	<title>Venato | {food?.name}</title>
</svelte:head>
<section class="flex items-end  justify-between  bg-accent px-4 py-8 drop-shadow-md">
	<div use:autoAnimate class="flex items-center space-x-4">
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
		{#await foodPromise}
			<div class="text-lg font-semibold text-accent-content loading w-32 h-5  " />
		{:then data}
			<h1 class="text-lg font-semibold text-accent-content ">
				{food?.name}
			</h1>
		{/await}
	</div>
	<button on:click={toggleFavorite}>
		<div use:autoAnimate class="rounded-full bg-white p-2 drop-shadow-xl hover:drop-shadow-2xl">
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
		<div use:autoAnimate class="flex space-x-2">
			{#await foodPromise}
				<div class="text-lg font-semibold text-accent-content loading w-full h-16  " />
			{:then data}
				<input
					class="w-full  rounded border border-gray-400 p-2 text-gray-800 outline-none ring-0"
					type="number"
					bind:value={serving_size}
					required
					min={1}
				/>
				<select class="select select-bordered select-lg bg-neutral " name="Unit" bind:value={unit}>
					<option disabled selected>Pick one</option>
					<option value={'g'}>grams</option>
				</select>
			{/await}
		</div>
	</form>
	<div use:autoAnimate class="my-8 flex items-center space-x-3">
		{#await foodPromise}
			<div class="text-lg font-semibold text-accent-content loading !rounded-full w-10 h-10" />

			<div class="text-lg font-semibold text-accent-content loading w-32 h-10  " />
		{:then data}
			{#if food.nutrition_grade === 'a'}
				<figure class=" fill-info">
					<EmoticonExcited color="inherit" size="40" />
				</figure>
			{:else if food.nutrition_grade === 'b'}
				<figure class=" fill-success">
					<EmoticonHappy color="inherit" size="40" />
				</figure>
			{:else if food.nutrition_grade === 'c'}
				<figure class=" fill-warning">
					<EmoticonSad color="inherit" size="40" />
				</figure>
			{:else if food.nutrition_grade === 'd' || food.nutrition_grade === 'e'}
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
		{/await}
	</div>
	<section class="my-8 space-y-6">
		<p class="text-lg font-semibold text-base-content">Nutritional information</p>
		<div use:autoAnimate class="flex justify-center space-x-6">
			{#await foodPromise}
				<div class="flex flex-col items-center">
					<div class="loading w-20 h-20 !rounded-full" />
					<p class="mt-2 text-xs uppercase text-base-content">Carbs</p>
				</div>
				<div class="flex flex-col items-center">
					<div class="loading w-20 h-20 !rounded-full" />
					<p class="mt-2 text-xs uppercase text-base-content">Protein</p>
				</div>
				<div class="flex flex-col items-center">
					<div class="loading w-20 h-20 !rounded-full" />
					<p class="mt-2 text-xs uppercase text-base-content">Fat</p>
				</div>
			{:then data}
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
			{/await}
		</div>
	</section>
	<div class="divider" />
	<section use:autoAnimate class="space-y-6">
		<h2>Nutrition per 100g:</h2>
		{#await foodPromise}
			<div class="space-y-2">
				<div class="loading w-full h-7" />
				<div class="loading w-full h-5" />
				<div class="loading w-full h-5" />
			</div>
			<div class="space-y-2">
				<div class="loading w-full h-7" />
			</div>
			<div class="space-y-2">
				<div class="loading w-full h-7" />
				<div class="loading w-full h-5" />
			</div>
			<div class="space-y-2">
				<div class="loading w-full h-7" />
				<div class="loading w-full h-5" />
				<div class="loading w-full h-5" />
				<div class="loading w-full h-5" />
			</div>
		{:then data}
			<section class="space-y-2">
				<div class="text-semi-bold flex w-full items-center justify-between text-lg">
					<p>Carbs</p>
					<p>{food.carbs} g</p>
				</div>
				{#if food?.fiber_g}
					<div class="flex w-full items-center justify-between text-sm font-light">
						<p>Fiber</p>
						<p>{food.fiber_g} g</p>
					</div>
				{/if}
				{#if food?.sugar_g}
					<div class="flex w-full items-center justify-between text-sm font-light">
						<p>Sugar</p>
						<p>{food.sugar_g} g</p>
					</div>
				{/if}
			</section>
			<div class="text-semi-bold flex w-full items-center justify-between text-lg">
				<p>Protein</p>
				<p>{food.protein} g</p>
			</div>
			<section class="space-y-2">
				<div class="text-semi-bold flex w-full items-center justify-between text-lg">
					<p>Fat</p>
					<p>{food.fat} g</p>
				</div>
				{#if food?.fat_saturated_g}
					<div class="flex w-full items-center justify-between text-sm font-light">
						<p>Saturated fat</p>
						<p>{food.fat_saturated_g} g</p>
					</div>
				{/if}
			</section>
			{#if food?.cholesterol_mg || food?.sodium_mg || food?.potassium_mg}
				<section class="space-y-2">
					<div class="text-semi-bold flex w-full items-center text-lg">
						<p>Other</p>
					</div>
					{#if food?.cholesterol_mg}
						<div class="flex w-full items-center justify-between text-sm font-light">
							<p>Cholesterol</p>
							<p>{food.cholesterol_mg} mg</p>
						</div>
					{/if}
					{#if food?.sodium_mg}
						<div class="flex w-full items-center justify-between text-sm font-light">
							<p>Sodium</p>
							<p>{food.sodium_mg} mg</p>
						</div>
					{/if}
					{#if food?.potassium_mg}
						<div class="flex w-full items-center justify-between text-sm font-light">
							<p>Potasium</p>
							<p>{food.potassium_mg} mg</p>
						</div>
					{/if}
				</section>
			{/if}
		{/await}
	</section>
</div>
<div class="text-md fixed bottom-0 flex w-full items-center justify-center  pb-4">
	<div class="container">
		<button on:click|preventDefault={handleSubmit} class=" btn-main "> Track </button>
	</div>
</div>

<!-- TODO: make this card pretty and the page usefull -->
<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/userStore';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import type { Meal } from '$lib/types/meals';
	import { page } from '$app/stores';

	let mealType = $page.params.mealType;

	let query = '';
	let queryRef;
	let food = <Meal>{};
	let tab = 1;

	const fetchMeal = async () => {
		// if (Object.keys(food).length) {
		// 	food = {};
		// 	query = '';
		// 	queryRef.focus();
		// 	return;
		// }
		if (query.length > 0) {
			const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-Api-Key': 'g3MDcxRxD2HNwTvPtR+r4A==xeCgAwWlHSji9qmP'
				}
			});
			const { items } = await response.json();
			console.log(items);
			if (items.length === 0) {
				toast.push('No food found');
			}
			if (items.length > 1) {
				// loop through items array and add up the serving_size_g and calories for each item
				const totalCalories = Math.ceil(items.reduce((acc, item) => acc + item.calories, 0));
				const totalPortion = Math.ceil(items.reduce((acc, item) => acc + item.serving_size_g, 0));
				const totalProtein = items.reduce((acc, item) => acc + item.protein_g, 0);
				const totalCarbs = items.reduce((acc, item) => acc + item.carbohydrates_total_g, 0);
				const totalFiber = items.reduce((acc, item) => acc + item.fiber_g, 0);
				const totalFat = items.reduce((acc, item) => acc + item.fat_total_g, 0);
				const totalFatSaturated = items.reduce((acc, item) => acc + item.fat_saturated_g, 0);
				const totalCholesterol = items.reduce((acc, item) => acc + item.cholesterol_mg, 0);
				const totalSodium = items.reduce((acc, item) => acc + item.sodium_mg, 0);
				const totalPotassium = items.reduce((acc, item) => acc + item.potassium_mg, 0);
				const totalSugar = items.reduce((acc, item) => acc + item.sugar_g, 0);
				const totalFoods = items.map((item) => `${item.serving_size_g}g ${item.name}`);
				const totalFoodsString = totalFoods.join(', ');
				const finalFood = {
					calories_serving_size: totalCalories,
					serving_size: totalPortion,
					name: totalFoodsString,
					carbs: totalCarbs,
					protein: totalProtein,
					fat: totalFat,
					fat_saturated_g: totalFatSaturated,
					cholesterol_mg: totalCholesterol,
					sodium_mg: totalSodium,
					sugar_g: totalSugar,
					potassium_mg: totalPotassium,
					fiber_g: totalFiber
				};
				food = finalFood;
			}
			if (items.length === 1) {
				let {
					calories,
					serving_size_g,
					name,
					carbohydrates_total_g,
					protein_g,
					fat_total_g,
					fat_saturated_g,
					cholesterol_mg,
					sodium_mg,
					sugar_g,
					potassium_mg,
					fiber_g
				} = items[0];
				calories = Math.ceil(calories);
				serving_size_g = Math.ceil(serving_size_g);
				const finalFood = {
					calories_serving_size: calories,
					serving_size: serving_size_g,
					name,
					carbs: carbohydrates_total_g,
					protein: protein_g,
					fat: fat_total_g,
					fat_saturated_g,
					cholesterol_mg,
					sodium_mg,
					sugar_g,
					potassium_mg,
					fiber_g
				};
				food = finalFood;
			}
		} else {
			toast.push('Please enter a meal');
		}
	};

	const addFoodItem = async () => {
		try {
			// TODO: fix nutrition grade
			const { data, error } = await supabase
				.from('meals')
				.insert([
					{
						name: food.name,
						serving_size: food.serving_size,
						calories_serving_size: food.calories_serving_size,
						carbs: food.carbs,
						protein: food.protein,
						fat: food.fat,
						sodium_mg: food?.sodium_mg,
						potassium_mg: food?.potassium_mg,
						fat_saturated_g: food?.fat_saturated_g,
						cholesterol_mg: food?.cholesterol_mg,
						sugar_g: food?.sugar_g,
						fiber_g: food?.fiber_g,
						nutrition_grade: 'A',
						is_quick_tracked: true
					}
				])
				.select();
			if (data) {
				const { data: mealData, error: mealError } = await supabase
					.from('consumed_meals')
					.insert([
						{
							meal_id: data[0].id,
							user_id: get(user).id,
							meal_type: mealType,
							portion: food.serving_size
						}
					])
					.select();
				if (mealData) {
					toast.push('Meal added');
					goto(`/track-food/${mealType}`);
				} else {
					toast.push('Error adding meal');
				}
			} else {
				toast.push('Error adding meal');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const calculatePercentage = (amount: number, total: number): number => {
		return Math.ceil((amount / total) * 100);
	};
</script>

<svelte:head>
	<title>Venato | Quick Track</title>
</svelte:head>
<section class="container mb-8 bg-accent pt-4 drop-shadow-md">
	<div class=" flex h-full w-full  items-center  ">
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
		<h1 class="ml-24 w-max text-xl font-bold text-accent-content">Quick Track</h1>
	</div>
	<div class="mt-6 flex items-center justify-center">
		<div class="tabs  ">
			<button
				on:click={() => {
					tab = 1;
					food = {};
				}}
				class:tab-active={tab == 1}
				class="tab tab-bordered !text-accent-content">Auto Track</button
			>
			<button
				on:click={() => {
					tab = 2;
					food = {};
				}}
				class:tab-active={tab == 2}
				class="tab tab-bordered !text-accent-content">Manual Track</button
			>
		</div>
	</div>
</section>
{#if tab == 1}
	<section class="mb-28 overflow-x-hidden">
		<form on:submit|preventDefault={fetchMeal} class="container flex flex-col items-center ">
			<div class="mb-2 w-full space-y-2">
				<label for="Meal">Input a meal</label>
				<input
					type="text"
					placeholder="Describe meal with measurements (e.g. 200g of chicken)"
					name="Meal"
					class="max-w-xs input w-full bg-neutral text-xl text-neutral-content placeholder:text-xs placeholder:text-gray-400"
					bind:value={query}
					bind:this={queryRef}
				/>
			</div>
			{#if Object.keys(food).length > 0}
				<div
					class="mt-6 flex h-max w-full flex-col rounded-md border border-gray-400 bg-base-content text-neutral shadow-lg"
					on:click={addFoodItem}
				>
					<div class="flex h-full items-center py-3 px-4">
						<figure>
							<slot />
						</figure>
						<div class="ml-6 flex w-60 flex-col items-start justify-center">
							<h1 class="w-full text-base font-semibold">{food.name}</h1>
							<p class="w-full truncate text-sm">
								{food.serving_size}g
							</p>
						</div>
					</div>
					<hr class="border border-gray-200" />
					<p class="flex h-max items-end justify-center  py-2 text-center text-sm">
						{food.calories_serving_size} kcal
					</p>
				</div>
				<div class="flex w-full items-center space-x-2">
					<button
						on:click={addFoodItem}
						class="btn mt-8 w-1/2 border-0 bg-accent bg-gradient-to-r from-accent to-accent-focus text-accent-content shadow-lg shadow-accent/30 hover:shadow-accent-focus/30"
						>Add Food</button
					>
					<button
						on:click={() => {
							food = {};
							query = '';
							queryRef.focus();
						}}
						class="btn mt-8 w-1/2 border-0 bg-error bg-gradient-to-r from-error to-error text-accent-content shadow-lg shadow-error/30 hover:shadow-error/30"
						>Clear food</button
					>
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
				<section class="w-full space-y-6">
					<h1 class="font-semi-bold text-lg text-base-content">Other information</h1>
					<section class="space-y-2">
						<div class="text-semi-bold flex w-full items-center justify-between text-lg">
							<p>Carbs</p>
							<p>{food.carbs.toFixed(2)} g</p>
						</div>
						{#if Object.hasOwn(food, 'fiber_g')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Fiber</p>
								<p>{food.fiber_g.toFixed(2)} g</p>
							</div>
						{/if}
						{#if Object.hasOwn(food, 'sugar_g')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Sugars</p>
								<p>{food.sugar_g.toFixed(2)} g</p>
							</div>
						{/if}
					</section>
					<div class="text-semi-bold flex w-full items-center justify-between text-lg">
						<p>Protein</p>
						<p>{food.protein.toFixed(2)} g</p>
					</div>
					<section class="space-y-2">
						<div class="text-semi-bold flex w-full items-center justify-between text-lg">
							<p>Fat</p>
							<p>{food.fat.toFixed(2)} g</p>
						</div>
						{#if Object.hasOwn(food, 'fat_saturated_g')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Saturated fat</p>
								<p>{food.fat_saturated_g.toFixed(2)} g</p>
							</div>
						{/if}
					</section>
					<section class="space-y-2">
						<div class="text-semi-bold flex w-full items-center text-lg">
							<p>Other</p>
						</div>
						{#if Object.hasOwn(food, 'cholesterol_mg')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Cholesterol</p>
								<p>{food.cholesterol_mg.toFixed(2)} mg</p>
							</div>
						{/if}
						{#if Object.hasOwn(food, 'sodium_mg')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Sodium</p>
								<p>{food.sodium_mg.toFixed(2)} mg</p>
							</div>
						{/if}
						{#if Object.hasOwn(food, 'potassium_mg')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Potasium</p>
								<p>{food.potassium_mg.toFixed(2)} mg</p>
							</div>
						{/if}
					</section>
				</section>
			{/if}
		</form>
		<div
			class="text-md  container fixed bottom-0 bg-gradient-to-t from-base-100 to-transparent pb-4"
		>
			<button on:click|preventDefault={fetchMeal} class="btn-main"> Search for food </button>
		</div>
	</section>
{:else if tab == 2}
	<section>
		<form on:submit|preventDefault={addFoodItem} class="container">
			<div class="form-control space-y-2">
				<label class="space-y-2">
					<span>Kcal</span>
					<input
						bind:value={food.calories_serving_size}
						type="text"
						placeholder="Required"
						class="max-w-xs input w-full bg-neutral text-xl text-neutral-content placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
				<label class="space-y-2">
					<span>Name</span>
					<input
						bind:value={food.name}
						type="text"
						placeholder="Optional"
						class="max-w-xs input w-full bg-neutral text-xl text-neutral-content placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
				<label class="space-y-2">
					<span>Portion</span>
					<input
						bind:value={food.serving_size}
						type="text"
						placeholder="Optional"
						class="max-w-xs input w-full bg-neutral text-xl text-neutral-content placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
				<label class="space-y-2">
					<span>Carbs (g)</span>
					<input
						bind:value={food.carbs}
						type="text"
						placeholder="Optional"
						class="max-w-xs input w-full bg-neutral text-xl text-neutral-content placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
				<label class="space-y-2">
					<span>Protein (g)</span>
					<input
						bind:value={food.protein}
						type="text"
						placeholder="Optional"
						class="max-w-xs input w-full bg-neutral text-xl text-neutral-content placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
				<label class="space-y-2">
					<span>Fat (g)</span>
					<input
						bind:value={food.fat}
						type="text"
						placeholder="Optional"
						class="max-w-xs input w-full bg-neutral text-xl text-neutral-content placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
			</div>
		</form>
		<div
			class="text-md  container fixed bottom-0 bg-gradient-to-t from-base-100 to-transparent pb-4"
		>
			<button on:click|preventDefault={addFoodItem} class="btn-main"> Add Food </button>
		</div>
	</section>
{/if}

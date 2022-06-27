<script lang="ts" context="module">
	export const load: import('@sveltejs/kit').Load = async ({
		params,
		props,
		fetch,
		status,
		error
	}) => {
		const res = await fetch('http://localhost:3004/consumedMeals');

		if (res.ok) {
			const data = await res.json();
			const meals = data[params.mealType];
			return {
				status: res.status,
				props: {
					meals,
					mealType: params.mealType
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load url`)
		};
	};
</script>

<script lang="ts">
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import type { Meal } from '../../types/meals';
	import { fly } from 'svelte/transition';

	import {
		caloriesEaten,
		caloriesGoal,
		caloriesPercent,
		carbsEaten,
		carbsGoal,
		carbsPercent,
		fatEaten,
		fatGoal,
		fatPercent,
		proteinEaten,
		proteinGoal,
		proteinPercent
	} from '../../stores/macrosStore.js';
	import {
		consumedBreakfast,
		consumedLunch,
		consumedDinner,
		consumedSnacks
	} from '../../stores/consumedMeals';

	import BarcodeScan from 'svelte-material-icons/BarcodeScan.svelte';
	import DotsVertical from 'svelte-material-icons/DotsVertical.svelte';
	import FoodCard from '../../components/FoodCard.svelte';

	export let meals: [Object];
	export let mealType: string;

	let searchQuery = '';
	$: filteredMeals = meals.filter((meal) => {
		return meal.name.toLowerCase().includes(searchQuery.toLowerCase());
	});
	$: filteredSavedFoods = savedFoods.filter((food) => {
		return food.name.toLowerCase().includes(searchQuery.toLowerCase());
	});

	const fetchData = async () => {
		const response = await fetch(`http://localhost:3004/consumedMeals`);
		const data = await response.json();
		meals = data.meal_type;
	};

	// // Spoof data for now id: number;
	const savedFoods = [
		{
			id: Math.ceil(Math.random() * 1000),
			name: 'Pizza',
			description: '',
			calories: 100,
			carbs: 10,
			protein: 10,
			fat: 10,
			portion: 1,
			portion_unit: 'g'
		},
		{
			id: Math.ceil(Math.random() * 1000),
			name: 'Greek Yoghurt',
			description: '',
			calories: 100,
			carbs: 10,
			protein: 10,
			fat: 10,
			portion: 1,
			portion_unit: 'g'
		}
	];

	const handleAddMeal = async (meal: Meal) => {
		const response = await axios.post(`/api/consumed_meals`, {
			meal_id: meal.id,
			meal_type: mealType,
			portion: meal.portion,
			portion_unit: meal.portion_unit
		});
		if (response.status === 200) {
			await fetchData();
		}
	};

	const handleRemoveMeals = async (meal: Meal) => {
		const response = await axios.delete(`/api/consumed_meals/${meal.id}`);
		if (response.status === 200) {
			await fetchData();
		}
	};

	const handleCustomizePortion = async (meal: Meal) => {
		goto(`/track-food/${mealType}-${meal.id}`);
	};

	const handleBarcodeScanning = async () => {
		goto(`/track-food/scan`);
	};
</script>

<section class="bg-accent container py-8">
	<div class=" flex h-full w-full  items-center justify-between space-x-2">
		<a href="/dashboard">
			<svg
				class="!stroke-accent-content h-6 w-6"
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
		<h1 class="text-accent-content w-max text-xl font-bold">
			{mealType.toUpperCase()}
		</h1>
		<div class="ml-auto h-max w-max">
			<div class="dropdown dropdown-end">
				<button tabindex="0">
					<DotsVertical />
				</button>
				<ul
					tabindex="0"
					class="dropdown-content menu bg-base-content text-base-100 rounded-box w-52 p-2 shadow"
				>
					<li><a href="/quick-track/{mealType}">Quick track</a></li>
					<li><a href="/add-food">Add food</a></li>
					<li><a href="/add-meal">Add meal</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="mt-6 flex items-center justify-center space-x-2">
		<div class="form-control w-full">
			<div class="input-group">
				<input
					type="text"
					placeholder="Search…"
					bind:value={searchQuery}
					class="input input-bordered bg-accent-content w-full !text-black placeholder:text-gray-700"
				/>
				<button class="btn btn-square">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
			</div>
		</div>
		<figure
			on:click={handleBarcodeScanning}
			class="bg-accent-content text-neutral rounded-full p-2"
		>
			<BarcodeScan size={'25'} color="inherit" />
		</figure>
	</div>
</section>
<div class="container mb-10 space-y-4">
	{#if !searchQuery.length}
		<section
			class="border-base-content text-neutral-content my-8 flex w-full flex-col items-center space-y-4 rounded border p-4 shadow-lg"
		>
			<div class="flex w-full flex-col items-center justify-center space-y-2">
				<div class="flex w-full items-center justify-between">
					<h1 class="text-sm">Dalily intake</h1>
					<h3 class="text-sm">
						{' '}
						{$caloriesEaten}/{$caloriesGoal} kcal
					</h3>
				</div>
				<progress class="progress progress-accent w-full" value={$caloriesPercent} max="100" />
			</div>
			<div class="flex w-full items-center justify-between">
				<div class="flex w-1/4 flex-col items-center justify-center space-y-2">
					<h3 class="text-sm">Carbs</h3>
					<progress class="progress progress-accent w-full" value={$carbsPercent} max="100" />

					<p class="text-sm">
						{$carbsEaten}/{$carbsGoal}g
					</p>
				</div>
				<div class="flex w-1/4 flex-col items-center justify-center space-y-2">
					<h3 class="text-sm">Protein</h3>
					<progress class="progress progress-accent w-full" value={$proteinPercent} max="100" />

					<p class="text-sm">
						{$proteinEaten}/{$proteinGoal}g
					</p>
				</div>
				<div class="flex w-1/4 flex-col items-center justify-center space-y-2">
					<h3 class="text-sm">fat</h3>
					<progress class="progress progress-accent w-full" value={$fatPercent} max="100" />
					<p class="text-sm">
						{$fatEaten}/{$fatGoal}g
					</p>
				</div>
			</div>
		</section>
	{/if}

	{#if meals.length > 0 && !searchQuery.length}
		<section class="my-8">
			<h1>Consumed meals</h1>
			<div class="space-y-4">
				{#each meals as meal}
					<FoodCard
						title={meal.name}
						calories={meal.calories}
						servingSize={meal.portion}
						on:clickFoodIcon={() => handleRemoveMeals(meal)}
						on:customizeFoodItem={() => {
							handleCustomizePortion(meal);
						}}
						remove
					/>
				{/each}
			</div>
		</section>
	{/if}
	{#if filteredSavedFoods.length > 0 && searchQuery.length > 0}
		<section class="my-8">
			<h1>Saved Foods</h1>
			<div class="space-y-4">
				{#each filteredSavedFoods as food}
					<FoodCard
						title={food.name}
						calories={food.calories}
						servingSize={food.portion}
						on:clickFoodIcon={() => handleAddMeal(food)}
						on:customizeFoodItem={() => {
							handleCustomizePortion(food);
						}}
					/>
				{/each}
			</div>
		</section>
	{/if}
	<section class="my-8">
		<h1>Meals</h1>
		<div class="space-y-4">
			{#if filteredMeals.length > 0}
				{#each filteredMeals as meal}
					<FoodCard
						title={meal.name}
						calories={meal.calories}
						servingSize={meal.portion}
						on:clickFoodIcon={() => handleAddMeal(meal)}
						on:customizeFoodItem={() => {
							handleCustomizePortion(meal);
						}}
					/>
				{/each}
			{/if}
		</div>
	</section>
</div>

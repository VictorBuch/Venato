<script lang="ts" context="module">
	import { supabase } from '$lib/supabaseClient';
	import { get } from 'svelte/store';
	import { user } from '../../stores/userStore';

	export const load: import('@sveltejs/kit').Load = async ({
		params,
		props,
		fetch,
		status,
		error
	}) => {
		const { data } = await supabase
			.from('consumed_meals')
			.select('meal_type, portion,meals(*)')
			.match({ user_id: get(user)?.id });

		const { data: allMeals } = await supabase.from('meals').select('*');

		const savedMealsResp = await supabase
			.from('saved_meals')
			.select('meals(*)')
			.match({ user_id: get(user)?.id });

		if (data && allMeals) {
			const consumedMeals = data
				.filter((meal) => meal.meal_type == params.mealType)
				.map((meal) => {
					return { ...meal.meals, portion: meal.portion };
				});
			const meals = allMeals.filter((meal) => !consumedMeals.some((cMeal) => cMeal.id == meal.id));
			return {
				props: {
					consumedMeals,
					meals,
					savedMeals: savedMealsResp.data
						? savedMealsResp.data.map((mealObj) => mealObj.meals)
						: [],
					mealType: params.mealType
				}
			};
		}

		return {
			status: error,
			error: new Error(`Could not load url`)
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Meal } from '../../types/meals';

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
	import { toast } from '@zerodevx/svelte-toast';

	export let consumedMeals: [Object];
	export let meals: [Meal];
	export let mealType: string;
	export let savedMeals: [Object];

	let searchQuery = '';
	let activeTab = 'meals';

	$: filteredMeals = meals.filter((meal) => {
		return meal.name.toLowerCase().includes(searchQuery.toLowerCase());
	});
	$: filteredSavedFoods = savedMeals.filter((food) => {
		return food.name.toLowerCase().includes(searchQuery.toLowerCase());
	});

	const fetchData = async () => {
		const { data, error } = await supabase
			.from('consumed_meals')
			.select('meal_type, portion,meals(*)')
			.match({ user_id: get(user)?.id, meal_type: mealType });

		if (data) {
			meals = data.map((meal) => {
				return { ...meal.meals, portion: meal.portion };
			});
		} else if (error) {
			console.log(error);
			toast.push(error.message);
		}
	};

	const handleAddMeal = async (meal: Meal) => {
		const { data, error } = await supabase.from('consumed_meals').insert([
			{
				user_id: get(user)?.id,
				meal_type: mealType,
				meal_id: meal.id,
				portion: meal.portion
			}
		]);
		if (!error) {
			await fetchData();
		} else {
			console.log(error);
			toast.push(error.message);
		}
	};

	const handleRemoveMeals = async (meal: Meal) => {
		const { data, error } = await supabase
			.from('consumed_meals')
			.delete()
			.match({ user_id: get(user)?.id, meal_type: mealType, meal_id: meal.id })
			.single();
		if (!error) {
			await fetchData();
		} else {
			console.log(error);
			toast.push(error.message);
		}
	};

	const handleCustomizePortion = async (meal: Meal) => {
		goto(`/track-food/${mealType}-${meal.id}`);
	};

	const handleBarcodeScanning = async () => {
		goto(`/track-food/scan`);
	};
</script>

<section class="container bg-accent py-8 drop-shadow-md">
	<div class=" flex h-full w-full  items-center justify-between space-x-2">
		<a href="/dashboard">
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
		<h1 class="w-max text-xl font-bold text-accent-content">
			{mealType.toUpperCase()}
		</h1>
		<div class="ml-auto h-max w-max">
			<div class="dropdown-end dropdown">
				<button tabindex="0">
					<DotsVertical size="20" />
				</button>
				<ul
					tabindex="0"
					class="dropdown-content menu rounded-box w-52 bg-base-content p-2 text-base-100 shadow"
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
					class="input input-bordered w-full bg-accent-content !text-black placeholder:text-gray-700"
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
			class="rounded-full bg-accent-content p-2 text-neutral"
		>
			<BarcodeScan size={'25'} color="inherit" />
		</figure>
	</div>
</section>

<div class="container mb-10 space-y-4">
	<section
		class="my-8 flex w-full flex-col items-center space-y-4 rounded border border-accent-focus p-4 text-neutral-content shadow-lg"
	>
		<div class="flex w-full flex-col items-center justify-center space-y-2">
			<div class="flex w-full items-center justify-between">
				<h1 class="text-sm">Dalily intake</h1>
				<h3 class="text-sm">
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
	<div class="tabs justify-between ">
		<button
			on:click={() => (activeTab = 'meals')}
			class:tab-active={activeTab === 'meals'}
			class:!border-accent={activeTab === 'meals'}
			class="tab tab-bordered w-1/3 ">All meals</button
		>
		<button
			on:click={() => (activeTab = 'saved')}
			class:tab-active={activeTab === 'saved'}
			class:!border-accent={activeTab === 'saved'}
			class="tab tab-bordered w-1/3">Saved meals</button
		>
		<button
			on:click={() => (activeTab = 'recent')}
			class:tab-active={activeTab === 'recent'}
			class:!border-accent={activeTab === 'recent'}
			class="tab tab-bordered w-1/3">Recent meals</button
		>
	</div>
	{#if activeTab === 'meals'}
		{#if consumedMeals.length > 0 && !searchQuery.length}
			<section class="my-8">
				<h1>Consumed meals</h1>
				<div class="space-y-4">
					{#each consumedMeals as meal}
						<FoodCard
							title={meal.name}
							calories={meal.calories}
							servingSize={meal.portion}
							on:clickFoodIcon={() => handleRemoveMeals(meal)}
							on:customizeFoodItem={() => handleCustomizePortion(meal)}
							remove
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
	{/if}
	{#if activeTab === 'saved'}
		<section class="my-8">
			<h1>Saved Foods</h1>
			{#if filteredSavedFoods.length > 0}
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
			{/if}
		</section>
	{/if}
</div>

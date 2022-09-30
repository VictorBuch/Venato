<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';
	import type { Meal } from '$lib/types/meals';

	import {
		consumedBreakfast,
		consumedLunch,
		consumedDinner,
		consumedSnacks,
		combinedMealsObj,
		meals
	} from '$lib/stores/consumedMeals';

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
	} from '$lib/stores/macrosStore.js';

	import BarcodeScan from 'svelte-material-icons/BarcodeScan.svelte';
	import DotsVertical from 'svelte-material-icons/DotsVertical.svelte';
	import FoodCard from '$lib/components/FoodCard.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let mealType: string;
	let savedMeals: [Meal];
	let recentMeals: [Meal];

	const fetchMealData = async () => {
		try {
			const start = new Date();
			start.setHours(0, 0, 0, 0);
			const { data: fetchSavedMeals } = await supabase
				.from('saved_meals')
				.select('meals(*)')
				.match({ user_id: $user?.id });

			const { data: fetchRecentMeals } = await supabase
				.from('consumed_meals')
				.select('meals(*)')
				.match({ user_id: $user?.id, meal_type: $page.params.mealType })
				.lt('created_at', start.toISOString());

			if (fetchSavedMeals && fetchRecentMeals) {
				savedMeals = fetchSavedMeals ? fetchSavedMeals.map((mealObj) => mealObj.meals) : [];
				recentMeals = fetchRecentMeals ? fetchRecentMeals.map((mealObj) => mealObj.meals) : [];
				mealType = $page?.params?.mealType;
			}
		} catch (error) {
			console.log(error);
			console.log($page.params);
			throw new Error('Error fetching meal data');
		}
	};

	let fetchData = fetchMealData();

	let searchQuery = '';
	let activeTab = 'recent';

	$: filteredMeals =
		$meals && mealType
			? $meals
					.filter(
						(meal) =>
							!$combinedMealsObj[mealType].includes(
								$combinedMealsObj[mealType].find((comMeal) => comMeal.id === meal.id)
							)
					)
					.filter((meal) => {
						return meal.name.toLowerCase().includes(searchQuery.toLowerCase());
					})
			: [];
	$: filteredSavedFoods = savedMeals
		? savedMeals.filter((food) => {
				return food.name.toLowerCase().includes(searchQuery.toLowerCase());
		  })
		: [];
	$: filteredRecentFoods = recentMeals
		? recentMeals.filter((food) => {
				return food.name.toLowerCase().includes(searchQuery.toLowerCase());
		  })
		: [];

	const handleAddMeal = async (meal: Meal) => {
		const { data, error } = await supabase.from('consumed_meals').insert([
			{
				user_id: $user?.id,
				meal_type: mealType,
				meal_id: meal.id,
				portion: meal.portion
			}
		]);
		if (error) {
			toast.push('Could not add meal');
			console.log(error);
		}
	};

	const handleRemoveMeals = async (meal: Meal) => {
		const { data, error } = await supabase
			.from('consumed_meals')
			.delete()
			.match({ user_id: $user?.id, meal_type: mealType, meal_id: meal.id });
		if (error) {
			toast.push('Could not remove meal');
			console.log(error);
		}
	};

	const handleCustomizePortion = async (meal: Meal) => {
		goto(`/track-food/${mealType}-${meal.id}`);
	};

	const handleBarcodeScanning = async () => {
		goto(`/track-food/scan`);
	};
</script>

{#await fetchData then data}
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
				{mealType?.toUpperCase()}
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
						<li><a href="/add-food">Add food / meal</a></li>
						<!-- <li><a href="/add-meal">Add meal</a></li> -->
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
				on:click={() => (activeTab = 'recent')}
				class:tab-active={activeTab === 'recent'}
				class:!border-accent={activeTab === 'recent'}
				class="tab tab-bordered w-1/3">Recent meals</button
			>
			<button
				on:click={() => (activeTab = 'saved')}
				class:tab-active={activeTab === 'saved'}
				class:!border-accent={activeTab === 'saved'}
				class="tab tab-bordered w-1/3">Saved meals</button
			>
			<button
				on:click={() => (activeTab = 'meals')}
				class:tab-active={activeTab === 'meals'}
				class:!border-accent={activeTab === 'meals'}
				class="tab tab-bordered w-1/3 ">All meals</button
			>
		</div>
		{#if activeTab === 'recent'}
			{#if $combinedMealsObj[mealType]?.length > 0 && !searchQuery.length}
				<section class="my-8">
					<h1>Consumed meals</h1>
					<div class="space-y-4">
						{#each $combinedMealsObj[mealType] as meal}
							<FoodCard
								title={meal.name}
								calories={meal.calories}
								servingSize={meal.portion}
								isQuickTracked={meal.is_quick_tracked}
								on:clickFoodIcon={() => handleRemoveMeals(meal)}
								on:customizeFoodItem={() => handleCustomizePortion(meal)}
								remove
							/>
						{/each}
					</div>
				</section>
			{/if}
			<section class="my-8">
				<h1>Recent Foods</h1>
				{#if filteredRecentFoods?.length > 0}
					<div class="space-y-4">
						{#each filteredRecentFoods as food}
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
		{#if activeTab === 'saved'}
			<section class="my-8">
				<h1>Saved Foods</h1>
				{#if filteredSavedFoods?.length > 0}
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
		{#if activeTab === 'meals'}
			<section class="my-8">
				<h1>Meals</h1>
				<div class="h-max space-y-4 overflow-auto">
					{#if filteredMeals?.length > 0}
						{#each filteredMeals as meal}
							<FoodCard
								title={meal.name}
								calories={meal.calories}
								servingSize={meal.portion}
								isQuickTracked={meal.is_quick_tracked}
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
	</div>
{/await}

<script lang="ts">
	import InfiniteLoading from 'svelte-infinite-loading';
	import VirtualList from 'svelte-tiny-virtual-list';
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';
	import type { Meal } from '$lib/types/meals';
	import autoAnimate from '@formkit/auto-animate';

	import { combinedMealsObj } from '$lib/stores/consumedMeals';

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
	import FoodCardSkeleton from '$lib/components/FoodCardSkeleton.svelte';

	let mealType = $page?.params?.mealType;
	let savedMeals: [Meal];
	let recentMeals: [Meal];
	let meals: [Meal];
	let searchQuery = '';
	let activeTab = 'recent';

	const fetchMealData = async () => {
		// TODO: Split this into multiple calls to make the initial load of recent meals faster
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

			const { data: fetchMeals } = await supabase.from('meals').select('*').limit(100);

			if (fetchSavedMeals && fetchRecentMeals && fetchMeals) {
				savedMeals = fetchSavedMeals ? fetchSavedMeals.map((mealObj) => mealObj.meals) : [];
				recentMeals = fetchRecentMeals ? fetchRecentMeals.map((mealObj) => mealObj.meals) : [];
				meals = fetchMeals;
			}
		} catch (error) {
			console.log(error);
			console.log($page.params);
			throw new Error('Error fetching meal data');
		}
	};

	let fetchData = fetchMealData();

	function infiniteHandler({ detail: { complete, error } }) {
		try {
			const fetchMeals = supabase.from('meals').select('*').limit(500);

			fetchMeals.then((res) => {
				if (res.error) {
					error();
				} else {
					meals = [...meals, ...res.data];
					complete();
				}
			});
		} catch (e) {
			error();
		}
	}

	let timeout;
	let queriedMeals = [];
	let querying = false;

	const debounce = () => {
		clearTimeout(timeout);
		querying = true;
		timeout = setTimeout(async () => {
			const { data, error } = await supabase
				.from('meals')
				.select('*')
				.textSearch('name', searchQuery);
			if (data) {
				queriedMeals = data;
			}
			if (error) {
				console.log(error);
			}
			querying = false;
		}, 1000);
	};

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
		const { data, error } = await supabase
			.from('consumed_meals')
			.insert([
				{
					user_id: $user?.id,
					meal_type: mealType,
					meal_id: meal.id,
					portion: meal.serving_size
				}
			])
			.select();
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
		goto(`/track-food/${mealType}/scan`);
	};
</script>

<svelte:head>
	<title>Venato | Track Food</title>
</svelte:head>
<div class="h-screen w-screen overflow-hidden text-neutral-content">
	<section class="container bg-accent py-4 drop-shadow-md">
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
						on:keyup={debounce}
						class="input-bordered input w-full bg-accent-content !text-black placeholder:text-gray-700"
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
	<div class="container h-full space-y-4 overflow-auto pb-10">
		<section
			class="my-8 flex w-full flex-col items-center space-y-4 rounded border border-accent p-4 text-neutral-content shadow-lg"
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

		{#if $combinedMealsObj[mealType]?.length > 0 && !searchQuery.length}
			<section class="my-8">
				<h1 class="mb-4 font-light text-base-content">Consumed meals</h1>
				<div
					class="space-y-4 md:grid md:auto-rows-auto md:grid-cols-2  md:gap-6 md:space-y-0 md:grid-flow-row"
				>
					{#each $combinedMealsObj[mealType] as meal}
						<FoodCard
							title={meal.name}
							calories={meal.calories_consumed_serving_size}
							servingSize={meal.consumed_serving_size}
							isQuickTracked={meal.is_quick_tracked}
							on:clickFoodIcon={() => handleRemoveMeals(meal)}
							on:customizeFoodItem={() => handleCustomizePortion(meal)}
							remove
						/>
					{/each}
				</div>
			</section>
		{/if}
		{#if searchQuery.length < 1}
			{#if activeTab === 'recent'}
				<section class="my-8 pb-52">
					<h1 class="mb-4 font-light text-base-content">Recent Meals</h1>
					<div use:autoAnimate>
						{#await fetchData}
							<div
								class="space-y-4 md:grid md:grid-flow-row md:auto-rows-auto  md:grid-cols-2 md:gap-6 md:space-y-0"
							>
								{#each Array(3) as food}
									<FoodCardSkeleton />
								{/each}
							</div>
						{:then data}
							{#if filteredRecentFoods?.length > 0}
								<div
									class="space-y-4 md:grid md:grid-flow-row md:auto-rows-auto  md:grid-cols-2 md:gap-6 md:space-y-0"
								>
									{#each filteredRecentFoods as food}
										<FoodCard
											title={food.name}
											calories={food.calories_serving_size}
											servingSize={food.serving_size}
											on:clickFoodIcon={() => handleAddMeal(food)}
											on:customizeFoodItem={() => {
												handleCustomizePortion(food);
											}}
										/>
									{/each}
								</div>
							{:else}
								<div class="mt-4 flex w-full items-center justify-center">
									<h3 class="text-sm">No recent meals</h3>
								</div>
							{/if}
						{/await}
					</div>
				</section>
			{/if}

			{#await fetchData then data}
				{#if activeTab === 'saved'}
					<section class="my-8 pb-52">
						<h1 class="mb-4 font-light text-base-content">Saved Meals</h1>
						{#if filteredSavedFoods?.length > 0}
							<div
								class="space-y-4 md:grid md:grid-flow-row md:auto-rows-auto  md:grid-cols-2 md:gap-6 md:space-y-0"
							>
								{#each filteredSavedFoods as food}
									<FoodCard
										title={food.name}
										calories={food.calories_serving_size}
										servingSize={food.serving_size}
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
					<section class="my-8 pb-32">
						<h1 class="mb-4 font-light text-base-content">Meals</h1>
						{#if meals?.length > 0}
							<div class="list">
								<VirtualList width="100%" height={500} itemCount={meals.length} itemSize={130}>
									<div slot="item" let:index let:style {style}>
										<FoodCard
											title={meals[index].name}
											calories={meals[index].calories_serving_size}
											servingSize={meals[index].serving_size}
											isQuickTracked={meals[index].is_quick_tracked}
											on:clickFoodIcon={() => handleAddMeal(meals[index])}
											on:customizeFoodItem={() => {
												handleCustomizePortion(meals[index]);
											}}
										/>
									</div>
									<div slot="footer">
										<InfiniteLoading on:infinite={infiniteHandler} />
									</div>
								</VirtualList>
							</div>
						{/if}
					</section>
				{/if}
			{/await}
		{:else if querying}
			<section class="my-8 pb-52">
				<h1 class="mb-4 font-light text-base-content">Found Meals</h1>
				<div class="mt-4 flex w-full items-center justify-center">
					<h3 class="text-sm">Searching...</h3>
				</div>
			</section>
		{:else}
			<section class="my-8 pb-52">
				<h1 class="mb-4 font-light text-base-content">Found Meals</h1>
				{#if queriedMeals?.length > 0}
					<div
						class="space-y-4 md:grid md:auto-rows-auto md:grid-cols-2  md:gap-6 md:space-y-0 md:grid-flow-row"
					>
						{#each queriedMeals as food}
							<FoodCard
								title={food.name}
								calories={food.calories_serving_size}
								servingSize={food.serving_size}
								on:clickFoodIcon={() => handleAddMeal(food)}
								on:customizeFoodItem={() => {
									handleCustomizePortion(food);
								}}
							/>
						{/each}
					</div>
				{:else}
					<div class="mt-4 flex w-full items-center justify-center">
						<h3 class="text-sm">No meals found</h3>
					</div>
				{/if}
			</section>
		{/if}
	</div>
</div>

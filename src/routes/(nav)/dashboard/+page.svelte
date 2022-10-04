<script lang="ts">
	import { goto } from '$app/navigation';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import MealCard from '$lib/components/MealCard.svelte';
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/userStore';
	import { supabase } from '$lib/supabaseClient';

	// SVG ICONS
	import FoodCroissant from 'svelte-material-icons/FoodCroissant.svelte';
	import Noodles from 'svelte-material-icons/Noodles.svelte';
	import Pasta from 'svelte-material-icons/Pasta.svelte';
	import FoodApple from 'svelte-material-icons/FoodApple.svelte';

	import {
		caloriesBurned,
		caloriesEaten,
		caloriesGoal,
		caloriesPercent,
		caloriesLeft,
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
	import {
		consumedBreakfast,
		consumedLunch,
		consumedDinner,
		consumedSnacks,
		meals
	} from '$lib/stores/consumedMeals';

	let consumedMeals;
	let fetchedMeals;

	const calculateRecommendedAmountOfCalories = (percentage: number) => {
		return Math.round((percentage / 100) * $caloriesLeft);
	};

	onMount(async () => {
		const start = new Date();
		start.setHours(0, 0, 0, 0);
		const { data } = await supabase
			.from('consumed_meals')
			.select('meal_type, portion,meals(*)')
			.match({ user_id: $user?.id })
			.gt('created_at', start.toISOString());

		const { data: mealsData } = await supabase
			.from('meals')
			.select('*')
			.match({ is_quick_tracked: false });
		if (data && mealsData) {
			const consumedMeals = {
				breakfast: data
					.filter((meal) => meal.meal_type === 'breakfast')
					.map((meal) => {
						return {
							...meal.meals,
							portion: meal.portion
						};
					}),
				lunch: data
					.filter((meal) => meal.meal_type === 'lunch')
					.map((meal) => {
						return {
							...meal.meals,
							portion: meal.portion
						};
					}),
				dinner: data
					.filter((meal) => meal.meal_type === 'dinner')
					.map((meal) => {
						return {
							...meal.meals,
							portion: meal.portion
						};
					}),
				snacks: data
					.filter((meal) => meal.meal_type === 'snacks')
					.map((meal) => {
						return {
							...meal.meals,
							portion: meal.portion
						};
					})
			};
			$consumedBreakfast = consumedMeals?.breakfast;
			$consumedLunch = consumedMeals?.lunch;
			$consumedDinner = consumedMeals?.dinner;
			$consumedSnacks = consumedMeals?.snacks;
			$meals = mealsData;
		}
	});
</script>

<svelte:head>
	<title>Venato | Dashboard</title>
</svelte:head>

<main class=" w-screen overflow-x-hidden">
	<nav class="container mt-6 flex h-max w-full items-center justify-evenly">
		<h1 class="text-2xl font-bold text-accent">Venato</h1>
	</nav>
	<div class="flex w-full flex-col items-center ">
		<div class="container py-8">
			<section
				id="CaloriesSection"
				class="item-center  flex w-full justify-between text-lg text-neutral-content"
			>
				<div class=" flex w-1/4 flex-col items-center justify-center">
					<h1>{$caloriesEaten}</h1>
					<h2>EATEN</h2>
				</div>
				<div class="flex w-2/4 items-center justify-center">
					<ProgressRing
						radius={150}
						percent={$caloriesPercent}
						percentOver={(($caloriesEaten - $caloriesGoal) / $caloriesGoal) * 100}
						stroke={1}
						number={$caloriesLeft}
						text={`Kcal ${$caloriesPercent > 100 ? 'over' : 'left'}`}
					/>
				</div>
				<div class=" flex w-1/4 flex-col items-center justify-center">
					<h1>{$caloriesBurned}</h1>
					<h2>BURNED</h2>
				</div>
			</section>
			<section class="mt-6 flex w-full justify-between text-lg text-neutral-content">
				<div class="flex w-1/4 flex-col items-center justify-center space-y-2">
					<h3>Carbs</h3>
					<progress class="progress progress-accent w-full" value={$carbsPercent} max="100" />
					<p class="text-sm">
						{$carbsEaten} / {$carbsGoal}g
					</p>
				</div>
				<div class="flex w-1/4 flex-col items-center justify-center space-y-2">
					<h3>Protein</h3>
					<progress class="progress progress-accent w-full " value={$proteinPercent} max="100" />
					<p class="text-sm">
						{$proteinEaten} / {$proteinGoal}g
					</p>
				</div>
				<div class="flex w-1/4 flex-col items-center justify-center space-y-2">
					<h3>Fat</h3>
					<progress class="progress progress-accent w-full " value={$fatPercent} max="100" />
					<p class="text-sm">
						{$fatEaten} / {$fatGoal}g
					</p>
				</div>
			</section>
		</div>
		<section
			id="Food"
			class="item-center mt-8 flex w-full flex-col justify-center text-lg  text-base-200"
		>
			<div class="container space-y-6">
				<MealCard
					title="Breakfast"
					foodItems={$consumedBreakfast}
					calories={$consumedBreakfast?.reduce((acc, food) => acc + food.calories, 0) || 0}
					recommendedCalories={calculateRecommendedAmountOfCalories(22)}
					addFoodItem={() => goto('/track-food/breakfast')}
				>
					<FoodCroissant size={'30'} />
				</MealCard>
				<MealCard
					title="Lunch"
					foodItems={$consumedLunch}
					calories={$consumedLunch?.reduce((acc, food) => acc + food.calories, 0) || 0}
					recommendedCalories={calculateRecommendedAmountOfCalories(33)}
					addFoodItem={() => goto('/track-food/lunch')}
				>
					<Noodles size={'30'} />
				</MealCard>
				<MealCard
					title="Dinner"
					foodItems={$consumedDinner}
					calories={$consumedDinner?.reduce((acc, food) => acc + food.calories, 0) || 0}
					recommendedCalories={calculateRecommendedAmountOfCalories(35)}
					addFoodItem={() => goto('/track-food/dinner')}
				>
					<Pasta size={'30'} />
				</MealCard>
				<MealCard
					title="Snacks"
					foodItems={$consumedSnacks}
					calories={$consumedSnacks?.reduce((acc, food) => acc + food.calories, 0) || 0}
					recommendedCalories={calculateRecommendedAmountOfCalories(10)}
					addFoodItem={() => goto('/track-food/snacks')}
				>
					<FoodApple size={'30'} />
				</MealCard>
			</div>
		</section>
	</div>
</main>

<style>
	.progress-accent {
		--tw-bg-opacity: 1;
		background-color: #4b5563;
	}
</style>

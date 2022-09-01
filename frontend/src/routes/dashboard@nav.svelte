<script lang="ts" context="module">
	import { supabase } from '$lib/supabaseClient';
	import { user } from '../stores/userStore';
	import { get } from 'svelte/store';
	export const load: import('@sveltejs/kit').Load = async ({
		url,
		params,
		props,
		fetch,
		session,
		stuff,
		status,
		error
	}) => {
		const { data } = await supabase
			.from('consumed_meals')
			.select('meal_type, portion,meals(*)')
			.match({ user_id: get(user)?.id });

		if (data) {
			const meals = {
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
				snack: data
					.filter((meal) => meal.meal_type === 'snack')
					.map((meal) => {
						return {
							...meal.meals,
							portion: meal.portion
						};
					})
			};
			return {
				props: {
					consumedMeals: meals
				}
			};
		}

		return {
			error: new Error(`Could not load url`)
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import ProgressRing from '../components/ProgressRing.svelte';
	import MealCard from '../components/MealCard.svelte';

	// SVG ICONS
	import DotsVertical from 'svelte-material-icons/DotsVertical.svelte';
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
	} from '../stores/macrosStore.js';
	import {
		consumedBreakfast,
		consumedLunch,
		consumedDinner,
		consumedSnacks
	} from '../stores/consumedMeals';

	export let consumedMeals;

	$consumedBreakfast = consumedMeals.breakfast;
	$consumedLunch = consumedMeals.lunch;
	$consumedDinner = consumedMeals.dinner;
	$consumedSnacks = consumedMeals.snacks;

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (!error) {
			$user = null;
			goto('/');
		}
	};
</script>

<svelte:head>
	<title>Firness Journey | Dashboard</title>
</svelte:head>

<main class=" w-screen overflow-x-hidden">
	<nav class="container mt-6 flex h-max w-full items-center justify-evenly">
		<div class="w-1/4" />
		<h1 class="w-2/4 text-2xl font-bold text-accent  ">Fitness journey</h1>
		<div class="ml-auto flex w-1/4 items-center justify-end">
			<div class="dropdown-end dropdown">
				<button tabindex="0">
					<DotsVertical />
				</button>
				<ul
					tabindex="0"
					class="dropdown-content menu rounded-box w-52 bg-base-content p-2 text-base-100 shadow"
				>
					<li><a href="/my-account">My Account</a></li>
					<li><button on:click={logout} class="rounded-lg">Logout</button></li>
				</ul>
			</div>
		</div>
	</nav>
	<div class="flex w-full flex-col items-center ">
		<div class="container py-8">
			<section
				id="CaloriesSection"
				class="item-center  flex w-full justify-between text-lg text-gray-200"
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
			<section class="mt-6 flex w-full justify-between text-lg text-gray-200">
				<div class="flex w-1/4 flex-col items-center justify-center space-y-2">
					<h3>Carbs</h3>
					<progress class="progress progress-accent w-full" value={$carbsPercent} max="100" />
					<p class="text-sm">
						{$carbsEaten} / {$carbsGoal}g
					</p>
				</div>
				<div class="flex w-1/4 flex-col items-center justify-center space-y-2">
					<h3>Potein</h3>
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
			class="item-center mt-8 flex w-full flex-col justify-center bg-base-100 text-lg  text-base-200"
		>
			<div class="container space-y-6">
				<MealCard
					title="Breakfast"
					foodItems={$consumedBreakfast}
					calories={$consumedBreakfast.reduce((acc, food) => acc + food.calories, 0)}
					reccomendedCalories={400}
					addFoodItem={() => goto('/track-food/breakfast')}
				>
					<FoodCroissant size={'30'} />
				</MealCard>
				<MealCard
					title="Lunch"
					foodItems={$consumedLunch}
					calories={$consumedBreakfast.reduce((acc, food) => acc + food.calories, 0)}
					reccomendedCalories={700}
					addFoodItem={() => goto('/track-food/lunch')}
				>
					<Noodles size={'30'} />
				</MealCard>
				<MealCard
					title="Dinner"
					foodItems={$consumedDinner}
					calories={$consumedBreakfast.reduce((acc, food) => acc + food.calories, 0)}
					reccomendedCalories={900}
					addFoodItem={() => goto('/track-food/dinner')}
				>
					<Pasta size={'30'} />
				</MealCard>
				<MealCard
					title="Snack"
					foodItems={$consumedSnacks}
					calories={$consumedBreakfast.reduce((acc, food) => acc + food.calories, 0)}
					reccomendedCalories={300}
					addFoodItem={() => goto('/track-food/snack')}
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

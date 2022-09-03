import { derived, writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { get } from 'svelte/store';
import { user } from '../stores/userStore';

const handleConsumedMealsChange = async () => {
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	console.log('start', start.toISOString());
	const { data: consumedMeals } = await supabase
		.from('consumed_meals')
		.select('meal_type, portion,meals(*)')
		.match({ user_id: get(user)?.id })
		.gt('created_at', start.toISOString());

	const { data: mealsData } = await supabase
		.from('meals')
		.select('*')
		.match({ is_quick_tracked: false });

	if (consumedMeals && mealsData) {
		const consumed = {
			breakfast: consumedMeals
				.filter((meal) => meal.meal_type === 'breakfast')
				.map((meal) => {
					return {
						...meal.meals,
						portion: meal.portion
					};
				}),
			lunch: consumedMeals
				.filter((meal) => meal.meal_type === 'lunch')
				.map((meal) => {
					return {
						...meal.meals,
						portion: meal.portion
					};
				}),
			dinner: consumedMeals
				.filter((meal) => meal.meal_type === 'dinner')
				.map((meal) => {
					return {
						...meal.meals,
						portion: meal.portion
					};
				}),
			snack: consumedMeals
				.filter((meal) => meal.meal_type === 'snack')
				.map((meal) => {
					return {
						...meal.meals,
						portion: meal.portion
					};
				})
		};
		consumedBreakfast.set(consumed.breakfast);
		consumedLunch.set(consumed.lunch);
		consumedDinner.set(consumed.dinner);
		consumedSnacks.set(consumed.snack);
		meals.set(mealsData);
	}
};

const consumedMealsSubscriptions = supabase
	.from('consumed_meals')
	.on('*', handleConsumedMealsChange)
	.subscribe();

export const consumedBreakfast = writable([]);
export const consumedLunch = writable([]);
export const consumedDinner = writable([]);
export const consumedSnacks = writable([]);
export const meals = writable([]);

export const combinedMealsObj = derived(
	[consumedBreakfast, consumedLunch, consumedDinner, consumedSnacks],
	([$consumedBreakfast, $consumedLunch, $consumedDinner, $consumedSnacks]) => {
		return {
			breakfast: $consumedBreakfast,
			lunch: $consumedLunch,
			dinner: $consumedDinner,
			snacks: $consumedSnacks
		};
	}
);
export const combinedMeals = derived(
	[consumedBreakfast, consumedLunch, consumedDinner, consumedSnacks],
	([$consumedBreakfast, $consumedLunch, $consumedDinner, $consumedSnacks]) => [
		...($consumedBreakfast || []),
		...($consumedLunch || []),
		...($consumedDinner || []),
		...($consumedSnacks || [])
	]
);

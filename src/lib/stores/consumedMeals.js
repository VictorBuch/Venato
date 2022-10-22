import { derived, writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { get } from 'svelte/store';
import { user } from '$lib/stores/userStore';
import { getMacroProportionateToPortion } from '$lib/helpers';

const handleConsumedMealsChange = async () => {
	const start = new Date();
	start.setHours(0, 0, 0, 0);
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
						consumed_serving_size: meal.portion,
						calories_consumed_serving_size: getMacroProportionateToPortion(
							meal.meals.calories_serving_size,
							meal.portion,
							meal.meals.serving_size
						)
					};
				}),
			lunch: consumedMeals
				.filter((meal) => meal.meal_type === 'lunch')
				.map((meal) => {
					return {
						...meal.meals,
						consumed_serving_size: meal.portion,
						calories_consumed_serving_size: getMacroProportionateToPortion(
							meal.meals.calories_serving_size,
							meal.portion,
							meal.meals.serving_size
						)
					};
				}),
			dinner: consumedMeals
				.filter((meal) => meal.meal_type === 'dinner')
				.map((meal) => {
					return {
						...meal.meals,
						consumed_serving_size: meal.portion,
						calories_consumed_serving_size: getMacroProportionateToPortion(
							meal.meals.calories_serving_size,
							meal.portion,
							meal.meals.serving_size
						)
					};
				}),
			snacks: consumedMeals
				.filter((meal) => meal.meal_type === 'snacks')
				.map((meal) => {
					if (meal.portion !== meal.meals.consumed_serving_size) {
						return {
							...meal.meals,
							consumed_serving_size: meal.portion,
							calories_consumed_serving_size: getMacroProportionateToPortion(
								meal.meals.calories_serving_size,
								meal.portion,
								meal.meals.serving_size
							)
						};
					} else {
						return { ...meal.meals };
					}
				})
		};
		consumedBreakfast.set(consumed.breakfast);
		consumedLunch.set(consumed.lunch);
		consumedDinner.set(consumed.dinner);
		consumedSnacks.set(consumed.snacks);
		meals.set(mealsData);
		console.log(
			'comsumed updated',
			get(consumedBreakfast),
			get(consumedLunch),
			get(consumedDinner),
			get(consumedSnacks)
		);
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

import { getMacroProportionateToPortion } from '$lib/helpers';
import { derived, writable } from 'svelte/store';
import { combinedMeals } from './consumedMeals';
import { user } from './userStore';

export const carbsEaten = derived(
	combinedMeals,
	($combinedMeals) =>
		Math.ceil(
			$combinedMeals.reduce(
				(value, current) =>
					value +
					getMacroProportionateToPortion(
						current?.carbs,
						current?.consumed_serving_size,
						current?.serving_size
					),
				0
			)
		),
	0
);

export const carbsGoal = derived(user, ($user) => $user.carb_goal);

export const carbsLeft = derived(
	[carbsEaten, carbsGoal],
	([$carbsEaten, $carbsGoal]) => $carbsGoal - $carbsEaten
);

export const carbsPercent = derived(
	[carbsEaten, carbsGoal],
	([$carbsEaten, $carbsGoal], set) => {
		if (
			!isNaN(Math.ceil(($carbsEaten / $carbsGoal) * 100)) ||
			isFinite(Math.ceil(($carbsEaten / $carbsGoal) * 100))
		) {
			set(Math.ceil(($carbsEaten / $carbsGoal) * 100));
		} else {
			set(0);
		}
	},
	0
);
export const fatEaten = derived(
	combinedMeals,
	($combinedMeals) =>
		Math.ceil(
			$combinedMeals.reduce(
				(value, current) =>
					value +
					getMacroProportionateToPortion(
						current?.fat,
						current?.consumed_serving_size,
						current?.serving_size
					),
				0
			)
		),
	0
);

export const fatGoal = derived(user, ($user) => $user.fat_goal);

export const fatLeft = derived(
	[fatEaten, fatGoal],
	([$fatEaten, $fatGoal]) => $fatGoal - $fatEaten
);

export const fatPercent = derived(
	[fatEaten, fatGoal],
	([$fatEaten, $fatGoal], set) => {
		if (
			!isNaN(Math.ceil(($fatEaten / $fatGoal) * 100)) ||
			isFinite(Math.ceil(($fatEaten / $fatGoal) * 100))
		) {
			set(Math.ceil(($fatEaten / $fatGoal) * 100));
		} else {
			set(0);
		}
	},
	0
);
export const proteinEaten = derived(
	combinedMeals,
	($combinedMeals) =>
		Math.ceil(
			$combinedMeals.reduce(
				(value, current) =>
					value +
					getMacroProportionateToPortion(
						current?.protein,
						current?.consumed_serving_size,
						current?.serving_size
					),
				0
			)
		),
	0
);

export const proteinGoal = derived(user, ($user) => $user.protein_goal);

export const proteinLeft = derived(
	[proteinEaten, proteinGoal],
	([$proteinEaten, $proteinGoal]) => $proteinGoal - $proteinEaten
);

export const proteinPercent = derived(
	[proteinEaten, proteinGoal],
	([$proteinEaten, $proteinGoal], set) => {
		if (
			!isNaN(Math.ceil(($proteinEaten / $proteinGoal) * 100)) ||
			isFinite(Math.ceil(($proteinEaten / $proteinGoal) * 100))
		) {
			set(Math.ceil(($proteinEaten / $proteinGoal) * 100));
		} else {
			set(0);
		}
	},
	0
);
export const caloriesEaten = derived(
	combinedMeals,
	($combinedMeals) =>
		$combinedMeals.reduce((value, current) => value + current.calories_consumed_serving_size, 0),
	0
);

export const caloriesGoal = derived(user, ($user) => $user.calorie_goal);

export const caloriesLeft = derived(
	[caloriesEaten, caloriesGoal],
	([$caloriesEaten, $caloriesGoal]) => $caloriesGoal - $caloriesEaten
);

export const caloriesPercent = derived(
	[caloriesEaten, caloriesGoal],
	([$caloriesEaten, $caloriesGoal], set) => {
		if (
			!isNaN(Math.ceil(($caloriesEaten / $caloriesGoal) * 100)) ||
			isFinite(Math.ceil(($caloriesEaten / $caloriesGoal) * 100))
		) {
			set(Math.ceil(($caloriesEaten / $caloriesGoal) * 100));
		} else {
			set(0);
		}
	},
	0
);

export const caloriesBurned = writable(0);

import { derived, writable } from 'svelte/store';

export const consumedBreakfast = writable([]);
export const consumedLunch = writable([]);
export const consumedDinner = writable([]);
export const consumedSnacks = writable([]);

export const combinedMeals = derived(
	[consumedBreakfast, consumedLunch, consumedDinner, consumedSnacks],
	([$consumedBreakfast, $consumedLunch, $consumedDinner, $consumedSnacks]) => [
		...($consumedBreakfast || []),
		...($consumedLunch || []),
		...($consumedDinner || []),
		...($consumedSnacks || [])
	]
);

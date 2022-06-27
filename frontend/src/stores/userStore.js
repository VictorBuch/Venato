/* eslint-disable @typescript-eslint/no-unused-vars */
import { writable } from 'svelte/store';
export const user = writable({
	email: '',
	password: '',
	authed: false,
	token: null,
	goal: 'maintain',
	calorie_goal: 0,
	protein_goal: 0,
	carb_goal: 0,
	fat_goal: 0,
	weight: 0,
	height: 0,
	age: 0,
	sex: ''
});

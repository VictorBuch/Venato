type User = {
	activity_level: 'sedentary'|'lightly active'|'moderately active'|'active'|'very active'
	age: number
	goal: 'maintain' | 'loss' | 'gain'
	calorie_goal: number
	carb_goal: number
	fat_goal: number
	protein_goal: number
	height: number
	id: number
	username: null | string
	sex: 'male' | 'female'
	updated_at: string
	weight: number
	weight_loss_amount: null | 0.25 | 0.5 | 1
  desired_weight: null | number
  firstTimeSetup?: null | boolean
}

import { writable } from 'svelte-local-storage-store'

export const user = writable<User>('user', {})

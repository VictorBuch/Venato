type User = {
	activity_level: string
	age: number
	authed: boolean
	calorie_goal: number
	carb_goal: number
	created_at: string
	email: string
	email_verified_at: null
	fat_goal: number
	goal: string
	height: number
	height_unit: null
	id: number
	name: null
	protein_goal: number
	sex: string
	updated_at: string
	weight: number
	weight_unit: null
}

import { writable } from 'svelte-local-storage-store'

export const user = writable('user', {})

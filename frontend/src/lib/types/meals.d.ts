export interface Meal {
	id: number;
	name: string;
	description: string;
	calories: number;
	carbs?: number;
	protein?: number;
	fat?: number;
	portion: number;
	portion_unit: string;
}

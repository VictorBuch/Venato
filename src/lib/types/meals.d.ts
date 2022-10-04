export interface Meal {
	id: number;
	name: string;
	calories: number;
	carbs?: number;
	protein?: number;
	fat?: number;
	portion: number;
	portion_unit?: string;
  fat_saturated_g?: number;
  cholesterol_mg?: number;
  sodium_mg?: number;
  potassium_mg?: number;
  sugar_g?: number;
  fiber_g?: number;
  is_quick_tracked: boolean;
}

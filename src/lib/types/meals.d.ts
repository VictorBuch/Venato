export interface Meal {
	id: number;
	name: string;
  barcode: number;
  brands: string;
  calories_serving_size: number;
	calories_100g: number;
	carbs?: number;
	protein?: number;
	fat?: number;
	portion: number;
	portion_unit?: string;
  nutrition_grade: string;
  fat_saturated_g?: number;
  cholesterol_mg?: number;
  sodium_mg?: number;
  potassium_mg?: number;
  sugar_g?: number;
  fiber_g?: number;
  is_quick_tracked: boolean;
}

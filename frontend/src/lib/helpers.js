export function getCaloriesProportionateToPortion(meal, portion) {
	return meal.calories * (portion / meal.portion);
}

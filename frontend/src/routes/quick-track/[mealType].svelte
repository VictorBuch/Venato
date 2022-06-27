<!-- TODO: make this card pretty and the page usefull -->
<script lang="ts" context="module">
	export const load: import('@sveltejs/kit').Load = async ({
		params,
		props,
		fetch,
		status,
		error
	}) => {
		return {
			props: {
				mealType: params.mealType
			}
		};
	};
</script>

<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import DotsVertical from 'svelte-material-icons/DotsVertical.svelte';
	import ProgressRing from '../../components/ProgressRing.svelte';

	export let mealType: string;

	let query = '';
	let queryRef;
	let food = {};
	let tab = 1;

	const fetchMeal = async () => {
		if (query.length > 0) {
			const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-Api-Key': 'g3MDcxRxD2HNwTvPtR+r4A==xeCgAwWlHSji9qmP'
				}
			});
			const { items } = await response.json();
			console.log(items);

			if (items.length > 1) {
				// loop through items array and add up the serving_size_g and calories for each item
				const totalCalories = Math.ceil(items.reduce((acc, item) => acc + item.calories, 0));
				const totalPortion = Math.ceil(items.reduce((acc, item) => acc + item.serving_size_g, 0));
				const totalProtein = Math.ceil(items.reduce((acc, item) => acc + item.protein_g, 0));
				const totalCarbs = Math.ceil(
					items.reduce((acc, item) => acc + item.carbohydrates_total_g, 0)
				);
				const totalFiber = Math.ceil(items.reduce((acc, item) => acc + item.fiber_g, 0));
				const totalFat = Math.ceil(items.reduce((acc, item) => acc + item.fat_total_g, 0));
				const totalFatSaturated = Math.ceil(
					items.reduce((acc, item) => acc + item.fat_saturated_g, 0)
				);
				const totalCholesterol = Math.ceil(
					items.reduce((acc, item) => acc + item.cholesterol_mg, 0)
				);
				const totalSodium = Math.ceil(items.reduce((acc, item) => acc + item.sodium_mg, 0));
				const totalPotassium = Math.ceil(items.reduce((acc, item) => acc + item.potassium_mg, 0));
				const totalSugar = Math.ceil(items.reduce((acc, item) => acc + item.sugar_g, 0));
				const totalFoods = items.map((item) => `${item.serving_size_g}g ${item.name}`);
				const totalFoodsString = totalFoods.join(', ');
				const finalFood = {
					calories: totalCalories,
					portion: totalPortion,
					name: totalFoodsString,
					carbs: totalCarbs,
					protein: totalProtein,
					fat: totalFat,
					saturatedFat: totalFatSaturated,
					cholesterol: totalCholesterol,
					sodium: totalSodium,
					sugars: totalSugar,
					potassium: totalPotassium,
					fiber: totalFiber
				};
				food = finalFood;
			}
			if (items.length === 1) {
				const {
					calories,
					serving_size_g,
					name,
					carbohydrates_total_g,
					protein_g,
					fat_total_g,
					fat_saturated_g,
					cholesterol_mg,
					sodium_mg,
					sugar_g,
					potassium_mg,
					fiber_g
				} = items[0];
				const finalFood = {
					calories,
					portion: serving_size_g,
					name,
					carbs: carbohydrates_total_g,
					protein: protein_g,
					fat: fat_total_g,
					saturatedFat: fat_saturated_g,
					cholesterol: cholesterol_mg,
					sodium: sodium_mg,
					sugars: sugar_g,
					potassium: potassium_mg,
					fiber: fiber_g
				};
				food = finalFood;
			}
		} else {
			toast.push('Please enter a meal');
		}
	};

	const addFoodItem = () => {};

	const calculatePercentage = (amount: number, total: number): number => {
		return Math.ceil((amount / total) * 100);
	};
</script>

<svelte:head>
	<title>Fitness Journey | Quick Track</title>
</svelte:head>
<section class="bg-accent container mb-8 pt-8">
	<div class=" flex h-full w-full  items-center  ">
		<a href="/track-food/{mealType}">
			<svg
				class="!stroke-accent-content h-6 w-6"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path d="M19 12H5M12 19l-7-7 7-7" />
			</svg>
		</a>
		<h1 class="text-accent-content ml-24 w-max text-xl font-bold">Quick Track</h1>
	</div>
	<div class="mt-6 flex items-center justify-center">
		<div class="tabs  ">
			<button
				on:click={() => {
					tab = 1;
					food = {};
				}}
				class:tab-active={tab == 1}
				class="tab !text-accent-content tab-bordered">Auto Track</button
			>
			<button
				on:click={() => {
					tab = 2;
					food = {};
				}}
				class:tab-active={tab == 2}
				class="tab !text-accent-content tab-bordered">Manual Track</button
			>
		</div>
	</div>
</section>
{#if tab == 1}
	<section class="mb-28 overflow-x-hidden">
		<form on:submit|preventDefault={fetchMeal} class="container flex flex-col items-center ">
			<div class="w-full space-y-2">
				<label for="Meal">Input a meal</label>
				<input
					type="text"
					placeholder="Describe meal with measurements (e.g. 200g of chicken)"
					name="Meal"
					class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
					bind:value={query}
					bind:this={queryRef}
				/>
			</div>
			{#if Object.keys(food).length > 0}
				<div
					class="bg-base-content text-neutral mt-8 flex h-max w-full flex-col rounded-md border border-gray-400 shadow-lg"
					on:click={addFoodItem}
				>
					<div class="flex h-full items-center py-3 px-4">
						<figure>
							<slot />
						</figure>
						<main class="ml-6 flex w-60 flex-col items-start justify-center">
							<h1 class="w-full text-base font-semibold">{food.name}</h1>
							<p class="w-full truncate text-sm">
								{food.portion}g
							</p>
						</main>
					</div>
					<hr class="border border-gray-200" />
					<p class="flex h-max items-end justify-center  py-2 text-center text-sm">
						{food.calories} kcal
					</p>
				</div>
				<div class="flex w-full items-center space-x-2">
					<button
						on:click={addFoodItem}
						class="btn bg-accent from-accent to-accent-focus text-accent-content shadow-accent/30 hover:shadow-accent-focus/30 mt-8 w-1/2 border-0 bg-gradient-to-r shadow-lg"
						>Add Food</button
					>
					<button
						on:click={() => {
							food = {};
							query = '';
							queryRef.focus();
						}}
						class="btn bg-error text-accent-content shadow-error/30 hover:shadow-error-focus/30 mt-8 w-1/2 border-0 shadow-lg"
						>Clear food</button
					>
				</div>
				<section class="my-8 space-y-6">
					<p class="text-base-content text-lg font-semibold">Nutritional information</p>
					<div class="flex justify-center space-x-6">
						<div class="flex flex-col items-center">
							<ProgressRing
								radius={75}
								percent={calculatePercentage(food.carbs, food.carbs + food.protein + food.fat)}
								percentOver={0}
								stroke={1}
								text={`${calculatePercentage(food.carbs, food.carbs + food.protein + food.fat)}%`}
							/>
							<p class="text-base-content mt-2 text-xs uppercase">Carbs</p>
						</div>
						<div class="flex flex-col items-center">
							<ProgressRing
								radius={75}
								percent={calculatePercentage(food.protein, food.carbs + food.protein + food.fat)}
								percentOver={0}
								stroke={1}
								text={`${calculatePercentage(food.protein, food.carbs + food.protein + food.fat)}%`}
							/>
							<p class="text-base-content mt-2 text-xs uppercase">Protein</p>
						</div>
						<div class="flex flex-col items-center">
							<ProgressRing
								radius={75}
								percent={calculatePercentage(food.fat, food.carbs + food.protein + food.fat)}
								percentOver={0}
								stroke={1}
								text={`${calculatePercentage(food.fat, food.carbs + food.protein + food.fat)}%`}
							/>
							<p class="text-base-content mt-2 text-xs uppercase">Fat</p>
						</div>
					</div>
				</section>
				<section class="w-full space-y-6">
					<h1 class="font-semi-bold text-base-content text-lg">Other information</h1>
					<section class="space-y-2">
						<div class="text-semi-bold flex w-full items-center justify-between text-lg">
							<p>Carbs (g)</p>
							<p>{food.carbs}</p>
						</div>
						{#if Object.hasOwn(food, 'fiber')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Fiber (g)</p>
								<p>{food.fiber}</p>
							</div>
						{/if}
						{#if Object.hasOwn(food, 'sugars')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Sugars (g)</p>
								<p>{food.sugars}</p>
							</div>
						{/if}
					</section>
					<div class="text-semi-bold flex w-full items-center justify-between text-lg">
						<p>Protein (g)</p>
						<p>{food.protein}</p>
					</div>
					<section class="space-y-2">
						<div class="text-semi-bold flex w-full items-center justify-between text-lg">
							<p>Fat (g)</p>
							<p>{food.fat}</p>
						</div>
						{#if Object.hasOwn(food, 'saturatedFat')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Saturated fat (g)</p>
								<p>{food.saturatedFat}</p>
							</div>
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Unsaturated fat (g)</p>
								<p>{food.fat - food.saturatedFat}</p>
							</div>
						{/if}
					</section>
					<section class="space-y-2">
						<div class="text-semi-bold flex w-full items-center text-lg">
							<p>Other</p>
						</div>
						{#if Object.hasOwn(food, 'cholesterol')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Cholesterol (mg)</p>
								<p>{food.cholesterol}</p>
							</div>
						{/if}
						{#if Object.hasOwn(food, 'sodium')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Sodium (mg)</p>
								<p>{food.sodium}</p>
							</div>
						{/if}
						{#if Object.hasOwn(food, 'potasium')}
							<div class="flex w-full items-center justify-between text-sm font-light">
								<p>Potasium (mg)</p>
								<p>{food.potasium}</p>
							</div>
						{/if}
					</section>
				</section>
			{/if}
		</form>
		<div
			class="text-md  from-base-100 container fixed bottom-0 bg-gradient-to-t to-transparent pb-4"
		>
			<button on:click|preventDefault={fetchMeal} class="btn-main"> Search for food </button>
		</div>
	</section>
{:else if tab == 2}
	<section>
		<form on:submit|preventDefault={addFoodItem} class="container">
			<div class="form-control space-y-2">
				<label class="space-y-2">
					<span>Kcal</span>
					<input
						bind:value={food.calories}
						type="text"
						placeholder="Required"
						class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
				<label class="space-y-2">
					<span>Name</span>
					<input
						bind:value={food.name}
						type="text"
						placeholder="Optional"
						class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
				<label class="space-y-2">
					<span>Portion</span>
					<input
						bind:value={food.portion}
						type="text"
						placeholder="Optional"
						class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
				<label class="space-y-2">
					<span>Carbs (g)</span>
					<input
						bind:value={food.carbs}
						type="text"
						placeholder="Optional"
						class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
				<label class="space-y-2">
					<span>Protein (g)</span>
					<input
						bind:value={food.protein}
						type="text"
						placeholder="Optional"
						class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
				<label class="space-y-2">
					<span>Fat (g)</span>
					<input
						bind:value={food.fat}
						type="text"
						placeholder="Optional"
						class="input bg-neutral text-neutral-content w-full max-w-xs text-xl placeholder:text-xs placeholder:text-gray-400"
					/>
				</label>
			</div>
		</form>
		<div
			class="text-md  from-base-100 container fixed bottom-0 bg-gradient-to-t to-transparent pb-4"
		>
			<button on:click|preventDefault={addFoodItem} class="btn-main"> Add Food </button>
		</div>
	</section>
{/if}

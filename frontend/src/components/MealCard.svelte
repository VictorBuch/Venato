<script lang="ts">
	import PlusCircle from 'svelte-material-icons/PlusCircle.svelte';

	export let title: string;
	export let foodItems: [];
	export let calories: number;
	export let recommendedCalories: number;
	export let addFoodItem;
</script>

<div
	class="flex h-28 flex-col rounded-md border border-gray-400 bg-base-content shadow-lg"
	on:click={addFoodItem}
>
	<div class="flex h-full items-center py-3 px-4">
		<figure>
			<slot />
		</figure>
		<div class="ml-6 flex w-60 flex-col items-start justify-center">
			<h1 class="w-full text-base font-semibold">{title}</h1>
			<p class="w-full truncate text-sm">
				{#if foodItems?.length}
					{#each foodItems as food, index}
						{#if index == foodItems.length - 1}
							{food.name}
						{:else}
							{food.name}, &ThinSpace;
						{/if}
					{/each}
				{:else}
					{`reccomended amount: ${recommendedCalories} kcal`}
				{/if}
			</p>
		</div>
		<PlusCircle size={'25'} />
	</div>
	<hr class="border border-gray-200" />
	<p class="flex h-max items-end justify-center  py-2 text-center text-sm">
		{calories} kcal
	</p>
</div>
